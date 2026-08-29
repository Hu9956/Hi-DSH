import { describe, expect, it } from 'vitest'
import { ACCESS_MODE_LABELS, translateAccessModeText } from '../src/client/access-mode-locales.ts'

describe('access mode locale relabeling', () => {
  it('maps exactly the three English mode names to their Chinese labels', () => {
    expect(ACCESS_MODE_LABELS).toEqual({
      'Read Only': '只读',
      'Workspace Write': '工作区写入',
      'Full access': '完全访问',
    })
  })

  it('translates the trigger aria-label and plain mode names', () => {
    expect(translateAccessModeText('访问模式，当前：Workspace Write')).toBe('访问模式，当前：工作区写入')
    expect(translateAccessModeText('Read Only')).toBe('只读')
    expect(translateAccessModeText('Full access')).toBe('完全访问')
  })

  it('leaves unrelated text untouched', () => {
    expect(translateAccessModeText('访问模式，当前：Custom Mode')).toBe('访问模式，当前：Custom Mode')
    expect(translateAccessModeText('')).toBe('')
  })
})
