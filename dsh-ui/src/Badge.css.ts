/** Style segment for {@link ././Badge.tsx Badge} — leaf module, imported only by css.ts. */
export const badgeCss = `
.dshui-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 18px;
  padding: 1px 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: var(--dshT3-surface-raised);
  color: var(--dshT3-fg-muted);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}
.dshui-badge[data-variant="primary"] { background: var(--dshT3-primary-soft); color: var(--dshT3-primary); }
.dshui-badge[data-variant="success"] { background: var(--dshT3-success-surface); color: var(--dshT3-success); }
.dshui-badge[data-variant="warning"] { background: var(--dshT3-warning-surface); color: var(--dshT3-warning); }
.dshui-badge[data-variant="danger"] { background: var(--dshT3-error-surface); color: var(--dshT3-error); }
.dshui-badge--mono { font-family: var(--dshT3-font-mono); }
`
