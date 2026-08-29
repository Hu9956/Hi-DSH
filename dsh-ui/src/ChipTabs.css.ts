/** Style segment for {@link ././ChipTabs.tsx ChipTabs} — leaf module, imported only by css.ts. */
export const chipTabsCss = `
.dshui-chips {
  display: flex;
  gap: 6px;
  padding: 2px;
}
.dshui-chip {
  padding: 4px 10px;
  border-radius: var(--dshT3-radius-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--dshT3-fg-subtle);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.dshui-chip:hover {
  color: var(--dshT3-fg-muted);
  background: var(--dshT3-hover);
}
.dshui-chip:focus-visible {
  outline: 2px solid var(--dshT3-primary);
  outline-offset: 2px;
}
.dshui-chip[aria-pressed="true"] {
  color: var(--dshT3-primary);
  border-color: color-mix(in srgb, var(--dshT3-primary) 32%, transparent);
  background: var(--dshT3-primary-soft);
  font-weight: 600;
}
`
