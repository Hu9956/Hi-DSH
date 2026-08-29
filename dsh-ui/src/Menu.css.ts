/** Style segment for {@link ././Menu.tsx Menu} — leaf module, imported only by css.ts. */
export const menuCss = `
.dshui-menu-anchor { position: relative; display: inline-flex; }
.dshui-menu {
  position: absolute;
  z-index: 100;
  top: calc(100% + 5px);
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: minmax(0, 1fr);
  min-width: 180px;
  padding: 5px;
  border: 1px solid var(--dshT3-border);
  border-radius: var(--dshT3-radius-lg);
  background: var(--dshT3-surface);
  box-shadow: var(--dshT3-shadow-pop);
}
.dshui-menu[data-align="end"] { right: 0; }
.dshui-menu[data-align="start"] { left: 0; }
.dshui-menu-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: var(--dshT3-control-h-lg);
  padding: 5px 9px;
  border: 0;
  border-radius: var(--dshT3-radius-sm);
  background: transparent;
  color: var(--dshT3-fg);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  text-align: start;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}
.dshui-menu-item:hover:not(:disabled),
.dshui-menu-item:focus-visible:not(:disabled) { background: var(--dshT3-hover); outline: none; }
.dshui-menu-item:focus-visible { box-shadow: inset 0 0 0 2px var(--dshT3-primary); }
.dshui-menu-item:disabled { cursor: default; opacity: .45; }
.dshui-menu-item[data-destructive="true"] { color: var(--dshT3-error); }
`
