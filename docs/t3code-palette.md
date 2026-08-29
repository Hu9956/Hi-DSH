# T3 Code 默认配色权威提取

> **来源**：`https://github.com/pingdotgg/t3code`（MIT）  
> **权威文件**：`apps/web/src/index.css`（2523 行，`@import "tailwindcss"`）  
> **提取方式**：`raw.githubusercontent.com` 原文 + `api.github.com/contents` 目录遍历，非记忆填充  
> **提取时间**：2026-08-30  
> **对应版本**：`main` 分支最新（2,882 commits 时点）  
> **适用范围**：桌面端 `apps/desktop` 与 Web 端 `apps/web` 共享同一套 Token，无差异；`[data-app-sidebar]` 兼容层与 `html[data-theme-id]` 主题覆盖层另述

---

## 1. 快速复用（copy-paste）

### CSS Variables（与源码一致，未换算）

```css
/* 浅色：:root  Light — apps/web/src/index.css:1388 */
:root {
  color-scheme: light;
  --radius: 0.625rem;
  --background: var(--color-zinc-25); /* oklch(99.2% 0 0) @theme inline */
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

/* 深色：@variant dark — apps/web/src/index.css:1457 */
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
```

### Tailwind 配置提示

```json
// apps/web/components.json 原文
{
  "style": "base-mira",
  "tailwind": { "css": "src/index.css", "baseColor": "zinc", "cssVariables": true }
}
```

`var(--color-zinc-*)` / `var(--color-neutral-*)` / `var(--color-red-*)` 为 **Tailwind v4 内置调色板**，非项目自定义，需随 `tailwindcss` 引入；唯一自定义为 `@theme inline --color-zinc-25: oklch(99.2% 0 0)`。

---

## 2. 完整 Token 表（源码原文）

### 2.1 语义色

| token | 浅色 `:root` | 深色 `@variant dark` | 说明 |
|---|---|---|---|
| `background` | `var(--color-zinc-25)` | `var(--color-neutral-950)` | 主画布 |
| `foreground` | `var(--color-zinc-800)` | `var(--color-neutral-100)` | 主文本 |
| `card` | `var(--color-white)` | `color-mix(in srgb, var(--background) 97%, white)` | 卡片 |
| `card-foreground` | `var(--color-zinc-800)` | `var(--color-neutral-100)` | |
| `popover` | `var(--color-white)` | `color-mix(in srgb, var(--background) 94%, white)` | 浮层 |
| `popover-foreground` | `var(--color-zinc-800)` | `var(--color-neutral-100)` | |
| `primary` | `oklch(0.488 0.217 264)` | `oklch(0.571 0.21 264)` | 品牌蓝 |
| `primary-foreground` | `var(--color-white)` | `var(--color-white)` | |
| `secondary` | `var(--color-zinc-50)` | `--alpha(white / 4%)` | |
| `secondary-foreground` | `var(--color-zinc-800)` | `var(--color-neutral-100)` | |
| `muted` | `var(--color-zinc-50)` | `--alpha(white / 4%)` | |
| `muted-foreground` | `var(--color-zinc-500)` | `color-mix(neutral-500 90%, white)` | |
| `accent` | `var(--color-zinc-100)` | `--alpha(white / 4%)` | 选中/悬停 |
| `accent-foreground` | `var(--color-zinc-900)` | `var(--color-neutral-100)` | |
| `destructive` | `var(--color-red-500)` | `color-mix(red-500 90%, white)` | = `error` |
| `destructive-foreground` | `var(--color-red-700)` | `var(--color-red-400)` | |
| `border` | `var(--color-zinc-200)` | `--alpha(white / 6%)` | |
| `input` | `var(--color-zinc-300)` | `--alpha(white / 8%)` | |
| `ring` | `var(--primary)` | `var(--primary)` | 聚焦环 |

### 2.2 扩展色

| token | 浅色 | 深色 |
|---|---|---|
| `error` / `error-surface` | `red-500` / `color-mix(red 8%, transparent)` | `color-mix(red-500 90%, white)` / `color-mix(red 16%, transparent)` |
| `warning` / `warning-surface` | `amber-500` / `color-mix(amber 8%, transparent)` | `amber-500` / `color-mix(amber 16%, transparent)` |
| `success` / `success-foreground` | `emerald-500` / `emerald-700` | `emerald-500` / `emerald-400` |
| `info` / `info-foreground` | `blue-500` / `blue-700` | `blue-500` / `blue-400` |
| `update` / `update-surface` | `primary` / `color-mix(primary 12%, transparent)` | `primary` / `color-mix(primary 18%, transparent)` |
| `surface-raised` | `color-mix(card 20%, transparent)` | `var(--secondary)` |
| `placeholder` / `secondary-label` / `icon-muted` | `muted-foreground` | 未重定义 |
| `message-surface` | `var(--accent)` | 未重定义 |
| `code-background` | `color-mix(card 90%, background)` | 未重定义 |

### 2.3 Sidebar 体系

| token | 浅色 | 深色 | 深色兼容层 `[data-app-sidebar].dark` |
|---|---|---|---|
| `sidebar` | `zinc-50` | `var(--card)` | `#000` |
| `sidebar-foreground` | `zinc-800` | `neutral-100` | `#f1f3f7` |
| `sidebar-muted-foreground` | `zinc-500` | `neutral-500→white 90%` | `#a3a3a3` |
| `sidebar-control-surface` | `zinc-100` | `muted` | `muted (#0a0a0a)` |
| `sidebar-row-hover` | `zinc-25` | `accent` | `color-mix(fg 8%, transparent)` |
| `sidebar-row-active` | `white` | `accent` | `color-mix(fg 11%, transparent)` |
| `sidebar-row-selected` | `white` | `muted` | `color-mix(fg 7%, transparent)` |
| `sidebar-border` | `zinc-200` | `white 6%` | `white 8%` |

> `chart-*` **未找到** — 仓库未定义，禁止用默认值填充。

---

## 3. 字体 / 圆角 / 阴影 / 玻璃

| 类别 | Token | 值 | 位置 |
|---|---|---|---|
| **字体** | `--font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif` | `@theme` L139 |
| | `--font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace` | 同上，镜像于 `appearanceFonts.ts` |
| **圆角** | `--radius` | `0.625rem` (=10px) | L1390 |
| | `--radius-sm/md/lg/xl/2xl/3xl/4xl` | `calc(var(--radius) ± 2/4/8/12/16px)` | `@theme inline` L202 |
| **阴影** | 无 token，硬编码 | `dialog-glass: 0 24px 64px -24px rgb(0 0 0 /65%)` 深色附加 `inset 0 1px rgb(255 255 255 /4%)` | L317 |
| **玻璃** | `--glass-blur` | `12px` 浅 / `16px` 深 | `:root` L103 |
| | `--glass-opacity` | `80%` | |
| | `--glass-saturation` | `1.14` 浅 / `1.08` 深 | |

---

## 4. 源码字面量与 Tailwind 类名

- **Tailwind 类**：消费侧为 `bg-background` `text-foreground` `border-border` 等，未见 `bg-zinc-800` 硬编码。
- **唯一字面量**：
  - `@theme inline --color-zinc-25: oklch(99.2% 0 0)`（新造色阶）
  - 兼容层深色：`#000` `#f1f3f7` `#191a1d` `#0a0a0a` 等（`index.css:1522`）
  - 终端/滚动条：`rgb(217 217 217)` `rgb(255 255 255 /8%)` `rgb(38 56 78)` 等

---

## 5. 主题覆盖（非默认，仅备查）

`html[data-theme-id="t3-chat|grove|ocean|ember|iris"]` 会以 `--app-theme-*` 重写全部语义 Token，舞台艺术色 `stage-art-*` 另有 5 套 `oklch` 调色板。默认不选主题时即本文档表格值。

---

## 6. 在 Hi-DSH 中调用

### 路径

- **Markdown**：`docs/t3code-palette.md`（本文档）
- **TS 常量**：`dsh-ui/src/t3code.tokens.ts` — `export const t3codePalette` / `export const t3codeTokensCss`
- **JSON**：`dsh-ui/t3code-tokens.json` — 供脚本/设计工具读取

### 示例

```ts
import { t3codePalette, t3codeTokensCss } from './dsh-ui/src/t3code.tokens'
// 注入全局
document.documentElement.insertAdjacentHTML('beforeend', `<style>${t3codeTokensCss}</style>`)
// 取值
t3codePalette.light.primary // "oklch(0.488 0.217 264)"
t3codePalette.dark.border   // "--alpha(var(--color-white) / 6%)"
```

```ts
// 与现有 dsh-ui 的映射（dshT3-* → T3 Code 原名）
 // dshT3-bg           → background (zinc-25 / neutral-950)
 // dshT3-surface      → card
 // dshT3-fg           → foreground
 // dshT3-border       → border
 // dshT3-primary      → primary
```

> 如需逐值对齐另一项目，直接复制第 1 节 CSS 块；Tailwind 的 `zinc`/`neutral` 阶请随 `tailwindcss` 引入，不要自转 hex。

---

## 7. 维护

- 定期执行 `scripts/sync-t3code-tokens.mjs`（待建）对比 `raw.githubusercontent` 最新值
- 变更需同步更新 `dsh-ui/src/t3code.tokens.ts` 与本文档
- 提交时请附 `来源 commit SHA` 备查
