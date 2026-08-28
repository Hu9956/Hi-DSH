/**
 * Extensions Settings Section (扩展管理中心).
 * Dedicated visual management for Skills (技能) and MCP Connectors (连接器).
 */

import { useState, useEffect, useTransition, useMemo } from 'react'
import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'
import type { DesktopSettingsApi } from './desktop-settings-api.ts'
import {
  type McpServerConfig,
  type McpServerTestResult,
  MCP_LIST_PATH,
  MCP_SAVE_PATH,
  MCP_DELETE_PATH,
  MCP_TEST_PATH,
} from '../mcp-contract.ts'

export interface ExtensionsSettingsSectionProps {
  api?: DesktopSettingsApi
  t: (key: DesktopSettingsLocaleKey) => string
}

interface SkillItem {
  readonly name: string
  readonly path: string
  readonly source: 'user-dsh' | 'user-agents' | 'workspace' | 'bundled'
  readonly description: string
  readonly enabled: boolean
}

type MainCategory = 'skills' | 'connectors'
type SkillSubTab = 'installed' | 'market'
type SkillTertiary = 'single' | 'packs'
type SkillMarketTertiary = 'market-single' | 'market-packs'
type ConnectorSubTab = 'installed' | 'market'

const PRESET_MCP_TEMPLATES: Record<string, Partial<McpServerConfig>> = {
  filesystem: {
    name: 'filesystem',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/kewen/Documents'],
    description: 'Direct local filesystem access and operations across allowed directory roots',
  },
  github: {
    name: 'github',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: '' },
    description: 'GitHub repository management, issues, pull requests, and code inspection',
  },
  brave: {
    name: 'brave-search',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    env: { BRAVE_API_KEY: '' },
    description: 'Live web and news search engine via Brave Search API',
  },
  postgres: {
    name: 'postgres',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres', 'postgresql://localhost/mydb'],
    description: 'PostgreSQL database read-only schema inspection and SQL query execution',
  },
}

export function ExtensionsSettingsSection({ api: _api, t }: ExtensionsSettingsSectionProps) {
  // Navigation State
  const [activeCategory, setActiveCategory] = useState<MainCategory>('skills')
  const [activeSkillTab, setActiveSkillTab] = useState<SkillSubTab>('installed')
  const [activeSkillTertiary, setActiveSkillTertiary] = useState<SkillTertiary>('single')
  const [activeSkillMarketTertiary, setActiveSkillMarketTertiary] = useState<SkillMarketTertiary>('market-single')
  const [activeConnectorTab, setActiveConnectorTab] = useState<ConnectorSubTab>('installed')

  // Skills State
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')

  // MCP State
  const [mcpServers, setMcpServers] = useState<Record<string, McpServerConfig>>({})
  const [mcpLoading, setMcpLoading] = useState(false)
  const [editingServer, setEditingServer] = useState<McpServerConfig | null>(null)
  const [testResults, setTestResults] = useState<Record<string, McpServerTestResult & { testing?: boolean }>>({})

  const [, startTransition] = useTransition()

  // Load skills
  const loadSkills = async () => {
    setSkillsLoading(true)
    try {
      const res = await fetch('/api/hi-dsh/skill-board/list')
      if (res.ok) {
        const data = (await res.json()) as { skills: SkillItem[] }
        setSkills(data.skills ?? [])
      }
    } catch {
      // ignore
    } finally {
      setSkillsLoading(false)
    }
  }

  // Toggle skill
  const handleToggleSkill = async (item: SkillItem) => {
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

  // Load MCP Servers
  const loadMcpServers = async () => {
    setMcpLoading(true)
    try {
      const res = await fetch(MCP_LIST_PATH)
      if (res.ok) {
        const data = (await res.json()) as { servers: Record<string, McpServerConfig> }
        setMcpServers(data.servers ?? {})
      }
    } catch {
      // ignore
    } finally {
      setMcpLoading(false)
    }
  }

  // Test MCP Server
  const handleTestMcp = async (server: McpServerConfig) => {
    setTestResults(prev => ({
      ...prev,
      [server.name]: { ok: false, name: server.name, message: t('mcpTesting'), testing: true },
    }))
    try {
      const res = await fetch(MCP_TEST_PATH, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ server }),
      })
      const result = (await res.json()) as McpServerTestResult
      setTestResults(prev => ({ ...prev, [server.name]: { ...result, testing: false } }))
    } catch (err: unknown) {
      setTestResults(prev => ({
        ...prev,
        [server.name]: { ok: false, name: server.name, message: String(err), testing: false },
      }))
    }
  }

  // Save MCP Server
  const handleSaveMcp = async (config: McpServerConfig) => {
    try {
      const res = await fetch(MCP_SAVE_PATH, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ server: config }),
      })
      if (res.ok) {
        const data = (await res.json()) as { servers: Record<string, McpServerConfig> }
        startTransition(() => {
          setMcpServers(data.servers)
          setEditingServer(null)
        })
      }
    } catch {
      void loadMcpServers()
    }
  }

  // Delete MCP Server
  const handleDeleteMcp = async (name: string) => {
    if (!confirm(`${t('confirmDeleteMcp')} "${name}"?`)) return
    try {
      const res = await fetch(MCP_DELETE_PATH, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        const data = (await res.json()) as { servers: Record<string, McpServerConfig> }
        startTransition(() => {
          setMcpServers(data.servers)
        })
      }
    } catch {
      void loadMcpServers()
    }
  }

  // Initial fetch
  useEffect(() => {
    void loadSkills()
    void loadMcpServers()
  }, [])

  // Filtered skills
  const filteredSkills = useMemo(() => {
    const query = skillSearch.trim().toLowerCase()
    if (!query) return skills
    return skills.filter(
      s => s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query)),
    )
  }, [skills, skillSearch])

  return (
    <div className="dshDesktopSettingsSection">
      <div className="dshDesktopSettingsHeader">
        <h2 className="dshDesktopSettingsTitle">{t('extensionsTitle')}</h2>
        <p className="dshDesktopSettingsIntro">{t('extensionsIntro')}</p>
      </div>

      {/* 🌟 1. 扩展两大能力分类导航 (Skills vs Connectors) */}
      <div className="dshNavTabs" role="tablist">
        <button
          type="button"
          className={`dshNavTab ${activeCategory === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveCategory('skills')}
        >
          🧠 {t('extCategorySkills')}
        </button>
        <button
          type="button"
          className={`dshNavTab ${activeCategory === 'connectors' ? 'active' : ''}`}
          onClick={() => setActiveCategory('connectors')}
        >
          🔗 {t('extCategoryConnectors')}
        </button>
      </div>

      {/* 🧠 1. 技能 (Skills) 页面 */}
      {activeCategory === 'skills' && (
        <div className="dshSkillsSection">
          {/* 二级子导航 */}
          <div className="dshSubNavTabs">
            <button
              type="button"
              className={`dshSubNavTab ${activeSkillTab === 'installed' ? 'active' : ''}`}
              onClick={() => setActiveSkillTab('installed')}
            >
              📂 {t('extSubInstalled')}
            </button>
            <button
              type="button"
              className={`dshSubNavTab ${activeSkillTab === 'market' ? 'active' : ''}`}
              onClick={() => setActiveSkillTab('market')}
            >
              🛒 {t('extSubMarket')}
            </button>
          </div>

          {/* 二级视图 A: 已安装技能 */}
          {activeSkillTab === 'installed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 三级细分导航 (单项技能 vs 技能套件) */}
              <div className="dshTertiaryNavTabs">
                <button
                  type="button"
                  className={`dshTertiaryNavTab ${activeSkillTertiary === 'single' ? 'active' : ''}`}
                  onClick={() => setActiveSkillTertiary('single')}
                >
                  📄 {t('extSkillSingle')} ({filteredSkills.length})
                </button>
                <button
                  type="button"
                  className={`dshTertiaryNavTab ${activeSkillTertiary === 'packs' ? 'active' : ''}`}
                  onClick={() => setActiveSkillTertiary('packs')}
                >
                  📦 {t('extSkillPacks')}
                </button>
              </div>

              {/* 三级视图 1: 单项技能列表 */}
              {activeSkillTertiary === 'single' && (
                <>
                  <div className="dshSkillsControls">
                    <input
                      type="text"
                      className="dshSearchInput"
                      placeholder={t('searchSkillsPlaceholder')}
                      value={skillSearch}
                      onChange={e => setSkillSearch(e.target.value)}
                    />
                    <button
                      type="button"
                      className="dshActionBtn"
                      onClick={() => void loadSkills()}
                      disabled={skillsLoading}
                    >
                      🔄 {t('refresh')}
                    </button>
                  </div>

                  {skillsLoading ? (
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
                              onClick={() => void handleToggleSkill(skill)}
                              style={{ cursor: 'pointer', border: 'none' }}
                              title="点击一键切换热开关"
                            >
                              {skill.enabled ? `● ${t('skillEnabled')}` : `○ ${t('skillDisabled')}`}
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

              {/* 三级视图 2: 技能套件 */}
              {activeSkillTertiary === 'packs' && (
                <div className="dshMarketPlaceholderCard">
                  <div className="dshMarketHeader">
                    <span style={{ fontSize: '22px' }}>📦</span>
                    <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--dsw-alias-label-primary)' }}>{t('skillPacksTitle')}</h3>
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

          {/* 二级视图 B: 技能市场 (占位) */}
          {activeSkillTab === 'market' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="dshTertiaryNavTabs">
                <button
                  type="button"
                  className={`dshTertiaryNavTab ${activeSkillMarketTertiary === 'market-single' ? 'active' : ''}`}
                  onClick={() => setActiveSkillMarketTertiary('market-single')}
                >
                  📄 {t('extSkillMarketSingle')}
                </button>
                <button
                  type="button"
                  className={`dshTertiaryNavTab ${activeSkillMarketTertiary === 'market-packs' ? 'active' : ''}`}
                  onClick={() => setActiveSkillMarketTertiary('market-packs')}
                >
                  📦 {t('extSkillMarketPacks')}
                </button>
              </div>

              <div className="dshMarketPlaceholderCard">
                <div className="dshMarketHeader">
                  <span style={{ fontSize: '24px' }}>🏪</span>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--dsw-alias-label-primary)' }}>{t('marketPlaceholderTitle')}</h3>
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
      )}

      {/* 🔗 2. 连接器 (Connectors / MCP) 页面 */}
      {activeCategory === 'connectors' && (
        <div className="dshMcpSection">
          {/* 二级子导航 */}
          <div className="dshSubNavTabs">
            <button
              type="button"
              className={`dshSubNavTab ${activeConnectorTab === 'installed' ? 'active' : ''}`}
              onClick={() => setActiveConnectorTab('installed')}
            >
              🔌 {t('extConnectorInstalled')}
            </button>
            <button
              type="button"
              className={`dshSubNavTab ${activeConnectorTab === 'market' ? 'active' : ''}`}
              onClick={() => setActiveConnectorTab('market')}
            >
              🛒 {t('extConnectorMarket')}
            </button>
          </div>

          {/* 二级视图 A: 已安装 MCP 连接器 */}
          {activeConnectorTab === 'installed' && (
            <>
              <div className="dshMcpControls">
                <button
                  type="button"
                  className="dshActionBtn"
                  onClick={() => setEditingServer({ name: '', transport: 'stdio', command: '', args: [] })}
                  style={{ background: 'var(--dsw-alias-state-brand-primary, #3b82f6)', color: '#fff', borderColor: 'transparent' }}
                >
                  ➕ {t('addMcpServer')}
                </button>
                <button
                  type="button"
                  className="dshActionBtn"
                  onClick={() => void loadMcpServers()}
                  disabled={mcpLoading}
                >
                  🔄 {t('refresh')}
                </button>
              </div>

              {mcpLoading ? (
                <p style={{ color: 'var(--dsw-alias-label-secondary)' }}>{t('loading')}</p>
              ) : Object.keys(mcpServers).length === 0 ? (
                <p style={{ color: 'var(--dsw-alias-label-secondary)' }}>{t('noMcpServers')}</p>
              ) : (
                <div className="dshMcpList">
                  {Object.entries(mcpServers).map(([name, server]) => {
                    const testResult = testResults[name]
                    return (
                      <div key={name} className="dshMcpCard">
                        <div className="dshMcpCardHeader">
                          <div className="dshMcpCardMain">
                            <span className="dshMcpName">{server.name}</span>
                            <span className="dshMcpTransportBadge">{server.transport}</span>
                            <span className={`dshStatusPill ${server.enabled !== false ? 'dshStatusPillActive' : 'dshStatusPillInactive'}`}>
                              {server.enabled !== false ? `● ${t('mcpActive')}` : `○ ${t('mcpInactive')}`}
                            </span>
                          </div>
                          <div className="dshMcpActions">
                            <button
                              type="button"
                              className="dshActionBtn"
                              onClick={() => void handleTestMcp(server)}
                              disabled={testResult?.testing}
                            >
                              ⚡ {testResult?.testing ? t('mcpTesting') : t('mcpTestPing')}
                            </button>
                            <button
                              type="button"
                              className="dshActionBtn"
                              onClick={() => setEditingServer({ ...server })}
                            >
                              ✏️ {t('edit')}
                            </button>
                            <button
                              type="button"
                              className="dshActionBtn dshActionBtnDanger"
                              onClick={() => void handleDeleteMcp(server.name)}
                            >
                              🗑️ {t('delete')}
                            </button>
                          </div>
                        </div>

                        {server.description && (
                          <p className="dshMcpDesc">{server.description}</p>
                        )}

                        <div className="dshMcpCommandBox">
                          {server.transport === 'stdio'
                            ? `${server.command ?? ''} ${(server.args ?? []).join(' ')}`
                            : server.url}
                        </div>

                        {testResult && !testResult.testing && (
                          <div className={`dshMcpTestResult ${testResult.ok ? 'success' : 'failed'}`}>
                            <span>{testResult.message}</span>
                            {testResult.latencyMs !== undefined && <span>{testResult.latencyMs}ms</span>}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* 二级视图 B: 连接器市场 (占位) */}
          {activeConnectorTab === 'market' && (
            <div className="dshMarketPlaceholderCard">
              <div className="dshMarketHeader">
                <span style={{ fontSize: '24px' }}>🔌</span>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--dsw-alias-label-primary)' }}>{t('marketPlaceholderTitle')}</h3>
                <span className="dshMarketBadge">{t('marketPlaceholderBadge')}</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--dsw-alias-label-secondary)', maxWidth: '520px' }}>
                {t('marketPlaceholderDesc')}
              </p>
              <div className="dshMarketGrid">
                <div className="dshMarketSampleCard">
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>GitHub MCP Connector</span>
                  <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>一键连接 GitHub 仓库、PR、Issue 与代码分支操作</span>
                  <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>官方预设</span>
                </div>
                <div className="dshMarketSampleCard">
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>PostgreSQL Database MCP</span>
                  <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>支持结构化数据库安全只读自省与 SQL 数据提取</span>
                  <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>官方预设</span>
                </div>
                <div className="dshMarketSampleCard">
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>Brave Search Web MCP</span>
                  <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>实时全网搜索与多语种权威事实新闻检索</span>
                  <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>官方预设</span>
                </div>
                <div className="dshMarketSampleCard">
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--dsw-alias-label-primary)' }}>Docker & Kubernetes MCP</span>
                  <span style={{ fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' }}>容器与集群资源巡检、日志提取与健康监控</span>
                  <span className="dshMarketBadge" style={{ alignSelf: 'flex-start' }}>生态拓展</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✏️ MCP 编辑/新建模态框 */}
      {editingServer && (
        <div className="dshModalOverlay" onClick={() => setEditingServer(null)}>
          <div className="dshModalCard" onClick={e => e.stopPropagation()}>
            <h3 className="dshModalTitle">
              {editingServer.name ? t('editMcpServer') : t('addMcpServer')}
            </h3>

            {!editingServer.name && (
              <div className="dshFormGroup">
                <label>{t('quickPresets')}</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(PRESET_MCP_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      className="dshActionBtn"
                      onClick={() => setEditingServer(prev => ({
                        ...prev,
                        ...template,
                        name: template.name ?? '',
                        transport: template.transport ?? 'stdio',
                      }))}
                    >
                      ⚡ {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="dshFormGroup">
              <label>{t('mcpName')} *</label>
              <input
                type="text"
                className="dshTextInput"
                value={editingServer.name}
                onChange={e => setEditingServer(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="e.g. github-connector"
              />
            </div>

            <div className="dshFormGroup">
              <label>{t('mcpDesc')}</label>
              <input
                type="text"
                className="dshTextInput"
                value={editingServer.description ?? ''}
                onChange={e => setEditingServer(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="e.g. GitHub Repository Operations"
              />
            </div>

            <div className="dshFormGroup">
              <label>{t('mcpTransport')}</label>
              <select
                className="dshSelectInput"
                value={editingServer.transport}
                onChange={e => setEditingServer(prev => prev ? { ...prev, transport: e.target.value as 'stdio' | 'streamable-http' } : null)}
              >
                <option value="stdio">stdio (Local Command)</option>
                <option value="streamable-http">streamable-http (Remote URL)</option>
              </select>
            </div>

            {editingServer.transport === 'stdio' ? (
              <>
                <div className="dshFormGroup">
                  <label>{t('mcpCommand')} *</label>
                  <input
                    type="text"
                    className="dshTextInput"
                    value={editingServer.command ?? ''}
                    onChange={e => setEditingServer(prev => prev ? { ...prev, command: e.target.value } : null)}
                    placeholder="e.g. npx or node"
                  />
                </div>
                <div className="dshFormGroup">
                  <label>{t('mcpArgs')}</label>
                  <input
                    type="text"
                    className="dshTextInput"
                    value={(editingServer.args ?? []).join(' ')}
                    onChange={e => setEditingServer(prev => prev ? { ...prev, args: e.target.value.split(' ').filter(Boolean) } : null)}
                    placeholder="e.g. -y @modelcontextprotocol/server-github"
                  />
                </div>
              </>
            ) : (
              <div className="dshFormGroup">
                <label>{t('mcpUrl')} *</label>
                <input
                  type="text"
                  className="dshTextInput"
                  value={editingServer.url ?? ''}
                  onChange={e => setEditingServer(prev => prev ? { ...prev, url: e.target.value } : null)}
                  placeholder="https://mcp.example.com/sse"
                />
              </div>
            )}

            <div className="dshModalActions">
              <button
                type="button"
                className="dshActionBtn"
                onClick={() => setEditingServer(null)}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                className="dshActionBtn"
                style={{ background: 'var(--dsw-alias-state-brand-primary, #3b82f6)', color: '#fff', borderColor: 'transparent' }}
                disabled={!editingServer.name || (editingServer.transport === 'stdio' ? !editingServer.command : !editingServer.url)}
                onClick={() => void handleSaveMcp(editingServer)}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
