import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // Keep FPX photography crisp while avoiding the q=90 payload penalty flagged by Lighthouse.
    // Individual LCP imagery can opt into 82; content photography uses 80.
    qualities: [70, 75, 80],
  },
  async redirects() {
    return [
      { source: "/faq", destination: "/frequently-asked-questions", permanent: true },
      { source: "/homepage-copy", destination: "/", permanent: true },
      { source: "/procurement-and-sales-team", destination: "/our-customers", permanent: true },
      { source: "/inventory-management-system", destination: "/our-customers", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
