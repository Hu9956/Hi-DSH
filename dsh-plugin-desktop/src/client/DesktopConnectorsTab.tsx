/**
 * Connectors Tab in Settings -> Extensions.
 * Clean native DSH UI for managing Model Context Protocol (MCP) tool connectors (zero emojis).
 */

import { useState, useEffect, useTransition } from 'react'
import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'
import {
  type McpServerConfig,
  type McpServerTestResult,
  MCP_LIST_PATH,
  MCP_SAVE_PATH,
  MCP_DELETE_PATH,
  MCP_TEST_PATH,
} from '../mcp-contract.ts'

export interface DesktopConnectorsTabProps {
  t: (key: DesktopSettingsLocaleKey) => string
}

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

export function DesktopConnectorsTab({ t }: DesktopConnectorsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<ConnectorSubTab>('installed')
  const [mcpServers, setMcpServers] = useState<Record<string, McpServerConfig>>({})
  const [loading, setLoading] = useState(false)
  const [editingServer, setEditingServer] = useState<McpServerConfig | null>(null)
  const [testResults, setTestResults] = useState<Record<string, McpServerTestResult & { testing?: boolean }>>({})

  const [, startTransition] = useTransition()

  const loadMcpServers = async () => {
    setLoading(true)
    try {
      const res = await fetch(MCP_LIST_PATH)
      if (res.ok) {
        const data = (await res.json()) as { servers: Record<string, McpServerConfig> }
        setMcpServers(data.servers ?? {})
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

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

  useEffect(() => {
    void loadMcpServers()
  }, [])

  return (
    <div className="dshDesktopSettingsSection">
      {/* 二级子导航 (无表情图标) */}
      <div className="dshSubNavTabs">
        <button
          type="button"
          className={`dshSubNavTab ${activeSubTab === 'installed' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('installed')}
        >
          {t('extConnectorInstalled')}
        </button>
        <button
          type="button"
          className={`dshSubNavTab ${activeSubTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('market')}
        >
          {t('extConnectorMarket')}
        </button>
      </div>

      {/* 已安装 */}
      {activeSubTab === 'installed' && (
        <>
          <div className="dshMcpControls">
            <button
              type="button"
              className="dshActionBtn"
              onClick={() => setEditingServer({ name: '', transport: 'stdio', command: '', args: [] })}
              style={{ background: 'var(--dsw-alias-state-brand-primary, #3b82f6)', color: '#fff', borderColor: 'transparent' }}
            >
              {t('addMcpServer')}
            </button>
            <button
              type="button"
              className="dshActionBtn"
              onClick={() => void loadMcpServers()}
              disabled={loading}
            >
              {t('refresh')}
            </button>
          </div>

          {loading ? (
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
                          {server.enabled !== false ? t('mcpActive') : t('mcpInactive')}
                        </span>
                      </div>
                      <div className="dshMcpActions">
                        <button
                          type="button"
                          className="dshActionBtn"
                          onClick={() => void handleTestMcp(server)}
                          disabled={testResult?.testing}
                        >
                          {testResult?.testing ? t('mcpTesting') : t('mcpTestPing')}
                        </button>
                        <button
                          type="button"
                          className="dshActionBtn"
                          onClick={() => setEditingServer({ ...server })}
                        >
                          {t('edit')}
                        </button>
                        <button
                          type="button"
                          className="dshActionBtn dshActionBtnDanger"
                          onClick={() => void handleDeleteMcp(server.name)}
                        >
                          {t('delete')}
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

      {/* 连接器市场 (占位) */}
      {activeSubTab === 'market' && (
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

      {/* MCP 编辑模态框 */}
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
                      {template.name}
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
                placeholder="例如：github-connector"
              />
            </div>

            <div className="dshFormGroup">
              <label>{t('mcpDesc')}</label>
              <input
                type="text"
                className="dshTextInput"
                value={editingServer.description ?? ''}
                onChange={e => setEditingServer(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="例如：GitHub 代码仓管理操作"
              />
            </div>

            <div className="dshFormGroup">
              <label>{t('mcpTransport')}</label>
              <select
                className="dshSelectInput"
                value={editingServer.transport}
                onChange={e => setEditingServer(prev => prev ? { ...prev, transport: e.target.value as 'stdio' | 'streamable-http' } : null)}
              >
                <option value="stdio">stdio (本地命令)</option>
                <option value="streamable-http">streamable-http (远程 URL)</option>
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
                    placeholder="例如：npx 或 node"
                  />
                </div>
                <div className="dshFormGroup">
                  <label>{t('mcpArgs')}</label>
                  <input
                    type="text"
                    className="dshTextInput"
                    value={(editingServer.args ?? []).join(' ')}
                    onChange={e => setEditingServer(prev => prev ? { ...prev, args: e.target.value.split(' ').filter(Boolean) } : null)}
                    placeholder="例如：-y @modelcontextprotocol/server-github"
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
