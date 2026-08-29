import { ensureUiStyles } from './install.ts'

export interface EmptyProps {
  readonly title?: string
  readonly description?: string
}


/** T3-style empty state: quiet title + muted description, no media. */
export function Empty({ title, description }: EmptyProps) {
  ensureUiStyles()
  if (title === undefined && description === undefined) return null
  return (
    <div className="dshui-empty">
      {title !== undefined && <div className="dshui-empty-title">{title}</div>}
      {description !== undefined && <p className="dshui-empty-description">{description}</p>}
    </div>
  )
}
