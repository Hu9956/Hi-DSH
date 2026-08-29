import type { ReactNode, SelectHTMLAttributes } from 'react'
import { ensureUiStyles } from './install.ts'

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly label?: ReactNode
  readonly children: ReactNode
}


/** T3-style select (compact 32px, token border, primary focus ring). */
export function SelectField({ label, className, children, ...rest }: SelectFieldProps) {
  ensureUiStyles()
  const select = (
    <select className={className === undefined ? 'dshui-select' : className} {...rest}>
      {children}
    </select>
  )
  if (label === undefined) return select
  return (
    <label className="dshui-field">
      {label}
      {select}
    </label>
  )
}
