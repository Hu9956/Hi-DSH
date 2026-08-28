/**
 * MCP (Model Context Protocol) Shared Type Contracts and Route Constants.
 * Safe to import in both browser client and Node.js host environments.
 */

export interface McpServerConfig {
  readonly name: string
  readonly transport: 'stdio' | 'streamable-http'
  readonly command?: string | undefined
  readonly args?: readonly string[] | undefined
  readonly url?: string | undefined
  readonly env?: Readonly<Record<string, string>> | undefined
  readonly cwd?: string | undefined
  readonly enabled?: boolean | undefined
  readonly description?: string | undefined
}

export interface McpServerTestResult {
  readonly ok: boolean
  readonly name: string
  readonly message: string
  readonly latencyMs?: number | undefined
  readonly toolsCount?: number | undefined
}

export const MCP_LIST_PATH = '/api/hi-dsh/mcp/list'
export const MCP_SAVE_PATH = '/api/hi-dsh/mcp/save'
export const MCP_DELETE_PATH = '/api/hi-dsh/mcp/delete'
export const MCP_TEST_PATH = '/api/hi-dsh/mcp/test'
