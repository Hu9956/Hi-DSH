import type { InputHTMLAttributes, ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional visible label; renders the labeled field layout when present. */
  readonly label?: ReactNode
}


/** T3-style text input (compact 32px, token border, primary focus ring). */
export function TextField({ label, className, ...rest }: TextFieldProps) {
  ensureUiStyles()
  const input = <input className={className === undefined ? 'dshui-input' : className} {...rest} />
  if (label === undefined) return input
  return (
    <label className="dshui-field">
      {label}
      {input}
    </label>
  )
}
