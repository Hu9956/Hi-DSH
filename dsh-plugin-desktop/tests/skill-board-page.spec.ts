import type { IncomingMessage, ServerResponse } from 'node:http'
import { describe, expect, it, vi } from 'vitest'
import {
  SKILL_BOARD_PAGE_PATH,
  handleSkillBoardPageRequest,
} from '../src/skill-board-page.ts'

function request(method = 'GET'): IncomingMessage {
  return { method, headers: {} } as IncomingMessage
}

function response(): ServerResponse & {
  body: string
  end: ReturnType<typeof vi.fn>
  setHeader: ReturnType<typeof vi.fn>
} {
  const res = {
    body: '',
    statusCode: 200,
    setHeader: vi.fn(),
    end: vi.fn((body?: string) => { res.body = body ?? '' }),
  }
  return res as unknown as ServerResponse & typeof res
}

describe('skill board page route', () => {
  it('exposes the path the desktop titlebar opens', () => {
    expect(SKILL_BOARD_PAGE_PATH).toBe('/hi-dsh/skill-board')
  })

  it('serves the standalone HTML page on GET', async () => {
    const res = response()

    await handleSkillBoardPageRequest(request(), res)

    expect(res.statusCode).toBe(200)
    expect(res.setHeader).toHaveBeenCalledWith('content-type', 'text/html; charset=utf-8')
    expect(res.body).toContain('<!doctype html>')
    expect(res.body).toContain('Hi-DSH 技能开关')
    expect(res.body).toContain('/api/hi-dsh/skill-board/list')
    expect(res.body).toContain('/api/hi-dsh/skill-board/toggle')
  })

  it('rejects non-GET methods', async () => {
    const res = response()

    await handleSkillBoardPageRequest(request('POST'), res)

    expect(res.statusCode).toBe(405)
    expect(res.setHeader).toHaveBeenCalledWith('content-type', 'application/json; charset=utf-8')
    expect(JSON.parse(res.body)).toEqual({ error: 'method not allowed' })
  })
})
