import { describe, expect, it } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { McpConfigService, DEFAULT_MCP_PRESETS, type McpServerConfig } from '../src/mcp-service.ts'

describe('McpConfigService', () => {
  it('loads default presets when config file does not exist', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'dsh-mcp-test-'))
    try {
      const configPath = join(tempDir, 'mcp.json')
      const service = new McpConfigService(configPath)
      const servers = await service.load()

      expect(Object.keys(servers).length).toBe(DEFAULT_MCP_PRESETS.length)
      expect(servers['github']).toBeDefined()
      expect(servers['filesystem']).toBeDefined()
      expect(servers['postgres']).toBeDefined()
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('saves, updates, and deletes MCP server configurations', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'dsh-mcp-test-'))
    try {
      const configPath = join(tempDir, 'mcp.json')
      const service = new McpConfigService(configPath)

      const customServer: McpServerConfig = {
        name: 'custom-tool',
        transport: 'stdio',
        command: 'node',
        args: ['-v'],
        enabled: true,
        description: 'Test custom tool',
      }

      const updated = await service.saveServer(customServer)
      expect(updated['custom-tool']).toMatchObject(customServer)

      // Reload to ensure persistence
      const reloaded = await service.load()
      expect(reloaded['custom-tool']).toMatchObject(customServer)

      // Delete
      const afterDelete = await service.deleteServer('custom-tool')
      expect(afterDelete['custom-tool']).toBeUndefined()

      const reloadedAfterDelete = await service.load()
      expect(reloadedAfterDelete['custom-tool']).toBeUndefined()
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('tests connection for a local stdio command', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'dsh-mcp-test-'))
    try {
      const configPath = join(tempDir, 'mcp.json')
      const service = new McpConfigService(configPath)

      const result = await service.testConnection({
        name: 'echo-test',
        transport: 'stdio',
        command: 'node',
        args: ['-e', 'process.exit(0)'],
      })

      expect(result.name).toBe('echo-test')
      expect(result.ok).toBe(true)
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })
})
