/** Style segment for {@link ././Skeleton.tsx Skeleton} — leaf module, imported only by css.ts. */
export const skeletonCss = `
.dshui-skeleton {
  display: block;
  width: 100%;
  height: 14px;
  border-radius: var(--dshT3-radius-sm);
  background: var(--dshT3-surface-raised);
  position: relative;
  overflow: hidden;
}
.dshui-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, var(--dshT3-hover), transparent);
  animation: dshuiSkeleton 1.6s infinite;
}
@keyframes dshuiSkeleton {
  100% { transform: translateX(100%); }
}
@media (prefers-reduced-motion: reduce) {
  .dshui-skeleton::after { animation: none; }
}
`
