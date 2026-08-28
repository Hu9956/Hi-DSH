/**
 * Skill Board Service in Hi-DSH Desktop Host.
 * Scans installed skills across user and workspace roots and manages model invocation toggles.
 */

import { readdir, readFile, writeFile, access } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

export interface SkillBoardItem {
  readonly name: string
  readonly description: string
  readonly source: string
  readonly path: string
  readonly modelInvocable: boolean
  readonly userInvocable: boolean
}

export function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } | undefined {
  if (!content.startsWith('---')) return undefined
  const endIdx = content.indexOf('\n---', 3)
  if (endIdx === -1) return undefined
  const yamlBlock = content.slice(3, endIdx).trim()
  const body = content.slice(endIdx + 4).trim()

  const data: Record<string, unknown> = {}
  const lines = yamlBlock.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue
    const key = trimmed.slice(0, colonIdx).trim()
    let valStr = trimmed.slice(colonIdx + 1).trim()
    if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
      valStr = valStr.slice(1, -1)
    }
    if (valStr === 'true') {
      data[key] = true
    } else if (valStr === 'false') {
      data[key] = false
    } else {
      data[key] = valStr
    }
  }

  return { data, body }
}

export function stringifyWithFrontmatter(data: Record<string, unknown>, body: string): string {
  const lines = ['---']
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'boolean') {
      lines.push(`${key}: ${val ? 'true' : 'false'}`)
    } else if (typeof val === 'string') {
      lines.push(`${key}: ${val}`)
    } else {
      lines.push(`${key}: ${JSON.stringify(val)}`)
    }
  }
  lines.push('---')
  lines.push('')
  lines.push(body)
  return lines.join('\n')
}

export async function toggleSkillFile(path: string, enabled: boolean): Promise<boolean> {
  const raw = await readFile(path, 'utf8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) throw new Error(`invalid SKILL.md frontmatter at ${path}`)

  if (enabled) {
    delete parsed.data['disable-model-invocation']
  } else {
    parsed.data['disable-model-invocation'] = true
  }

  const updated = stringifyWithFrontmatter(parsed.data, parsed.body)
  await writeFile(path, updated, 'utf8')
  return enabled
}

export class SkillBoardService {
  constructor(private readonly dryRun: boolean = false) {}

  private roots(): { path: string; source: string }[] {
    const dshHome = process.env.DSH_HOME ? resolve(process.env.DSH_HOME) : join(homedir(), '.dsh')
    const agentsHome = process.env.DSH_AGENTS_HOME ?? join(homedir(), '.agents')
    return [
      { path: join(dshHome, 'skills'), source: 'user-dsh' },
      { path: join(agentsHome, 'skills'), source: 'user-agents' },
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
    if (this.dryRun) {
      return { path: target.path, enabled }
    }
    const newMode = await toggleSkillFile(target.path, enabled)
    return { path: target.path, enabled: newMode }
  }

  private async scan(): Promise<SkillBoardItem[]> {
    const result: SkillBoardItem[] = []
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
    const seen = new Set<string>()
    return result.filter(s => !seen.has(s.name) && seen.add(s.name) !== undefined)
  }

  private async parse(path: string, source: string): Promise<SkillBoardItem | undefined> {
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
