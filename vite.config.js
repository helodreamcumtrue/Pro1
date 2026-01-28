import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // THE PROXY BRIDGE STARTS HERE
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Points to your server.js port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
