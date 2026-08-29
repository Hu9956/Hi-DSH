/** Style segment for {@link ././SelectField.tsx SelectField} — leaf module, imported only by css.ts. */
export const selectFieldCss = `
.dshui-select {
  flex: 0 0 auto;
  min-width: 150px;
  min-height: var(--dshT3-control-h-lg);
  padding: 4px 28px 4px 10px;
  border: 1px solid var(--dshT3-border-strong);
  border-radius: var(--dshT3-radius-md);
  background: var(--dshT3-surface);
  color: var(--dshT3-fg);
  font: inherit;
  font-size: 12px;
}
.dshui-select:disabled { opacity: .55; }
.dshui-select:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: 2px;
}
`
