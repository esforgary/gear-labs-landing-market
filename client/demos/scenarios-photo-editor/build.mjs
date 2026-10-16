import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

await build({
  configFile: false,
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [react()],
  worker: { format: 'es' },
  build: { outDir: fileURLToPath(new URL('../../public/imported/scenarios-photo-editor/', import.meta.url)), emptyOutDir: true },
});
