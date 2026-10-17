import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CSP_META } from './scripts/lib/csp.mjs'

// Content Security Policy as a <meta> tag, production builds only: the dev
// server injects its own inline scripts (React refresh) that it would block.
const csp = () => ({
  name: 'csp-meta',
  apply: 'build',
  transformIndexHtml: (html) => html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${CSP_META}`),
})

// vite-plugin-sitemap removed 20 Sep: it only ever listed the root URL,
// since HashRouter routes aren't real paths. scripts/build-static-pages.mjs
// now writes dist/sitemap.xml itself, alongside the static pages that make
// those URLs real and crawlable.
export default defineConfig({
  plugins: [react(), csp()],
  base: '/',
})
