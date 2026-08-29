import { useSyncExternalStore } from 'react'
import { ensureUiStyles } from './install.ts'
import { ToastStore, type ToastInput, type ToastTone } from './toast-logic.ts'

export const toastStore = new ToastStore()

/** Show a toast from anywhere; rendered by the mounted `<ToastViewport/>`. */
export function toast(input: ToastInput): number {
  return toastStore.show(input)
}


const TONE_ROLE: Record<ToastTone, 'status' | 'alert'> = {
  info: 'status',
  success: 'status',
  warning: 'status',
  error: 'alert',
}

/** Mount once per surface; renders the imperative `toast()` queue. */
export function ToastViewport() {
  ensureUiStyles()
  const state = useSyncExternalStore(toastStore.subscribe, () => toastStore.getSnapshot())
  if (state.entries.length === 0) return null
  return (
    <div className="dshui-toast-viewport">
      {state.entries.map(entry => (
        <div
          key={entry.id}
          className="dshui-toast"
          data-tone={entry.tone}
          role={TONE_ROLE[entry.tone]}
          onClick={() => { toastStore.dismiss(entry.id) }}
        >
          <span className="dshui-toast-dot" aria-hidden="true" />
          {entry.message}
        </div>
      ))}
    </div>
  )
}
