import { afterEach, describe, expect, it, vi } from 'vitest'
import { composerCardFrom, markComposerSurfaces } from '../src/client/t3-composer-surface.ts'

interface FakeEl {
  readonly parentElement: FakeEl | null
  style: { r: string; bg: string; img: string }
  children: FakeEl[]
  parent: FakeEl | null
  dataset: Record<string, string>
  overlay: boolean
  textarea: boolean
}

function fakeEl(style: { r?: string; bg?: string; img?: string } = {}, children: FakeEl[] = []): FakeEl {
  const el: FakeEl = {
    parentElement: null,
    style: { r: style.r ?? '0px', bg: style.bg ?? 'rgba(0, 0, 0, 0)', img: style.img ?? 'none' },
    children,
    parent: null,
    dataset: {},
    overlay: false,
    textarea: false,
  }
  Object.defineProperty(el, 'parentElement', { get: () => el.parent })
  for (const child of children) child.parent = el
  return el
}

function textarea(parent: FakeEl): FakeEl {
  const node = fakeEl()
  node.textarea = true
  node.parent = parent
  parent.children.push(node)
  return node
}

function closest(el: FakeEl, selector: string): FakeEl | null {
  const surface = selector.match(/^\[data-dsh-t3-surface(?:="([^"]+)")?\]$/)
  for (let node: FakeEl | null = el; node !== null; node = node.parent) {
    if (selector === '[data-shell-overlay]' && node.overlay) return node
    if (surface !== null) {
      const value = node.dataset.dshT3Surface
      if (value !== undefined && (surface[1] === undefined || surface[1] === value)) return node
    }
  }
  return null
}

function collect(root: FakeEl): FakeEl[] {
  const out: FakeEl[] = [root]
  for (const child of root.children) out.push(...collect(child))
  return out
}

function installFakeDom(root: FakeEl): void {
  vi.stubGlobal('getComputedStyle', (element: FakeEl) => ({
    borderRadius: element.style.r,
    backgroundColor: element.style.bg,
    backgroundImage: element.style.img,
  }))
  ;(root as unknown as { querySelectorAll: (selector: string) => FakeEl[] }).querySelectorAll = (
    selector: string,
  ) => (selector === 'textarea' ? collect(root).filter(node => node.textarea) : [])
  for (const node of collect(root)) {
    Object.assign(node, {
      closest: (selector: string) => closest(node, selector),
    })
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('composer surface tagging', () => {
  const styleOf = (element: Element) => {
    const fake = element as unknown as FakeEl
    return { borderRadius: fake.style.r, backgroundColor: fake.style.bg }
  }

  it('walks up to the outermost rounded, filled card ancestor', () => {
    const card = fakeEl({ r: '22px', bg: 'rgb(255, 255, 255)' })
    const row = fakeEl({ r: '12px', bg: 'rgba(0, 0, 0, 0)' }, [])
    card.children.push(row)
    row.parent = card
    const input = textarea(row)
    expect(composerCardFrom(input as unknown as Element, styleOf)).toBe(card)
  })

  it('returns null when no rounded, filled ancestor exists', () => {
    const plain = fakeEl()
    const input = textarea(plain)
    expect(composerCardFrom(input as unknown as Element, styleOf)).toBeNull()
  })

  it('tags composer cards, their gradient seats, skips overlays and tagged trees', () => {
    const seat = fakeEl({ img: 'linear-gradient(transparent 0px, rgb(255, 255, 255) 36px)' })
    const card = fakeEl({ r: '22px', bg: 'rgb(255, 255, 255)' })
    seat.children.push(card)
    card.parent = seat
    const input = textarea(card)
    const overlay = fakeEl()
    overlay.overlay = true
    const overlayCard = fakeEl({ r: '22px', bg: 'rgb(255, 255, 255)' })
    overlay.children.push(overlayCard)
    overlayCard.parent = overlay
    const overlayInput = textarea(overlayCard)
    const root = fakeEl({}, [seat, overlay])
    installFakeDom(root)

    const tagged = markComposerSurfaces(root as unknown as ParentNode)
    expect(tagged).toEqual([card, seat])
    expect((card as unknown as { dataset: Record<string, string> }).dataset.dshT3Surface).toBe('composer')
    expect((seat as unknown as { dataset: Record<string, string> }).dataset.dshT3Surface).toBe('composer-seat')
    expect('dshT3Surface' in overlayCard.dataset).toBe(false)
    void input
    void overlayInput

    expect(markComposerSurfaces(root as unknown as ParentNode)).toEqual([])
  })

  it('backfills a missing seat tag on a later pass', () => {
    // Regression: the seat wrapper can mount after the pass that tagged the
    // card; a tagged card must not block re-checking for its seat.
    const seat = fakeEl()
    const card = fakeEl({ r: '22px', bg: 'rgb(255, 255, 255)' })
    seat.children.push(card)
    card.parent = seat
    textarea(card)
    const root = fakeEl({}, [seat])
    installFakeDom(root)

    expect(markComposerSurfaces(root as unknown as ParentNode)).toEqual([card])
    seat.style.img = 'linear-gradient(transparent 0px, rgb(255, 255, 255) 36px)'
    expect(markComposerSurfaces(root as unknown as ParentNode)).toEqual([seat])
    expect((seat as unknown as { dataset: Record<string, string> }).dataset.dshT3Surface).toBe('composer-seat')
  })
})
