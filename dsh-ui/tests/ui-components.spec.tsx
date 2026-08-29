import { afterEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  Button,
  Badge,
  Switch,
  SegmentedControl,
  ChipTabs,
  Card,
  StatusPill,
  Notice,
  Empty,
  Modal,
  ToastViewport,
  toast,
  toastStore,
  Tooltip,
  Menu,
  MenuItem,
  Tabs,
  Skeleton,
  ensureUiStyles,
} from '../src/index.ts'
import { ToastStore } from '../src/toast-logic.ts'

afterEach(cleanup)

describe('dsh-ui primitives', () => {
  it('renders the package stylesheet once, tokens included', () => {
    render(<div><Button>ok</Button><Badge>badged</Badge><Card>card</Card></div>)
    const styles = document.querySelectorAll('style#dsh-ui-styles')
    expect(styles).toHaveLength(1)
    const css = styles[0]!.textContent ?? ''
    expect(css).toContain('.dshui-btn')
    // Token declarations themselves, not merely var() references.
    expect(css).toContain(':root {')
    expect(css).toContain('--dshT3-bg: #fcfcfc')
    expect(css).toContain('--dshT3-bg: #09090b')
  })

  it('maps button variants to their classes', () => {
    render(
      <div>
        <Button>outline</Button>
        <Button variant="primary">primary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="danger">danger</Button>
      </div>,
    )
    expect(screen.getByText('outline').className).toBe('dshui-btn')
    expect(screen.getByText('primary').className).toContain('dshui-btn--primary')
    expect(screen.getByText('ghost').className).toContain('dshui-btn--ghost')
    expect(screen.getByText('danger').className).toContain('dshui-btn--danger')
  })

  it('defaults the button type to button but allows submit', () => {
    render(<div><Button>plain</Button><Button type="submit">submit</Button></div>)
    expect(screen.getByText('plain')).toHaveAttribute('type', 'button')
    expect(screen.getByText('submit')).toHaveAttribute('type', 'submit')
  })

  it('badges carry their variant and mono flags', () => {
    render(<div><Badge>neutral</Badge><Badge variant="success" mono>stdio</Badge></div>)
    expect(screen.getByText('neutral').dataset.variant).toBe('neutral')
    expect(screen.getByText('stdio').dataset.variant).toBe('success')
    expect(screen.getByText('stdio').className).toContain('dshui-badge--mono')
  })

  it('switch toggles through onCheckedChange', () => {
    let checked = false
    const onChange = (next: boolean): void => { checked = next }
    render(<Switch checked={false} onCheckedChange={onChange} aria-label="toggle" />)
    const sw = screen.getByRole('switch', { name: 'toggle' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(sw)
    expect(checked).toBe(true)
  })

  it('segmented control marks the active segment', () => {
    let value = 'a'
    const { rerender } = render(
      <SegmentedControl
        aria-label="pages"
        value="a"
        onChange={next => { value = next }}
        options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]}
      />,
    )
    const a = screen.getByText('A')
    expect(a.getAttribute('data-active')).toBe('true')
    fireEvent.click(screen.getByText('B'))
    expect(value).toBe('b')
    rerender(
      <SegmentedControl
        aria-label="pages"
        value="b"
        onChange={next => { value = next }}
        options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]}
      />,
    )
    expect(screen.getByText('B').getAttribute('data-active')).toBe('true')
    expect(screen.getByText('A').getAttribute('data-active')).toBe('false')
  })

  it('chip tabs use aria-pressed for the active chip', () => {
    render(
      <ChipTabs
        aria-label="levels"
        value="one"
        onChange={() => {}}
        options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]}
      />,
    )
    expect(screen.getByText('One').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText('Two').getAttribute('aria-pressed')).toBe('false')
  })

  it('card exposes the active accent', () => {
    render(<div><Card>plain</Card><Card active>hot</Card></div>)
    expect(screen.getByText('plain').getAttribute('data-active')).toBeNull()
    expect(screen.getByText('hot').getAttribute('data-active')).toBe('true')
  })

  it('status pill renders a button only when interactive', () => {
    render(<div><StatusPill active={false}>static</StatusPill><StatusPill active onClick={() => {}}>hot</StatusPill></div>)
    expect(screen.getByText('static').tagName).toBe('SPAN')
    expect(screen.getByText('hot').tagName).toBe('BUTTON')
  })

  it('notice tones map to data-tone', () => {
    render(<div><Notice>info</Notice><Notice tone="error" role="alert">bad</Notice></div>)
    expect(screen.getByText('info').dataset.tone).toBe('info')
    expect(screen.getByText('bad').dataset.tone).toBe('error')
    expect(screen.getByText('bad').getAttribute('role')).toBe('alert')
  })

  it('empty renders nothing without content', () => {
    const { container } = render(<Empty />)
    expect(container).toBeEmptyDOMElement()
  })

  it('modal stops propagation inside the card and closes from the overlay', () => {
    let open = true
    const onClose = (): void => { open = false }
    const { container } = render(
      <Modal title="Hi" onClose={onClose}><p>body</p></Modal>,
    )
    expect(screen.getByText('body')).toBeTruthy()
    fireEvent.click(screen.getByText('body'))
    expect(open).toBe(true)
    fireEvent.click(container.querySelector('.dshui-overlay')!)
    expect(open).toBe(false)
  })

  it('tabs mark aria-selected', () => {
    render(
      <Tabs
        aria-label="views"
        value="x"
        onChange={() => {}}
        options={[{ value: 'x', label: 'X' }, { value: 'y', label: 'Y' }]}
      />,
    )
    expect(screen.getByText('X').getAttribute('aria-selected')).toBe('true')
    expect(screen.getByText('Y').getAttribute('aria-selected')).toBe('false')
  })
})

describe('toast logic', () => {
  it('queues, caps, and dismisses entries', () => {
    vi.useFakeTimers()
    const store = new ToastStore()
    const seen: number[] = []
    const off = store.subscribe(() => { seen.push(store.getSnapshot().entries.length) })
    store.show({ message: 'one' })
    store.show({ message: 'two', tone: 'error' })
    expect(store.getSnapshot().entries.map(e => e.tone)).toEqual(['info', 'error'])
    const id = store.getSnapshot().entries[0]!.id
    store.dismiss(id)
    expect(store.getSnapshot().entries).toHaveLength(1)
    act(() => { vi.advanceTimersByTime(4000) })
    expect(store.getSnapshot().entries).toHaveLength(0)
    off()
    vi.useRealTimers()
  })

  it('renders the viewport from the imperative queue', () => {
    render(<ToastViewport />)
    expect(document.querySelector('.dshui-toast-viewport')).toBeNull()
    act(() => { toast({ message: 'hello', tone: 'success' }) })
    const viewport = document.querySelector('.dshui-toast-viewport')
    expect(viewport).not.toBeNull()
    expect(screen.getByText('hello').getAttribute('role')).toBe('status')
    expect(screen.getByText('hello').getAttribute('data-tone')).toBe('success')
    act(() => { toastStore.clear() })
  })
})

describe('overlays', () => {
  it('tooltip renders a bubble labeled for the trigger', () => {
    render(<Tooltip label="hi"><button type="button">go</button></Tooltip>)
    expect(screen.getByRole('tooltip').textContent).toBe('hi')
  })

  it('menu opens, closes on outside click, and handles item selection', () => {
    let picked = false
    render(
      <Menu label="actions" trigger={<span>Actions</span>}>
        <MenuItem onSelect={() => { picked = true }}>Do it</MenuItem>
      </Menu>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'actions' }))
    const item = screen.getByRole('menuitem')
    expect(item).toBeTruthy()
    fireEvent.click(item)
    expect(picked).toBe(true)
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'actions' }))
    expect(screen.queryByRole('menu')).not.toBeNull()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('menu Escape closes the popup', () => {
    render(
      <Menu label="actions" trigger={<span>Actions</span>}>
        <MenuItem onSelect={() => {}}>Do it</MenuItem>
      </Menu>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'actions' }))
    expect(screen.queryByRole('menu')).not.toBeNull()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('skeleton renders a decorative bar', () => {
    const { container } = render(<Skeleton width={80} />)
    const bar = container.querySelector('.dshui-skeleton')!
    expect(bar.getAttribute('aria-hidden')).toBe('true')
    expect((bar as HTMLElement).style.width).toBe('80px')
  })

  it('ensureUiStyles is idempotent', () => {
    render(<Button>x</Button>)
    ensureUiStyles()
    expect(document.querySelectorAll('style#dsh-ui-styles')).toHaveLength(1)
  })
})
