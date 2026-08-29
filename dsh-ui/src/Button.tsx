import type { ButtonHTMLAttributes } from 'react'
import { ensureUiStyles } from './install.ts'

/** T3-style button variants over the shared compact control geometry. */
export type ButtonVariant = 'outline' | 'primary' | 'ghost' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant
}


const VARIANT_CLASS: Record<ButtonVariant, string> = {
  outline: 'dshui-btn',
  primary: 'dshui-btn dshui-btn--primary',
  ghost: 'dshui-btn dshui-btn--ghost',
  danger: 'dshui-btn dshui-btn--danger',
}

export function Button({ variant = 'outline', type = 'button', className, ...rest }: ButtonProps) {
  ensureUiStyles()
  const variantClass = VARIANT_CLASS[variant]
  return (
    <button
      type={type}
      className={className === undefined ? variantClass : `${variantClass} ${className}`}
      {...rest}
    />
  )
}
