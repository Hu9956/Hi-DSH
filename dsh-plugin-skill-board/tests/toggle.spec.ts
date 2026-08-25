import { describe, it, expect } from 'vitest'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { toggleSkillFile } from '../src/index.js'

const SKILL_TMPL = (disable?: boolean) => `---
name: hello-skill
description: a test skill
${disable ? 'disable-model-invocation: true\n' : ''}---
# Hello
content here
`

describe('toggleSkillFile', () => {
  it('disables skill (hot, adds flag)', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'skill-board-'))
    const file = join(dir, 'hello-skill.md')
    await writeFile(file, SKILL_TMPL(false), 'utf8')
    await toggleSkillFile(file, false)
    const raw = await readFile(file, 'utf8')
    expect(raw).toContain('disable-model-invocation: true')
    await rm(dir, { recursive: true, force: true })
  })

  it('enables skill (removes flag)', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'skill-board-'))
    const file = join(dir, 'hello-skill.md')
    await writeFile(file, SKILL_TMPL(true), 'utf8')
    await toggleSkillFile(file, true)
    const raw = await readFile(file, 'utf8')
    expect(raw).not.toContain('disable-model-invocation')
    await rm(dir, { recursive: true, force: true })
  })

  it('dryRun does not write', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'skill-board-'))
    const file = join(dir, 'hello-skill.md')
    await writeFile(file, SKILL_TMPL(false), 'utf8')
    await toggleSkillFile(file, false, true)
    const raw = await readFile(file, 'utf8')
    expect(raw).not.toContain('disable-model-invocation')
    await rm(dir, { recursive: true, force: true })
  })
})
