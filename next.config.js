/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // The following are needed for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/sfc-gh-harkim.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sfc-gh-harkim.github.io/' : '',
  trailingSlash: true,
};

module.exports = nextConfig; 