import { useEffect, useState, useCallback } from 'react'

interface SkillItem {
  name: string
  description: string
  source: string
  provider: string
  path?: string
  modelInvocable: boolean
  userInvocable: boolean
}

export function SkillBoardSection() {
  const [skills, setSkills] = useState<SkillItem[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch('/api/hi-dsh/skill-board/list', { headers: { 'accept': 'application/json' } })
      if (!res.ok) throw new Error(`list failed ${res.status}`)
      const data = (await res.json()) as { skills: SkillItem[] }
      setSkills(data.skills)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const toggle = async (name: string, enabled: boolean) => {
    setBusy(name)
    setError(null)
    try {
      const res = await fetch('/api/hi-dsh/skill-board/toggle', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, enabled }),
      })
      const data = (await res.json()) as { error?: string; message?: string }
      if (!res.ok) throw new Error(data.error ?? `toggle failed ${res.status}`)
      setToast(data.message ?? (enabled ? '已启用（热）' : '已禁用（热，省 Token）'))
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="hiDshSkillBoard" style={{ padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Hi-DSH 技能开关 <span style={{ fontWeight: 400, fontSize: 12, color: '#888' }}>· 热生效 · 关掉即省 Token</span></h2>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        这里列出当前 Profile 已安装的所有技能。关闭后该技能不会进入模型的 <code>&lt;available_skills&gt;</code> 目录，下一轮对话即生效，无需重启。规则按插件实际声明，不预设单选/多选。
      </p>
      {error && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>错误：{error}</div>}
      {toast && <div style={{ background: '#111', color: '#fff', fontSize: 12, padding: '6px 10px', borderRadius: 6, marginBottom: 8 }}>{toast}</div>}
      {skills === null ? (
        <div style={{ fontSize: 12, color: '#888' }}>加载中…</div>
      ) : skills.length === 0 ? (
        <div style={{ fontSize: 12, color: '#888' }}>暂无已安装技能。去插件市场装几个技能后刷新。</div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {skills.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', background: s.modelInvocable ? '#fff' : '#f9fafb' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name} <span style={{ fontWeight: 400, color: '#888', fontSize: 11 }}>· {s.source} · {s.provider}</span></div>
                <div style={{ fontSize: 12, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 480 }}>{s.description}</div>
                <div style={{ fontSize: 11, color: s.modelInvocable ? '#16a34a' : '#9ca3af' }}>{s.modelInvocable ? '● 模型可见（会进上下文）' : '○ 已隐藏（省 Token，热）'}</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
                <input
                  type="checkbox"
                  checked={s.modelInvocable}
                  disabled={busy === s.name || !s.path}
                  onChange={e => void toggle(s.name, e.target.checked)}
                  title={s.path ? `文件: ${s.path}` : '运行时技能不可切换'}
                />
                <span style={{ fontSize: 12 }}>{s.path ? (s.modelInvocable ? '已启用' : '已禁用') : '不可切换'}</span>
              </label>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 12, fontSize: 11, color: '#888' }}>
        提示：开关改的是 <code>SKILL.md</code> 的 <code>disable-model-invocation</code>，由 <code>skill-filesystem</code> 的 <code>chokidar</code> 监听热更新，无需重启。运行时技能（无 path）暂不可切换。
      </div>
    </div>
  )
}
