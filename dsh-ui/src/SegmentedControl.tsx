import type { ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export interface SegmentedOption<T extends string> {
  readonly value: T
  readonly label: ReactNode
}

export interface SegmentedControlProps<T extends string> {
  readonly options: ReadonlyArray<SegmentedOption<T>>
  readonly value: T
  readonly onChange: (value: T) => void
  readonly 'aria-label'?: string
}


/** T3-style boxed segmented control (raised track, lifted active segment). */
export function SegmentedControl<T extends string>({ options, value, onChange, 'aria-label': ariaLabel }: SegmentedControlProps<T>) {
  ensureUiStyles()
  return (
    <div className="dshui-seg" role="tablist" aria-label={ariaLabel}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          data-active={option.value === value ? 'true' : 'false'}
          className="dshui-seg-item"
          onClick={() => { onChange(option.value) }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
