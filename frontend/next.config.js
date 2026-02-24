/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  // Force rebuild
  experimental: {
    forceSwcTransforms: true
  }
}

module.exports = nextConfig
