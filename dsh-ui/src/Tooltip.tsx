import type { ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export interface TooltipProps {
  readonly label: ReactNode
  /** Tooltip placement relative to the trigger; defaults to top. */
  readonly placement?: 'top' | 'bottom'
  readonly children: ReactNode
}


/** CSS-only tooltip: shows on hover and keyboard focus of the wrapped trigger. */
export function Tooltip({ label, placement = 'top', children }: TooltipProps) {
  ensureUiStyles()
  return (
    <span className="dshui-tip" data-placement={placement}>
      {children}
      <span className="dshui-tip-bubble" role="tooltip">{label}</span>
    </span>
  )
}
