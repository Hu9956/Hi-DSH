/** Style segment for {@link ././Notice.tsx Notice} — leaf module, imported only by css.ts. */
export const noticeCss = `
.dshui-notice {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--dshT3-radius-md);
  font-size: 12px;
  line-height: 1.55;
}
.dshui-notice[data-tone="info"] { background: var(--dshT3-surface-raised); color: var(--dshT3-fg-muted); }
.dshui-notice[data-tone="success"] { color: var(--dshT3-success); background: var(--dshT3-success-surface); }
.dshui-notice[data-tone="error"] { color: var(--dshT3-error); background: var(--dshT3-error-surface); }
`
