import { describe, expect, it } from 'vitest'
import {
  CURRENT_DSH_STD_API_VERSION,
  scanClientSandboxViolations,
  validateDshStdManifest,
  verifyPluginCompliance,
  type DshStdManifest,
} from '../src/compliance-checker.ts'

describe('dsh-std compliance checker - manifest validation', () => {
  const VALID_MANIFEST: DshStdManifest = {
    apiVersion: CURRENT_DSH_STD_API_VERSION,
    kind: 'Tool',
    name: 'dsh-plugin-sample-tool',
    version: '1.0.0',
    description: 'A compliant sample tool plugin',
    requires: ['network'],
  }

  it('accepts a fully compliant dsh-std manifest', () => {
    const { manifest, violations, warnings } = validateDshStdManifest(VALID_MANIFEST)
    expect(violations).toHaveLength(0)
    expect(warnings).toHaveLength(0)
    expect(manifest).toEqual(VALID_MANIFEST)
  })

  it('rejects invalid or missing apiVersion', () => {
    const { violations } = validateDshStdManifest({
      ...VALID_MANIFEST,
      apiVersion: 'v2-legacy',
    })
    expect(violations.some(v => v.code === 'ERR_PROTOCOL_MISSING_OR_INVALID')).toBe(true)
  })

  it('rejects unsupported plugin kind', () => {
    const { violations } = validateDshStdManifest({
      ...VALID_MANIFEST,
      kind: 'UnknownKind',
    })
    expect(violations.some(v => v.code === 'ERR_KIND_UNSUPPORTED')).toBe(true)
  })

  it('rejects blocked core package names to prevent tampering', () => {
    const { violations } = validateDshStdManifest({
      ...VALID_MANIFEST,
      name: 'dsh-plugin-desktop',
    })
    expect(violations.some(v => v.code === 'ERR_UPSTREAM_TAMPER_DETECTED')).toBe(true)
  })

  it('rejects malformed SemVer strings', () => {
    const { violations } = validateDshStdManifest({
      ...VALID_MANIFEST,
      version: 'invalid-version',
    })
    expect(violations.some(v => v.code === 'ERR_INVALID_VERSION')).toBe(true)
  })

  it('warns on unknown capability requests', () => {
    const { warnings, violations } = validateDshStdManifest({
      ...VALID_MANIFEST,
      requires: ['unsupported-super-admin-perm'],
    })
    expect(violations).toHaveLength(0)
    expect(warnings.some(w => w.code === 'WARN_UNKNOWN_CAPABILITY')).toBe(true)
  })
})

describe('dsh-std compliance checker - sandbox scanning', () => {
  it('passes safe pure React/Web client code', () => {
    const safeClientCode = `
      import React, { useState } from 'react'
      export function MyWidget() {
        const [count, setCount] = useState(0)
        return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      }
    `
    const violations = scanClientSandboxViolations(safeClientCode)
    expect(violations).toHaveLength(0)
  })

  it('catches and rejects direct node:fs import in client bundle', () => {
    const unsafeClientCode = `
      import { readFileSync } from 'node:fs'
      export function HackyView() {
        const secret = readFileSync('/etc/passwd')
        return <div>{secret}</div>
      }
    `
    const violations = scanClientSandboxViolations(unsafeClientCode)
    expect(violations.some(v => v.code === 'ERR_RENDERER_SANDBOX_VIOLATION')).toBe(true)
  })

  it('catches and rejects child_process in client bundle', () => {
    const unsafeClientCode = `
      import { execSync } from 'node:child_process'
      export function Exploit() {
        execSync('rm -rf /')
      }
    `
    const violations = scanClientSandboxViolations(unsafeClientCode)
    expect(violations.some(v => v.code === 'ERR_RENDERER_SANDBOX_VIOLATION')).toBe(true)
  })

  it('catches and rejects raw electron runtime import in client renderer', () => {
    const unsafeClientCode = `
      import { ipcRenderer } from 'electron'
      ipcRenderer.send('danger')
    `
    const violations = scanClientSandboxViolations(unsafeClientCode)
    expect(violations.some(v => v.code === 'ERR_RENDERER_SANDBOX_VIOLATION')).toBe(true)
  })
})

describe('dsh-std compliance checker - holistic decision engine', () => {
  it('admits a completely compliant plugin with high score', () => {
    const report = verifyPluginCompliance({
      manifest: {
        apiVersion: CURRENT_DSH_STD_API_VERSION,
        kind: 'Presentation',
        name: 'dsh-plugin-awesome-dashboard',
        version: '1.2.0',
        description: 'An awesome dashboard plugin',
        requires: ['ui-slot'],
      },
      hostSource: `
        import type { Context } from '@deepseek-ai/cordis'
        export function apply(ctx: Context): void {
          ctx.logger.info('plugin ready')
        }
      `,
      clientSource: `
        import React from 'react'
        export function Dashboard() { return <div>Dashboard</div> }
      `,
    })

    expect(report.compliant).toBe(true)
    expect(report.decision).toBe('admit')
    expect(report.score).toBe(100)
    expect(report.violations).toHaveLength(0)
  })

  it('rejects a plugin that violates upstream submodule boundary', () => {
    const report = verifyPluginCompliance({
      manifest: {
        apiVersion: CURRENT_DSH_STD_API_VERSION,
        kind: 'Service',
        name: 'dsh-plugin-core-tamper',
        version: '0.1.0',
        description: 'Tampering with core',
      },
      hostSource: `
        import { something } from '../../deepseek-harness/packages/core'
        export function apply() {}
      `,
    })

    expect(report.compliant).toBe(false)
    expect(report.decision).toBe('reject')
    expect(report.violations.some(v => v.code === 'ERR_UPSTREAM_TAMPER_DETECTED')).toBe(true)
  })
})
