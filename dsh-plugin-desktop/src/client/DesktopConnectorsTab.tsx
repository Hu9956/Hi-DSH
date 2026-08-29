/**
 * Connectors Tab in Settings -> Extensions.
 * Manages Model Context Protocol (MCP) tool connectors through the shared desktop UI primitives.
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
import { Button, Card, Badge, StatusPill, SegmentedControl, TextField, SelectField, Empty, Modal } from 'dsh-ui'

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
      <SegmentedControl<ConnectorSubTab>
        value={activeSubTab}
        onChange={setActiveSubTab}
        options={[
          { value: 'installed', label: t('extConnectorInstalled') },
          { value: 'market', label: t('extConnectorMarket') },
        ]}
      />

      {/* 已安装 */}
      {activeSubTab === 'installed' && (
        <>
          <div className="dshMcpControls">
            <Button
              variant="primary"
              onClick={() => setEditingServer({ name: '', transport: 'stdio', command: '', args: [] })}
            >
              {t('addMcpServer')}
            </Button>
            <Button onClick={() => void loadMcpServers()} disabled={loading}>
              {t('refresh')}
            </Button>
          </div>

          {loading ? (
            <Empty description={t('loading')} />
          ) : Object.keys(mcpServers).length === 0 ? (
            <Empty description={t('noMcpServers')} />
          ) : (
            <div className="dshMcpList">
              {Object.entries(mcpServers).map(([name, server]) => {
                const testResult = testResults[name]
                return (
                  <Card key={name}>
                    <div className="dshMcpCardHeader">
                      <div className="dshMcpCardMain">
                        <span className="dshMcpName">{server.name}</span>
                        <Badge mono>{server.transport}</Badge>
                        <StatusPill active={server.enabled !== false}>
                          {server.enabled !== false ? t('mcpActive') : t('mcpInactive')}
                        </StatusPill>
                      </div>
                      <div className="dshMcpActions">
                        <Button
                          onClick={() => void handleTestMcp(server)}
                          disabled={testResult?.testing}
                        >
                          {testResult?.testing ? t('mcpTesting') : t('mcpTestPing')}
                        </Button>
                        <Button onClick={() => setEditingServer({ ...server })}>
                          {t('edit')}
                        </Button>
                        <Button variant="danger" onClick={() => void handleDeleteMcp(server.name)}>
                          {t('delete')}
                        </Button>
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
                  </Card>
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
            <h4 className="dshMarketTitle">{t('marketPlaceholderTitle')}</h4>
            <Badge variant="primary">{t('marketPlaceholderBadge')}</Badge>
          </div>
          <p className="dshMarketLead">
            {t('marketPlaceholderDesc')}
          </p>
          <div className="dshMarketGrid">
            <div className="dshMarketSampleCard">
              <span className="dshMarketCardName">GitHub MCP Connector</span>
              <span className="dshMarketCardDesc">{t('connectorSampleGithubDesc')}</span>
              <Badge variant="primary" className="dshMarketCardBadge">{t('marketBadgeOfficial')}</Badge>
            </div>
            <div className="dshMarketSampleCard">
              <span className="dshMarketCardName">PostgreSQL Database MCP</span>
              <span className="dshMarketCardDesc">{t('connectorSamplePostgresDesc')}</span>
              <Badge variant="primary" className="dshMarketCardBadge">{t('marketBadgeOfficial')}</Badge>
            </div>
            <div className="dshMarketSampleCard">
              <span className="dshMarketCardName">Brave Search Web MCP</span>
              <span className="dshMarketCardDesc">{t('connectorSampleBraveDesc')}</span>
              <Badge variant="primary" className="dshMarketCardBadge">{t('marketBadgeOfficial')}</Badge>
            </div>
            <div className="dshMarketSampleCard">
              <span className="dshMarketCardName">Docker & Kubernetes MCP</span>
              <span className="dshMarketCardDesc">{t('connectorSampleDockerDesc')}</span>
              <Badge variant="primary" className="dshMarketCardBadge">{t('marketBadgeEcosystem')}</Badge>
            </div>
          </div>
        </div>
      )}

      {/* MCP 编辑模态框 */}
      {editingServer && (
        <Modal
          title={editingServer.name ? t('editMcpServer') : t('addMcpServer')}
          onClose={() => setEditingServer(null)}
          actions={(
            <>
              <Button variant="ghost" onClick={() => setEditingServer(null)}>
                {t('cancel')}
              </Button>
              <Button
                variant="primary"
                disabled={!editingServer.name || (editingServer.transport === 'stdio' ? !editingServer.command : !editingServer.url)}
                onClick={() => void handleSaveMcp(editingServer)}
              >
                {t('save')}
              </Button>
            </>
          )}
        >
          {!editingServer.name && (
            <div className="dshFormGroup">
              <label>{t('quickPresets')}</label>
              <div className="dshFormPresetRow">
                {Object.entries(PRESET_MCP_TEMPLATES).map(([key, template]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    onClick={() => setEditingServer(prev => ({
                      ...prev,
                      ...template,
                      name: template.name ?? '',
                      transport: template.transport ?? 'stdio',
                    }))}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="dshFormGroup">
            <label>{t('mcpName')} *</label>
            <TextField
              type="text"
              value={editingServer.name}
              onChange={e => setEditingServer(prev => prev ? { ...prev, name: e.target.value } : null)}
              placeholder={t('mcpNamePlaceholder')}
            />
          </div>

          <div className="dshFormGroup">
            <label>{t('mcpDesc')}</label>
            <TextField
              type="text"
              value={editingServer.description ?? ''}
              onChange={e => setEditingServer(prev => prev ? { ...prev, description: e.target.value } : null)}
              placeholder={t('mcpDescPlaceholder')}
            />
          </div>

          <div className="dshFormGroup">
            <label>{t('mcpTransport')}</label>
            <SelectField
              value={editingServer.transport}
              onChange={e => setEditingServer(prev => prev ? { ...prev, transport: e.target.value as 'stdio' | 'streamable-http' } : null)}
            >
              <option value="stdio">{t('mcpTransportStdio')}</option>
              <option value="streamable-http">{t('mcpTransportHttp')}</option>
            </SelectField>
          </div>

          {editingServer.transport === 'stdio' ? (
            <>
              <div className="dshFormGroup">
                <label>{t('mcpCommand')} *</label>
                <TextField
                  type="text"
                  value={editingServer.command ?? ''}
                  onChange={e => setEditingServer(prev => prev ? { ...prev, command: e.target.value } : null)}
                  placeholder={t('mcpCommandPlaceholder')}
                />
              </div>
              <div className="dshFormGroup">
                <label>{t('mcpArgs')}</label>
                <TextField
                  type="text"
                  value={(editingServer.args ?? []).join(' ')}
                  onChange={e => setEditingServer(prev => prev ? { ...prev, args: e.target.value.split(' ').filter(Boolean) } : null)}
                  placeholder={t('mcpArgsPlaceholder')}
                />
              </div>
            </>
          ) : (
            <div className="dshFormGroup">
              <label>{t('mcpUrl')} *</label>
              <TextField
                type="text"
                value={editingServer.url ?? ''}
                onChange={e => setEditingServer(prev => prev ? { ...prev, url: e.target.value } : null)}
                placeholder="https://mcp.example.com/sse"
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
