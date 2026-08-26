/**
 * Hi-DSH Skill Board — Loopback HTTP handlers
 * GET  /api/hi-dsh/skill-board/list   -> list skills
 * POST /api/hi-dsh/skill-board/toggle -> {name, enabled}
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { SkillBoardService } from './index.ts'

const MAX_BODY = 16 * 1024
const SKILL_BOARD_LIST_PATH = '/api/hi-dsh/skill-board/list'
const SKILL_BOARD_TOGGLE_PATH = '/api/hi-dsh/skill-board/toggle'

function finishJson(res: ServerResponse, status: number, value: object): void {
  res.statusCode = status
  res.setHeader('cache-control', 'no-store')
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(value))
}

function isLoopbackAddress(addr: string | undefined): boolean {
  if (!addr) return false
  if (addr === '::1' || addr === '127.0.0.1') return true
  if (addr.startsWith('::ffff:')) return addr.slice(7).startsWith('127.')
  return addr.startsWith('127.')
}

function isAllowed(req: IncomingMessage, expectedOrigin: string): boolean {
  try {
    const expected = new URL(expectedOrigin)
    if (expected.hostname !== '127.0.0.1' && expected.hostname !== '[::1]') return false
    if (!isLoopbackAddress(req.socket.remoteAddress)) return false
    if (req.headers.host?.toLowerCase() !== expected.host.toLowerCase()) return false
    const origin = req.headers.origin
    if (origin !== undefined) return origin === expectedOrigin
    // GET may omit Origin: allow same-origin fetches and top-level address-bar
    // navigations (sec-fetch-site: none). Cross-site GETs are still rejected.
    if (req.method === 'GET') {
      const site = req.headers['sec-fetch-site']
      return site === 'same-origin' || site === 'none' || site === undefined
    }
    return false
  } catch {
    return false
  }
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array)
    size += buf.byteLength
    if (size > MAX_BODY) throw new Error('body too large')
    chunks.push(buf)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

export async function handleSkillBoardList(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  service: SkillBoardService,
): Promise<void> {
  if (req.method !== 'GET') { finishJson(res, 405, { error: 'method not allowed' }); return }
  if (!isAllowed(req, expectedOrigin)) { finishJson(res, 403, { error: 'forbidden' }); return }
  try {
    const list = await service.list()
    finishJson(res, 200, { skills: list })
  } catch (e) {
    finishJson(res, 500, { error: String(e) })
  }
}

export async function handleSkillBoardToggle(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
  service: SkillBoardService,
): Promise<void> {
  if (req.method !== 'POST') { finishJson(res, 405, { error: 'method not allowed' }); return }
  if (!isAllowed(req, expectedOrigin)) { finishJson(res, 403, { error: 'forbidden' }); return }
  if (req.headers['content-type']?.split(';')[0]?.trim() !== 'application/json') {
    finishJson(res, 415, { error: 'content-type must be application/json' }); return
  }
  let body: unknown
  try { body = await readJson(req) } catch { finishJson(res, 400, { error: 'invalid JSON' }); return }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) { finishJson(res, 400, { error: 'invalid request' }); return }
  const { name, enabled } = body as Record<string, unknown>
  if (typeof name !== 'string' || typeof enabled !== 'boolean') { finishJson(res, 400, { error: 'name and enabled required' }); return }
  try {
    const result = await service.toggle(name, enabled)
    finishJson(res, 200, { ok: true, ...result, hot: true, message: enabled ? '已启用，下一轮对话生效（热）' : '已禁用，下一轮对话生效（热，省 Token）' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    finishJson(res, 400, { error: msg })
  }
}

const SKILL_BOARD_PAGE_PATH = '/hi-dsh/skill-board'

function finishHtml(res: ServerResponse, html: string): void {
  res.statusCode = 200
  res.setHeader('content-type', 'text/html; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(html)
}

export async function handleSkillBoardPage(
  req: IncomingMessage,
  res: ServerResponse,
  expectedOrigin: string,
): Promise<void> {
  if (req.method !== 'GET') { finishJson(res, 405, { error: 'method not allowed' }); return }
  if (!isAllowed(req, expectedOrigin)) { finishJson(res, 403, { error: 'forbidden' }); return }
  finishHtml(res, `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hi-DSH 技能开关</title><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;padding:16px;background:#f8fafc;color:#111}h1{font-size:18px;margin:0 0 8px} .sub{font-size:12px;color:#666;margin-bottom:12px} .card{border:1px solid #e5e7eb;border-radius:10px;padding:12px;background:#fff;display:flex;justify-content:space-between;gap:12px;margin-bottom:8px} .card.off{background:#f9fafb} .name{font-weight:600;font-size:13px} .desc{font-size:12px;color:#555;max-width:520px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .meta{font-size:11px} .on{color:#16a34a} .offc{color:#9ca3af} .toast{position:fixed;top:12px;right:12px;background:#111;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px} .err{color:#b91c1c;font-size:12px;margin-bottom:8px}</style></head><body><h1>Hi-DSH 技能开关 <span style="font-weight:400;font-size:12px;color:#888">· 热生效 · 关掉即省 Token</span></h1><div class="sub">所有能力都是“选项”，互斥与否看插件实际声明。关闭后不会进入 <code>&lt;available_skills&gt;</code>，下一轮对话生效，无需重启。</div><div id="err" class="err" style="display:none"></div><div id="toast" class="toast" style="display:none"></div><div id="list" style="display:grid;gap:8px"><div style="font-size:12px;color:#888">加载中…</div></div><script>
async function load(){
  const e=document.getElementById('err'); e.style.display='none';
  try{
    const r=await fetch('/api/hi-dsh/skill-board/list',{headers:{accept:'application/json'}});
    const j=await r.json();
    if(!r.ok) throw new Error(j.error||'list failed');
    const c=document.getElementById('list'); c.innerHTML='';
    if(j.skills.length===0){c.innerHTML='<div style="font-size:12px;color:#888">暂无已安装技能，去插件市场装几个后刷新。</div>';return}
    for(const s of j.skills){
      const d=document.createElement('div'); d.className='card'+(s.modelInvocable?'':' off');
      d.innerHTML='<div style="min-width:0"><div class="name">'+s.name+' <span style="font-weight:400;color:#888;font-size:11px">· '+s.source+' · '+s.provider+'</span></div><div class="desc">'+(s.description||'')+'</div><div class="meta '+(s.modelInvocable?'on':'offc')+'">'+(s.modelInvocable?'● 模型可见（会进上下文）':'○ 已隐藏（省 Token，热）')+'</div><div style="font-size:10px;color:#999">'+(s.path||'运行时技能')+'</div></div><label style="display:flex;align-items:center;gap:8px;margin-left:12px"><input type="checkbox" '+(s.modelInvocable?'checked':'')+' '+(s.path?'':'disabled')+' data-name="'+s.name+'"><span style="font-size:12px">'+(s.path?(s.modelInvocable?'已启用':'已禁用'):'不可切换')+'</span></label>';
      c.appendChild(d);
    }
    c.querySelectorAll('input[type=checkbox]').forEach(el=>{
      el.addEventListener('change', async (ev)=>{
        const t=ev.target; const name=t.getAttribute('data-name'); const enabled=t.checked;
        t.disabled=true;
        try{
          const r=await fetch('/api/hi-dsh/skill-board/toggle',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,enabled})});
          const j=await r.json(); if(!r.ok) throw new Error(j.error||'toggle failed');
          showToast(j.message|| (enabled?'已启用（热）':'已禁用（热，省 Token）'));
          await load();
        }catch(e){ showErr(e.message||String(e)); t.checked=!enabled; } finally{ t.disabled=false; }
      });
    });
  }catch(e){ showErr(e.message||String(e)); }
}
function showErr(m){ const e=document.getElementById('err'); e.textContent='错误：'+m; e.style.display='block'; }
function showToast(m){ const t=document.getElementById('toast'); t.textContent=m; t.style.display='block'; setTimeout(()=>t.style.display='none',2200); }
load();
</script></body></html>`)
}

export const skillBoardRouteConstants = {
  listPath: SKILL_BOARD_LIST_PATH,
  togglePath: SKILL_BOARD_TOGGLE_PATH,
  pagePath: SKILL_BOARD_PAGE_PATH,
} as const
