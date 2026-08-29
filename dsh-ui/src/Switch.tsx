import { ensureUiStyles } from './install.ts'

export interface SwitchProps {
  readonly checked: boolean
  readonly disabled?: boolean
  readonly onCheckedChange: (checked: boolean) => void
  /** Accessible name when no visible label row owns the switch. */
  readonly 'aria-label'?: string
  /** Id of the visible label element for `aria-labelledby`. */
  readonly 'aria-labelledby'?: string
  readonly title?: string
}


/** T3-style switch: 30×18 track, 16px knob, primary when checked. */
export function Switch({ checked, disabled, onCheckedChange, title, ...aria }: SwitchProps) {
  ensureUiStyles()
  return (
    <button
      type="button"
      role="switch"
      className="dshui-switch"
      aria-checked={checked}
      disabled={disabled}
      title={title}
      onClick={() => { onCheckedChange(!checked) }}
      {...aria}
    >
      <span className="dshui-switch-knob" aria-hidden="true" />
    </button>
  )
}
