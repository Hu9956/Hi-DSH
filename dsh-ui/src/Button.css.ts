/** Style segment for {@link ././Button.tsx Button} — leaf module, imported only by css.ts. */
export const buttonCss = `
.dshui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: var(--dshT3-control-h);
  padding: 4px 12px;
  border: 1px solid var(--dshT3-border-strong);
  border-radius: var(--dshT3-radius-sm);
  background: transparent;
  color: var(--dshT3-fg);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
}
.dshui-btn:hover:not(:disabled) {
  background: var(--dshT3-hover);
  border-color: var(--dshT3-fg-subtle);
}
.dshui-btn:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: 2px;
}
.dshui-btn:disabled {
  cursor: default;
  opacity: .5;
}
.dshui-btn svg { width: 14px; height: 14px; }
.dshui-btn--primary {
  border-color: transparent;
  background: var(--dshT3-primary);
  color: var(--dshT3-primary-fg);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 1px 2px color-mix(in srgb, var(--dshT3-primary) 30%, transparent);
}
.dshui-btn--primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--dshT3-primary) 90%, transparent);
  border-color: transparent;
  box-shadow: none;
}
.dshui-btn--ghost { border-color: transparent; }
.dshui-btn--ghost:hover:not(:disabled) {
  background: var(--dshT3-hover);
  border-color: transparent;
}
.dshui-btn--danger { color: var(--dshT3-error); }
.dshui-btn--danger:hover:not(:disabled) {
  background: var(--dshT3-error-surface);
  border-color: color-mix(in srgb, var(--dshT3-error) 35%, transparent);
  color: var(--dshT3-error);
}
`
