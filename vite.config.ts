import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['tesseract.js'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['leaflet'],
          recharts: ['recharts'],
          tesseract: ['tesseract.js'],
        },
      },
    },
  },
  server: { port: 5173 },
})
