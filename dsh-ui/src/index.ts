/**
 * dsh-ui — the Hi-DSH desktop component library, encoding the T3 Code design
 * language (neutral-black dark theme, white-alpha surfaces, zinc light theme,
 * blue accent, 10px radius scale, compact controls) as self-contained React
 * primitives over the `--dshT3-*` token layer.
 *
 * Every component is the only sanctioned renderer of its `dshui-*` classes;
 * raw class strings at call sites are a consistency-checker finding.
 */
export { Button, type ButtonProps, type ButtonVariant } from './Button.tsx'
export { Badge, type BadgeProps, type BadgeVariant } from './Badge.tsx'
export { Switch, type SwitchProps } from './Switch.tsx'
export { TextField, type TextFieldProps } from './TextField.tsx'
export { SelectField, type SelectFieldProps } from './SelectField.tsx'
export { SegmentedControl, type SegmentedControlProps, type SegmentedOption } from './SegmentedControl.tsx'
export { ChipTabs, type ChipTabsProps, type ChipTabOption } from './ChipTabs.tsx'
export { Card, type CardProps } from './Card.tsx'
export { StatusPill, type StatusPillProps } from './StatusPill.tsx'
export { Notice, type NoticeProps, type NoticeTone } from './Notice.tsx'
export { Empty, type EmptyProps } from './Empty.tsx'
export { Modal, type ModalProps } from './Modal.tsx'
export { ToastViewport, toast, toastStore } from './Toast.tsx'
export { ToastStore, type ToastEntry, type ToastInput, type ToastState, type ToastTone } from './toast-logic.ts'
export { Tooltip, type TooltipProps } from './Tooltip.tsx'
export { Menu, MenuItem, type MenuProps, type MenuItemProps } from './Menu.tsx'
export { Tabs, type TabsProps, type TabOption } from './Tabs.tsx'
export { Skeleton, type SkeletonProps } from './Skeleton.tsx'
export { ensureUiStyles } from './install.ts'
export { tokensCss } from './tokens.ts'
export {
  t3codePalette,
  t3codeLight,
  t3codeDark,
  t3codeTokensCss,
  t3codeSource,
  dshT3ToT3CodeMap,
} from './t3code.tokens.ts'
