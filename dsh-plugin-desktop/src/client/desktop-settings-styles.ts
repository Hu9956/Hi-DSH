/** Desktop settings section styles, installed independently of presentation mode. */

const STYLE_ID = 'dsh-desktop-settings-styles'

const CSS = `
.dshDesktopSettings {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: min(100%, 880px);
  padding: 2px 0 36px;
  color: var(--dsw-alias-label-primary);
}
/* Top-level Pillar Navigation (插件 / 技能 / 连接器) */
.dshPillarNav {
  display: flex;
  gap: 12px;
  margin: 12px 0 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  padding-bottom: 6px;
}
.dshPillarTab {
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: var(--dsw-alias-label-secondary);
  padding: 6px 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  outline: none;
}
.dshPillarTab:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.06));
}
.dshPillarTab.active {
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  border-bottom: 2px solid var(--dsw-alias-state-brand-primary, #3b82f6);
  border-radius: 0;
}

/* Hide skills and connectors from the sub-tabs list so it only contains the 5 plugin tabs */
div[class*="PluginsSettingsSection_tabs"] button[id*="-tab-skills"],
div[class*="PluginsSettingsSection_tabs"] button[id*="-tab-connectors"] {
  display: none !important;
}

/* Rename official 'Plugin list' tab to '内置插件' */
button[id*="-tab-all"],
button[aria-controls*="-panel-all"] {
  font-size: 0 !important;
}
button[id*="-tab-all"]::before,
button[aria-controls*="-panel-all"]::before {
  content: '内置插件';
  font-size: 13px;
  line-height: 20px;
}
:lang(en) button[id*="-tab-all"]::before,
:lang(en) button[aria-controls*="-panel-all"]::before {
  content: 'Built-in Plugins';
}
/* Rename sidebar section button 'plugins' to '扩展' */
button[data-section-id="plugins"] span,
[data-section-id="plugins"] > span {
  font-size: 0 !important;
}
button[data-section-id="plugins"] span::before,
[data-section-id="plugins"] > span::before {
  content: '扩展';
  font-size: 13px;
  line-height: 20px;
}
:lang(en) button[data-section-id="plugins"] span::before,
:lang(en) [data-section-id="plugins"] > span::before {
  content: 'Extensions';
}
/* Rename Section Title & Subtitle */
[data-section-panel="plugins"] h2,
[data-section="plugins"] h2,
div[class*="PluginsSettingsSection"] h2,
div[class*="PluginsSettingsSection_heading"] {
  font-size: 0 !important;
}
[data-section-panel="plugins"] h2::before,
[data-section="plugins"] h2::before,
div[class*="PluginsSettingsSection"] h2::before,
div[class*="PluginsSettingsSection_heading"]::before {
  content: '扩展';
  font-size: 18px;
  font-weight: 600;
}
:lang(en) [data-section-panel="plugins"] h2::before,
:lang(en) [data-section="plugins"] h2::before,
:lang(en) div[class*="PluginsSettingsSection"] h2::before,
:lang(en) div[class*="PluginsSettingsSection_heading"]::before {
  content: 'Extensions';
}

[data-section-panel="plugins"] p[class*="intro"],
[data-section="plugins"] p[class*="intro"],
div[class*="PluginsSettingsSection"] p[class*="intro"],
div[class*="PluginsSettingsSection_intro"] {
  font-size: 0 !important;
}
[data-section-panel="plugins"] p[class*="intro"]::before,
[data-section="plugins"] p[class*="intro"]::before,
div[class*="PluginsSettingsSection"] p[class*="intro"]::before,
div[class*="PluginsSettingsSection_intro"]::before {
  content: '配置和管理插件、技能与连接器扩展生态。';
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary);
}
:lang(en) [data-section-panel="plugins"] p[class*="intro"]::before,
:lang(en) [data-section="plugins"] p[class*="intro"]::before,
:lang(en) div[class*="PluginsSettingsSection"] p[class*="intro"]::before,
:lang(en) div[class*="PluginsSettingsSection_intro"]::before {
  content: 'Configure and manage plugins, agent skills, and tool connectors.';
}
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
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.dshDesktopSettingsGroup {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--dsw-alias-border-l1);
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
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
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
.dshDesktopSettingsChoice[data-actionable="true"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dshDesktopSettingsChoice:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.dshDesktopSettingsChoice[data-selected="true"] {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary);
}
.dshDesktopSettingsChoice[aria-disabled="true"]:not([data-selected="true"]) { opacity: .58; }
.dshDesktopSettingsChoiceCopy { display: block; flex: 1; min-width: 0; }
.dshDesktopSettingsChoiceAside { flex: 0 0 auto; margin-left: 12px; }
.dshDesktopSettingsDeleteConfirm { display: flex; align-items: flex-end; flex-direction: column; gap: 8px; max-width: 320px; }
.dshDesktopSettingsDeleteWarning { color: var(--dsw-alias-state-warning-primary); font-size: 12px; line-height: 1.4; text-align: right; }
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
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.dshDesktopSettingsChoiceLink {
  color: var(--dsw-alias-brand-primary);
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
.dshDesktopSettingsBadge {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-weight: 400;
}
.dshDesktopSettingsForm {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.dshDesktopSettingsField {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
}
.dshDesktopSettingsField > span { width: 100%; }
.dshDesktopSettingsInput {
  width: 100%;
  min-height: 36px;
  box-sizing: border-box;
  padding: 7px 11px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
}
.dshDesktopSettingsInput:focus-visible {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 20%, transparent);
}
.dshDesktopSettingsButton {
  flex: 0 0 auto;
  min-height: 32px;
  padding: 5px 13px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}
.dshDesktopSettingsButton:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dshDesktopSettingsButtonSecondary { color: var(--dsw-alias-label-secondary); }
.dshDesktopSettingsButtonDanger { color: var(--dsw-alias-state-error-primary); }
.dshDesktopSettingsButton:disabled { cursor: default; opacity: .55; }
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
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
  box-shadow: 0 12px 32px color-mix(in srgb, #000 28%, transparent);
  -webkit-app-region: no-drag;
}
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 32px;
  padding: 5px 9px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  text-align: start;
  white-space: nowrap;
}
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem:disabled { cursor: default; opacity: .45; }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem svg { width: 14px; height: 14px; stroke-width: 1.8; }
.dshDesktopNativeActions[data-placement="settings"] .dshDesktopActionMenuItem span { flex: 1; }
.dshDesktopSettingsHeaderButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 14px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
}
.dshDesktopSettingsHeaderButton svg { width: 14px; height: 14px; margin-left: 5px; }
.dshDesktopSettingsHeaderButton:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dshDesktopSettingsHeaderButton:disabled { cursor: not-allowed; opacity: .4; }
.dshDesktopNativeActionError {
  max-width: 260px;
  color: var(--dsw-alias-state-error-primary);
  font-size: 11px;
  line-height: 1.4;
}
.dshDesktopSettingsMaterialField {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
}
.dshDesktopSettingsMaterialCopy { min-width: 0; }
.dshDesktopSettingsSelect {
  flex: 0 0 auto;
  min-width: 150px;
  min-height: 32px;
  padding: 4px 28px 4px 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
}
.dshDesktopSettingsSelect:disabled { opacity: .55; }
.dshDesktopSettingsNotice,
.dshDesktopSettingsError,
.dshDesktopSettingsSuccess {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.55;
}
.dshDesktopSettingsNotice { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); }
.dshDesktopSettingsError { color: var(--dsw-alias-state-error-primary); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent); }
.dshDesktopSettingsSuccess { color: var(--dsw-alias-state-success-primary); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent); }
.dshDesktopSettingsToggle {
  flex: 0 0 auto;
  position: relative;
  width: 40px;
  height: 22px;
  padding: 2px;
  border: none;
  border-radius: 999px;
  background: var(--dsw-alias-border-l2);
  cursor: pointer;
  transition: background-color var(--ds-transition-duration-fast) var(--ds-ease-in-out);
}
.dshDesktopSettingsToggle[aria-checked="true"] {
  background: var(--dsw-alias-brand-primary);
}
.dshDesktopSettingsToggle:disabled { cursor: default; opacity: .5; }
.dshDesktopSettingsToggle:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.dshDesktopSettingsToggleKnob {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--dsw-alias-label-primary-foreground);
  box-shadow: 0 1px 2px rgba(0, 0, 0, .24);
  transform: translateX(0);
  transition: transform var(--ds-transition-duration-fast) var(--ds-ease-in-out);
}
.dshDesktopSettingsToggle[aria-checked="true"] .dshDesktopSettingsToggleKnob {
  transform: translateX(18px);
}
.dshDesktopSettingsDetails {
  display: grid;
  gap: 8px;
  padding-left: 14px;
  border-left: 2px solid var(--dsw-alias-border-l1);
}
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
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
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
  color: var(--dsw-alias-label-primary);
}
.dshDesktopUpdateBadge {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(77, 107, 254, 0.12);
  color: #4d6bfe;
}
.dshDesktopUpdateBadgeCore {
  background: rgba(22, 163, 74, 0.12);
  color: #16a34a;
}
.dshDesktopUpdateCardVersion {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  line-height: 1.4;
}
.dshDesktopUpdateFeedback {
  font-size: 12px;
  color: var(--dsw-alias-brand-primary);
  font-weight: 500;
}
.dshDesktopUpdateNotice {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  line-height: 1.5;
  padding: 8px 12px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
  border-radius: 8px;
  border-left: 3px solid var(--dsw-alias-brand-primary);
}
.dshComplianceContainer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(100%, 880px);
  padding: 2px 0 36px;
  color: var(--dsw-alias-label-primary);
}
.dshComplianceCard {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
}
.dshComplianceHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dshComplianceTitle {
  font-size: 15px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.dshComplianceActiveBadge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(22, 163, 74, 0.12);
  color: #16a34a;
}
.dshCompliancePresetRow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dshCompliancePresetBtn {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  transition: all 0.15s ease;
}
.dshCompliancePresetBtn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  border-color: var(--dsw-alias-brand-primary);
}
.dshComplianceTextarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 100px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  color: var(--dsw-alias-label-primary);
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  resize: vertical;
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
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
  border: 1px solid var(--dsw-alias-border-l1);
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
}
.dshComplianceAdmit {
  color: #16a34a;
  font-weight: 600;
}
.dshComplianceReject {
  color: #ef4444;
  font-weight: 600;
}
.dshComplianceWarn {
  color: #f59e0b;
  font-weight: 600;
}
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
  color: var(--dsw-alias-label-primary);
}
.dshExtensionsIntro {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
}
.dshExtensionsTabs {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  padding-bottom: 8px;
}
.dshExtensionsTabButton {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.dshExtensionsTabButton:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dshExtensionsTabButton.active {
  background: var(--dsw-alias-interactive-bg-active, rgba(59, 130, 246, 0.12));
  color: var(--dsw-alias-state-brand-primary, #3b82f6);
  font-weight: 600;
}
.dshSubNavTabs {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: var(--dsw-alias-bg-layer-2, #18181b);
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  overflow-x: auto;
  align-items: center;
}
.dshSubNavTab {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.dshSubNavTab:hover {
  color: var(--dsw-alias-label-primary);
  background: rgba(255, 255, 255, 0.04);
}
.dshSubNavTab.active {
  background: var(--dsw-alias-bg-layer-0, #27272a);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.dshTertiaryNavTabs {
  display: flex;
  gap: 6px;
  padding: 2px;
  margin-bottom: 8px;
}
.dshTertiaryNavTab {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.12s ease;
}
.dshTertiaryNavTab:hover {
  color: var(--dsw-alias-label-secondary);
}
.dshTertiaryNavTab.active {
  color: var(--dsw-alias-state-brand-primary, #3b82f6);
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.08);
  font-weight: 500;
}
.dshMarketPlaceholderCard {
  padding: 24px;
  border-radius: 12px;
  border: 1px dashed var(--dsw-alias-border-brand, rgba(59, 130, 246, 0.4));
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.04), rgba(168, 85, 247, 0.04));
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
.dshMarketBadge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  font-weight: 600;
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
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}
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
.dshSearchInput {
  flex: 1;
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
}
.dshSkillsList, .dshMcpList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dshSkillCard, .dshMcpCard {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.15s ease;
}
.dshSkillCard.enabled {
  border-color: var(--dsw-alias-border-brand, rgba(59, 130, 246, 0.3));
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
  color: var(--dsw-alias-label-primary);
}
.dshSkillBadge, .dshMcpTransportBadge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-family: monospace;
}
.dshStatusPill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}
.dshStatusPillActive {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}
.dshStatusPillInactive {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-tertiary, #9ca3af);
}
.dshSkillDesc, .dshMcpDesc {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
  line-height: 1.45;
}
.dshSkillFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dshSkillPath {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary, #9ca3af);
  font-family: monospace;
}
.dshMcpActions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dshActionBtn {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.dshActionBtn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dshActionBtnDanger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}
.dshMcpCommandBox {
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2);
  font-family: monospace;
  font-size: 12px;
  color: var(--dsw-alias-label-primary);
  overflow-x: auto;
}
.dshMcpTestResult {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dshMcpTestResult.success {
  background: rgba(34, 197, 94, 0.08);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}
.dshMcpTestResult.failed {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.dshModalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.dshModalCard {
  width: 90%;
  max-width: 520px;
  background: var(--dsw-alias-bg-layer-0, #1e1e1e);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
.dshModalTitle {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.dshFormGroup {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dshFormGroup label {
  font-size: 12px;
  font-weight: 500;
  color: var(--dsw-alias-label-secondary);
}
.dshTextInput, .dshSelectInput {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
}
.dshModalActions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
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

/** Install one scoped stylesheet; tolerate headless Client boot. */
export function installDesktopSettingsStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  const existing = document.getElementById(STYLE_ID)
  if (existing !== null) return () => {}
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.appendChild(style)
  return () => { style.remove() }
}
