import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // If building demo site
  if (process.env.BUILD_TARGET === 'demo') {
    return {
      base: './',
      build: {
        outDir: 'dist-demo',
        emptyOutDir: true,
      },
    };
  }

  // Default: Library build
  return {
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
        // Zero external dependencies! Everything is self-contained.
        external: [],
        output: {
          exports: 'named',
          globals: {},
        },
      },
    },
  };
});
