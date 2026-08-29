/**
 * dsh-std Plugin Compliance Checker Settings Tab & Card.
 * Visual admission inspection, sandbox safety verification, and interactive audit console.
 */

import { useState, useTransition } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { DesktopSettingsLocaleKey } from './desktop-settings-locales.ts'
import {
  CURRENT_DSH_STD_API_VERSION,
  verifyPluginCompliance,
  type PluginComplianceReport,
} from '../compliance-checker.ts'
import { Button, Badge, Card } from 'dsh-ui'

export interface DesktopComplianceCheckerTabProps
  extends Partial<PropsRuntime<'settings.plugins.tab'>> {
  t: (key: DesktopSettingsLocaleKey) => string
}

/**
 * Extract an embedded `export const manifest = { ... }` block from pasted
 * plugin source. The pasted text is untrusted data, so only its string fields
 * are read here, as text — the manifest block is handed to the validator as a
 * plain object and the rest of the source is never treated as code.
 */
export function extractEmbeddedManifest(source: string): unknown {
  const block = source.match(/export\s+const\s+manifest\s*=\s*\{([\s\S]*?)\}(?:\s*as\s+const)?/u)
  if (block === null || block[1] === undefined) return null
  const fields: Record<string, string> = {}
  const doubleQuoted = /(\w+)\s*:\s*"([^"]*)"/gu
  const singleQuoted = /(\w+)\s*:\s*'([^']*)'/gu
  for (const pattern of [doubleQuoted, singleQuoted]) {
    for (const match of block[1].matchAll(pattern)) {
      const key = match[1]
      const value = match[2]
      if (key !== undefined && value !== undefined) fields[key] = value
    }
  }
  return Object.keys(fields).length > 0 ? fields : null
}

const PRESET_TOOL = `/**
 * @name dsh-plugin-sample-tool
 * apiVersion: dsh-std/v1
 * kind: Tool
 */
export const manifest = {
  apiVersion: 'dsh-std/v1',
  kind: 'Tool',
  name: 'dsh-plugin-sample-tool',
  version: '1.0.0',
  description: 'A standard tool plugin following dsh-std',
  requires: ['network']
}

export function apply(ctx) {
  ctx.logger.info('Tool plugin initialized');
}
`

const PRESET_SLOT = `/**
 * @name dsh-plugin-sample-ui
 * apiVersion: dsh-std/v1
 * kind: Presentation
 */
export const manifest = {
  apiVersion: 'dsh-std/v1',
  kind: 'Presentation',
  name: 'dsh-plugin-sample-ui',
  version: '1.0.0',
  description: 'A safe client UI slot extension',
  requires: ['ui-slot']
}

import React from 'react'
export function View() {
  return <div>Safe Client Component</div>
}
`

const PRESET_SERVICE = `/**
 * @name dsh-plugin-backend-service
 * apiVersion: dsh-std/v1
 * kind: Service
 */
export const manifest = {
  apiVersion: 'dsh-std/v1',
  kind: 'Service',
  name: 'dsh-plugin-backend-service',
  version: '1.0.0',
  description: 'A background daemon service',
  requires: ['settings']
}

export function apply(ctx) {
  ctx.provide('customService', { status: 'ok' });
}
`

const PRESET_INVALID = `/**
 * @name dsh-plugin-malicious-leak
 * apiVersion: legacy-v0
 * kind: HackerScript
 */
export const manifest = {
  apiVersion: 'legacy-v0',
  kind: 'HackerScript',
  name: 'dsh-plugin-desktop',
  version: '0.0.0'
}

import { readFileSync } from 'node:fs'
import { ipcRenderer } from 'electron'
`

export function DesktopComplianceCheckerTab(props: DesktopComplianceCheckerTabProps) {
  const { t } = props
  const [sourceCode, setSourceCode] = useState(PRESET_TOOL)
  const [report, setReport] = useState<PluginComplianceReport>(() =>
    verifyPluginCompliance({
      manifest: {
        apiVersion: CURRENT_DSH_STD_API_VERSION,
        kind: 'Tool',
        name: 'dsh-plugin-sample-tool',
        version: '1.0.0',
        description: 'A standard tool plugin following dsh-std',
        requires: ['network'],
      },
      hostSource: PRESET_TOOL,
    }),
  )
  const [isPending, startTransition] = useTransition()

  const handleRunAudit = () => {
    startTransition(() => {
      // Try to parse manifest if embedded
      const manifest = extractEmbeddedManifest(sourceCode)

      const outcome = verifyPluginCompliance({
        manifest: manifest ?? {
          apiVersion: CURRENT_DSH_STD_API_VERSION,
          kind: 'Tool',
          name: 'custom-plugin',
          version: '1.0.0',
        },
        hostSource: sourceCode,
        clientSource: sourceCode.includes('import React') || sourceCode.includes('from \'electron\'') || sourceCode.includes('node:fs') ? sourceCode : undefined,
      })

      setReport(outcome)
    })
  }

  return (
    <div className="dshComplianceContainer">
      <Card>
        <div className="dshComplianceHeader">
          <div className="dshComplianceTitle">
            <span>{t('complianceTitle')}</span>
          </div>
          <Badge variant="success">
            <span>●</span>
            <span>{t('complianceBadge')}</span>
          </Badge>
        </div>

        <p className="dshDesktopSettingsHint">
          {t('complianceDesc')}
        </p>

        <div className="dshCompliancePresetRow">
          <Button
            variant="ghost"
            onClick={() => {
              setSourceCode(PRESET_TOOL)
            }}
          >
            {t('compliancePresetTool')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSourceCode(PRESET_SLOT)
            }}
          >
            {t('compliancePresetSlot')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSourceCode(PRESET_SERVICE)
            }}
          >
            {t('compliancePresetService')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setSourceCode(PRESET_INVALID)
            }}
          >
            {t('compliancePresetInvalid')}
          </Button>
        </div>

        <textarea
          className="dshComplianceTextarea"
          value={sourceCode}
          onChange={e => setSourceCode(e.target.value)}
          placeholder={t('complianceSourcePlaceholder')}
        />

        <div className="dshComplianceActionRow">
          <Button variant="primary" onClick={handleRunAudit} disabled={isPending}>
            {isPending ? '...' : t('complianceRunCheck')}
          </Button>
        </div>

        <div className="dshComplianceResultBox">
          <div className="dshComplianceStatRow">
            <div className="dshComplianceStatItem">
              <span>{t('complianceDecisionLabel')}:</span>
              <span
                className={
                  report.decision === 'admit'
                    ? 'dshComplianceAdmit'
                    : report.decision === 'warn'
                      ? 'dshComplianceWarn'
                      : 'dshComplianceReject'
                }
              >
                {report.decision === 'admit'
                  ? t('complianceAdmit')
                  : report.decision === 'warn'
                    ? t('complianceWarn')
                    : t('complianceReject')}
              </span>
            </div>
            <div className="dshComplianceStatItem">
              <span>{t('complianceScoreLabel')}:</span>
              <span className="dshComplianceStatValue">{report.score} / 100</span>
            </div>
            {report.manifest && (
              <div className="dshComplianceStatItem">
                <span>ID:</span>
                <code className="dshComplianceIdCode">
                  [{report.manifest.kind}] {report.manifest.name}@{report.manifest.version}
                </code>
              </div>
            )}
          </div>

          {report.violations.length > 0 ? (
            <div className="dshComplianceFindingGroup" data-severity="error">
              <div className="dshComplianceFindingTitle">
                {t('complianceViolationsLabel')} ({report.violations.length}):
              </div>
              <ul className="dshComplianceFindingList">
                {report.violations.map((v, i) => (
                  <li key={i}>
                    <strong>[{v.code}]</strong> {v.message}
                    {v.detail && <div className="dshComplianceFindingDetail">{v.detail}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="dshComplianceNoViolations">
              {t('complianceNoViolations')}
            </div>
          )}

          {report.warnings.length > 0 && (
            <div className="dshComplianceFindingGroup" data-severity="warning">
              <div className="dshComplianceFindingTitle">
                {t('complianceWarningsLabel')} ({report.warnings.length}):
              </div>
              <ul className="dshComplianceFindingList">
                {report.warnings.map((w, i) => (
                  <li key={i}>
                    <strong>[{w.code}]</strong> {w.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
