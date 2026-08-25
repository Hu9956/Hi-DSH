import { defineConfig } from 'tsdown'
export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts', 'src/skill-board-route.ts'],
  format: ['esm'],
  dts: false,
  clean: false,
  outDir: 'lib',
})
