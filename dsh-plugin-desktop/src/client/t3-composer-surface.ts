/**
 * Composer surface marker for the framed-shell T3 treatment.
 *
 * The upstream conversation composer card carries no stable attribute of its
 * own (inline styles empty, class names hashed), so framed CSS cannot anchor
 * on it directly. The one composer-stable node is its textarea: derive the
 * card by walking up from the textarea to the outermost rounded, filled
 * ancestor, then tag it with a data attribute the stylesheet keys on.
 * Overlay-layer surfaces (Extensions Center forms, dialogs) are skipped —
 * they manage their own styling through dsh-ui.
 */

export const COMPOSER_SURFACE_ATTRIBUTE = 'data-dsh-t3-surface'

/** Walk up from a textarea to its outermost rounded, filled card ancestor. */
export function composerCardFrom(
  textarea: Element,
  styleOf: (element: Element) => { borderRadius: string; backgroundColor: string },
): Element | null {
  let card: Element | null = null
  let current = textarea.parentElement
  for (let hops = 0; current !== null && hops < 8; hops += 1) {
    const style = styleOf(current)
    const radius = Number.parseFloat(style.borderRadius)
    const filled = style.backgroundColor !== 'rgba(0, 0, 0, 0)'
    if (Number.isFinite(radius) && radius >= 10 && filled) card = current
    current = current.parentElement
  }
  return card
}

/**
 * Walk up from the composer card to the seat that paints the scroll fade
 * behind it (upstream lays a white gradient there so content dissolves under
 * the input); the T3 composition wants the bare base instead.
 */
export function composerSeatFrom(
  card: Element,
  styleOf: (element: Element) => { backgroundImage: string },
): Element | null {
  let current = card.parentElement
  for (let hops = 0; current !== null && hops < 8; hops += 1) {
    if (styleOf(current).backgroundImage !== 'none') return current
    current = current.parentElement
  }
  return null
}

/** Tag every composer card (and its gradient seat) under `root`. */
export function markComposerSurfaces(root: ParentNode): Element[] {
  const tagged: Element[] = []
  for (const textarea of root.querySelectorAll('textarea')) {
    if (textarea.closest('[data-shell-overlay]') !== null) continue
    // Card and seat are tracked independently: the seat wrapper may mount
    // after the first pass found the card, so a tagged card never blocks
    // re-checking for its untagged seat.
    let card = textarea.closest(`[${COMPOSER_SURFACE_ATTRIBUTE}="composer"]`)
    if (card === null) {
      card = composerCardFrom(textarea, element => {
        const style = getComputedStyle(element)
        return { borderRadius: style.borderRadius, backgroundColor: style.backgroundColor }
      })
      if (card === null) continue
      ;(card as HTMLElement).dataset.dshT3Surface = 'composer'
      tagged.push(card)
    }
    // The card's direct parent is the frame candidate (glass ring around the
    // card); it mounts with the card, so tagging it here keeps them in sync.
    const frame = card.parentElement
    if (frame !== null && (frame as HTMLElement).dataset.dshT3Surface === undefined) {
      ;(frame as HTMLElement).dataset.dshT3Surface = 'composer-frame'
      tagged.push(frame)
    }
    if (card.closest(`[${COMPOSER_SURFACE_ATTRIBUTE}="composer-seat"]`) !== null) continue
    const seat = composerSeatFrom(card, element => ({
      backgroundImage: getComputedStyle(element).backgroundImage,
    }))
    if (seat === null) continue
    ;(seat as HTMLElement).dataset.dshT3Surface = 'composer-seat'
    tagged.push(seat)
  }
  return tagged
}

/** Observe `root` and keep composer cards tagged as the session view swaps. */
export function installComposerSurfaceTagger(root: ParentNode): () => void {
  // Headless-safe: style-only test environments stub a minimal document with
  // neither MutationObserver nor queryable trees, so the tagger is a no-op.
  if (typeof MutationObserver === 'undefined' || typeof root.querySelectorAll !== 'function') {
    return () => {}
  }
  let scheduled = false
  const observer = new MutationObserver(() => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      markComposerSurfaces(root)
    })
  })
  observer.observe(root, { childList: true, subtree: true })
  markComposerSurfaces(root)
  // The seat wrapper can mount after the pass that tagged the card and never
  // mutate again on a settled session view; sweep a few times to catch it.
  const sweeps = [300, 1_000, 2_500].map(ms => setTimeout(() => { markComposerSurfaces(root) }, ms))
  return () => {
    observer.disconnect()
    for (const timer of sweeps) clearTimeout(timer)
  }
}
