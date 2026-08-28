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

export interface DesktopComplianceCheckerTabProps
  extends Partial<PropsRuntime<'settings.plugins.tab'>> {
  t: (key: DesktopSettingsLocaleKey) => string
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
      let manifest: unknown = null
      const manifestMatch = /export\s+const\s+manifest\s*=\s*(\{[\s\S]*?\})(?:\s*as\s+const)?/u.exec(sourceCode)
      if (manifestMatch) {
        try {
          manifest = Function(`"use strict"; return (${manifestMatch[1]})`)()
        } catch {}
      }

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
      <div className="dshComplianceCard">
        <div className="dshComplianceHeader">
          <div className="dshComplianceTitle">
            <span>{t('complianceTitle')}</span>
          </div>
          <div className="dshComplianceActiveBadge">
            <span>●</span>
            <span>{t('complianceBadge')}</span>
          </div>
        </div>

        <p className="dshDesktopSettingsHint" style={{ margin: 0 }}>
          {t('complianceDesc')}
        </p>

        <div className="dshCompliancePresetRow">
          <button
            type="button"
            className="dshCompliancePresetBtn"
            onClick={() => {
              setSourceCode(PRESET_TOOL)
            }}
          >
            {t('compliancePresetTool')}
          </button>
          <button
            type="button"
            className="dshCompliancePresetBtn"
            onClick={() => {
              setSourceCode(PRESET_SLOT)
            }}
          >
            {t('compliancePresetSlot')}
          </button>
          <button
            type="button"
            className="dshCompliancePresetBtn"
            onClick={() => {
              setSourceCode(PRESET_SERVICE)
            }}
          >
            {t('compliancePresetService')}
          </button>
          <button
            type="button"
            className="dshCompliancePresetBtn"
            style={{ color: '#ef4444' }}
            onClick={() => {
              setSourceCode(PRESET_INVALID)
            }}
          >
            {t('compliancePresetInvalid')}
          </button>
        </div>

        <textarea
          className="dshComplianceTextarea"
          value={sourceCode}
          onChange={e => setSourceCode(e.target.value)}
          placeholder="Paste or edit plugin manifest and source code here..."
        />

        <div className="dshComplianceActionRow">
          <button
            type="button"
            className="dshDesktopSettingsBtn dshDesktopSettingsBtnPrimary"
            onClick={handleRunAudit}
            disabled={isPending}
          >
            {isPending ? '...' : t('complianceRunCheck')}
          </button>
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
              <span style={{ fontWeight: 600 }}>{report.score} / 100</span>
            </div>
            {report.manifest && (
              <div className="dshComplianceStatItem">
                <span>ID:</span>
                <code style={{ fontSize: '12px' }}>
                  [{report.manifest.kind}] {report.manifest.name}@{report.manifest.version}
                </code>
              </div>
            )}
          </div>

          {report.violations.length > 0 ? (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444', marginBottom: '4px' }}>
                {t('complianceViolationsLabel')} ({report.violations.length}):
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#ef4444' }}>
                {report.violations.map((v, i) => (
                  <li key={i}>
                    <strong>[{v.code}]</strong> {v.message}
                    {v.detail && <div style={{ color: 'var(--dsw-alias-label-secondary)' }}>{v.detail}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
              {t('complianceNoViolations')}
            </div>
          )}

          {report.warnings.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>
                {t('complianceWarningsLabel')} ({report.warnings.length}):
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#f59e0b' }}>
                {report.warnings.map((w, i) => (
                  <li key={i}>
                    <strong>[{w.code}]</strong> {w.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
