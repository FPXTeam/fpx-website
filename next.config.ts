import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // Next 16 defaults to quality 75. FPX uses large photographic hero imagery
    // and UI screenshots, so keep optimized delivery but raise the baseline.
    qualities: [90],
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
