/** Style segment for {@link ././StatusPill.tsx StatusPill} — leaf module, imported only by css.ts. */
export const statusPillCss = `
.dshui-pill {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  border: none;
  font-family: inherit;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
.dshui-pill[data-active="true"] {
  background: var(--dshT3-success-surface);
  color: var(--dshT3-success);
}
.dshui-pill[data-active="true"]:hover {
  background: var(--dshT3-success);
  color: #ffffff;
}
.dshui-pill[data-active="false"] {
  background: var(--dshT3-surface-raised);
  color: var(--dshT3-fg-subtle);
}
.dshui-pill[data-active="false"]:hover {
  background: var(--dshT3-hover);
  color: var(--dshT3-fg-muted);
}
button.dshui-pill { cursor: pointer; }
button.dshui-pill:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: 2px;
}
`
