import type { ReactNode } from 'react'
import { ensureUiStyles } from './install.ts'

export interface TabOption<T extends string> {
  readonly value: T
  readonly label: ReactNode
}

export interface TabsProps<T extends string> {
  readonly options: ReadonlyArray<TabOption<T>>
  readonly value: T
  readonly onChange: (value: T) => void
  readonly 'aria-label': string
}


/** Underline-style tab nav; render the active panel yourself from `value`. */
export function Tabs<T extends string>({ options, value, onChange, 'aria-label': ariaLabel }: TabsProps<T>) {
  ensureUiStyles()
  return (
    <div className="dshui-tabs" role="tablist" aria-label={ariaLabel}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className="dshui-tab"
          onClick={() => { onChange(option.value) }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
