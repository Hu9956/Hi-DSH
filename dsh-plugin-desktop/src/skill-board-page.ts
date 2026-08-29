import type { IncomingMessage, ServerResponse } from 'node:http'

/** Browser page served at this path; the desktop titlebar opens it in the system browser. */
export const SKILL_BOARD_PAGE_PATH = '/hi-dsh/skill-board'

const PAGE_TITLE = 'Hi-DSH 技能开关'

/** Escape untrusted skill metadata before embedding into the page. */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function finishJson(res: ServerResponse, statusCode: number, value: object): void {
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(value))
}

/**
 * Serve the standalone skill board page. It talks to the same-origin
 * `/api/hi-dsh/skill-board/*` routes and renders with the desktop T3 design
 * tokens; dark appearance follows the system browser preference.
 */
export async function handleSkillBoardPageRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'GET') return finishJson(res, 405, { error: 'method not allowed' })
  const body = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(PAGE_TITLE)}</title>
<style>
  /* T3 design tokens: neutral-black dark theme, white-alpha surfaces, blue accent. */
  :root {
    --t3-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    --t3-font-mono: ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace;
    --t3-radius-sm: 6px; --t3-radius-md: 8px; --t3-radius-lg: 10px;
    --t3-bg: #fcfcfc; --t3-surface: #ffffff; --t3-raised: #f4f4f5;
    --t3-fg: #27272a; --t3-fg-muted: #71717a; --t3-fg-subtle: #a1a1aa;
    --t3-border: #e4e4e7; --t3-border-strong: #d4d4d8;
    --t3-hover: rgba(0, 0, 0, 0.05);
    --t3-primary: oklch(48.8% 0.217 264); --t3-primary-fg: #ffffff;
    --t3-success: #059669; --t3-success-surface: rgba(16, 185, 129, 0.09);
    --t3-error: #dc2626; --t3-error-surface: rgba(239, 68, 68, 0.08);
    --t3-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --t3-bg: #0a0a0a; --t3-surface: #161616; --t3-raised: rgba(255, 255, 255, 0.04);
      --t3-fg: #f5f5f5; --t3-fg-muted: #a3a3a3; --t3-fg-subtle: #737373;
      --t3-border: rgba(255, 255, 255, 0.07); --t3-border-strong: rgba(255, 255, 255, 0.14);
      --t3-hover: rgba(255, 255, 255, 0.06);
      --t3-primary: oklch(57.1% 0.21 264);
      --t3-success: #34d399; --t3-success-surface: rgba(52, 211, 153, 0.12);
      --t3-error: #f87171; --t3-error-surface: rgba(248, 113, 113, 0.12);
      --t3-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 24px 48px; background: var(--t3-bg); color: var(--t3-fg);
    font-family: var(--t3-font-sans); font-size: 13px; line-height: 1.5;
    display: flex; justify-content: center;
  }
  main { width: min(100%, 720px); }
  h1 { margin: 0 0 4px; font-size: 18px; font-weight: 600; }
  h1 small { font-weight: 400; font-size: 12px; color: var(--t3-fg-muted); }
  .intro { margin: 0 0 20px; color: var(--t3-fg-muted); font-size: 12px; }
  .intro code { font-family: var(--t3-font-mono); font-size: 11px; }
  .banner { margin: 0 0 12px; padding: 8px 12px; border-radius: var(--t3-radius-md); font-size: 12px; display: none; }
  .banner.error { display: block; color: var(--t3-error); background: var(--t3-error-surface); }
  .banner.toast { display: block; color: var(--t3-fg); background: var(--t3-raised); border: 1px solid var(--t3-border); }
  .toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .toolbar .count { color: var(--t3-fg-muted); font-size: 12px; flex: 1; }
  button.refresh {
    min-height: 28px; padding: 4px 12px; border: 1px solid var(--t3-border-strong); border-radius: var(--t3-radius-sm);
    background: transparent; color: var(--t3-fg); font: inherit; font-size: 12px; cursor: pointer;
    transition: background-color .15s ease, border-color .15s ease;
  }
  button.refresh:hover { background: var(--t3-hover); border-color: var(--t3-fg-subtle); }
  button.refresh:focus-visible { outline: 2px solid var(--t3-primary); outline-offset: 2px; }
  .list { display: flex; flex-direction: column; gap: 8px; }
  .card {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 12px 14px; border: 1px solid var(--t3-border); border-radius: var(--t3-radius-lg);
    background: var(--t3-surface); transition: border-color .15s ease;
  }
  .card.on { border-color: color-mix(in srgb, var(--t3-primary) 45%, var(--t3-border)); }
  .card .info { min-width: 0; }
  .card .name { font-size: 13px; font-weight: 600; }
  .card .meta { font-size: 11px; font-weight: 400; color: var(--t3-fg-muted); }
  .card .desc { margin-top: 2px; font-size: 12px; color: var(--t3-fg-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .card .path { margin-top: 2px; font-size: 11px; color: var(--t3-fg-subtle); font-family: var(--t3-font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .card .state { margin-top: 2px; font-size: 11px; color: var(--t3-fg-subtle); }
  .card .state.on { color: var(--t3-success); }
  .switch { display: inline-flex; align-items: center; gap: 8px; flex: 0 0 auto; cursor: pointer; }
  .switch input { position: absolute; opacity: 0; }
  .switch .track {
    position: relative; width: 36px; height: 20px; border-radius: 999px;
    background: var(--t3-border-strong); transition: background-color .15s ease;
  }
  .switch .track::after {
    content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
    border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); transition: transform .15s ease;
  }
  .switch input:checked + .track { background: var(--t3-primary); }
  .switch input:checked + .track::after { transform: translateX(16px); }
  .switch input:focus-visible + .track { outline: 2px solid var(--t3-primary); outline-offset: 2px; }
  .switch .label { font-size: 12px; color: var(--t3-fg-muted); }
  .switch.disabled { cursor: default; opacity: .5; }
  .empty { color: var(--t3-fg-muted); font-size: 13px; }
  footer { margin-top: 20px; font-size: 11px; color: var(--t3-fg-subtle); }
  footer code { font-family: var(--t3-font-mono); }
</style>
</head>
<body>
<main>
  <h1>${escapeHtml(PAGE_TITLE)} <small>· 热生效 · 关掉即省 Token</small></h1>
  <p class="intro">这里列出当前 Profile 已安装的所有技能。关闭后该技能不会进入模型的 <code>&lt;available_skills&gt;</code> 目录，下一轮对话即生效，无需重启。</p>
  <div id="banner" class="banner"></div>
  <div class="toolbar"><span class="count" id="count"></span><button class="refresh" id="refresh" type="button">刷新</button></div>
  <div class="list" id="list"></div>
  <footer>开关改的是 <code>SKILL.md</code> 的 <code>disable-model-invocation</code>，由 <code>skill-filesystem</code> 热更新监听，无需重启。运行时技能（无 path）暂不可切换。</footer>
</main>
<script>
  const list = document.getElementById('list')
  const banner = document.getElementById('banner')
  const count = document.getElementById('count')
  const refreshBtn = document.getElementById('refresh')
  let toastTimer

  const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')

  function showBanner(text, kind) {
    banner.className = 'banner ' + kind
    banner.textContent = text
    clearTimeout(toastTimer)
    if (kind === 'toast') toastTimer = setTimeout(() => { banner.className = 'banner' }, 2500)
  }

  async function load() {
    banner.className = 'banner'
    list.innerHTML = '<div class="empty">加载中…</div>'
    try {
      const res = await fetch('/api/hi-dsh/skill-board/list', { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error('list failed ' + res.status)
      const data = await res.json()
      render(data.skills ?? [])
    } catch (err) {
      list.innerHTML = ''
      showBanner('错误：' + (err instanceof Error ? err.message : String(err)), 'error')
    }
  }

  function render(skills) {
    count.textContent = skills.length + ' 个技能'
    if (skills.length === 0) { list.innerHTML = '<div class="empty">暂无已安装技能。</div>'; return }
    list.innerHTML = ''
    for (const s of skills) {
      const card = document.createElement('div')
      card.className = 'card' + (s.modelInvocable ? ' on' : '')
      const info = document.createElement('div'); info.className = 'info'
      info.innerHTML =
        '<div class="name">' + esc(s.name) + ' <span class="meta">· ' + esc(s.source) + ' · ' + esc(s.provider) + '</span></div>' +
        '<div class="desc">' + esc(s.description) + '</div>' +
        (s.path ? '<div class="path">' + esc(s.path) + '</div>' : '') +
        '<div class="state' + (s.modelInvocable ? ' on' : '') + '">' + (s.modelInvocable ? '● 模型可见（会进上下文）' : '○ 已隐藏（省 Token，热）') + '</div>'
      const toggleable = Boolean(s.path)
      const label = document.createElement('label')
      label.className = 'switch' + (toggleable ? '' : ' disabled')
      label.title = s.path ? ('文件: ' + s.path) : '运行时技能不可切换'
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.checked = Boolean(s.modelInvocable)
      input.disabled = !toggleable
      input.addEventListener('change', () => { void toggle(s, input) })
      const track = document.createElement('span'); track.className = 'track'
      const text = document.createElement('span'); text.className = 'label'
      text.textContent = toggleable ? (s.modelInvocable ? '已启用' : '已禁用') : '不可切换'
      label.append(input, track, text)
      card.append(info, label)
      list.append(card)
    }
  }

  async function toggle(skill, input) {
    input.disabled = true
    try {
      const res = await fetch('/api/hi-dsh/skill-board/toggle', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: skill.name, enabled: input.checked }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'toggle failed ' + res.status)
      showBanner(data.message ?? (input.checked ? '已启用（热）' : '已禁用（热，省 Token）'), 'toast')
      await load()
    } catch (err) {
      showBanner('错误：' + (err instanceof Error ? err.message : String(err)), 'error')
      input.checked = !input.checked
      input.disabled = false
    }
  }

  refreshBtn.addEventListener('click', () => { void load() })
  void load()
</script>
</body>
</html>`
  res.statusCode = 200
  res.setHeader('content-type', 'text/html; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(body)
}
