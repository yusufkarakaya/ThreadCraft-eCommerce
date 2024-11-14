import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Basit Vite Konfigürasyonu (Proxy olmadan)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Geliştirme sunucusunun portunu ayarlayın (varsayılan olarak 3000)
  },
  build: {
    outDir: 'dist', // Üretim build çıktısının klasörü
  },
  resolve: {
    alias: {
      '@': '/src', // Kısayol olarak '@' işareti ile 'src' klasörüne referans
    },
  },
})
