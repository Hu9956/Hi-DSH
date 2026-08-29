/** Style segment for {@link ././Tooltip.tsx Tooltip} — leaf module, imported only by css.ts. */
export const tooltipCss = `
.dshui-tip {
  position: relative;
  display: inline-flex;
}
.dshui-tip-bubble {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(2px);
  bottom: calc(100% + 6px);
  z-index: 100;
  padding: 5px 9px;
  border-radius: var(--dshT3-radius-sm);
  background: var(--dshT3-fg);
  color: var(--dshT3-bg);
  font-family: var(--dshT3-font-sans);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.12s ease 0.25s, transform 0.12s ease 0.25s;
}
.dshui-tip[data-placement="bottom"] .dshui-tip-bubble {
  bottom: auto;
  top: calc(100% + 6px);
  transform: translateX(-50%) translateY(-2px);
}
.dshui-tip:hover .dshui-tip-bubble,
.dshui-tip:focus-within .dshui-tip-bubble {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
`
