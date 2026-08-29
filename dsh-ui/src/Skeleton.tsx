import type { CSSProperties } from 'react'
import { ensureUiStyles } from './install.ts'

export interface SkeletonProps {
  readonly width?: number | string
  readonly height?: number | string
  readonly radius?: number | string
}


/** Loading placeholder bar with a transform-only shimmer sweep. */
export function Skeleton({ width, height, radius }: SkeletonProps) {
  ensureUiStyles()
  const style: CSSProperties = {}
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height
  if (radius !== undefined) style.borderRadius = typeof radius === 'number' ? `${radius}px` : radius
  return <span className="dshui-skeleton" style={style} aria-hidden="true" />
}
