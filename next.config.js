/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.eu-central-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: '**.extropy.sk'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true
      }
    ];
  }
};
