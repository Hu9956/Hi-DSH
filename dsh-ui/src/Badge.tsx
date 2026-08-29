import type { HTMLAttributes } from 'react'
import { ensureUiStyles } from './install.ts'

/** T3-style status badge: quiet 4px-radius chip tinted from semantic tokens. */
export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLElement> {
  readonly variant?: BadgeVariant
  /** Render value text (ids, transports, paths) in the mono stack. */
  readonly mono?: boolean
}


export function Badge({ variant = 'neutral', mono = false, className, ...rest }: BadgeProps) {
  ensureUiStyles()
  const classes = ['dshui-badge']
  if (variant !== 'neutral') classes.push(`dshui-badge--${variant}`)
  if (mono) classes.push('dshui-badge--mono')
  if (className !== undefined) classes.push(className)
  return <span data-variant={variant} className={classes.join(' ')} {...rest} />
}
