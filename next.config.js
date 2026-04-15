/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'barbera-uneyeable-scrutinizingly.ngrok-free.dev',
      'love-app-production.up.railway.app'
    ],
  },
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns', 'lodash'],
  },
}

module.exports = nextConfig