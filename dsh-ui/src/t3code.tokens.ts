/**
 * T3 Code authoritative design tokens — default palette only.
 *
 * Source: https://github.com/pingdotgg/t3code
 * File:   apps/web/src/index.css (2523 lines, @import "tailwindcss")
 * Extracted: 2026-08-30 via raw.githubusercontent + api.github.com/contents traversal
 * Method: verbatim copy, no hex/rgb conversion, no invented defaults
 *
 * Notes:
 *  - :root = light, @variant dark = dark (Tailwind v4). Equivalent to classic .dark.
 *  - var(--color-zinc-*) / neutral-* / red-* are Tailwind v4 built-ins; only
 *    --color-zinc-25 is custom (@theme inline oklch(99.2% 0 0)).
 *  - apps/desktop has NO css (verified); desktop & web share this file.
 *  - Themed palettes (html[data-theme-id="t3-chat|grove|ocean|ember|iris"]) override
 *    these defaults at runtime — not included here except as reference.
 */

export const t3codeSource = {
  repo: 'https://github.com/pingdotgg/t3code',
  file: 'apps/web/src/index.css',
  commit: 'main@2026-08-30 (2882 commits)',
  componentsJson: 'apps/web/components.json',
} as const

/** Light theme — :root { … } at index.css:1388 */
export const t3codeLight = {
  radius: '0.625rem',
  // core surfaces
  background: 'var(--color-zinc-25)', // -> oklch(99.2% 0 0) @theme inline
  foreground: 'var(--color-zinc-800)',
  card: 'var(--color-white)',
  cardForeground: 'var(--color-zinc-800)',
  popover: 'var(--color-white)',
  popoverForeground: 'var(--color-zinc-800)',
  // brand / actions
  primary: 'oklch(0.488 0.217 264)',
  primaryForeground: 'var(--color-white)',
  secondary: 'var(--color-zinc-50)',
  secondaryForeground: 'var(--color-zinc-800)',
  muted: 'var(--color-zinc-50)',
  mutedForeground: 'var(--color-zinc-500)',
  accent: 'var(--color-zinc-100)',
  accentForeground: 'var(--color-zinc-900)',
  // states
  destructive: 'var(--color-red-500)', // alias error
  destructiveForeground: 'var(--color-red-700)',
  border: 'var(--color-zinc-200)',
  input: 'var(--color-zinc-300)',
  ring: 'var(--primary)',
  // extended
  error: 'var(--color-red-500)',
  errorForeground: 'var(--color-red-700)',
  errorSurface: 'color-mix(in srgb, var(--error) 8%, transparent)',
  warning: 'var(--color-amber-500)',
  warningForeground: 'var(--color-amber-700)',
  warningSurface: 'color-mix(in srgb, var(--warning) 8%, transparent)',
  success: 'var(--color-emerald-500)',
  successForeground: 'var(--color-emerald-700)',
  info: 'var(--color-blue-500)',
  infoForeground: 'var(--color-blue-700)',
  update: 'var(--primary)',
  updateSurface: 'color-mix(in srgb, var(--update) 12%, transparent)',
  surfaceRaised: 'color-mix(in srgb, var(--card) 20%, transparent)',
  // sidebar
  sidebar: 'var(--color-zinc-50)',
  sidebarForeground: 'var(--foreground)',
  sidebarMutedForeground: 'var(--muted-foreground)',
  sidebarControlSurface: 'var(--color-zinc-100)',
  sidebarRowHover: 'var(--color-zinc-25)',
  sidebarRowActive: 'var(--color-white)',
  sidebarRowSelected: 'var(--color-white)',
  sidebarBorder: 'var(--border)',
  sidebarStageFade: 'var(--sidebar)',
  // code / terminal
  codeBackground: 'color-mix(in srgb, var(--card) 90%, var(--background))',
  codeForeground: 'var(--foreground)',
  terminalBackground: 'var(--background)',
  terminalForeground: 'var(--foreground)',
  terminalCursor: 'rgb(38 56 78)',
  terminalSelectionBackground: 'rgb(37 63 99 / 20%)',
} as const

/** Dark theme — @variant dark inside :root at index.css:1457 */
export const t3codeDark = {
  background: 'var(--color-neutral-950)',
  foreground: 'var(--color-neutral-100)',
  card: 'color-mix(in srgb, var(--background) 97%, var(--color-white))',
  cardForeground: 'var(--color-neutral-100)',
  popover: 'color-mix(in srgb, var(--background) 94%, var(--color-white))',
  popoverForeground: 'var(--color-neutral-100)',
  primary: 'oklch(0.571 0.21 264)',
  primaryForeground: 'var(--color-white)', // inherits
  secondary: '--alpha(var(--color-white) / 4%)',
  secondaryForeground: 'var(--color-neutral-100)',
  muted: '--alpha(var(--color-white) / 4%)',
  mutedForeground: 'color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-white))',
  accent: '--alpha(var(--color-white) / 4%)',
  accentForeground: 'var(--color-neutral-100)',
  destructive: 'color-mix(in srgb, var(--color-red-500) 90%, var(--color-white))',
  destructiveForeground: 'var(--color-red-400)',
  border: '--alpha(var(--color-white) / 6%)',
  input: '--alpha(var(--color-white) / 8%)',
  ring: 'var(--primary)',
  error: 'color-mix(in srgb, var(--color-red-500) 90%, var(--color-white))',
  errorForeground: 'var(--color-red-400)',
  errorSurface: 'color-mix(in srgb, var(--error) 16%, transparent)',
  warning: 'var(--color-amber-500)', // inherits
  warningForeground: 'var(--color-amber-400)',
  warningSurface: 'color-mix(in srgb, var(--warning) 16%, transparent)',
  success: 'var(--color-emerald-500)',
  successForeground: 'var(--color-emerald-400)',
  info: 'var(--color-blue-500)',
  infoForeground: 'var(--color-blue-400)',
  update: 'var(--primary)',
  updateSurface: 'color-mix(in srgb, var(--update) 18%, transparent)',
  surfaceRaised: 'var(--secondary)',
  sidebar: 'var(--card)',
  sidebarForeground: 'var(--foreground)',
  sidebarMutedForeground: 'var(--muted-foreground)',
  sidebarControlSurface: 'var(--muted)',
  sidebarRowHover: 'var(--accent)',
  sidebarRowActive: 'var(--accent)',
  sidebarRowSelected: 'var(--muted)',
  sidebarBorder: 'var(--border)',
  sidebarStageFade: 'var(--card)',
  terminalCursor: 'rgb(180 203 255)',
  terminalSelectionBackground: 'rgb(180 203 255 / 25%)',
} as const

/** Sidebar compat layer — [data-app-sidebar] at index.css:1500 */
export const t3codeSidebarCompat = {
  light: {
    background: 'var(--color-zinc-25)',
    foreground: 'var(--color-zinc-800)',
    card: 'var(--color-white)',
    accent: 'var(--color-zinc-100)',
    muted: 'var(--color-zinc-50)',
    mutedForeground: 'var(--color-zinc-500)',
    border: 'var(--color-zinc-200)',
    input: 'var(--color-zinc-300)',
    sidebar: 'var(--color-zinc-50)',
    sidebarStageFade: 'var(--sidebar)',
  },
  dark: {
    background: '#000',
    foreground: '#f1f3f7',
    card: '#000',
    cardForeground: '#f1f3f7',
    accent: '#191a1d',
    accentForeground: '#f7f9ff',
    muted: '#0a0a0a',
    mutedForeground: '#a3a3a3',
    border: 'rgb(255 255 255 / 8%)',
    input: 'rgb(255 255 255 / 18%)',
    sidebar: '#000',
    sidebarBorder: 'rgb(255 255 255 / 8%)',
  },
} as const

export const t3codeFonts = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace',
} as const

export const t3codeRadius = {
  base: '0.625rem',
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
  '2xl': 'calc(var(--radius) + 8px)',
  '3xl': 'calc(var(--radius) + 12px)',
  '4xl': 'calc(var(--radius) + 16px)',
} as const

export const t3codeShadow = {
  // no token — hardcoded in index.css
  dialogLight: '0 24px 64px -24px rgb(0 0 0 / 65%)',
  dialogDark: 'inset 0 1px rgb(255 255 255 / 4%), 0 24px 72px -20px rgb(0 0 0 / 90%)',
} as const

export const t3codeGlass = {
  blurLight: '12px',
  blurDark: '16px',
  opacity: '80%',
  saturationLight: '1.14',
  saturationDark: '1.08',
} as const

/** Full palette object for programmatic use */
export const t3codePalette = {
  light: t3codeLight,
  dark: t3codeDark,
  sidebarCompat: t3codeSidebarCompat,
  fonts: t3codeFonts,
  radius: t3codeRadius,
  shadow: t3codeShadow,
  glass: t3codeGlass,
  source: t3codeSource,
} as const

/**
 * Ready-to-inject CSS — verbatim from index.css, with @variant dark expanded
 * to :root.dark for environments without Tailwind's @variant.
 * Prefer importing `tokensCss` for dsh-ui's namespaced layer; use this when
 * you need pixel-perfect parity with T3 Code.
 */
export const t3codeTokensCss = `
@theme inline { --color-zinc-25: oklch(99.2% 0 0); }
:root {
  color-scheme: light;
  --radius: 0.625rem;
  --background: var(--color-zinc-25);
  --foreground: var(--color-zinc-800);
  --card: var(--color-white);
  --card-foreground: var(--color-zinc-800);
  --popover: var(--color-white);
  --popover-foreground: var(--color-zinc-800);
  --primary: oklch(0.488 0.217 264);
  --primary-foreground: var(--color-white);
  --secondary: var(--color-zinc-50);
  --secondary-foreground: var(--color-zinc-800);
  --muted: var(--color-zinc-50);
  --muted-foreground: var(--color-zinc-500);
  --accent: var(--color-zinc-100);
  --accent-foreground: var(--color-zinc-900);
  --destructive: var(--color-red-500);
  --destructive-foreground: var(--color-red-700);
  --border: var(--color-zinc-200);
  --input: var(--color-zinc-300);
  --ring: var(--primary);
  --sidebar: var(--color-zinc-50);
  --sidebar-foreground: var(--foreground);
  --sidebar-muted-foreground: var(--muted-foreground);
  --sidebar-control-surface: var(--color-zinc-100);
  --sidebar-row-hover: var(--color-zinc-25);
  --sidebar-row-active: var(--color-white);
  --sidebar-row-selected: var(--color-white);
  --sidebar-border: var(--border);
}
:root.dark, .dark {
  color-scheme: dark;
  --background: var(--color-neutral-950);
  --foreground: var(--color-neutral-100);
  --card: color-mix(in srgb, var(--background) 97%, var(--color-white));
  --card-foreground: var(--color-neutral-100);
  --popover: color-mix(in srgb, var(--background) 94%, var(--color-white));
  --popover-foreground: var(--color-neutral-100);
  --primary: oklch(0.571 0.21 264);
  --secondary: --alpha(var(--color-white) / 4%);
  --secondary-foreground: var(--color-neutral-100);
  --muted: --alpha(var(--color-white) / 4%);
  --muted-foreground: color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-white));
  --accent: --alpha(var(--color-white) / 4%);
  --accent-foreground: var(--color-neutral-100);
  --destructive: color-mix(in srgb, var(--color-red-500) 90%, var(--color-white));
  --destructive-foreground: var(--color-red-400);
  --border: --alpha(var(--color-white) / 6%);
  --input: --alpha(var(--color-white) / 8%);
  --sidebar: var(--card);
  --sidebar-control-surface: var(--muted);
  --sidebar-row-hover: var(--accent);
  --sidebar-row-active: var(--accent);
  --sidebar-row-selected: var(--muted);
}
`.trim()

/** Mapping from current dsh-ui --dshT3-* to T3 Code canonical names */
export const dshT3ToT3CodeMap = {
  '--dshT3-bg': 'background',
  '--dshT3-rail': 'sidebar',
  '--dshT3-surface': 'card',
  '--dshT3-surface-raised': 'surfaceRaised',
  '--dshT3-fg': 'foreground',
  '--dshT3-fg-muted': 'mutedForeground',
  '--dshT3-fg-subtle': 'mutedForeground (subtle)',
  '--dshT3-border': 'border',
  '--dshT3-border-strong': 'input',
  '--dshT3-primary': 'primary',
  '--dshT3-primary-fg': 'primaryForeground',
} as const
