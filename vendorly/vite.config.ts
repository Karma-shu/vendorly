import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Vendorly - Hyperlocal Quick Commerce',
        short_name: 'Vendorly',
        description: 'Connect with local vendors for quick delivery of groceries, medicines, and more',
        theme_color: '#2D7D32',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        maximumFileSizeToCacheInBytes: 3000000, // 3MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.vendorly\.in\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300 // 5 minutes
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|webp|svg|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 86400 // 24 hours
              }
            }
          }
        ]
      }
    })
  ],
  // Production Build Optimizations
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Routing
            if (id.includes('react-router')) {
              return 'router';
            }
            // UI Components
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Forms
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            // API & State
            if (id.includes('@supabase') || id.includes('@tanstack')) {
              return 'api-vendor';
            }
            // Charts and visualization
            if (id.includes('recharts') || id.includes('chart.js')) {
              return 'charts-vendor';
            }
            // Date utilities
            if (id.includes('date-fns') || id.includes('dayjs')) {
              return 'date-vendor';
            }
            // Utility libraries
            if (id.includes('lodash') || id.includes('ramda')) {
              return 'utils-vendor';
            }
            // Large dependencies
            if (id.includes('mapbox') || id.includes('leaflet')) {
              return 'maps-vendor';
            }
            // General vendor chunk for other node_modules
            return 'vendor';
          }
        }
      }
    },
    // Asset optimization
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    chunkSizeWarningLimit: 500, // Warn for chunks larger than 500KB
    cssCodeSplit: true, // Split CSS into separate files
  },
  // Development server configuration
  server: {
    host: true,
    port: 3000,
    open: false,
    cors: true
  },
  // Preview server configuration
  preview: {
    port: 4173,
    host: true
  },
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils')
    }
  },
  // TypeScript configuration
  esbuild: {
    // Drop console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ]
  }
})
