import type { MetadataRoute } from "next";
const base = "https://fpx.nz";
const revised = new Date("2026-09-08T00:00:00+12:00");
const urls = [
  "", "/source-timber", "/products", "/manufacturing", "/building-construction", "/outdoor-landscaping", "/dunnage",
  "/how-fpx-works", "/our-customers", "/about-us", "/contact-us", "/saw-point", "/industry-resources",
  "/timber-growth-rings", "/the-science-of-kiln-drying", "/frequently-asked-questions", "/terms-and-conditions", "/privacy-policy",
];
export default function sitemap(): MetadataRoute.Sitemap {
  return urls.map((url) => ({ url: `${base}${url}`, lastModified: revised, changeFrequency: url === "/saw-point" || url === "/industry-resources" ? "monthly" : "weekly", priority: url === "" ? 1 : ["/source-timber","/products"].includes(url) ? 0.9 : 0.7 }));
}
