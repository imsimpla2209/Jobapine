import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      next: path.resolve(__dirname, './src/next'),
      types: path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    assetsDir: '',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    minify: !!process.env.IS_PRODUCTION,
    emptyOutDir: true,
    outDir: './build',
    rollupOptions: {
      external: {
        socketIo: './src/next/socket.io/index.tsx',
      },
      input: {
        index: './src/index.tsx',
        styles: './src/index.css',
      },
      output: {
        manualChunks: false,
        entryFileNames: 'main.js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
