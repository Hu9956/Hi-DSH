/**
 * Installed Plugins Tab in Settings -> Plugins.
 * Shows custom and third-party plugins loaded into the current active profile.
 */

import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'

export interface DesktopInstalledPluginsTabProps {
  t: (key: DesktopSettingsLocaleKey) => string
}

export function DesktopInstalledPluginsTab({ t }: DesktopInstalledPluginsTabProps) {
  return (
    <div className="dshDesktopSettingsSection">
      <div className="dshDesktopSettingsHeader">
        <h3 className="dshDesktopSettingsTitle">{t('extPluginInstalled')}</h3>
        <p className="dshDesktopSettingsIntro">
          展示当前 Profile 中由用户自定义添加或从市场安装的第三方扩展插件。
        </p>
      </div>

      <div className="dshDesktopSettingsNotice" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, color: 'var(--dsw-alias-label-primary)' }}>{t('noInstalledPlugins')}</span>
        </div>
        <p style={{ margin: 0, color: 'var(--dsw-alias-label-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
          您可以在 <code>cordis.patch.yml</code> 中声明自定义插件，或通过插件市场一键安装。所有第三方插件均会在运行前自动通过 <code>dsh-std</code> 准入安全审计。
        </p>
      </div>
    </div>
  )
}
