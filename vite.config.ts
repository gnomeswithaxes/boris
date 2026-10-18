import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'

const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf-8'))

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: () => ({ ...readJson('manifest.json'), version: readJson('package.json').version }),
      watchFilePaths: ['manifest.json', 'package.json'],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
