/**
 * Skills Tab in Settings -> Extensions.
 * Clean native DSH UI for managing Agent Skills and Skill Packs (zero emojis).
 */

import { useState, useEffect, useMemo } from 'react'
import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'

export interface DesktopSkillsTabProps {
  t: (key: DesktopSettingsLocaleKey) => string
}

interface SkillItem {
  readonly name: string
  readonly path: string
  readonly source: 'user-dsh' | 'user-agents' | 'workspace' | 'bundled'
  readonly description: string
  readonly enabled: boolean
}

type SkillSubTab = 'installed' | 'market'
type SkillTertiary = 'single' | 'packs'
type SkillMarketTertiary = 'market-single' | 'market-packs'

export function DesktopSkillsTab({ t }: DesktopSkillsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SkillSubTab>('installed')
  const [activeTertiary, setActiveTertiary] = useState<SkillTertiary>('single')
  const [activeMarketTertiary, setActiveMarketTertiary] = useState<SkillMarketTertiary>('market-single')

  const [skills, setSkills] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const loadSkills = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/hi-dsh/skill-board/list')
      if (res.ok) {
        const data = (await res.json()) as { skills: SkillItem[] }
        setSkills(data.skills ?? [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (item: SkillItem) => {
    const nextState = !item.enabled
    setSkills(prev => prev.map(s => s.name === item.name ? { ...s, enabled: nextState } : s))
    try {
      const res = await fetch('/api/hi-dsh/skill-board/toggle', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: item.name, enabled: nextState }),
      })
      if (!res.ok) {
        setSkills(prev => prev.map(s => s.name === item.name ? { ...s, enabled: item.enabled } : s))
      }
    } catch {
      setSkills(prev => prev.map(s => s.name === item.name ? { ...s, enabled: item.enabled } : s))
    }
  }

  useEffect(() => {
    void loadSkills()
  }, [])

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return skills
    return skills.filter(
      s => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)),
    )
  }, [skills, search])

  return (
    <div className="dshDesktopSettingsSection">
      {/* 二级子导航 (无表情图标) */}
      <div className="dshSubNavTabs">
        <button
          type="button"
          className={`dshSubNavTab ${activeSubTab === 'installed' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('installed')}
        >
          {t('extSubInstalled')}
        </button>
        <button
          type="button"
          className={`dshSubNavTab ${activeSubTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('market')}
        >
          {t('extSubMarket')}
        </button>
      </div>

      {/* 已安装 */}
      {activeSubTab === 'installed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 三级导航 (单项技能 vs 技能套件) */}
          <div className="dshTertiaryNavTabs">
            <button
              type="button"
              className={`dshTertiaryNavTab ${activeTertiary === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTertiary('single')}
            >
              {t('extSkillSingle')} ({filteredSkills.length})
            </button>
            <button
              type="button"
              className={`dshTertiaryNavTab ${activeTertiary === 'packs' ? 'active' : ''}`}
              onClick={() => setActiveTertiary('packs')}
            >
              {t('extSkillPacks')}
            </button>
          </div>

          {activeTertiary === 'single' && (
            <>
              <div className="dshSkillsControls">
                <input
                  type="text"
                  className="dshSearchInput"
                  placeholder={t('searchSkillsPlaceholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button
                  type="button"
                  className="dshActionBtn"
                  onClick={() => void loadSkills()}
                  disabled={loading}
                >
                  {t('refresh')}
                </button>
              </div>

              {loading ? (
                <p style={{ color: 'var(--dsw-alias-label-secondary)' }}>{t('loading')}</p>
              ) : filteredSkills.length === 0 ? (
                <p style={{ color: 'var(--dsw-alias-label-secondary)' }}>{t('noSkillsFound')}</p>
              ) : (
                <div className="dshSkillsList">
                  {filteredSkills.map(skill => (
                    <div key={skill.path} className={`dshSkillCard ${skill.enabled ? 'enabled' : ''}`}>
                      <div className="dshSkillCardHeader">
                        <div className="dshSkillCardMain">
                          <span className="dshSkillName">{skill.name}</span>
                          <span className="dshSkillBadge">{skill.source}</span>
                        </div>
                        <button
                          type="button"
                          className={`dshStatusPill ${skill.enabled ? 'dshStatusPillActive' : 'dshStatusPillInactive'}`}
                          onClick={() => void handleToggle(skill)}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="点击一键切换热开关"
                        >
                          {skill.enabled ? t('skillEnabled') : t('skillDisabled')}
                        </button>
                      </div>
                      <p className="dshSkillDesc">
                        {skill.description || t('noDescription')}
                      </p>
                      <div className="dshSkillFooter">
                        <span className="dshSkillPath">{skill.path}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTertiary === 'packs' && (
            <div className="dshMarketPlaceholderCard">
              <div className="dshMarketHeader">
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--dsw-alias-label-primary)' }}>{t('skillPacksTitle')}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--dsw-alias-label-secondary)', maxWidth: '520px' }}>
                {t('skillPacksDesc')}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--dsw-alias-label-tertiary)' }}>
                {t('noSkillPacks')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 技能市场 (占位) */}
      {activeSubTab === 'market' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="dshTertiaryNavTabs">
            <button
              type="button"
              className={`dshTertiaryNavTab ${activeMarketTertiary === 'market-single' ? 'active' : ''}`}
              onClick={() => setActiveMarketTertiary('market-single')}
            >
              {t('extSkillMarketSingle')}
            </button>
            <button
              type="button"
              className={`dshTertiaryNavTab ${activeMarketTertiary === 'market-packs' ? 'active' : ''}`}
              onClick={() => setActiveMarketTertiary('market-packs')}
            >
              {t('extSkillMarketPacks')}
            </button>
          </div>

          <div className="dshMarketPlaceholderCard">
            <div className="dshMarketHeader">
              <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--dsw-alias-label-primary)' }}>{t('marketPlaceholderTitle')}</h4>
              <span className="dshMarketBadge">{t('marketPlaceholderBadge')}</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--dsw-alias-label-secondary)', maxWidth: '520px' }}>
              {t('marketPlaceholderDesc')}
            </p>
            <div className="dshMarketGrid">
              <div className="dshMarketSampleCard">
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>dsh-std-plugin-crafting</span>
                <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>官方标准插件规范设计、脚手架与准入自检技能</span>
                <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>官方技能</span>
              </div>
              <div className="dshMarketSampleCard">
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>fullstack-dev-pack</span>
                <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>全栈研发技能套件（含架构、API、测试套件）</span>
                <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>套件预告</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
