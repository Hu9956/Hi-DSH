/**
 * Plugin Market Tab in Settings -> Extensions.
 * Marketplace placeholder and discoverability surface for DSH plugins.
 */

import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'
import { Badge } from 'dsh-ui'

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
          <h4 className="dshMarketTitle">{t('marketPlaceholderTitle')}</h4>
          <Badge variant="primary">{t('marketPlaceholderBadge')}</Badge>
        </div>
        <p className="dshMarketLead">
          {t('pluginMarketIndexDesc')}
        </p>
        <div className="dshMarketGrid">
          <div className="dshMarketSampleCard">
            <span className="dshMarketCardName">dsh-market</span>
            <span className="dshMarketCardDesc">{t('dshMarketBody')}</span>
            <Badge variant="primary" className="dshMarketCardBadge">{t('marketBadgeEcoMarket')}</Badge>
          </div>
          <div className="dshMarketSampleCard">
            <span className="dshMarketCardName">dsh-community-market</span>
            <span className="dshMarketCardDesc">{t('communityMarketBody')}</span>
            <Badge className="dshMarketCardBadge">{t('marketBadgeDeepCustom')}</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
