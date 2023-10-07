import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
      assets: path.resolve(__dirname, './src/assets'),
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
