/**
 * Hi-DSH Skill Board — Host side
 * Visual toggle for skills: disabling removes skill from model catalog (hot, saves tokens).
 * Implements toggle by editing SKILL.md frontmatter `disable-model-invocation`.
 * Relies on skill-filesystem watcher + tool-skill catalog replacement (agent/pre-step).
 */

import type { Context } from '@deepseek-ai/cordis'
import { readFile, writeFile } from 'node:fs/promises'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

export const name = 'dsh-plugin-skill-board'
export const inject = {
  required: ['skills'],
  optional: ['webServer', 'fs'],
} as const

export interface SkillBoardItem {
  name: string
  description: string
  source: string
  provider: string
  path?: string
  modelInvocable: boolean
  userInvocable: boolean
}

export interface Config {
  /** Dry-run: log toggle without writing file */
  dryRun?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  const service = new SkillBoardService(ctx, config)
  ctx.effect(() => {
    ;(ctx as any).skillBoard = service
    return () => { delete (ctx as any).skillBoard }
  })

  // Register loopback HTTP API if webServer is available (desktop mode)
  ctx.effect(() => {
    const webServer = (ctx as any).webServer as undefined | { port: number; host: string; register: (route: unknown) => () => void }
    if (webServer === undefined) return
    // Lazy import to avoid circular
    let routeModule: typeof import('./skill-board-route.ts') | undefined
    const expectedOrigin = `http://${webServer.host}:${String(webServer.port)}`
    const doRegister = async (): Promise<(() => void)[]> => {
      if (routeModule === undefined) routeModule = await import('./skill-board-route.ts')
      const { handleSkillBoardList, handleSkillBoardToggle, skillBoardRouteConstants } = routeModule
      const disposers: (() => void)[] = []
      disposers.push(
        webServer.register({
          kind: 'exact',
          path: skillBoardRouteConstants.listPath,
          handler: (req: unknown, res: unknown) =>
            handleSkillBoardList(req as any, res as any, expectedOrigin, service),
        }),
      )
      disposers.push(
        webServer.register({
          kind: 'exact',
          path: skillBoardRouteConstants.togglePath,
          handler: (req: unknown, res: unknown) =>
            handleSkillBoardToggle(req as any, res as any, expectedOrigin, service),
        }),
      )
      return disposers
    }
    let disposers: (() => void)[] = []
    void doRegister().then(ds => { disposers = ds }).catch(e => ctx.logger.warn(`skill-board: failed to register routes: ${String(e)}`))
    return () => { for (const d of disposers) try { d() } catch {} }
  })
}

export class SkillBoardService {
  constructor(private ctx: Context, private config: Config) {}

  async list(): Promise<SkillBoardItem[]> {
    const skills = await (this.ctx as any).skills.snapshot({ cwd: process.cwd() })
    const list: SkillBoardItem[] = skills.skills.map((s: any) => ({
      name: s.name,
      description: s.description,
      source: s.source,
      provider: s.provider,
      path: s.path,
      modelInvocable: s.invocation.modelInvocable,
      userInvocable: s.invocation.userInvocable,
    }))
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }

  /**
   * Toggle model-invocable for a skill file.
   * @param name skill name
   * @param enabled true = model can invoke, false = hidden from catalog (saves tokens)
   */
  async toggle(name: string, enabled: boolean): Promise<{ path: string; enabled: boolean }> {
    const snapshot = await (this.ctx as any).skills.snapshot({ cwd: process.cwd() })
    const target = snapshot.skills.find((s: any) => s.name === name)
    if (!target) throw new Error(`skill "${name}" not found`)
    if (!target.path) throw new Error(`skill "${name}" has no file path (runtime skill) — cannot toggle via file`)

    const filePath: string = target.path
    const newMode = await toggleSkillFile(filePath, enabled, this.config.dryRun ?? false)
    ctx.logger.info(`skill-board: ${name} -> modelInvocable=${newMode} at ${filePath}`)
    return { path: filePath, enabled: newMode }
  }
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
  // Validate legacy keys are rejected per spec
  if ('disableModelInvocation' in data || 'modelInvocable' in data) {
    throw new Error(`skill ${filePath} uses legacy frontmatter key`)
  }

  if (enabled) {
    // enabled => remove disable flag (or set false)
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
