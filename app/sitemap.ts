import type { MetadataRoute } from "next";
const base = "https://fpx.nz";
const revised = new Date("2026-09-08T00:00:00+12:00");
const urls = [
  "", "/fpx-sourcing", "/timber", "/manufacturing", "/building-construction", "/outdoor-landscaping", "/dunnage",
  "/how-fpx-works", "/our-customers", "/about-us", "/contact-us", "/saw-point", "/industry-insights",
  "/timber-growth-rings", "/the-science-of-kiln-drying", "/frequently-asked-questions", "/terms-and-conditions", "/privacy-policy",
];
export default function sitemap(): MetadataRoute.Sitemap {
  return urls.map((url) => ({ url: `${base}${url}`, lastModified: revised, changeFrequency: url === "/saw-point" || url === "/industry-insights" ? "monthly" : "weekly", priority: url === "" ? 1 : ["/fpx-sourcing","/timber"].includes(url) ? 0.9 : 0.7 }));
}
