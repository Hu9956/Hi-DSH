/**
 * dsh-std UI 插槽组件插件模板 (Presentation / Slot Component Template)
 * apiVersion: dsh-std/v1
 * kind: Presentation
 */

import { useState, type ReactNode } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

export const manifest = {
  apiVersion: 'dsh-std/v1',
  kind: 'Presentation',
  name: 'my-slot-extension',
  version: '1.0.0',
  description: 'A sample slot UI component following dsh-std conventions',
  requires: ['ui-slot'],
} as const

export interface SampleComponentProps {
  title: string
  actionLabel: string
}

export function SampleSlotComponent({ title, actionLabel }: SampleComponentProps) {
  const [clicked, setClicked] = useState(false)

  return (
    <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{title}</h4>
      <button
        type="button"
        onClick={() => { setClicked(true) }}
        style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
      >
        {clicked ? 'Clicked!' : actionLabel}
      </button>
    </div>
  )
}

/** Client 端 Cordis 注册入口 */
export function apply(ctx: ClientContext): void {
  // 向指定 Slot（如 settings.general.item 或 sidebar.settings）挂载
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: manifest.name,
    order: 300,
    inject: () => ({
      title: 'My Custom Extension',
      actionLabel: 'Perform Action',
    }),
  }, SampleSlotComponent))
}
