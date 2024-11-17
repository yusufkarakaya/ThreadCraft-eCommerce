import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://e-commerce-api-200w.onrender.com', // Backend port
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
