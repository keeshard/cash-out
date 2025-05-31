/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-production-opera-website.operacdn.com",
      },
      {
        protocol: "https",
        hostname: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
