/** Style installer. Components call ensureUiStyles(); never import css.ts from a component. */
import { uiCss } from './css.ts'

const STYLE_ID = 'dsh-ui-styles'

let installed = false

/** Install the package stylesheet once; safe to call from every component render. */
export function ensureUiStyles(): void {
  if (installed) return
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) {
    installed = true
    return
  }
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = uiCss
  document.head.appendChild(style)
  installed = true
}
