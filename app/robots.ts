import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";
  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/internal/"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/internal/"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/internal/"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/internal/"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/internal/"] },
    ],
    sitemap: "https://www.fpx.nz/sitemap.xml",
  };
}
