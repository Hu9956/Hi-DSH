/**
 * Hi-DSH Skill Board — Client side
 * Registers a Settings section via DSH slots.
 * In v0.1 we mount as a plain React component; host provides /api/hi-dsh/skill-board/*
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

export const name = 'dsh-plugin-skill-board/client'
export const inject = ['slots'] as const

export function apply(ctx: ClientContext): void {
  // Lazy import to avoid bundling in host build
  ctx.effect(() => {
    let dispose: (() => void) | undefined
    void import('./client/SkillBoardSection.tsx').then(mod => {
      const { SkillBoardSection } = mod
      // Register into settings slot if available, otherwise as a standalone page
      try {
        const slots = (ctx as unknown as { slots: { register: (name: string, comp: unknown) => () => void } }).slots
        // Try settings.section first (official settings)
        dispose = slots.register('settings.section', {
          // Minimal slot contribution — actual rendering is delegated to the host's settings renderer
          // For v0.1 we expose the component via global for manual mount; the real slot wiring
          // will be refined once we verify the Host API in a running Hi-DSH.
          component: SkillBoardSection,
          id: 'hi-dsh-skill-board',
          title: 'Hi-DSH 技能开关',
        } as unknown as never)
      } catch {
        // Fallback: expose globally for manual testing via devtools
        ;(globalThis as unknown as Record<string, unknown>).__hiDshSkillBoard = SkillBoardSection
      }
    }).catch(() => {})
    return () => { try { dispose?.() } catch {} }
  })
}
