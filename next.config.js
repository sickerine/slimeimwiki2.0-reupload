/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: { domains: ['appmedia.jp', 'cdn.discordapp.com', 'media.discordapp.net', 'i.imgur.com'], },
}

module.exports = nextConfig
