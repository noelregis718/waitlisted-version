/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['firebase'],
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig 