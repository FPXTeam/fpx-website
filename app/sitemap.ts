import type { MetadataRoute } from "next";
const base = "https://www.fpx.nz";

const pages = [
  { path:"", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:1 },
  { path:"/fpx-sourcing", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:.9 },
  { path:"/timber", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:.9 },
  { path:"/manufacturing", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:.8 },
  { path:"/building-construction", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:.8 },
  { path:"/outdoor-landscaping", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:.8 },
  { path:"/dunnage", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:.8 },
  { path:"/how-fpx-works", modified:"2026-09-18", changeFrequency:"monthly" as const, priority:.8 },
  { path:"/our-customers", modified:"2026-09-18", changeFrequency:"monthly" as const, priority:.7 },
  { path:"/about-us", modified:"2026-09-18", changeFrequency:"monthly" as const, priority:.7 },
  { path:"/contact-us", modified:"2026-09-18", changeFrequency:"monthly" as const, priority:.7 },
  { path:"/saw-point", modified:"2026-09-18", changeFrequency:"monthly" as const, priority:.8 },
  { path:"/industry-insights", modified:"2026-09-18", changeFrequency:"weekly" as const, priority:.8 },
  { path:"/timber-growth-rings", modified:"2026-03-13", changeFrequency:"yearly" as const, priority:.7 },
  { path:"/the-science-of-kiln-drying", modified:"2026-09-16", changeFrequency:"yearly" as const, priority:.8 },
  { path:"/frequently-asked-questions", modified:"2026-09-18", changeFrequency:"monthly" as const, priority:.7 },
  { path:"/terms-and-conditions", modified:"2026-09-16", changeFrequency:"yearly" as const, priority:.4 },
  { path:"/privacy-policy", modified:"2026-09-21", changeFrequency:"yearly" as const, priority:.4 },
  { path:"/cookie-policy", modified:"2026-09-21", changeFrequency:"yearly" as const, priority:.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({path,modified,changeFrequency,priority})=>({
    url:`${base}${path}`,
    lastModified:new Date(`${modified}T00:00:00+12:00`),
    changeFrequency,
    priority,
  }));
}
