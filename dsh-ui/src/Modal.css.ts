/** Style segment for {@link ././Modal.tsx Modal} — leaf module, imported only by css.ts. */
export const modalCss = `
.dshui-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dshui-modal {
  width: 90%;
  max-width: 520px;
  background: var(--dshT3-surface);
  border: 1px solid var(--dshT3-border);
  border-radius: var(--dshT3-radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--dshT3-shadow-pop);
}
.dshui-modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--dshT3-fg);
}
.dshui-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
`
