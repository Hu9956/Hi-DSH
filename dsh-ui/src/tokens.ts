/**
 * Design tokens for the T3 Code design language.
 *
 * Light theme: zinc family. Dark theme: neutral-black family keyed off the
 * host's `body[data-ds-dark-theme]` switch. Every component color in this
 * package derives from these tokens — hardcoded hex values at call sites are
 * a consistency-checker finding.
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
  --dshT3-hover: rgba(0, 0, 0, 0.05);
  --dshT3-active: rgba(0, 0, 0, 0.07);
  --dshT3-primary: oklch(48.8% 0.217 264);
  --dshT3-primary-soft: rgba(59, 130, 246, 0.1);
  --dshT3-primary-fg: #ffffff;
  --dshT3-success: #059669;
  --dshT3-success-surface: rgba(16, 185, 129, 0.09);
  --dshT3-error: #dc2626;
  --dshT3-error-surface: rgba(239, 68, 68, 0.08);
  --dshT3-warning: #b45309;
  --dshT3-warning-surface: rgba(245, 158, 11, 0.1);
  --dshT3-shadow-pop: 0 12px 32px rgba(0, 0, 0, 0.12);
  --dshT3-shadow-knob: 0 1px 2px rgba(0, 0, 0, 0.2);
}
body[data-ds-dark-theme] {
  --dshT3-bg: #0a0a0a;
  --dshT3-rail: #050505;
  --dshT3-surface: color-mix(in srgb, #0a0a0a 97%, #ffffff);
  --dshT3-surface-raised: rgba(255, 255, 255, 0.04);
  --dshT3-fg: #f5f5f5;
  --dshT3-fg-muted: #a3a3a3;
  --dshT3-fg-subtle: #737373;
  --dshT3-border: rgba(255, 255, 255, 0.07);
  --dshT3-border-strong: rgba(255, 255, 255, 0.14);
  --dshT3-hover: rgba(255, 255, 255, 0.06);
  --dshT3-active: rgba(255, 255, 255, 0.09);
  --dshT3-primary: oklch(57.1% 0.21 264);
  --dshT3-primary-soft: rgba(59, 130, 246, 0.14);
  --dshT3-primary-fg: #ffffff;
  --dshT3-success: #34d399;
  --dshT3-success-surface: rgba(52, 211, 153, 0.12);
  --dshT3-error: #f87171;
  --dshT3-error-surface: rgba(248, 113, 113, 0.12);
  --dshT3-warning: #fbbf24;
  --dshT3-warning-surface: rgba(251, 191, 36, 0.12);
  --dshT3-shadow-pop: 0 12px 32px rgba(0, 0, 0, 0.55);
  --dshT3-shadow-knob: 0 1px 2px rgba(0, 0, 0, 0.5);
}
`
