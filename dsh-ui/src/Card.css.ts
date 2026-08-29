/** Style segment for {@link ././Card.tsx Card} — leaf module, imported only by css.ts. */
export const cardCss = `
.dshui-card {
  padding: 14px 16px;
  border-radius: var(--dshT3-radius-lg);
  border: 1px solid var(--dshT3-border);
  background: var(--dshT3-surface);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.15s ease;
}
.dshui-card[data-active="true"] { border-color: var(--dshT3-primary); }
`
