import { defineConfig } from 'tsdown'
export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
})
