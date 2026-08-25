/**
 * Hi-DSH Skill Board — Loopback HTTP handlers
 * GET  /api/hi-dsh/skill-board/list   -> list skills
 * POST /api/hi-dsh/skill-board/toggle -> {name, enabled}
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { SkillBoardService } from './index.ts'

const MAX_BODY = 16 * 1024
const SKILL_BOARD_LIST_PATH = '/api/hi-dsh/skill-board/list'
const SKILL_BOARD_TOGGLE_PATH = '/api/hi-dsh/skill-board/toggle'

function finishJson(res: ServerResponse, status: number, value: object): void {
  res.statusCode = status
  res.setHeader('cache-control', 'no-store')
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(value))
}

function isLoopbackAddress(addr: string | undefined): boolean {
  if (!addr) return false
  if (addr === '::1' || addr === '127.0.0.1') return true
  if (addr.startsWith('::ffff:')) return addr.slice(7).startsWith('127.')
  return addr.startsWith('127.')
}

function isAllowed(req: IncomingMessage, expectedOrigin: string): boolean {
  try {
    const expected = new URL(expectedOrigin)
    if (expected.hostname !== '127.0.0.1' && expected.hostname !== '[::1]') return false
    if (!isLoopbackAddress(req.socket.remoteAddress)) return false
    if (req.headers.host?.toLowerCase() !== expected.host.toLowerCase()) return false
    const origin = req.headers.origin
    if (origin !== undefined) return origin === expectedOrigin
    // GET may omit Origin, check sec-fetch-site
    if (req.method === 'GET') return req.headers['sec-fetch-site'] === 'same-origin' || req.headers['sec-fetch-site'] === undefined
    return false
  } catch {
    return false
  }
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array)
    size += buf.byteLength
    if (size > MAX_BODY) throw new Error('body too large')
    chunks.push(buf)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

export async function handleSkillBoardList(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  service: SkillBoardService,
): Promise<void> {
  if (req.method !== 'GET') { finishJson(res, 405, { error: 'method not allowed' }); return }
  if (!isAllowed(req, expectedOrigin)) { finishJson(res, 403, { error: 'forbidden' }); return }
  try {
    const list = await service.list()
    finishJson(res, 200, { skills: list })
  } catch (e) {
    finishJson(res, 500, { error: String(e) })
  }
}

export async function handleSkillBoardToggle(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  service: SkillBoardService,
): Promise<void> {
  if (req.method !== 'POST') { finishJson(res, 405, { error: 'method not allowed' }); return }
  if (!isAllowed(req, expectedOrigin)) { finishJson(res, 403, { error: 'forbidden' }); return }
  if (req.headers['content-type']?.split(';')[0]?.trim() !== 'application/json') {
    finishJson(res, 415, { error: 'content-type must be application/json' }); return
  }
  let body: unknown
  try { body = await readJson(req) } catch { finishJson(res, 400, { error: 'invalid JSON' }); return }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) { finishJson(res, 400, { error: 'invalid request' }); return }
  const { name, enabled } = body as Record<string, unknown>
  if (typeof name !== 'string' || typeof enabled !== 'boolean') { finishJson(res, 400, { error: 'name and enabled required' }); return }
  try {
    const result = await service.toggle(name, enabled)
    finishJson(res, 200, { ok: true, ...result, hot: true, message: enabled ? '已启用，下一轮对话生效（热）' : '已禁用，下一轮对话生效（热，省 Token）' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    finishJson(res, 400, { error: msg })
  }
}

export const skillBoardRouteConstants = {
  listPath: SKILL_BOARD_LIST_PATH,
  togglePath: SKILL_BOARD_TOGGLE_PATH,
} as const
