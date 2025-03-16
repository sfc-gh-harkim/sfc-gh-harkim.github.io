/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/sfc-gh-harkim.github.io',
  assetPrefix: '/sfc-gh-harkim.github.io',
};

module.exports = nextConfig; 