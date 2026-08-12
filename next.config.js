/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vapedeliverybangalore.com' }],
        destination: 'https://vapedeliverybangalore.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
