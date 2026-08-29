import type { ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export interface ModalProps {
  readonly title: ReactNode
  readonly onClose: () => void
  readonly children: ReactNode
  readonly actions?: ReactNode
}


/** Token-styled modal: dimmed overlay, raised surface card, title row. */
export function Modal({ title, onClose, children, actions }: ModalProps) {
  ensureUiStyles()
  return (
    <div className="dshui-overlay" onClick={onClose}>
      <div
        className="dshui-modal"
        role="dialog"
        aria-modal="true"
        onClick={event => { event.stopPropagation() }}
      >
        <h3 className="dshui-modal-title">{title}</h3>
        {children}
        {actions !== undefined && <div className="dshui-modal-actions">{actions}</div>}
      </div>
    </div>
  )
}
