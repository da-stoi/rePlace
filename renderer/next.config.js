/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  distDir: '../app',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
