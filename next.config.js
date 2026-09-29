/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  async rewrites() {
    return [
      {
        source: '/lomba/:path*',
        destination: '/siswa/lomba/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
