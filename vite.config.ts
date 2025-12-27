import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Force hardcode API URL at build time to override any env issues
    'import.meta.env.VITE_API_URL': JSON.stringify('https://esse-aqui-midia.vercel.app/api')
  },
  build: {
    // Clear cache on build
    emptyOutDir: true,
    // Ensure proper sourcemaps for debugging
    sourcemap: false,
    // Minify for production
    minify: 'esbuild',
    // Force new build hash
    rollupOptions: {
      output: {
        // Generate unique filenames every build
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
