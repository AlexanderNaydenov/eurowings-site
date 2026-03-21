import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.graphassets.com",
      },
      {
        protocol: "https",
        hostname: "**.graphassets.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/home", destination: "/" },
      { source: "/de/home", destination: "/de" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.hygraph.com",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
