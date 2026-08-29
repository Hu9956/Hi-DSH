/** Style segment for {@link ././TextField.tsx TextField} — leaf module, imported only by css.ts. */
export const textFieldCss = `
.dshui-field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  color: var(--dshT3-fg-muted);
  font-size: 12px;
}
.dshui-input {
  width: 100%;
  min-height: var(--dshT3-control-h-lg);
  box-sizing: border-box;
  padding: 7px 11px;
  border: 1px solid var(--dshT3-border-strong);
  border-radius: var(--dshT3-radius-md);
  outline: none;
  background: var(--dshT3-surface);
  color: var(--dshT3-fg);
  font: inherit;
  font-size: 13px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.dshui-input:focus-visible {
  border-color: var(--dshT3-primary);
  box-shadow: 0 0 0 2px var(--dshT3-primary-soft);
}
`
