/** Style segment for {@link ././Tabs.tsx Tabs} — leaf module, imported only by css.ts. */
export const tabsCss = `
.dshui-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--dshT3-border);
}
.dshui-tab {
  padding: 8px 12px;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: var(--dshT3-radius-sm) var(--dshT3-radius-sm) 0 0;
  background: transparent;
  color: var(--dshT3-fg-muted);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: -1px;
  white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}
.dshui-tab:hover { color: var(--dshT3-fg); background: var(--dshT3-hover); }
.dshui-tab:focus-visible { outline: 2px solid var(--dshT3-primary); outline-offset: -2px; }
.dshui-tab[aria-selected="true"] {
  color: var(--dshT3-fg);
  font-weight: 600;
  border-bottom-color: var(--dshT3-primary);
}
`
