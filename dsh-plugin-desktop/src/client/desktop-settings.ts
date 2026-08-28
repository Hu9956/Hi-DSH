/** Official Settings Slot registration for Desktop-owned preferences. */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { DesktopSettingsSection, type DesktopNotificationSettings, type DesktopShellSettings } from './DesktopSettingsSection.tsx'
import { DesktopTerminalSettingsAction } from './DesktopTerminalSettingsAction.tsx'
import { DesktopUpdateCheckRow } from './DesktopUpdateCheckRow.tsx'
import { DesktopComplianceCheckerTab } from './DesktopComplianceCheckerTab.tsx'
import { DesktopInstalledPluginsTab } from './DesktopInstalledPluginsTab.tsx'
import { DesktopPluginMarketTab } from './DesktopPluginMarketTab.tsx'
import { DesktopSkillsTab } from './DesktopSkillsTab.tsx'
import { DesktopConnectorsTab } from './DesktopConnectorsTab.tsx'
import { createDesktopSettingsApi } from './desktop-settings-api.ts'
import { en, zh, type DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'
import { installDesktopSettingsStyles } from './desktop-settings-styles.ts'
import type { DesktopClientEnvironment } from './environment.ts'

/** Locale namespace owned by the Desktop settings page. */
export const DESKTOP_SETTINGS_LOCALE_NAMESPACE = 'desktop.settings'

/** Host settings namespaces bound through the standard client settings service. */
export const DESKTOP_SHELL_SETTINGS_NAMESPACE = 'dsh-desktop'
export const DESKTOP_NOTIFICATIONS_SETTINGS_NAMESPACE = 'dsh-desktop-notifications'

/** Shared client controls consumed by settings and Desktop-owned window chrome. */
export interface DesktopSettingsClientControl {
  readonly api: ReturnType<typeof createDesktopSettingsApi>
  setMode(mode: DesktopShellSettings['mode']): Promise<void>
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Desktop-only settings page copy. */
    'desktop.settings': DesktopSettingsLocaleKey
  }
}

/** Controls the 2-level hierarchy: Level 1 Pillar Bar (插件 / 技能 / 连接器) + Level 2 Sub-Tabs */
function installPillarNavigationObserver(): () => void {
  if (typeof document === 'undefined') return () => {}

  let activePillar: 'plugins' | 'skills' | 'connectors' = 'plugins'
  let lastPluginSubTab = 'configurable'

  // Anchor on React-rendered structure (tab ids, ARIA roles): compiled CSS
  // module class names are hashed per build and must not be matched.
  const findSection = (): HTMLElement | undefined => {
    const configurableTab = document.querySelector<HTMLButtonElement>('button[id$="-tab-configurable"]')
    return configurableTab?.closest<HTMLElement>('[role="tablist"]')?.parentElement ?? undefined
  }

  const findTabsContainer = (section: HTMLElement): HTMLElement | null =>
    section.querySelector<HTMLElement>('[role="tablist"]')

  // The plugins settings section is re-branded as the「扩展」root (插件/技能/连接器).
  // Upstream locale namespaces are single-owner (duplicate registration throws),
  // so rendered text is renamed here and idempotently reapplied — React may
  // restore its own text on re-render and the next tick puts ours back.
  const renameText = (element: Element | null | undefined, from: string, to: string): void => {
    if (!element) return
    const current = (element.textContent ?? '').trim()
    if (current !== from) return
    if (element.childElementCount === 0) {
      element.textContent = to
      return
    }
    // Text may sit in one leaf child (e.g. an icon <svg> beside a label <span>).
    for (const child of element.children) {
      if (child.childElementCount === 0 && (child.textContent ?? '').trim() === from) {
        child.textContent = to
        return
      }
    }
    const textNode = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE && (node.nodeValue ?? '').trim() === from)
    if (textNode) textNode.nodeValue = to
  }

  const relabelChrome = (): void => {
    const zh = !document.documentElement.lang?.startsWith('en')
    const navFrom = zh ? '插件' : 'Plugins'
    const navTo = zh ? '扩展' : 'Extensions'
    for (const btn of document.querySelectorAll<HTMLButtonElement>('[role="dialog"] nav button, [role="dialog"] [role="navigation"] button')) {
      renameText(btn, navFrom, navTo)
    }

    const section = findSection()
    if (!section) return
    renameText(section.querySelector('h2'), navFrom, navTo)
    renameText(
      section.querySelector('p'),
      zh ? '配置和查看本部署已安装的插件。' : 'Configure and inspect the plugins installed in this deployment.',
      zh ? '管理本部署的插件、技能与连接器扩展。' : 'Manage the plugin, skill, and connector extensions of this deployment.',
    )
    renameText(section.querySelector('button[id$="-tab-all"]'), zh ? '插件列表' : 'Plugin list', zh ? '内置插件' : 'Built-in')
  }

  const sync = () => {
    relabelChrome()
    const section = findSection()
    if (!section) return

    const tabsContainer = findTabsContainer(section)
    if (!tabsContainer || !tabsContainer.parentNode) return

    let pillarNav = section.querySelector('.dshPillarNav') as HTMLDivElement | null
    if (!pillarNav) {
      pillarNav = document.createElement('div')
      pillarNav.className = 'dshPillarNav'

      const isZh = !document.documentElement.lang?.startsWith('en')
      pillarNav.innerHTML = `
        <button type="button" class="dshPillarTab" data-pillar="plugins">${isZh ? '插件' : 'Plugins'}</button>
        <button type="button" class="dshPillarTab" data-pillar="skills">${isZh ? '技能' : 'Skills'}</button>
        <button type="button" class="dshPillarTab" data-pillar="connectors">${isZh ? '连接器' : 'Connectors'}</button>
      `

      pillarNav.querySelectorAll<HTMLButtonElement>('.dshPillarTab').forEach(btn => {
        btn.addEventListener('click', () => {
          const pillar = btn.getAttribute('data-pillar') as 'plugins' | 'skills' | 'connectors'
          if (!pillar) return
          activePillar = pillar

          const sectionNow = findSection()
          if (pillar === 'plugins') {
            const targetBtn = sectionNow?.querySelector<HTMLButtonElement>(`button[id$="-tab-${lastPluginSubTab}"]`)
              ?? sectionNow?.querySelector<HTMLButtonElement>('button[id$="-tab-configurable"]')
            targetBtn?.click()
          } else if (pillar === 'skills') {
            sectionNow?.querySelector<HTMLButtonElement>('button[id$="-tab-skills"]')?.click()
          } else if (pillar === 'connectors') {
            sectionNow?.querySelector<HTMLButtonElement>('button[id$="-tab-connectors"]')?.click()
          }
          applyVisualState()
        })
      })

      tabsContainer.parentNode.insertBefore(pillarNav, tabsContainer)
    }

    applyVisualState()
  }

  const applyVisualState = () => {
    const section = findSection()
    if (!section) return

    // Find currently active native tab
    const activeBtn = section.querySelector('button[role="tab"][data-active="true"]')
    const activeId = activeBtn?.id ?? ''

    if (activeId.includes('-tab-skills')) {
      activePillar = 'skills'
    } else if (activeId.includes('-tab-connectors')) {
      activePillar = 'connectors'
    } else if (
      activeId.includes('-tab-configurable') ||
      activeId.includes('-tab-compliance-checker') ||
      activeId.includes('-tab-installed-plugins') ||
      activeId.includes('-tab-all') ||
      activeId.includes('-tab-plugins-market')
    ) {
      activePillar = 'plugins'
      if (activeId.includes('-tab-compliance-checker')) lastPluginSubTab = 'compliance-checker'
      else if (activeId.includes('-tab-installed-plugins')) lastPluginSubTab = 'installed-plugins'
      else if (activeId.includes('-tab-all')) lastPluginSubTab = 'all'
      else if (activeId.includes('-tab-plugins-market')) lastPluginSubTab = 'plugins-market'
      else lastPluginSubTab = 'configurable'
    }

    // Highlight pillar button
    const pillarNav = section.querySelector('.dshPillarNav')
    if (pillarNav) {
      pillarNav.querySelectorAll<HTMLButtonElement>('.dshPillarTab').forEach(btn => {
        const pillar = btn.getAttribute('data-pillar')
        if (pillar === activePillar) {
          btn.classList.add('active')
        } else {
          btn.classList.remove('active')
        }
      })
    }

    // Toggle native sub-tabs row visibility
    const tabsContainer = findTabsContainer(section)
    if (tabsContainer) {
      if (activePillar === 'plugins') {
        tabsContainer.style.display = 'flex'
      } else {
        tabsContainer.style.display = 'none'
      }
    }
  }

  const intervalId = setInterval(sync, 150)
  sync()

  return () => {
    clearInterval(intervalId)
  }
}

/** Register the Desktop page in the settings.section list slot. */
export function applyDesktopSettings(
  ctx: ClientContext,
  environment: DesktopClientEnvironment,
): DesktopSettingsClientControl {
  const desktopSettings = ctx.settingsScope.bind<DesktopShellSettings>({
    namespace: DESKTOP_SHELL_SETTINGS_NAMESPACE,
  })
  const notificationSettings = ctx.settingsScope.bind<DesktopNotificationSettings>({
    namespace: DESKTOP_NOTIFICATIONS_SETTINGS_NAMESPACE,
  })
  const api = createDesktopSettingsApi()
  const t = ctx.locale.bind(DESKTOP_SETTINGS_LOCALE_NAMESPACE)

  ctx.effect(
    () => ctx.locale.register(DESKTOP_SETTINGS_LOCALE_NAMESPACE, { zh, en }),
    'dsh-plugin-desktop: settings dictionaries',
  )
  ctx.effect(
    () => installDesktopSettingsStyles(),
    'dsh-plugin-desktop: settings styles',
  )
  ctx.effect(
    () => installPillarNavigationObserver(),
    'dsh-plugin-desktop: pillar navigation observer',
  )
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'desktop',
    order: 100,
    label: () => t('nav'),
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({
      api,
      platform: environment.platform,
      initialMode: environment.mode,
      micaSupported: environment.micaSupported,
      desktopSettings,
      notificationSettings,
    }),
  }, DesktopSettingsSection))
  ctx.slots.inject('settings.action', () => ctx.slots.register({
    name: 'settings.action',
    id: 'open-desktop-terminal',
    order: 1,
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({ api }),
  }, DesktopTerminalSettingsAction))
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'desktop-update-check',
    order: 200,
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({ api }),
  }, DesktopUpdateCheckRow))
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'compliance-checker',
    order: 5,
    label: () => t('complianceTab'),
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({ api }),
  }, DesktopComplianceCheckerTab))
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'installed-plugins',
    order: 8,
    label: () => t('extPluginInstalled'),
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({ api }),
  }, DesktopInstalledPluginsTab))
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'plugins-market',
    order: 20,
    label: () => t('extPluginMarket'),
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({ api }),
  }, DesktopPluginMarketTab))
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'skills',
    order: 30,
    label: () => t('extCategorySkills'),
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({ api }),
  }, DesktopSkillsTab))
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'connectors',
    order: 40,
    label: () => t('extCategoryConnectors'),
    locale: DESKTOP_SETTINGS_LOCALE_NAMESPACE,
    inject: () => ({ api }),
  }, DesktopConnectorsTab))

  return Object.freeze({
    api,
    async setMode(mode: DesktopShellSettings['mode']) {
      await desktopSettings.set('mode', mode)
    },
  })
}
