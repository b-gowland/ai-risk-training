import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite-plugin-sitemap removed 20 Sep: it only ever listed the root URL,
// since HashRouter routes aren't real paths. scripts/build-static-pages.mjs
// now writes dist/sitemap.xml itself, alongside the static pages that make
// those URLs real and crawlable.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
