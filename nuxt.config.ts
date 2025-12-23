import { pwa } from './app/config/pwa'
import { appDescription } from './app/constants/index'

export default defineNuxtConfig({
  runtimeConfig: {
    // Server-side only (not exposed to client)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001',
      geoapifyKey: process.env.NUXT_PUBLIC_GEOAPIFY_KEY || '',
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_KEY || '',
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    },
  },

  // Proxy Payload CMS routes - routeRules handle routing at Nitro level
  // In production (NODE_ENV=production), Payload runs on localhost:3000 (same container)
  // In development, Payload runs on localhost:3001 (separate process)
  routeRules: process.env.NODE_ENV === 'production' ? {
    '/admin/**': { proxy: 'http://localhost:3000/admin/**' },
    '/_next/**': { proxy: 'http://localhost:3000/_next/**' },
    '/_payload/**': { proxy: 'http://localhost:3000/_payload/**' },
    '/media/**': { proxy: 'http://localhost:3000/media/**' },
  } : {
    '/admin/**': { proxy: 'http://localhost:3001/admin/**' },
    '/_next/**': { proxy: 'http://localhost:3001/_next/**' },
    '/_payload/**': { proxy: 'http://localhost:3001/_payload/**' },
    '/media/**': { proxy: 'http://localhost:3001/media/**' },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/google-fonts'
  ],

  css: ['~/assets/css/main.css'],

  googleFonts: {
    families: {
      Outfit: [400, 500, 600, 700],
    }
  },

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
      bodyAttrs: {
        class: 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 antialiased font-sans'
      }
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi', '/admin', '/api'],
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  pwa,
})
