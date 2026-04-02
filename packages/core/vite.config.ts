import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'YChartCore',
      formats: ['es', 'iife'],
      fileName: (format) => format === 'es' ? 'index.js' : 'ychart-core.iife.js',
    },
    rollupOptions: {
      output: {
        globals: {},
      },
    },
    sourcemap: true,
    minify: false,
  },
});
