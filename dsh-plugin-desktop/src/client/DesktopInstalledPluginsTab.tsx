/**
 * Installed Plugins Tab in Settings -> Extensions.
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
          {t('installedPluginsDesc')}
        </p>
      </div>

      <div className="dshDesktopSettingsNotice dshDesktopSettingsNoticeStack">
        <span className="dshDesktopSettingsNoticeTitle">{t('noInstalledPlugins')}</span>
        <p className="dshDesktopSettingsNoticeBody">
          {t('installedPluginsHintHead')}
          <code>cordis.patch.yml</code>
          {t('installedPluginsHintTail')}
          <code>dsh-std</code>
          {t('installedPluginsHintEnd')}
        </p>
      </div>
    </div>
  )
}
