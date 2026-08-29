import type { HTMLAttributes, ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export type NoticeTone = 'info' | 'success' | 'error'

export interface NoticeProps extends HTMLAttributes<HTMLElement> {
  readonly tone?: NoticeTone
  readonly children: ReactNode
}


/** Inline status line tinted from semantic state tokens. */
export function Notice({ tone = 'info', className, ...rest }: NoticeProps) {
  ensureUiStyles()
  return (
    <p
      data-tone={tone}
      className={className === undefined ? 'dshui-notice' : `dshui-notice ${className}`}
      {...rest}
    />
  )
}
