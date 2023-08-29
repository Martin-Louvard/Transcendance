import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {port: 3000},
  resolve: {
    alias: [{ find: '@shared', replacement: path.resolve(__dirname, 'shared') }],
  },
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['Buffer', 'Buffer'], process: 'process' })],
    }
  }
})
