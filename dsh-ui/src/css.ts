/** Aggregate style ledger: leaf modules only, never component files. */
import { tokensCss } from './tokens.ts'
import { buttonCss } from './Button.css.ts'
import { badgeCss } from './Badge.css.ts'
import { switchCss } from './Switch.css.ts'
import { textFieldCss } from './TextField.css.ts'
import { selectFieldCss } from './SelectField.css.ts'
import { segmentedControlCss } from './SegmentedControl.css.ts'
import { chipTabsCss } from './ChipTabs.css.ts'
import { cardCss } from './Card.css.ts'
import { statusPillCss } from './StatusPill.css.ts'
import { noticeCss } from './Notice.css.ts'
import { emptyCss } from './Empty.css.ts'
import { modalCss } from './Modal.css.ts'
import { toastCss } from './Toast.css.ts'
import { tooltipCss } from './Tooltip.css.ts'
import { menuCss } from './Menu.css.ts'
import { tabsCss } from './Tabs.css.ts'
import { skeletonCss } from './Skeleton.css.ts'

export const uiCss: string = [
  tokensCss,
  buttonCss,
  badgeCss,
  switchCss,
  textFieldCss,
  selectFieldCss,
  segmentedControlCss,
  chipTabsCss,
  cardCss,
  statusPillCss,
  noticeCss,
  emptyCss,
  modalCss,
  toastCss,
  tooltipCss,
  menuCss,
  tabsCss,
  skeletonCss,
].join('\n')
