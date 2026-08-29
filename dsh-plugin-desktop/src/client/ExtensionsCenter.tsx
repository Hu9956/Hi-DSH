/**
 * Desktop-owned Extensions Center: a full-screen T3-styled surface registered
 * into the upstream `shell.overlay` frame layer. All pixels here are
 * desktop-owned, so the T3 design language applies without touching the
 * upstream settings shell.
 */

import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'
import { DesktopComplianceCheckerTab } from './DesktopComplianceCheckerTab.tsx'
import { DesktopInstalledPluginsTab } from './DesktopInstalledPluginsTab.tsx'
import { DesktopPluginMarketTab } from './DesktopPluginMarketTab.tsx'
import { DesktopSkillsTab } from './DesktopSkillsTab.tsx'
import { DesktopConnectorsTab } from './DesktopConnectorsTab.tsx'
import { installDesktopSettingsStyles } from './desktop-settings-styles.ts'

/** Window event that opens the center; dispatched from the desktop titlebar. */
export const OPEN_EXTENSIONS_CENTER_EVENT = 'dsh-desktop:open-extensions-center'

export function openExtensionsCenter(): void {
  window.dispatchEvent(new CustomEvent(OPEN_EXTENSIONS_CENTER_EVENT))
}

type CenterPage = 'compliance' | 'installed' | 'market' | 'skills' | 'connectors'

interface CenterNavItem {
  readonly page: CenterPage
  readonly labelKey: DesktopSettingsLocaleKey
}

interface CenterNavGroup {
  readonly labelKey: DesktopSettingsLocaleKey
  readonly items: ReadonlyArray<CenterNavItem>
}

const NAV_GROUPS: ReadonlyArray<CenterNavGroup> = [
  {
    labelKey: 'centerGroupPlugins',
    items: [
      { page: 'compliance', labelKey: 'extPluginCompliance' },
      { page: 'installed', labelKey: 'extPluginInstalled' },
      { page: 'market', labelKey: 'extPluginMarket' },
    ],
  },
  {
    labelKey: 'centerGroupSkills',
    items: [{ page: 'skills', labelKey: 'extSkillSingle' }],
  },
  {
    labelKey: 'centerGroupConnectors',
    items: [{ page: 'connectors', labelKey: 'extConnectorInstalled' }],
  },
]

const PAGE_LABEL_KEY: Record<CenterPage, DesktopSettingsLocaleKey> = Object.fromEntries(
  NAV_GROUPS.flatMap(group => group.items.map(item => [item.page, item.labelKey])),
) as Record<CenterPage, DesktopSettingsLocaleKey>

export interface ExtensionsCenterProps {
  readonly t: (key: DesktopSettingsLocaleKey) => string
}

export function ExtensionsCenter({ t }: ExtensionsCenterProps) {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<CenterPage>('compliance')

  useEffect(() => installDesktopSettingsStyles(), [])

  useEffect(() => {
    const onOpen = (): void => { setOpen(true) }
    window.addEventListener(OPEN_EXTENSIONS_CENTER_EVENT, onOpen)
    return () => { window.removeEventListener(OPEN_EXTENSIONS_CENTER_EVENT, onOpen) }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [open])

  const close = useCallback(() => { setOpen(false) }, [])

  if (!open) return null

  return (
    <div className="dshCenterOverlay" role="dialog" aria-modal="true" aria-label={t('extensionsCenter')}>
      <aside className="dshCenterRail">
        <div className="dshCenterBrand">
          <span className="dshCenterBrandName">Hi-DSH</span>
          <span className="dshCenterBrandTag">{t('extensionsCenter')}</span>
        </div>
        <nav className="dshCenterNav" aria-label={t('extensionsCenter')}>
          {NAV_GROUPS.map(group => (
            <div key={group.labelKey} className="dshCenterNavGroup">
              <div className="dshCenterNavGroupLabel">{t(group.labelKey)}</div>
              {group.items.map(item => (
                <button
                  key={item.page}
                  type="button"
                  className={`dshCenterNavItem${page === item.page ? ' active' : ''}`}
                  aria-current={page === item.page ? 'page' : undefined}
                  onClick={() => { setPage(item.page) }}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="dshCenterRailFoot">{t('centerFootHint')}</div>
      </aside>
      <main className="dshCenterContent">
        <header className="dshCenterHeader">
          <h1 className="dshCenterTitle">{t(PAGE_LABEL_KEY[page])}</h1>
          <button type="button" className="dshCenterClose" aria-label={t('close')} onClick={close}>
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="dshCenterBody">
          {page === 'compliance' && <DesktopComplianceCheckerTab t={t} />}
          {page === 'installed' && <DesktopInstalledPluginsTab t={t} />}
          {page === 'market' && <DesktopPluginMarketTab t={t} />}
          {page === 'skills' && <DesktopSkillsTab t={t} />}
          {page === 'connectors' && <DesktopConnectorsTab t={t} />}
        </div>
      </main>
    </div>
  )
}
