/** Style segment for {@link ././SegmentedControl.tsx SegmentedControl} — leaf module, imported only by css.ts. */
export const segmentedControlCss = `
.dshui-seg {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--dshT3-surface-raised);
  border-radius: var(--dshT3-radius-md);
  border: 1px solid var(--dshT3-border);
  overflow-x: auto;
  align-items: center;
  max-width: 100%;
}
.dshui-seg-item {
  padding: 5px 12px;
  border-radius: var(--dshT3-radius-sm);
  border: none;
  background: transparent;
  color: var(--dshT3-fg-muted);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.dshui-seg-item:hover {
  color: var(--dshT3-fg);
  background: var(--dshT3-hover);
}
.dshui-seg-item:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: 2px;
}
.dshui-seg-item[data-active="true"] {
  background: var(--dshT3-surface);
  color: var(--dshT3-fg);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
`
