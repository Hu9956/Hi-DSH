/** General Settings preference row for separated application and core update checks. */

import { useState } from 'react'
import type { DesktopSettingsApi } from './desktop-settings-api.ts'
import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'

export interface DesktopUpdateCheckRowInjected {
  readonly api: Pick<DesktopSettingsApi, 'checkForUpdates' | 'checkCoreUpdates'>
}

export interface DesktopUpdateCheckRowProps {
  readonly api: Pick<DesktopSettingsApi, 'checkForUpdates' | 'checkCoreUpdates'>
  readonly t: (key: DesktopSettingsLocaleKey) => string
}

export function DesktopUpdateCheckRow({ api, t }: DesktopUpdateCheckRowProps) {
  const [appChecking, setAppChecking] = useState(false)
  const [appFeedback, setAppFeedback] = useState<string | null>(null)
  const [coreChecking, setCoreChecking] = useState(false)
  const [coreFeedback, setCoreFeedback] = useState<string | null>(null)

  const handleCheckApp = async () => {
    if (appChecking) return
    setAppChecking(true)
    setAppFeedback(null)
    try {
      await api.checkForUpdates()
      setAppFeedback(t('appUpToDate'))
      setTimeout(() => { setAppFeedback(null) }, 4000)
    } catch {
      setAppFeedback(t('appUpdateError'))
    } finally {
      setAppChecking(false)
    }
  }

  const handleCheckCore = async () => {
    if (coreChecking) return
    setCoreChecking(true)
    setCoreFeedback(null)
    try {
      await api.checkCoreUpdates()
      setCoreFeedback(t('coreUpToDate'))
      setTimeout(() => { setCoreFeedback(null) }, 4000)
    } catch {
      setCoreFeedback(t('coreUpdateError'))
    } finally {
      setCoreChecking(false)
    }
  }

  return (
    <div className="dshDesktopUpdateCheckContainer">
      <div className="dshDesktopUpdateCard">
        <div className="dshDesktopUpdateCardInfo">
          <div className="dshDesktopUpdateCardTitle">
            {t('appUpdateTitle')}
            <span className="dshDesktopUpdateBadge">App</span>
          </div>
          <div className="dshDesktopUpdateCardVersion">
            {t('appUpdateCurrentVersion')}
          </div>
          {appFeedback && (
            <div className="dshDesktopUpdateFeedback" role="status">
              {appFeedback}
            </div>
          )}
        </div>
        <button
          type="button"
          className="dshDesktopSettingsButton"
          disabled={appChecking}
          onClick={() => { void handleCheckApp() }}
        >
          {appChecking ? t('checkingAppUpdates') : t('checkAppUpdates')}
        </button>
      </div>

      <div className="dshDesktopUpdateCard">
        <div className="dshDesktopUpdateCardInfo">
          <div className="dshDesktopUpdateCardTitle">
            {t('coreUpdateTitle')}
            <span className="dshDesktopUpdateBadge dshDesktopUpdateBadgeCore">Core</span>
          </div>
          <div className="dshDesktopUpdateCardVersion">
            {t('coreUpdateCurrentVersion')}
          </div>
          {coreFeedback && (
            <div className="dshDesktopUpdateFeedback" role="status">
              {coreFeedback}
            </div>
          )}
        </div>
        <button
          type="button"
          className="dshDesktopSettingsButton"
          disabled={coreChecking}
          onClick={() => { void handleCheckCore() }}
        >
          {coreChecking ? t('checkingCoreUpdates') : t('checkCoreUpdates')}
        </button>
      </div>

      <div className="dshDesktopUpdateNotice">
        {t('updateAutoNotice')}
      </div>
    </div>
  )
}
