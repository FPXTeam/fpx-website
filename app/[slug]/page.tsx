import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MasterInnerPage } from "@/components/master-site";

const siteUrl = "https://fpx.nz";
const masterPages = [
  "products",
  "manufacturing",
  "building-construction",
  "outdoor-landscaping",
  "dunnage",
  "source-timber",
  "how-fpx-works",
  "our-customers",
  "saw-point",
  "industry-resources",
  "frequently-asked-questions",
  "faq",
  "about-us",
  "contact-us",
  "terms-and-conditions",
  "privacy-policy",
  "timber-growth-rings",
  "the-science-of-kiln-drying",
] as const;

type MasterPage = (typeof masterPages)[number];
type PageMeta = { title: string; description: string; image?: string; canonical?: string; type?: "article" | "website" };
const defaultImage = "/images/social/fpx-social-share.jpg";

const pageMeta: Record<MasterPage, PageMeta> = {
  products: { title: "Timber Range for New Zealand Commercial Buyers", description: "Explore FPX timber product groups for manufacturing, building and construction, outdoor and landscaping, and dunnage applications across New Zealand." },
  manufacturing: { title: "Manufacturing Timber for NZ Wood Processors", description: "Explore manufacturing timber feedstock through FPX for New Zealand wood processors and timber manufacturers, including multiple grades and remanufacturing applications.", image: "/images/social/manufacturing-social-share.jpg" },
  "building-construction": { title: "Building & Construction Timber NZ", description: "Explore structural, building, finishing and specialist construction timber through FPX for commercial projects across New Zealand.", image: "/images/social/building-construction-social-share.jpg" },
  "outdoor-landscaping": { title: "Outdoor & Landscaping Timber NZ", description: "Explore treated and purpose-made timber for fencing, decking, retaining, landscaping and outdoor construction through FPX.", image: "/images/social/outdoor-landscaping-social-share.jpg" },
  dunnage: { title: "Dunnage Timber for Freight & Shipping NZ", description: "Explore timber dunnage through FPX for freight, shipping, load support, storage and industrial transport applications across New Zealand.", image: "/images/social/dunnage-social-share.jpg" },
  "source-timber": { title: "FPX Sourcing | Source Commercial Timber in New Zealand", description: "Use FPX Sourcing to browse available timber, review current offers or send a specific commercial timber requirement anywhere in New Zealand." },
  "how-fpx-works": { title: "How FPX Timber Sourcing Works", description: "See how FPX supports New Zealand timber buyers from available stock, current offers and product requests through to orders and delivery." },
  "our-customers": { title: "Who Uses FPX | New Zealand Timber Buyers", description: "FPX supports contractors, builders, procurement teams, timber merchants and wood processors sourcing commercial timber across New Zealand." },
  "saw-point": { title: "Saw Point | New Zealand Timber Industry Insights", description: "Read Saw Point by George Harman for selected New Zealand timber industry news, market developments and issues worth paying attention to." },
  "industry-resources": { title: "FPX Insights | New Zealand Timber Guides", description: "Read FPX Insights for practical explanations of Radiata pine, kiln drying, timber characteristics, specifications and sourcing topics in New Zealand." },
  "frequently-asked-questions": { title: "FPX Sourcing FAQ | Timber Buying Questions", description: "Get direct answers about browsing timber, current offers, product requests, orders and support through FPX Sourcing in New Zealand." },
  faq: { title: "FPX Sourcing FAQ | Timber Buying Questions", description: "Get direct answers about browsing timber, current offers, product requests, orders and support through FPX Sourcing in New Zealand.", canonical: "/frequently-asked-questions" },
  "about-us": { title: "About FPX | Forest Products Exchange New Zealand", description: "Learn about Forest Products Exchange Limited, the team behind FPX and how FPX supports commercial timber sourcing across New Zealand." },
  "contact-us": { title: "Contact FPX | New Zealand Timber Sourcing", description: "Contact Forest Products Exchange about commercial timber sourcing requirements, FPX platform support or general enquiries in New Zealand." },
  "terms-and-conditions": { title: "Terms and Conditions | Forest Products Exchange Ltd", description: "Terms and Conditions for Forest Products Exchange Limited and use of the FPX website and platform." },
  "privacy-policy": { title: "Privacy Policy | Forest Products Exchange Ltd", description: "Privacy Policy for Forest Products Exchange Limited, including collection, use, disclosure and protection of personal information." },
  "timber-growth-rings": { title: "Radiata Pine Characteristics | Growth & Environment", description: "FPX Insight on how growth and environment shape Radiata pine timber characteristics in New Zealand.", type: "article" },
  "the-science-of-kiln-drying": { title: "The Science of Kiln Drying Radiata Pine", description: "FPX Insight covering conventional and continuous kilns, moisture content and why kiln drying matters for Radiata pine.", type: "article" },
};

export function generateStaticParams() { return masterPages.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!masterPages.includes(slug as MasterPage)) return {};
  const data = pageMeta[slug as MasterPage];
  const image = data.image ?? defaultImage;
  const path = data.canonical ?? `/${slug}`;
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: path },
    robots: { index: slug !== "faq", follow: true },
    openGraph: { type: data.type === "article" ? "article" : "website", locale: "en_NZ", url: path, siteName: "FPX | Forest Products Exchange", title: `${data.title} | FPX`, description: data.description, images: [{ url: image, width: 1200, height: 630, alt: `${data.title} | FPX` }] },
    twitter: { card: "summary_large_image", title: `${data.title} | FPX`, description: data.description, images: [image] },
  };
}

function breadcrumbSchema(slug: string) {
  const data = pageMeta[slug as MasterPage];
  const path = data.canonical ?? `/${slug}`;
  const parent = ["manufacturing","building-construction","outdoor-landscaping","dunnage"].includes(slug)
    ? [{ name: "Timber Range", item: `${siteUrl}/products` }]
    : ["timber-growth-rings","the-science-of-kiln-drying"].includes(slug)
      ? [{ name: "FPX Insights", item: `${siteUrl}/industry-resources` }]
      : [];
  return { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[
    { "@type":"ListItem", position:1, name:"Home", item:siteUrl },
    ...parent.map((p,i)=>({"@type":"ListItem",position:i+2,name:p.name,item:p.item})),
    { "@type":"ListItem", position:parent.length+2, name:data.title, item:`${siteUrl}${path}` },
  ]};
}

function pageSchema(slug: string) {
  const data = pageMeta[slug as MasterPage];
  const path = data.canonical ?? `/${slug}`;
  if (["timber-growth-rings","the-science-of-kiln-drying"].includes(slug)) {
    return { "@context":"https://schema.org", "@type":"Article", headline:data.title, description:data.description, mainEntityOfPage:`${siteUrl}${path}`, publisher:{"@id":`${siteUrl}/#organization`}, author:{"@type":"Organization","@id":`${siteUrl}/#organization`}, inLanguage:"en-NZ" };
  }
  if (slug === "about-us") {
    return { "@context":"https://schema.org", "@type":"AboutPage", name:data.title, description:data.description, url:`${siteUrl}${path}`, about:{"@id":`${siteUrl}/#organization`} };
  }
  if (slug === "contact-us") {
    return { "@context":"https://schema.org", "@type":"ContactPage", name:data.title, description:data.description, url:`${siteUrl}${path}`, about:{"@id":`${siteUrl}/#organization`} };
  }
  return { "@context":"https://schema.org", "@type":"WebPage", name:data.title, description:data.description, url:`${siteUrl}${path}`, isPartOf:{"@id":`${siteUrl}/#website`}, inLanguage:"en-NZ" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!masterPages.includes(slug as MasterPage)) notFound();
  if (slug === "faq") redirect("/frequently-asked-questions");
  const schemas = [breadcrumbSchema(slug), pageSchema(slug)];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemas)}}/><MasterInnerPage slug={slug}/></>;
}
