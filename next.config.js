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
  }
}

module.exports = nextConfig