import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {

          if (id.includes('node_modules/katex')) return 'vendor-katex'
          if (id.includes('node_modules/highlight.js')) return 'vendor-hljs'
          if (
            id.includes('node_modules/marked') ||
            id.includes('node_modules/marked-highlight') ||
            id.includes('node_modules/marked-katex-extension')
          ) return 'vendor-markdown'
          if (id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) return 'vendor-vue'
          if (id.includes('node_modules/lucide-vue-next') || id.includes('node_modules/vue-toastification')) return 'vendor-ui'
          if (id.includes('node_modules/dompurify')) return 'vendor-sanitize'
          if (id.includes('node_modules/axios')) return 'vendor-axios'
          if (id.includes('node_modules/vue')) return 'vendor-vue'
        },
      },
    },
  },
})
