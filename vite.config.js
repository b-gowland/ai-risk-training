import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://app.airiskpractice.org',
      // HashRouter: only the root URL is crawlable by Google.
      // Hash-based routes (#/scenario/a1 etc.) are invisible to crawlers.
      exclude: ['/404'],
    }),
  ],
  base: '/',
})
