import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'
import { ensureUiStyles } from './install.ts'

export interface StatusPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly active: boolean
}


/** Compact enabled/disabled pill; renders a button when interactive. */
export function StatusPill({ active, onClick, className, ...rest }: StatusPillProps) {
  ensureUiStyles()
  const classes = `dshui-pill${className === undefined ? '' : ` ${className}`}`
  const shared = {
    'data-active': active ? 'true' : 'false',
    className: classes,
    ...rest,
  }
  if (onClick === undefined) {
    return <span {...(shared as HTMLAttributes<HTMLElement>)} />
  }
  return <button type="button" onClick={onClick} {...shared} />
}
