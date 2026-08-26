/**
 * Hi-DSH Skill Board — Host side
 *
 * Visual toggle for skills: disabling removes the skill from the model catalog
 * (hot, saves tokens) by editing SKILL.md frontmatter `disable-model-invocation`.
 * The per-preset skill-filesystem watchers pick up file changes and the
 * tool-skill catalog replacement reaches the model on the next step — no restart.
 *
 * Listing scans the same roots the local provider scans (project, custom,
 * user-dsh, user-agents, bundled) because the desktop web composition disables
 * the host-plane skill-filesystem row: the global registry layer is empty and
 * per-preset providers are scope-scoped, so a plain registry snapshot cannot
 * enumerate installed skills for a management surface.
 */

import type { Context } from '@deepseek-ai/cordis'
import { readdir, readFile, writeFile, access } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { handleSkillBoardList, handleSkillBoardPage, handleSkillBoardToggle, skillBoardRouteConstants } from './skill-board-route.ts'

export const name = 'dsh-plugin-skill-board'
export const inject = ['skills'] as const

export interface SkillBoardItem {
  name: string
  description: string
  source: string
  path: string
  modelInvocable: boolean
  userInvocable: boolean
}

export interface Config {
  /** Dry-run: log toggle without writing file */
  dryRun?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  const service = new SkillBoardService(ctx, config)

  // Register loopback HTTP API — sync + retry until webServer activates
  ctx.effect(() => {
    let d1: (() => void) | undefined
    let d2: (() => void) | undefined
    let d3: (() => void) | undefined
    let timer: ReturnType<typeof setInterval> | undefined
    const tryRegister = (): boolean => {
      const webServer = ctx.get('webServer') as undefined | { port: number; host: string; register: (route: unknown) => () => void }
      if (webServer === undefined) return false
      const expectedOrigin = `http://${webServer.host}:${String(webServer.port)}`
      d1 = webServer.register({
        kind: 'exact',
        path: skillBoardRouteConstants.listPath,
        handler: (req: unknown, res: unknown) => handleSkillBoardList(req as any, res as any, expectedOrigin, service),
      })
      d2 = webServer.register({
        kind: 'exact',
        path: skillBoardRouteConstants.togglePath,
        handler: (req: unknown, res: unknown) => handleSkillBoardToggle(req as any, res as any, expectedOrigin, service),
      })
      d3 = webServer.register({
        kind: 'exact',
        path: skillBoardRouteConstants.pagePath,
        handler: (req: unknown, res: unknown) => handleSkillBoardPage(req as any, res as any, expectedOrigin),
      })
      ctx.logger.info(`skill-board: routes registered at ${expectedOrigin}${skillBoardRouteConstants.pagePath}`)
      return true
    }
    if (!tryRegister()) {
      timer = setInterval(() => {
        if (tryRegister() && timer !== undefined) { clearInterval(timer); timer = undefined }
      }, 200)
    }
    return () => {
      if (timer !== undefined) clearInterval(timer)
      try { d1?.() } catch {}
      try { d2?.() } catch {}
      try { d3?.() } catch {}
    }
  })
}

interface FoundSkill {
  name: string
  description: string
  source: string
  path: string
  modelInvocable: boolean
  userInvocable: boolean
}

const USER_DSH_RANK = 400
const USER_AGENTS_RANK = 500

export class SkillBoardService {
  constructor(private ctx: Context, private config: Config) {}

  /** Skill roots mirroring the local provider's default roots (user level). */
  private roots(): { path: string; source: string; rank: number }[] {
    const home = resolveDshHomeSafe()
    return [
      { path: join(home, 'skills'), source: 'user-dsh', rank: USER_DSH_RANK },
      { path: join(process.env.DSH_AGENTS_HOME ?? join(homedir(), '.agents'), 'skills'), source: 'user-agents', rank: USER_AGENTS_RANK },
    ]
  }

  async list(): Promise<SkillBoardItem[]> {
    const found = await this.scan()
    return found.sort((a, b) => a.name.localeCompare(b.name))
  }

  async toggle(name: string, enabled: boolean): Promise<{ path: string; enabled: boolean }> {
    const found = await this.scan()
    const target = found.find(s => s.name === name)
    if (!target) throw new Error(`skill "${name}" not found`)
    const newMode = await toggleSkillFile(target.path, enabled, this.config.dryRun ?? false)
    this.ctx.logger.info(`skill-board: ${name} -> modelInvocable=${newMode} at ${target.path}`)
    return { path: target.path, enabled: newMode }
  }

  /** Scan user roots for bundle (dir/SKILL.md) and flat (<name>.md) skills. */
  private async scan(): Promise<FoundSkill[]> {
    const result: FoundSkill[] = []
    for (const root of this.roots()) {
      let entries
      try {
        entries = await readdir(root.path, { withFileTypes: true })
      } catch {
        continue
      }
      for (const entry of entries) {
        if (entry.name === '.system') continue
        if (entry.isDirectory()) {
          const path = join(root.path, entry.name, 'SKILL.md')
          const parsed = await this.parse(path, root.source)
          if (parsed) result.push(parsed)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const path = join(root.path, entry.name)
          const parsed = await this.parse(path, root.source)
          if (parsed) result.push(parsed)
        }
      }
    }
    // first wins per name (roots already ordered by rank)
    const seen = new Set<string>()
    return result.filter(s => !seen.has(s.name) && seen.add(s.name) !== undefined)
  }

  private async parse(path: string, source: string): Promise<FoundSkill | undefined> {
    try {
      await access(path)
      const raw = await readFile(path, 'utf8')
      const parsed = parseFrontmatter(raw)
      if (!parsed) return undefined
      const name = parsed.data['name']
      const description = parsed.data['description']
      if (typeof name !== 'string' || typeof description !== 'string') return undefined
      const disableModel = parsed.data['disable-model-invocation']
      const userInv = parsed.data['user-invocable']
      return {
        name,
        description,
        source,
        path,
        modelInvocable: disableModel !== true,
        userInvocable: userInv !== false,
      }
    } catch {
      return undefined
    }
  }
}

function resolveDshHomeSafe(): string {
  return resolve(process.env.DSH_HOME ?? join(homedir(), '.dsh'))
}

/**
 * Patch SKILL.md frontmatter to set disable-model-invocation.
 * Hot-reload is handled by skill-filesystem chokidar + tool-skill catalog replacement.
 */
export async function toggleSkillFile(filePath: string, enabled: boolean, dryRun = false): Promise<boolean> {
  const raw = await readFile(filePath, 'utf8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) throw new Error(`skill file ${filePath} missing frontmatter`)

  const data = parsed.data as Record<string, unknown>
  if ('disableModelInvocation' in data || 'modelInvocable' in data) {
    throw new Error(`skill ${filePath} uses legacy frontmatter key`)
  }

  if (enabled) {
    if ('disable-model-invocation' in data) delete data['disable-model-invocation']
  } else {
    data['disable-model-invocation'] = true
  }

  const newRaw = stringifyFrontmatter(data, parsed.body)
  if (!dryRun) await writeFile(filePath, newRaw, 'utf8')
  return enabled
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } | undefined {
  if (!raw.startsWith('---\n')) return undefined
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return undefined
  const yaml = raw.slice(4, end)
  const bodyStart = raw.indexOf('\n', end + 4)
  const body = bodyStart === -1 ? '' : raw.slice(bodyStart + 1)
  const data = parseYaml(yaml) as Record<string, unknown>
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return undefined
  return { data, body }
}

function stringifyFrontmatter(data: Record<string, unknown>, body: string): string {
  const yaml = stringifyYaml(data).trimEnd()
  return `---\n${yaml}\n---\n${body.startsWith('\n') ? body : body ? body : ''}`
}
