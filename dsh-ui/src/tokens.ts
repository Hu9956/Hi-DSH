/**
 * Design tokens for the T3 Code design language.
 *
 * Light theme: zinc family. Dark theme: neutral-black family keyed off the
 * host's `body[data-ds-dark-theme]` switch. Every component color in this
 * package derives from these tokens — hardcoded hex values at call sites are
 * a consistency-checker finding.
 *
 * Values are aligned against T3 Code's own token source (pingdotgg/t3code
 * `apps/web/src/index.css` — the single token file the desktop app shares):
 * semantic colors sit at the 500 step with 8%/16% soft surfaces, dark
 * hairlines cap at white 8%, dark muted text is neutral-500 mixed 10% toward
 * white. The rail intentionally stays darker than the background — T3's
 * sidebar token reads lighter, but our rail is chrome, not a sidebar card.
 *
 * Verbatim source of truth lives in {@link ./t3code.tokens.ts} + `docs/t3code-palette.md`
 * + `dsh-ui/t3code-tokens.json` (extracted 2026-08-30, no conversion). This file
 * is the adapted, namespaced `--dshT3-*` implementation; the authoritative file
 * is kept separate for diffing and sync checks.
 */
export const tokensCss = `
:root {
  --dshT3-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --dshT3-font-mono: ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace;
  --dshT3-radius-sm: 6px;
  --dshT3-radius-md: 8px;
  --dshT3-radius-lg: 10px;
  --dshT3-control-h: 28px;
  --dshT3-control-h-lg: 32px;
  --dshT3-bg: #fcfcfc;
  --dshT3-rail: #fafafa;
  --dshT3-surface: #ffffff;
  --dshT3-surface-raised: #f4f4f5;
  --dshT3-fg: #27272a;
  --dshT3-fg-muted: #71717a;
  --dshT3-fg-subtle: #a1a1aa;
  --dshT3-border: #e4e4e7;
  --dshT3-border-strong: #d4d4d8;
  --dshT3-hover: rgba(0, 0, 0, 0.04);
  --dshT3-active: rgba(0, 0, 0, 0.06);
  --dshT3-primary: oklch(48.8% 0.217 264);
  --dshT3-primary-soft: rgba(59, 130, 246, 0.1);
  --dshT3-primary-fg: #ffffff;
  --dshT3-ring: var(--dshT3-primary);
  --dshT3-success: #10b981;
  --dshT3-success-surface: rgba(16, 185, 129, 0.08);
  --dshT3-error: #ef4444;
  --dshT3-error-surface: rgba(239, 68, 68, 0.08);
  --dshT3-warning: #f59e0b;
  --dshT3-warning-surface: rgba(245, 158, 11, 0.08);
  --dshT3-shadow-pop: 0 12px 32px rgba(0, 0, 0, 0.12);
  --dshT3-shadow-knob: 0 1px 2px rgba(0, 0, 0, 0.2);
}
body[data-ds-dark-theme] {
  --dshT3-bg: #09090b;
  --dshT3-rail: #050505;
  --dshT3-surface: color-mix(in srgb, var(--dshT3-bg) 97%, #ffffff);
  --dshT3-surface-raised: rgba(255, 255, 255, 0.04);
  --dshT3-fg: #f5f5f5;
  --dshT3-fg-muted: color-mix(in srgb, #737373 90%, #ffffff);
  --dshT3-fg-subtle: #737373;
  --dshT3-border: rgba(255, 255, 255, 0.06);
  --dshT3-border-strong: rgba(255, 255, 255, 0.08);
  --dshT3-hover: rgba(255, 255, 255, 0.04);
  --dshT3-active: rgba(255, 255, 255, 0.08);
  --dshT3-primary: oklch(57.1% 0.21 264);
  --dshT3-primary-soft: rgba(59, 130, 246, 0.14);
  --dshT3-primary-fg: #ffffff;
  /* Re-declared so the var() substitutes against this scope's primary — a
     :root-level ring would pin to the light value for the whole tree. */
  --dshT3-ring: var(--dshT3-primary);
  --dshT3-success: #10b981;
  --dshT3-success-surface: rgba(16, 185, 129, 0.16);
  --dshT3-error: color-mix(in srgb, #ef4444 90%, #ffffff);
  --dshT3-error-surface: rgba(239, 68, 68, 0.16);
  --dshT3-warning: #f59e0b;
  --dshT3-warning-surface: rgba(245, 158, 11, 0.16);
  --dshT3-shadow-pop: 0 12px 32px rgba(0, 0, 0, 0.55);
  --dshT3-shadow-knob: 0 1px 2px rgba(0, 0, 0, 0.5);
}
`
