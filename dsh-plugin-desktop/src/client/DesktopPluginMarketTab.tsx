/**
 * Plugin Market Tab in Settings -> Plugins.
 * Marketplace placeholder and discoverability surface for DSH plugins.
 */

import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'

export interface DesktopPluginMarketTabProps {
  t: (key: DesktopSettingsLocaleKey) => string
}

export function DesktopPluginMarketTab({ t }: DesktopPluginMarketTabProps) {
  return (
    <div className="dshDesktopSettingsSection">
      <div className="dshDesktopSettingsHeader">
        <h3 className="dshDesktopSettingsTitle">{t('extPluginMarket')}</h3>
        <p className="dshDesktopSettingsIntro">
          {t('marketPlaceholderDesc')}
        </p>
      </div>

      <div className="dshMarketPlaceholderCard">
        <div className="dshMarketHeader">
          <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--dsw-alias-label-primary)' }}>{t('marketPlaceholderTitle')}</h4>
          <span className="dshMarketBadge">{t('marketPlaceholderBadge')}</span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--dsw-alias-label-secondary)', maxWidth: '560px' }}>
          Hi-DSH 正在打通开放的插件市场索引，支持在图形界面中浏览、搜索并一键安装遵守 <code>dsh-std</code> 协议的社区插件。
        </p>
        <div className="dshMarketGrid">
          <div className="dshMarketSampleCard">
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>dsh-market</span>
            <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>社区流行插件生态索引与一键包管理</span>
            <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>生态市场</span>
          </div>
          <div className="dshMarketSampleCard">
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>dsh-community-market</span>
            <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>Hi-DSH 原生开放插件市场与自定义数据源</span>
            <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>深度定制</span>
          </div>
        </div>
      </div>
    </div>
  )
}
