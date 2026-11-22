import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname),
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: [resolve(__dirname, 'tests/setup.js')],
  },
});
