// https://vite.dev/config/

import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [
    svelte(),
    viteSingleFile()
  ],
  build: {
    cssCodeSplit: false,
    cssMinify: true,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
