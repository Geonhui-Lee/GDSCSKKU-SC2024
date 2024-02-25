import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    tsconfigPaths()
  ],
  resolve: {
    alias: [
      { find: "hooks", replacement: resolve(__dirname, "./src/hooks") },
      { find: "components", replacement: resolve(__dirname, "./src/components") },
      { find: "data", replacement: resolve(__dirname, "./src/data") },
      { find: "pages", replacement: resolve(__dirname, "./src/pages") },
      { find: "theme", replacement: resolve(__dirname, "./src/theme") }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
