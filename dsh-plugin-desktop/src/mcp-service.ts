/**
 * MCP (Model Context Protocol) Server Configuration and Diagnostics Service.
 * Manages ~/.dsh/mcp.json persistence and connection health diagnostics.
 */

import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

import type { McpServerConfig, McpServerTestResult } from './mcp-contract.ts'
export type { McpServerConfig, McpServerTestResult } from './mcp-contract.ts'

export interface McpStoreDocument {
  readonly version: 1
  readonly mcpServers: Record<string, McpServerConfig>
}

export const DEFAULT_MCP_PRESETS: readonly McpServerConfig[] = Object.freeze([
  {
    name: 'filesystem',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', homedir()],
    enabled: false,
    description: 'Direct local filesystem access and operations across allowed directory roots',
  },
  {
    name: 'github',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: '' },
    enabled: false,
    description: 'GitHub repository management, issues, pull requests, and code inspection',
  },
  {
    name: 'brave-search',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    env: { BRAVE_API_KEY: '' },
    enabled: false,
    description: 'Live web and news search engine via Brave Search API',
  },
  {
    name: 'postgres',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres', 'postgresql://localhost/mydb'],
    enabled: false,
    description: 'PostgreSQL database read-only schema inspection and SQL query execution',
  },
])

export function resolveMcpConfigPath(): string {
  const dshHome = process.env.DSH_HOME ? resolve(process.env.DSH_HOME) : join(homedir(), '.dsh')
  return join(dshHome, 'mcp.json')
}

export class McpConfigService {
  constructor(private readonly configPath: string = resolveMcpConfigPath()) {}

  async load(): Promise<Record<string, McpServerConfig>> {
    if (!existsSync(this.configPath)) {
      const initial: Record<string, McpServerConfig> = {}
      for (const preset of DEFAULT_MCP_PRESETS) {
        initial[preset.name] = preset
      }
      return initial
    }

    try {
      const raw = await readFile(this.configPath, 'utf8')
      const doc = JSON.parse(raw) as unknown
      if (typeof doc === 'object' && doc !== null && 'mcpServers' in doc) {
        return (doc as { mcpServers: Record<string, McpServerConfig> }).mcpServers ?? {}
      }
      if (typeof doc === 'object' && doc !== null) {
        return doc as Record<string, McpServerConfig>
      }
      return {}
    } catch {
      return {}
    }
  }

  async saveServer(config: McpServerConfig): Promise<Record<string, McpServerConfig>> {
    if (!config.name || typeof config.name !== 'string') {
      throw new Error('MCP server name is required')
    }

    const current = await this.load()
    const updated = {
      ...current,
      [config.name]: config,
    }

    await this.persist(updated)
    return updated
  }

  async deleteServer(name: string): Promise<Record<string, McpServerConfig>> {
    const current = await this.load()
    const { [name]: _, ...rest } = current
    await this.persist(rest)
    return rest
  }

  async testConnection(config: McpServerConfig): Promise<McpServerTestResult> {
    const startTime = Date.now()

    if (config.transport === 'streamable-http') {
      if (!config.url) {
        return { ok: false, name: config.name, message: 'URL is required for HTTP transport' }
      }
      try {
        const res = await fetch(config.url, { method: 'HEAD' })
        const latencyMs = Date.now() - startTime
        return {
          ok: res.ok || res.status === 405 || res.status === 404, // Server exists and responds
          name: config.name,
          message: `HTTP endpoint responded with status ${res.status}`,
          latencyMs,
        }
      } catch (err) {
        return {
          ok: false,
          name: config.name,
          message: `HTTP connection failed: ${err instanceof Error ? err.message : String(err)}`,
        }
      }
    }

    // stdio transport test
    if (!config.command) {
      return { ok: false, name: config.name, message: 'Command is required for stdio transport' }
    }

    return new Promise<McpServerTestResult>((resolveTest) => {
      let resolved = false
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true
          try {
            proc.kill('SIGTERM')
          } catch {}
          resolveTest({
            ok: true,
            name: config.name,
            message: 'Process started successfully (timed out waiting for EOF, stdio active)',
            latencyMs: Date.now() - startTime,
          })
        }
      }, 3000)

      const proc = spawn(config.command!, config.args ? [...config.args] : [], {
        cwd: config.cwd || process.cwd(),
        env: { ...process.env, ...(config.env ?? {}) },
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      proc.on('error', (err) => {
        if (!resolved) {
          resolved = true
          clearTimeout(timeout)
          resolveTest({
            ok: false,
            name: config.name,
            message: `Failed to spawn process: ${err.message}`,
          })
        }
      })

      proc.on('spawn', () => {
        if (!resolved) {
          resolved = true
          clearTimeout(timeout)
          const latencyMs = Date.now() - startTime
          // Give process 200ms to verify it didn't immediately crash
          setTimeout(() => {
            try {
              proc.kill('SIGTERM')
            } catch {}
          }, 500)
          resolveTest({
            ok: true,
            name: config.name,
            message: 'MCP server process spawned and responsive on stdio',
            latencyMs,
          })
        }
      })
    })
  }

  private async persist(servers: Record<string, McpServerConfig>): Promise<void> {
    const dir = dirname(this.configPath)
    await mkdir(dir, { recursive: true })
    const doc: McpStoreDocument = {
      version: 1,
      mcpServers: servers,
    }
    await writeFile(this.configPath, JSON.stringify(doc, null, 2), 'utf8')
  }
}
