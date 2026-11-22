import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true'
const appBase = isGitHubPagesBuild ? '/scan-and-create/' : '/'

export default defineConfig({
  base: appBase,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'branding/favicon.ico',
        'favicon.svg',
        'branding/app-icon.svg',
        'branding/apple-touch-icon-180x180.png',
        'branding/nasirpintu.jpg',
      ],
      manifest: {
        id: './',
        name: 'Scan & Create — Your Digital Toolkit',
        short_name: 'Scan & Create',
        description:
          'Scan, create, and manage QR codes and barcodes in a privacy-first digital toolkit.',
        lang: 'en',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#F7F7FA',
        theme_color: '#7057E8',
        categories: ['utilities', 'productivity'],
        icons: [
          { src: 'branding/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'branding/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          {
            src: 'branding/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'branding/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,webmanifest}'],
      },
    }),
  ],
})
