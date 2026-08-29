/** Style segment for {@link ././Toast.tsx Toast} — leaf module, imported only by css.ts. */
export const toastCss = `
.dshui-toast-viewport {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  pointer-events: none;
}
.dshui-toast {
  pointer-events: auto;
  max-width: 360px;
  padding: 10px 14px;
  border-radius: var(--dshT3-radius-md);
  border: 1px solid var(--dshT3-border);
  background: var(--dshT3-surface);
  color: var(--dshT3-fg);
  font-family: var(--dshT3-font-sans);
  font-size: 12px;
  line-height: 1.5;
  box-shadow: var(--dshT3-shadow-pop);
  animation: dshuiToastIn 0.16s ease;
}
@keyframes dshuiToastIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.dshui-toast[data-tone="success"] { border-color: color-mix(in srgb, var(--dshT3-success) 32%, transparent); }
.dshui-toast[data-tone="error"] { border-color: color-mix(in srgb, var(--dshT3-error) 32%, transparent); }
.dshui-toast[data-tone="warning"] { border-color: color-mix(in srgb, var(--dshT3-warning) 32%, transparent); }
.dshui-toast[data-tone="success"] .dshui-toast-dot { background: var(--dshT3-success); }
.dshui-toast[data-tone="error"] .dshui-toast-dot { background: var(--dshT3-error); }
.dshui-toast[data-tone="warning"] .dshui-toast-dot { background: var(--dshT3-warning); }
.dshui-toast[data-tone="info"] .dshui-toast-dot { background: var(--dshT3-primary); }
.dshui-toast-dot {
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  margin-right: 8px;
}
`
