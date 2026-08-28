import type { IncomingMessage, ServerResponse } from 'node:http'
import { SkillBoardService } from './skill-board-service.ts'

const MAX_BODY_BYTES = 16 * 1024

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

export const SKILL_BOARD_LIST_PATH = '/api/hi-dsh/skill-board/list'
export const SKILL_BOARD_TOGGLE_PATH = '/api/hi-dsh/skill-board/toggle'

export async function handleSkillBoardListRequest(
  req: IncomingMessage,
  res: ServerResponse,
  _expectedOrigin: string,
  service: SkillBoardService,
): Promise<void> {
  if (req.method !== 'GET') return finishJson(res, 405, { error: 'method not allowed' })
  try {
    const skills = await service.list()
    finishJson(res, 200, { skills })
  } catch (cause: unknown) {
    finishJson(res, 500, { error: 'failed to list skills', detail: String(cause) })
  }
}

export async function handleSkillBoardToggleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  service: SkillBoardService,
): Promise<void> {
  if (req.method !== 'POST') return finishJson(res, 405, { error: 'method not allowed' })
  if (req.headers.origin !== expectedOrigin && req.headers['sec-fetch-site'] !== 'same-origin') {
    return finishJson(res, 403, { error: 'forbidden' })
  }
  try {
    const body = (await readJson(req)) as { name?: string; enabled?: boolean }
    if (!body || typeof body.name !== 'string' || typeof body.enabled !== 'boolean') {
      return finishJson(res, 400, { error: 'invalid payload' })
    }
    const result = await service.toggle(body.name, body.enabled)
    finishJson(res, 200, result)
  } catch (cause: unknown) {
    finishJson(res, 500, { error: 'failed to toggle skill', detail: String(cause) })
  }
}
