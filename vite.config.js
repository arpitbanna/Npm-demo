import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode, command }) => {
  // If running dev server or building demo
  if (command === 'serve' || process.env.BUILD_TARGET === 'demo') {
    return {
      base: './',
      plugins: [react()],
      server: {
        port: 5173,
        host: true,
      },
      build: {
        outDir: 'dist-demo',
        emptyOutDir: true,
      },
    };
  }

  // Default: Library build
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        name: 'MagicUIEffects',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          if (format === 'es') return 'magicui-effects.js';
          if (format === 'cjs') return 'magicui-effects.cjs';
          return 'magicui-effects.umd.js';
        },
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  };
});
