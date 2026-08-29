/**
 * Toast state machine, split from rendering so the queue logic is unit-testable
 * without a DOM (mirrors T3 Code's toast.logic/toast split).
 */

export type ToastTone = 'info' | 'success' | 'error' | 'warning'

export interface ToastEntry {
  readonly id: number
  readonly message: string
  readonly tone: ToastTone
}

export interface ToastInput {
  readonly message: string
  readonly tone?: ToastTone
  /** Auto-dismiss delay in ms; defaults to 3200. */
  readonly duration?: number
}

const DEFAULT_DURATION = 3200
const MAX_VISIBLE = 4

export interface ToastState {
  readonly entries: readonly ToastEntry[]
}

export class ToastStore {
  private state: ToastState = { entries: [] }
  private timers = new Map<number, ReturnType<typeof setTimeout>>()
  private nextId = 1
  private readonly listeners = new Set<() => void>()

  getSnapshot(): ToastState {
    return this.state
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  show(input: ToastInput): number {
    const id = this.nextId++
    const entry: ToastEntry = { id, message: input.message, tone: input.tone ?? 'info' }
    const entries = [...this.state.entries, entry].slice(-MAX_VISIBLE)
    this.publish({ entries })
    const duration = input.duration ?? DEFAULT_DURATION
    this.timers.set(id, setTimeout(() => { this.dismiss(id) }, duration))
    return id
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id)
    if (timer !== undefined) {
      clearTimeout(timer)
      this.timers.delete(id)
    }
    const entries = this.state.entries.filter(entry => entry.id !== id)
    if (entries.length !== this.state.entries.length) this.publish({ entries })
  }

  /** Test seam: flush every pending dismissal immediately. */
  clear(): void {
    for (const timer of this.timers.values()) clearTimeout(timer)
    this.timers.clear()
    this.publish({ entries: [] })
  }

  private publish(state: ToastState): void {
    this.state = state
    for (const listener of [...this.listeners]) listener()
  }
}
