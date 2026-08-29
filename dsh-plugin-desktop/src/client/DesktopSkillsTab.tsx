/**
 * Skills Tab in Settings -> Extensions.
 * Manages Agent Skills and Skill Packs through the shared desktop UI primitives.
 */

import { useState, useEffect, useMemo } from 'react'
import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'
import { Button, Card, Badge, StatusPill, SegmentedControl, ChipTabs, TextField, Empty } from 'dsh-ui'

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
      <SegmentedControl<SkillSubTab>
        value={activeSubTab}
        onChange={setActiveSubTab}
        options={[
          { value: 'installed', label: t('extSubInstalled') },
          { value: 'market', label: t('extSubMarket') },
        ]}
      />

      {/* 已安装 */}
      {activeSubTab === 'installed' && (
        <div className="dshSkillsSection">
          <ChipTabs<SkillTertiary>
            value={activeTertiary}
            onChange={setActiveTertiary}
            options={[
              { value: 'single', label: `${t('extSkillSingle')} (${filteredSkills.length})` },
              { value: 'packs', label: t('extSkillPacks') },
            ]}
          />

          {activeTertiary === 'single' && (
            <>
              <div className="dshSkillsControls">
                <TextField
                  type="text"
                  value={search}
                  placeholder={t('searchSkillsPlaceholder')}
                  onChange={e => setSearch(e.target.value)}
                />
                <Button onClick={() => void loadSkills()} disabled={loading}>
                  {t('refresh')}
                </Button>
              </div>

              {loading ? (
                <Empty description={t('loading')} />
              ) : filteredSkills.length === 0 ? (
                <Empty description={t('noSkillsFound')} />
              ) : (
                <div className="dshSkillsList">
                  {filteredSkills.map(skill => (
                    <Card key={skill.path} active={skill.enabled}>
                      <div className="dshSkillCardHeader">
                        <div className="dshSkillCardMain">
                          <span className="dshSkillName">{skill.name}</span>
                          <Badge mono>{skill.source}</Badge>
                        </div>
                        <StatusPill
                          active={skill.enabled}
                          onClick={() => void handleToggle(skill)}
                          title={t('skillToggleHint')}
                        >
                          {skill.enabled ? t('skillEnabled') : t('skillDisabled')}
                        </StatusPill>
                      </div>
                      <p className="dshSkillDesc">
                        {skill.description || t('noDescription')}
                      </p>
                      <div className="dshSkillFooter">
                        <span className="dshSkillPath">{skill.path}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTertiary === 'packs' && (
            <div className="dshMarketPlaceholderCard">
              <div className="dshMarketHeader">
                <h4 className="dshMarketTitle">{t('skillPacksTitle')}</h4>
              </div>
              <p className="dshMarketLead">
                {t('skillPacksDesc')}
              </p>
              <Empty description={t('noSkillPacks')} />
            </div>
          )}
        </div>
      )}

      {/* 技能市场 (占位) */}
      {activeSubTab === 'market' && (
        <div className="dshSkillsSection">
          <ChipTabs<SkillMarketTertiary>
            value={activeMarketTertiary}
            onChange={setActiveMarketTertiary}
            options={[
              { value: 'market-single', label: t('extSkillMarketSingle') },
              { value: 'market-packs', label: t('extSkillMarketPacks') },
            ]}
          />

          <div className="dshMarketPlaceholderCard">
            <div className="dshMarketHeader">
              <h4 className="dshMarketTitle">{t('marketPlaceholderTitle')}</h4>
              <Badge variant="primary">{t('marketPlaceholderBadge')}</Badge>
            </div>
            <p className="dshMarketLead">
              {t('marketPlaceholderDesc')}
            </p>
            <div className="dshMarketGrid">
              <div className="dshMarketSampleCard">
                <span className="dshMarketCardName">dsh-std-plugin-crafting</span>
                <span className="dshMarketCardDesc">{t('skillSampleCraftingDesc')}</span>
                <Badge variant="primary" className="dshMarketCardBadge">{t('marketBadgeOfficialSkill')}</Badge>
              </div>
              <div className="dshMarketSampleCard">
                <span className="dshMarketCardName">fullstack-dev-pack</span>
                <span className="dshMarketCardDesc">{t('skillSampleFullstackDesc')}</span>
                <Badge variant="primary" className="dshMarketCardBadge">{t('marketBadgePackPreview')}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
