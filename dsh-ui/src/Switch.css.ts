/** Style segment for {@link ././Switch.tsx Switch} — leaf module, imported only by css.ts. */
export const switchCss = `
.dshui-switch {
  flex: 0 0 auto;
  position: relative;
  width: 30px;
  height: 18px;
  padding: 1px;
  border: none;
  border-radius: 999px;
  background: var(--dshT3-border-strong);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.dshui-switch[aria-checked="true"] { background: var(--dshT3-primary); }
.dshui-switch:disabled { cursor: default; opacity: .5; }
.dshui-switch:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: 2px;
}
.dshui-switch-knob {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: var(--dshT3-shadow-knob);
  transform: translateX(0);
  transition: transform 0.15s ease;
}
.dshui-switch[aria-checked="true"] .dshui-switch-knob { transform: translateX(12px); }
`
