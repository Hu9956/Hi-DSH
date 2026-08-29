/**
 * Chinese labels for the composer's access-mode control.
 *
 * Upstream's own shell copy around this control is Chinese (the trigger's
 * aria-label reads 访问模式，当前：…) but the three mode names stay English.
 * Upstream locale namespaces are single-owner (duplicate registration
 * throws), so the names are relabeled in the DOM and idempotently
 * reapplied — React restores its text on re-render and the next sweep puts
 * ours back.
 *
 * Scope is deliberately narrow: only the trigger (anchored on upstream's
 * own 访问模式 aria-label prefix) and role=menuitem entries inside a
 * role=menu are relabeled. Conversation messages can legitimately contain
 * these exact English strings and must never be touched.
 */

/** English mode name → 中文档位名, applied verbatim wherever the control renders them. */
export const ACCESS_MODE_LABELS: Readonly<Record<string, string>> = {
  'Read Only': '只读',
  'Workspace Write': '工作区写入',
  'Full access': '完全访问',
}

const LABEL_PATTERN = /Read Only|Workspace Write|Full access/g

/** Replace every English mode name in an arbitrary string (aria-labels, text nodes). */
export function translateAccessModeText(text: string): string {
  return text.replace(LABEL_PATTERN, name => ACCESS_MODE_LABELS[name] ?? name)
}

const relabelElementText = (element: Element): void => {
  // The visible name may be the element's own text node or sit in one leaf
  // child (an icon <svg> beside a label <span>).
  for (const node of [...element.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const replacement = ACCESS_MODE_LABELS[(node.nodeValue ?? '').trim()]
      if (replacement) {
        node.nodeValue = replacement
        return
      }
    }
  }
  for (const child of element.children) {
    if (child.childElementCount === 0) {
      const replacement = ACCESS_MODE_LABELS[(child.textContent ?? '').trim()]
      if (replacement) {
        child.textContent = replacement
        return
      }
    }
  }
}

export function relabelAccessMode(root: ParentNode): void {
  if (typeof Element === 'undefined') return
  // The trigger carries upstream's own Chinese shell copy as its aria-label.
  for (const trigger of root.querySelectorAll('button[aria-label^="访问模式"]')) {
    const label = trigger.getAttribute('aria-label')
    if (label) {
      const translated = translateAccessModeText(label)
      if (translated !== label) trigger.setAttribute('aria-label', translated)
    }
    relabelElementText(trigger)
  }
  // Menu items exist only while the popup is open; the role scope keeps the
  // sweep away from conversation text that may quote these names.
  for (const menu of root.querySelectorAll('[role="menu"]')) {
    for (const item of menu.querySelectorAll('[role="menuitem"]')) relabelElementText(item)
  }
}

/** Observe the document and keep the access-mode control relabeled. */
export function installAccessModeLocales(): () => void {
  if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return () => {}
  let scheduled = false
  const observer = new MutationObserver(() => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      relabelAccessMode(document.body)
    })
  })
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label'] })
  relabelAccessMode(document.body)
  return () => observer.disconnect()
}
