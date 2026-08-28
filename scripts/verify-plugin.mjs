#!/usr/bin/env node

/**
 * CLI runner for dsh-std Plugin Compliance Admission Checker.
 * Usage: node scripts/verify-plugin.mjs [path-to-plugin-or-file]
 */

import { readFileSync, statSync, readdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import {
  verifyPluginCompliance,
  CURRENT_DSH_STD_API_VERSION,
} from '../dsh-plugin-desktop/src/compliance-checker.ts'

const targetArg = process.argv[2] ?? '.'
const targetPath = resolve(process.cwd(), targetArg)

if (!existsSync(targetPath)) {
  console.error(`\x1b[31mError: Target path does not exist: ${targetPath}\x1b[0m`)
  process.exit(1)
}

let manifest = null
let hostSource = ''
let clientSource = ''

const stat = statSync(targetPath)

if (stat.isDirectory()) {
  // Check package.json or dsh-manifest.json or manifest in index.ts
  const pkgPath = join(targetPath, 'package.json')
  const manifestPath = join(targetPath, 'dsh-manifest.json')

  if (existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    } catch (e) {
      console.warn('Failed to parse dsh-manifest.json:', e.message)
    }
  } else if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      manifest = pkg['dsh'] ?? {
        apiVersion: CURRENT_DSH_STD_API_VERSION,
        kind: pkg.dshKind ?? 'Tool',
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        requires: pkg.dshRequires ?? [],
      }
    } catch (e) {
      console.warn('Failed to parse package.json:', e.message)
    }
  }

  // Look for host/client source
  const srcDir = join(targetPath, 'src')
  if (existsSync(srcDir)) {
    try {
      const files = readdirSync(srcDir)
      for (const file of files) {
        const full = join(srcDir, file)
        const content = readFileSync(full, 'utf8')
        if (file.includes('client') || file.endsWith('.tsx')) {
          clientSource += `\n// ${file}\n` + content
        } else {
          hostSource += `\n// ${file}\n` + content
        }
      }
    } catch {}
  }
} else {
  // Single file mode
  const content = readFileSync(targetPath, 'utf8')
  hostSource = content

  // Extract inline manifest if present
  const manifestMatch = /export\s+const\s+manifest\s*=\s*(\{[\s\S]*?\})\s*as\s+const/u.exec(content)
  if (manifestMatch) {
    try {
      // safe eval simple object
      manifest = Function(`"use strict"; return (${manifestMatch[1]})`)()
    } catch {}
  }

  if (targetPath.endsWith('.tsx') || targetPath.includes('client')) {
    clientSource = content
  }
}

console.log(`\n\x1b[1m🔍 Running dsh-std Plugin Compliance Checker on:\x1b[0m ${targetPath}\n`)

const report = verifyPluginCompliance({
  manifest: manifest ?? {
    apiVersion: CURRENT_DSH_STD_API_VERSION,
    kind: 'Tool',
    name: 'sample-plugin',
    version: '1.0.0',
    description: 'Sample evaluated file',
  },
  hostSource,
  clientSource,
})

console.log(`📊 \x1b[1mCompliance Score:\x1b[0m ${report.score}/100`)
console.log(`🎯 \x1b[1mAdmission Decision:\x1b[0m ${
  report.decision === 'admit'
    ? '\x1b[32m✔ ADMIT (Passed)\x1b[0m'
    : report.decision === 'warn'
      ? '\x1b[33m⚠ WARN (Passed with warnings)\x1b[0m'
      : '\x1b[31m✖ REJECT (Admission Refused)\x1b[0m'
}`)

if (report.manifest) {
  console.log(`📌 \x1b[1mPlugin Identity:\x1b[0m [${report.manifest.kind}] ${report.manifest.name}@${report.manifest.version}`)
  if (report.manifest.requires && report.manifest.requires.length > 0) {
    console.log(`🔑 \x1b[1mDeclared Capabilities:\x1b[0m ${report.manifest.requires.join(', ')}`)
  }
}

if (report.violations.length > 0) {
  console.log(`\n\x1b[31m\x1b[1m⛔ Violations (${report.violations.length}):\x1b[0m`)
  for (const v of report.violations) {
    console.log(`  • \x1b[31m[${v.code}]\x1b[0m ${v.message}`)
    if (v.detail) console.log(`    \x1b[90m${v.detail}\x1b[0m`)
  }
}

if (report.warnings.length > 0) {
  console.log(`\n\x1b[33m\x1b[1m⚠ Warnings (${report.warnings.length}):\x1b[0m`)
  for (const w of report.warnings) {
    console.log(`  • \x1b[33m[${w.code}]\x1b[0m ${w.message}`)
    if (w.detail) console.log(`    \x1b[90m${w.detail}\x1b[0m`)
  }
}

console.log('')

if (report.decision === 'reject') {
  process.exit(1)
} else {
  process.exit(0)
}
