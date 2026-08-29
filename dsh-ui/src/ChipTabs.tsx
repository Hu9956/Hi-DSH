import type { ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export interface ChipTabOption<T extends string> {
  readonly value: T
  readonly label: ReactNode
}

export interface ChipTabsProps<T extends string> {
  readonly options: ReadonlyArray<ChipTabOption<T>>
  readonly value: T
  readonly onChange: (value: T) => void
  readonly 'aria-label'?: string
}


/** T3-style ghost chip tabs for tertiary switching (accent wash when active). */
export function ChipTabs<T extends string>({ options, value, onChange, 'aria-label': ariaLabel }: ChipTabsProps<T>) {
  ensureUiStyles()
  return (
    <div className="dshui-chips" role="group" aria-label={ariaLabel}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          className="dshui-chip"
          onClick={() => { onChange(option.value) }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
