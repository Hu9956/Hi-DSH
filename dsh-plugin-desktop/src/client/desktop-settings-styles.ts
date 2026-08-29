/** Desktop settings surface styles.
 *
 * Controls and tokens live in the `dsh-ui` package (installed on first
 * component render); this sheet owns only the desktop-specific composition
 * surfaces around them — groups, rows, the pillar navigation, update cards,
 * the compliance console, market composites, and the Extensions Center chrome.
 * Anchors use stable ids/roles/own classes: compiled CSS module class names
 * are hashed and must never be matched.
 */

import { ensureUiStyles } from 'dsh-ui'

const STYLE_ID = 'dsh-desktop-settings-styles'

const CSS = `
/* ---- Base containers ----------------------------------------------------- */
.dshDesktopSettings,
.dshDesktopSettingsSection,
.dshComplianceContainer {
  font-family: var(--dshT3-font-sans);
}
.dshDesktopSettings {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: min(100%, 880px);
  padding: 2px 0 36px;
  color: var(--dsw-alias-label-primary);
}
.dshDesktopSettingsSection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.dshComplianceContainer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(100%, 880px);
  padding: 2px 0 36px;
  color: var(--dsw-alias-label-primary);
}

/* ---- Pillar navigation (插件 / 技能 / 连接器) ------------------------------ */
.dshPillarNav {
  display: flex;
  gap: 4px;
  margin: 12px 0 16px;
  border-bottom: 1px solid var(--dshT3-border);
}
.dshPillarTab {
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: var(--dshT3-fg-muted);
  padding: 7px 12px;
  cursor: pointer;
  border-radius: var(--dshT3-radius-sm) var(--dshT3-radius-sm) 0 0;
  transition: color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.dshPillarTab:hover {
  color: var(--dshT3-fg);
  background: var(--dshT3-hover);
}
.dshPillarTab:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: -2px;
}
.dshPillarTab.active {
  color: var(--dshT3-fg);
  font-weight: 600;
  background: transparent;
  box-shadow: inset 0 -2px 0 0 var(--dshT3-primary);
}

/* The plugins sub-tab row lists plugin pages only; the skills/connectors
 * pillars render their own tabs. Anchored on stable tab ids — compiled CSS
 * module class names are hashed and must not be matched. */
button[id$="-tab-skills"],
button[id$="-tab-connectors"] {
  display: none !important;
}

/* ---- Groups, rows, choices ---------------------------------------------- */
.dshDesktopSettingsHeader h2,
.dshDesktopSettingsGroup h3 {
  margin: 0;
  font-weight: 600;
}
.dshDesktopSettingsHeader h2 { font-size: 22px; line-height: 1.35; }
.dshDesktopSettingsGroup h3 { font-size: 16px; line-height: 1.4; }
.dshDesktopSettingsHeader p,
.dshDesktopSettingsGroupIntro,
.dshDesktopSettingsHint {
  margin: 6px 0 0;
  color: var(--dshT3-fg-muted);
  font-size: 13px;
  line-height: 1.6;
}
.dshDesktopSettingsGroup {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--dshT3-border);
}
.dshDesktopSettingsList { display: grid; gap: 8px; }
.dshDesktopSettingsChoice,
.dshDesktopSettingsToggleRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  padding: 13px 14px;
  border: 1px solid var(--dshT3-border);
  border-radius: var(--dshT3-radius-lg);
  background: var(--dshT3-surface);
}
.dshDesktopSettingsChoice {
  box-sizing: border-box;
  width: 100%;
  color: inherit;
  cursor: default;
  text-align: left;
  font: inherit;
}
.dshDesktopSettingsChoice[data-actionable="true"] { cursor: pointer; }
.dshDesktopSettingsChoice[data-actionable="true"]:hover { background: var(--dshT3-hover); }
.dshDesktopSettingsChoice:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: 2px;
}
.dshDesktopSettingsChoice[data-selected="true"] {
  border-color: var(--dshT3-primary);
  box-shadow: 0 0 0 1px var(--dshT3-primary);
}
.dshDesktopSettingsChoice[aria-disabled="true"]:not([data-selected="true"]) { opacity: .58; }
.dshDesktopSettingsChoiceCopy { display: block; flex: 1; min-width: 0; }
.dshDesktopSettingsChoiceAside { flex: 0 0 auto; margin-left: 12px; }
.dshDesktopSettingsDeleteConfirm { display: flex; align-items: flex-end; flex-direction: column; gap: 8px; max-width: 320px; }
.dshDesktopSettingsDeleteWarning { color: var(--dshT3-warning); font-size: 12px; line-height: 1.4; text-align: right; }
.dshDesktopSettingsDeleteActions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.dshDesktopSettingsChoiceTitle {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}
.dshDesktopSettingsChoiceBody {
  display: block;
  margin-top: 3px;
  color: var(--dshT3-fg-muted);
  font-size: 12px;
  line-height: 1.5;
}
.dshDesktopSettingsChoiceLink {
  color: var(--dshT3-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
.dshDesktopSettingsChoiceLink:hover { text-decoration-thickness: 2px; }
.dshDesktopSettingsChoiceTitle .dshDesktopSettingsChoiceLink {
  text-decoration: none;
}
.dshDesktopSettingsChoiceTitle .dshDesktopSettingsChoiceLink:hover {
  opacity: .82;
}

/* ---- Form layout (controls come from dsh-ui) ------------------------------ */
.dshDesktopSettingsForm {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.dshFormGroup {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dshFormGroup label {
  font-size: 12px;
  font-weight: 500;
  color: var(--dshT3-fg-muted);
}
.dshFormPresetRow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ---- Notice stack (base tones come from dsh-ui Notice) --------------------- */
.dshDesktopSettingsNoticeStack { display: flex; flex-direction: column; gap: 8px; }
.dshDesktopSettingsNoticeTitle { font-weight: 600; color: var(--dshT3-fg); }
.dshDesktopSettingsNoticeBody { margin: 0; color: var(--dshT3-fg-muted); font-size: 12px; line-height: 1.5; }

/* ---- Native actions menu -------------------------------------------------- */
.dshDesktopNativeActions[data-placement="settings"] {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopNativeActionMenuAnchor { position: relative; }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenu {
  position: absolute;
  z-index: 2147483001;
  top: calc(100% + 5px);
  right: 0;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: minmax(0, 1fr);
  min-width: 220px;
  padding: 5px;
  border: 1px solid var(--dshT3-border);
  border-radius: var(--dshT3-radius-lg);
  background: var(--dshT3-surface);
  box-shadow: var(--dshT3-shadow-pop);
  -webkit-app-region: no-drag;
}
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: var(--dshT3-control-h-lg);
  padding: 5px 9px;
  border: 0;
  border-radius: var(--dshT3-radius-sm);
  background: transparent;
  color: var(--dshT3-fg);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  text-align: start;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem:hover:not(:disabled) { background: var(--dshT3-hover); }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem:focus-visible { outline: 2px solid var(--dshT3-primary); outline-offset: -2px; }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem:disabled { cursor: default; opacity: .45; }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem svg { width: 14px; height: 14px; stroke-width: 1.8; }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem span { flex: 1; }
.dshDesktopNativeActionError {
  max-width: 260px;
  color: var(--dshT3-error);
  font-size: 11px;
  line-height: 1.4;
}

/* ---- Material field -------------------------------------------------------- */
.dshDesktopSettingsMaterialField {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--dshT3-border);
  border-radius: var(--dshT3-radius-lg);
  background: var(--dshT3-surface);
}
.dshDesktopSettingsMaterialCopy { min-width: 0; }

/* ---- Update check row ----------------------------------------------------------- */
.dshDesktopUpdateCheckContainer {
  display: grid;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}
.dshDesktopUpdateCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--dshT3-border);
  border-radius: var(--dshT3-radius-lg);
  background: var(--dshT3-surface);
}
.dshDesktopUpdateCardInfo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}
.dshDesktopUpdateCardTitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--dshT3-fg);
}
.dshDesktopUpdateCardVersion {
  font-size: 12px;
  color: var(--dshT3-fg-muted);
  line-height: 1.4;
}
.dshDesktopUpdateFeedback {
  font-size: 12px;
  color: var(--dshT3-primary);
  font-weight: 500;
}
.dshDesktopUpdateNotice {
  font-size: 12px;
  color: var(--dshT3-fg-muted);
  line-height: 1.5;
  padding: 8px 12px;
  background: var(--dshT3-surface-raised);
  border-radius: var(--dshT3-radius-md);
  border-left: 3px solid var(--dshT3-primary);
}

/* ---- Compliance console composites ------------------------------------------------ */
.dshComplianceHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dshComplianceTitle {
  font-size: 15px;
  font-weight: 600;
  color: var(--dshT3-fg);
  display: flex;
  align-items: center;
  gap: 8px;
}
.dshCompliancePresetRow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dshComplianceTextarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 100px;
  padding: 10px 12px;
  border-radius: var(--dshT3-radius-md);
  border: 1px solid var(--dshT3-border);
  background: var(--dshT3-surface-raised);
  color: var(--dshT3-fg);
  font-family: var(--dshT3-font-mono);
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.dshComplianceTextarea:focus-visible {
  border-color: var(--dshT3-primary);
  box-shadow: 0 0 0 2px var(--dshT3-primary-soft);
}
.dshComplianceActionRow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
.dshComplianceResultBox {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: var(--dshT3-radius-md);
  background: var(--dshT3-surface-raised);
  border: 1px solid var(--dshT3-border);
}
.dshComplianceStatRow {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.dshComplianceStatItem {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--dshT3-fg-muted);
}
.dshComplianceStatValue { font-weight: 600; color: var(--dshT3-fg); }
.dshComplianceIdCode {
  font-family: var(--dshT3-font-mono);
  font-size: 12px;
  color: var(--dshT3-fg);
}
.dshComplianceAdmit { color: var(--dshT3-success); font-weight: 600; }
.dshComplianceReject { color: var(--dshT3-error); font-weight: 600; }
.dshComplianceWarn { color: var(--dshT3-warning); font-weight: 600; }
.dshComplianceFindingGroup { margin-top: 8px; }
.dshComplianceFindingTitle {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}
.dshComplianceFindingGroup[data-severity="error"] .dshComplianceFindingTitle { color: var(--dshT3-error); }
.dshComplianceFindingGroup[data-severity="warning"] .dshComplianceFindingTitle { color: var(--dshT3-warning); }
.dshComplianceFindingList {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
}
.dshComplianceFindingGroup[data-severity="error"] .dshComplianceFindingList { color: var(--dshT3-error); }
.dshComplianceFindingGroup[data-severity="warning"] .dshComplianceFindingList { color: var(--dshT3-warning); }
.dshComplianceFindingDetail { color: var(--dshT3-fg-muted); }
.dshComplianceNoViolations {
  font-size: 12px;
  color: var(--dshT3-success);
  margin-top: 4px;
}

/* ---- Skills / MCP card composition --------------------------------------------------- */
.dshSkillsSection, .dshMcpSection, .dshPluginsSubSection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.dshSkillsControls, .dshMcpControls {
  display: flex;
  gap: 12px;
  align-items: center;
}
.dshSkillsList, .dshMcpList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dshSkillCardHeader, .dshMcpCardHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dshSkillCardMain, .dshMcpCardMain {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dshSkillName, .dshMcpName {
  font-size: 14px;
  font-weight: 600;
  color: var(--dshT3-fg);
}
.dshSkillDesc, .dshMcpDesc {
  margin: 0;
  font-size: 13px;
  color: var(--dshT3-fg-muted);
  line-height: 1.45;
}
.dshSkillFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dshSkillPath {
  font-size: 11px;
  color: var(--dshT3-fg-subtle);
  font-family: var(--dshT3-font-mono);
}
.dshMcpActions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dshMcpCommandBox {
  padding: 8px 12px;
  border-radius: var(--dshT3-radius-sm);
  background: var(--dshT3-surface-raised);
  border: 1px solid var(--dshT3-border);
  font-family: var(--dshT3-font-mono);
  font-size: 12px;
  color: var(--dshT3-fg-muted);
  overflow-x: auto;
}
.dshMcpTestResult {
  padding: 8px 12px;
  border-radius: var(--dshT3-radius-sm);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dshMcpTestResult.success {
  background: var(--dshT3-success-surface);
  color: var(--dshT3-success);
  border: 1px solid color-mix(in srgb, var(--dshT3-success) 24%, transparent);
}
.dshMcpTestResult.failed {
  background: var(--dshT3-error-surface);
  color: var(--dshT3-error);
  border: 1px solid color-mix(in srgb, var(--dshT3-error) 24%, transparent);
}

/* ---- Market composites ---------------------------------------------------------------- */
.dshMarketPlaceholderCard {
  padding: 24px;
  border-radius: var(--dshT3-radius-lg);
  border: 1px dashed var(--dshT3-border-strong);
  background: var(--dshT3-surface-raised);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
}
.dshMarketHeader {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dshMarketTitle {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--dshT3-fg);
}
.dshMarketLead {
  margin: 0;
  font-size: 13px;
  color: var(--dshT3-fg-muted);
  line-height: 1.55;
  max-width: 560px;
}
.dshMarketGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  width: 100%;
  margin-top: 12px;
}
.dshMarketSampleCard {
  padding: 14px;
  border-radius: var(--dshT3-radius-md);
  border: 1px solid var(--dshT3-border);
  background: var(--dshT3-surface);
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}
.dshMarketCardName {
  font-weight: 600;
  font-size: 13px;
  color: var(--dshT3-fg);
  font-family: var(--dshT3-font-mono);
}
.dshMarketCardDesc {
  font-size: 12px;
  color: var(--dshT3-fg-muted);
  line-height: 1.5;
}
.dshMarketCardBadge { align-self: flex-start; }

/* ---- Extensions Center chrome ------------------------------------------------------------ */
.dshCenterOverlay {
  position: fixed;
  inset: 0;
  z-index: 2147482000;
  display: flex;
  font-family: var(--dshT3-font-sans);
  color: var(--dshT3-fg);
  background: var(--dshT3-bg);
  animation: dshCenterIn 0.14s ease;
}
@keyframes dshCenterIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.dshCenterRail {
  width: 232px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 12px 16px;
  background: var(--dshT3-rail);
  border-right: 1px solid var(--dshT3-border);
}
.dshCenterBrand { display: flex; align-items: baseline; gap: 8px; padding: 0 10px; }
.dshCenterBrandName { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }
.dshCenterBrandTag { font-size: 11px; color: var(--dshT3-fg-subtle); }
.dshCenterNav { flex: 1; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
.dshCenterNavGroup { display: flex; flex-direction: column; gap: 2px; }
.dshCenterNavGroupLabel {
  padding: 0 10px;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--dshT3-fg-subtle);
}
.dshCenterNavItem {
  min-height: 30px;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border: none;
  border-radius: var(--dshT3-radius-sm);
  background: transparent;
  color: var(--dshT3-fg-muted);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.dshCenterNavItem:hover { background: var(--dshT3-hover); color: var(--dshT3-fg); }
.dshCenterNavItem:focus-visible { outline: 2px solid var(--dshT3-primary); outline-offset: -2px; }
.dshCenterNavItem.active {
  background: var(--dshT3-primary-soft);
  color: var(--dshT3-primary);
  font-weight: 600;
}
.dshCenterRailFoot {
  padding: 12px 10px 0;
  border-top: 1px solid var(--dshT3-border);
  font-size: 11px;
  line-height: 1.5;
  color: var(--dshT3-fg-subtle);
}
.dshCenterContent { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.dshCenterHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 28px 14px;
  border-bottom: 1px solid var(--dshT3-border);
}
.dshCenterTitle { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
.dshCenterClose {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: var(--dshT3-radius-sm);
  background: transparent;
  color: var(--dshT3-fg-muted);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.dshCenterClose:hover { background: var(--dshT3-hover); color: var(--dshT3-fg); }
.dshCenterClose:focus-visible { outline: 2px solid var(--dshT3-primary); outline-offset: 2px; }
.dshCenterClose svg { width: 16px; height: 16px; }
.dshCenterBody { flex: 1; overflow-y: auto; padding: 20px 28px 40px; }
.dshCenterBody > * { max-width: 880px; }

/* ---- Legacy extension-header block (kept for the desktop page composition) -------------- */
.dshExtensionsContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.dshExtensionsHeader {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dshExtensionsTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--dshT3-fg);
}
.dshExtensionsIntro {
  margin: 0;
  font-size: 13px;
  color: var(--dshT3-fg-muted);
}

@media (max-width: 720px) {
  .dshDesktopSettingsChoice,
  .dshDesktopSettingsToggleRow,
  .dshDesktopUpdateCard,
  .dshComplianceHeader,
  .dshSkillCardHeader,
  .dshMcpCardHeader { align-items: flex-start; }
  .dshDesktopSettingsForm { align-items: stretch; flex-direction: column; }
}
`

/** Install the desktop surface stylesheet after the dsh-ui token layer. */
export function installDesktopSettingsStyles(): () => void {
  ensureUiStyles()
  if (typeof document === 'undefined') return () => {}
  const existing = document.getElementById(STYLE_ID)
  if (existing !== null) return () => {}
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.appendChild(style)
  return () => { style.remove() }
}
