import type { HTMLAttributes } from 'react'
import { ensureUiStyles } from './install.ts'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Accent the border with the primary color (e.g. an enabled skill). */
  readonly active?: boolean
}


/** T3-style surface card: token surface, hairline border, 10px radius. */
export function Card({ active = false, className, ...rest }: CardProps) {
  ensureUiStyles()
  return (
    <div
      data-active={active ? 'true' : undefined}
      className={className === undefined ? 'dshui-card' : `dshui-card ${className}`}
      {...rest}
    />
  )
}
