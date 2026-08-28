/**
 * dsh-std Plugin Compliance Admission Checker & Linter Engine.
 * Implements static manifest inspection, sandbox boundary verification, capability negotiation, and admission decision making.
 */

export const CURRENT_DSH_STD_API_VERSION = 'dsh-std/v1'
export const SUPPORTED_DSH_STD_KINDS = [
  'Tool',
  'Command',
  'Presentation',
  'Service',
  'Bundle',
] as const

export type DshStdKind = (typeof SUPPORTED_DSH_STD_KINDS)[number]

export const STANDARD_CAPABILITIES = [
  'network',
  'workspace-fs',
  'settings',
  'ui-slot',
  'model-invoke',
] as const

export type StandardCapability = (typeof STANDARD_CAPABILITIES)[number]

export const BLOCKED_PACKAGES = new Set([
  'dsh-plugin-desktop',
  'dsh-community-market',
  '@deepseek-ai/deepseek-harness',
  '@deepseek-ai/dsh-core',
])

export const PACKAGE_NAME_PATTERN = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/u
export const SEMVER_PATTERN = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/u

export interface DshStdManifest {
  readonly apiVersion: string
  readonly kind: DshStdKind
  readonly name: string
  readonly version: string
  readonly description?: string | undefined
  readonly requires?: readonly string[] | undefined
  readonly supports?: readonly string[] | undefined
  readonly main?: string | undefined
  readonly client?: string | undefined
}

export type ComplianceViolationCode =
  | 'ERR_PROTOCOL_MISSING_OR_INVALID'
  | 'ERR_KIND_UNSUPPORTED'
  | 'ERR_RENDERER_SANDBOX_VIOLATION'
  | 'ERR_UPSTREAM_TAMPER_DETECTED'
  | 'ERR_BLOCKED_OR_INVALID_PACKAGE'
  | 'ERR_INVALID_VERSION'
  | 'ERR_LIFECYCLE_ENTRY_MISSING'

export type ComplianceWarningCode =
  | 'WARN_UNKNOWN_CAPABILITY'
  | 'WARN_MISSING_DESCRIPTION'
  | 'WARN_EXCESSIVE_PERMISSIONS'

export interface ComplianceViolation {
  readonly code: ComplianceViolationCode
  readonly message: string
  readonly detail?: string
}

export interface ComplianceWarning {
  readonly code: ComplianceWarningCode
  readonly message: string
  readonly detail?: string
}

export type AdmissionDecision = 'admit' | 'reject' | 'warn'

export interface PluginComplianceReport {
  readonly compliant: boolean
  readonly decision: AdmissionDecision
  readonly score: number
  readonly manifest: DshStdManifest | null
  readonly violations: readonly ComplianceViolation[]
  readonly warnings: readonly ComplianceWarning[]
}

export interface PluginComplianceCheckOptions {
  readonly manifest?: unknown
  readonly hostSource?: string | undefined
  readonly clientSource?: string | undefined
  readonly allowWarnings?: boolean | undefined
}

/** Dangerous identifiers/patterns that are forbidden in sandboxed Web client code. */
const FORBIDDEN_CLIENT_PATTERNS: readonly { pattern: RegExp; reason: string }[] = [
  { pattern: /(?:import\s+.*?from\s+['"]node:fs(?:|(?:\/promises))['"])|(?:require\(['"](?:node:)?fs['"]\))/u, reason: 'Direct Node.js filesystem access in client renderer is prohibited' },
  { pattern: /(?:import\s+.*?from\s+['"]node:child_process['"])|(?:require\(['"](?:node:)?child_process['"]\))/u, reason: 'Direct child_process execution in client renderer is prohibited' },
  { pattern: /(?:import\s+.*?from\s+['"]electron['"])|(?:require\(['"]electron['"]\))/u, reason: 'Raw Electron runtime leaking into renderer is prohibited' },
  { pattern: /(?:process\.binding\()|(?:process\.dlopen\()/u, reason: 'Low-level native Node.js process bindings are prohibited in client' },
  { pattern: /deepseek-harness\//u, reason: 'Direct mutation or reference to upstream submodule deepseek-harness/ is prohibited' },
]

/** Scan client bundle source for sandbox escape and security violations. */
export function scanClientSandboxViolations(clientSource: string): ComplianceViolation[] {
  const violations: ComplianceViolation[] = []
  if (!clientSource || typeof clientSource !== 'string') return violations

  for (const { pattern, reason } of FORBIDDEN_CLIENT_PATTERNS) {
    if (pattern.test(clientSource)) {
      violations.push({
        code: 'ERR_RENDERER_SANDBOX_VIOLATION',
        message: reason,
        detail: `Matched forbidden pattern: ${pattern.toString()}`,
      })
    }
  }

  return violations
}

/** Validate manifest shape against dsh-std specification. */
export function validateDshStdManifest(raw: unknown): {
  manifest: DshStdManifest | null
  violations: ComplianceViolation[]
  warnings: ComplianceWarning[]
} {
  const violations: ComplianceViolation[] = []
  const warnings: ComplianceWarning[] = []

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    violations.push({
      code: 'ERR_PROTOCOL_MISSING_OR_INVALID',
      message: 'Manifest must be a non-null object',
    })
    return { manifest: null, violations, warnings }
  }

  const obj = raw as Record<string, unknown>

  // 1. apiVersion check
  if (typeof obj.apiVersion !== 'string' || obj.apiVersion !== CURRENT_DSH_STD_API_VERSION) {
    violations.push({
      code: 'ERR_PROTOCOL_MISSING_OR_INVALID',
      message: `Invalid or missing apiVersion. Expected "${CURRENT_DSH_STD_API_VERSION}", received "${String(obj.apiVersion)}"`,
    })
  }

  // 2. kind check
  if (typeof obj.kind !== 'string' || !SUPPORTED_DSH_STD_KINDS.includes(obj.kind as DshStdKind)) {
    violations.push({
      code: 'ERR_KIND_UNSUPPORTED',
      message: `Unsupported plugin kind. Must be one of: ${SUPPORTED_DSH_STD_KINDS.join(', ')}`,
      detail: `Received kind: "${String(obj.kind)}"`,
    })
  }

  // 3. name check
  if (typeof obj.name !== 'string' || !PACKAGE_NAME_PATTERN.test(obj.name)) {
    violations.push({
      code: 'ERR_BLOCKED_OR_INVALID_PACKAGE',
      message: 'Invalid package name format according to npm conventions',
      detail: `Received name: "${String(obj.name)}"`,
    })
  } else if (BLOCKED_PACKAGES.has(obj.name)) {
    violations.push({
      code: 'ERR_UPSTREAM_TAMPER_DETECTED',
      message: `Cannot use protected core system package name "${obj.name}"`,
    })
  }

  // 4. version check
  if (typeof obj.version !== 'string' || !SEMVER_PATTERN.test(obj.version)) {
    violations.push({
      code: 'ERR_INVALID_VERSION',
      message: `Invalid SemVer version string "${String(obj.version)}"`,
    })
  }

  // 5. description check
  if (typeof obj.description !== 'string' || obj.description.trim().length === 0) {
    warnings.push({
      code: 'WARN_MISSING_DESCRIPTION',
      message: 'Plugin manifest lacks a descriptive explanation',
    })
  }

  // 6. requires check
  if (obj.requires !== undefined) {
    if (!Array.isArray(obj.requires) || obj.requires.some(item => typeof item !== 'string')) {
      violations.push({
        code: 'ERR_PROTOCOL_MISSING_OR_INVALID',
        message: 'The "requires" field must be an array of capability strings',
      })
    } else {
      for (const req of obj.requires) {
        if (!STANDARD_CAPABILITIES.includes(req as StandardCapability)) {
          warnings.push({
            code: 'WARN_UNKNOWN_CAPABILITY',
            message: `Unknown capability requested: "${req}"`,
          })
        }
      }
    }
  }

  const manifest: DshStdManifest | null = violations.length === 0
    ? Object.freeze({
      apiVersion: String(obj.apiVersion),
      kind: obj.kind as DshStdKind,
      name: String(obj.name),
      version: String(obj.version),
      description: typeof obj.description === 'string' ? obj.description : undefined,
      requires: Array.isArray(obj.requires) ? Object.freeze(obj.requires.map(String)) : undefined,
      supports: Array.isArray(obj.supports) ? Object.freeze(obj.supports.map(String)) : undefined,
      main: typeof obj.main === 'string' ? obj.main : undefined,
      client: typeof obj.client === 'string' ? obj.client : undefined,
    })
    : null

  return { manifest, violations, warnings }
}

/**
 * Perform a comprehensive static compliance check on a candidate plugin.
 * @param options - Manifest, Host source code, and Client source code.
 * @returns An immutable compliance report with admission decision.
 */
export function verifyPluginCompliance(
  options: PluginComplianceCheckOptions,
): PluginComplianceReport {
  const { manifest, violations: manifestViolations, warnings: manifestWarnings } =
    validateDshStdManifest(options.manifest)

  const allViolations: ComplianceViolation[] = [...manifestViolations]
  const allWarnings: ComplianceWarning[] = [...manifestWarnings]

  // Scan client bundle if provided
  if (options.clientSource) {
    const sandboxViolations = scanClientSandboxViolations(options.clientSource)
    allViolations.push(...sandboxViolations)
  }

  // Check host source for submodule tampering
  if (options.hostSource && options.hostSource.includes('deepseek-harness/')) {
    allViolations.push({
      code: 'ERR_UPSTREAM_TAMPER_DETECTED',
      message: 'Plugin source contains direct path reference into deepseek-harness/ submodule',
    })
  }

  // Check lifecycle entry point
  if (options.hostSource && !options.hostSource.includes('export function apply') && !options.hostSource.includes('apply(')) {
    allWarnings.push({
      code: 'WARN_UNKNOWN_CAPABILITY',
      message: 'Host source does not declare a standard apply lifecycle function',
    })
  }

  const compliant = allViolations.length === 0
  const score = Math.max(0, 100 - allViolations.length * 40 - allWarnings.length * 10)

  let decision: AdmissionDecision = 'admit'
  if (!compliant) {
    decision = 'reject'
  } else if (allWarnings.length > 0) {
    decision = options.allowWarnings === false ? 'reject' : 'warn'
  }

  return Object.freeze({
    compliant,
    decision,
    score,
    manifest,
    violations: Object.freeze(allViolations),
    warnings: Object.freeze(allWarnings),
  })
}
