import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export interface MenuProps {
  /** Accessible menu label; also the trigger's aria-label when the trigger renders none. */
  readonly label: string
  readonly trigger: ReactNode
  /** Right-align the popup under the trigger (default: left). */
  readonly align?: 'start' | 'end'
  readonly disabled?: boolean
  readonly children: ReactNode
}

const MenuCloseContext = createContext<() => void>(() => {})

export interface MenuItemProps {
  readonly children: ReactNode
  readonly onSelect: () => void
  readonly disabled?: boolean
  readonly destructive?: boolean
}


/** Dropdown menu: outside-click and Escape close, arrow keys rove items. */
export function Menu({ label, trigger, align = 'start', disabled, children }: MenuProps) {
  ensureUiStyles()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent): void => {
      if (anchorRef.current !== null && !anchorRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const rove = (delta: 1 | -1): void => {
    const items = anchorRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
    if (items === undefined || items.length === 0) return
    const list = [...items]
    const index = list.findIndex(item => item === document.activeElement)
    list[(index + delta + list.length) % list.length]?.focus()
  }

  return (
    <div className="dshui-menu-anchor" ref={anchorRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        disabled={disabled}
        onClick={() => { setOpen(value => !value) }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' && open) { event.preventDefault(); rove(1) }
        }}
      >
        {trigger}
      </button>
      {open && (
        <div
          id={menuId}
          className="dshui-menu"
          data-align={align}
          role="menu"
          aria-label={label}
          onKeyDown={event => {
            if (event.key === 'ArrowDown') { event.preventDefault(); rove(1) }
            if (event.key === 'ArrowUp') { event.preventDefault(); rove(-1) }
          }}
        >
          <MenuCloseContext.Provider value={() => { setOpen(false) }}>
            {children}
          </MenuCloseContext.Provider>
        </div>
      )}
    </div>
  )
}

export function MenuItem({ children, onSelect, disabled, destructive }: MenuItemProps) {
  ensureUiStyles()
  const close = useContext(MenuCloseContext)
  return (
    <button
      type="button"
      role="menuitem"
      className="dshui-menu-item"
      data-destructive={destructive ? 'true' : undefined}
      disabled={disabled}
      onClick={() => {
        onSelect()
        close()
      }}
    >
      {children}
    </button>
  )
}
