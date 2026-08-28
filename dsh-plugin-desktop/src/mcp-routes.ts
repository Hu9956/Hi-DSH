import type { IncomingMessage, ServerResponse } from 'node:http'
import { McpConfigService, type McpServerConfig } from './mcp-service.ts'
export {
  MCP_LIST_PATH,
  MCP_SAVE_PATH,
  MCP_DELETE_PATH,
  MCP_TEST_PATH,
} from './mcp-contract.ts'

const MAX_BODY_BYTES = 32 * 1024

function finishJson(res: ServerResponse, statusCode: number, value: object): void {
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(value))
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new Error('request body is too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

export async function handleMcpListRequest(
  req: IncomingMessage,
  res: ServerResponse,
  _expectedOrigin: string,
  mcpService: McpConfigService,
): Promise<void> {
  if (req.method !== 'GET') return finishJson(res, 405, { error: 'method not allowed' })
  try {
    const servers = await mcpService.load()
    finishJson(res, 200, { servers })
  } catch (cause: unknown) {
    finishJson(res, 500, { error: 'failed to load mcp servers', detail: String(cause) })
  }
}

export async function handleMcpSaveRequest(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  mcpService: McpConfigService,
): Promise<void> {
  if (req.method !== 'POST') return finishJson(res, 405, { error: 'method not allowed' })
  if (req.headers.origin !== expectedOrigin && req.headers['sec-fetch-site'] !== 'same-origin') {
    return finishJson(res, 403, { error: 'forbidden' })
  }
  try {
    const body = (await readJson(req)) as { server?: McpServerConfig }
    if (!body || !body.server || !body.server.name) {
      return finishJson(res, 400, { error: 'invalid mcp server config' })
    }
    const servers = await mcpService.saveServer(body.server)
    finishJson(res, 200, { ok: true, servers })
  } catch (cause: unknown) {
    finishJson(res, 500, { error: 'failed to save mcp server', detail: String(cause) })
  }
}

export async function handleMcpDeleteRequest(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  mcpService: McpConfigService,
): Promise<void> {
  if (req.method !== 'POST') return finishJson(res, 405, { error: 'method not allowed' })
  if (req.headers.origin !== expectedOrigin && req.headers['sec-fetch-site'] !== 'same-origin') {
    return finishJson(res, 403, { error: 'forbidden' })
  }
  try {
    const body = (await readJson(req)) as { name?: string }
    if (!body || typeof body.name !== 'string') {
      return finishJson(res, 400, { error: 'name is required' })
    }
    const servers = await mcpService.deleteServer(body.name)
    finishJson(res, 200, { ok: true, servers })
  } catch (cause: unknown) {
    finishJson(res, 500, { error: 'failed to delete mcp server', detail: String(cause) })
  }
}

export async function handleMcpTestRequest(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  mcpService: McpConfigService,
): Promise<void> {
  if (req.method !== 'POST') return finishJson(res, 405, { error: 'method not allowed' })
  if (req.headers.origin !== expectedOrigin && req.headers['sec-fetch-site'] !== 'same-origin') {
    return finishJson(res, 403, { error: 'forbidden' })
  }
  try {
    const body = (await readJson(req)) as { server?: McpServerConfig }
    if (!body || !body.server) {
      return finishJson(res, 400, { error: 'server is required' })
    }
    const result = await mcpService.testConnection(body.server)
    finishJson(res, 200, result)
  } catch (cause: unknown) {
    finishJson(res, 500, { error: 'mcp test failed', detail: String(cause) })
  }
}
