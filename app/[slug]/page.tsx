import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { MasterInnerPage } from "@/components/master-site";
import sawPointIssues from "../../data/saw-point-issues.json";
import "../../components/revised-pages.css";
import "../../components/inner-refresh.css";
import "../../components/source-timber-redesign.css";
import "../../components/premium-inner-pages.css";
import "../../components/kiln-drying-article.css";

const siteUrl = "https://www.fpx.nz";
const masterPages = [
  "timber",
  "products",
  "manufacturing",
  "building-construction",
  "outdoor-landscaping",
  "dunnage",
  "fpx-sourcing",
  "source-timber",
  "how-fpx-works",
  "our-customers",
  "saw-point",
  "industry-insights",
  "industry-resources",
  "frequently-asked-questions",
  "faq",
  "about-us",
  "contact-us",
  "terms-and-conditions",
  "privacy-policy",
  "cookie-policy",
  "cookie-settings",
  "timber-growth-rings",
  "the-science-of-kiln-drying",
] as const;

type MasterPage = (typeof masterPages)[number];
type PageMeta = { title: string; description: string; image?: string; canonical?: string; type?: "article" | "website"; publishedAt?: string; modifiedAt?: string; articleSection?: string };
const defaultImage = "/images/social/fpx-social-share.jpg";

const articleCitations:Record<string,string[]> = {
  "timber-growth-rings":[
    "https://www.sciencedirect.com/science/article/abs/pii/S0378112700004059",
    "https://teara.govt.nz/en/radiata-pine",
    "https://link.springer.com/article/10.1186/s40490-015-0053-8",
    "https://assets-global.website-files.com/5d4797a2a904cdf4df041fd6/5d6738e946f65d180ff176d1_RPBC%20Bulletin%202%20Radiata%20Pine%20Wood%20Density%20200306.pdf"
  ],
  "the-science-of-kiln-drying":[
    "https://bioresources.cnr.ncsu.edu/resources/impact-of-continuous-drying-method-on-drying-quality-of-southern-pine-sawn-timber/",
    "https://bioresources.cnr.ncsu.edu/resources/the-effects-of-drying-method-on-the-wood-permeability-wettability-treatability-and-gluability-of-southern-pine-from-australia/",
    "https://www.mdpi.com/2073-4360/15/4/792",
    "https://www.ippc.int/en/publications/640/",
    "https://www.redstagtimber.co.nz/products/new-zealand-products/technical-information/timber-briefs/timber-brief-3/"
  ]
};

const pageMeta: Record<MasterPage, PageMeta> = {
  timber: { title: "Timber Range for New Zealand Commercial Buyers", description: "Explore FPX timber product groups for manufacturing, building and construction, outdoor and landscaping, and dunnage applications across New Zealand." },
  products: { title: "Timber Range for New Zealand Commercial Buyers", description: "Explore FPX timber product groups for manufacturing, building and construction, outdoor and landscaping, and dunnage applications across New Zealand.", canonical: "/timber" },
  manufacturing: { title: "Manufacturing Timber for NZ Wood Processors", description: "Explore manufacturing timber feedstock through FPX for New Zealand wood processors and timber manufacturers, including multiple grades and remanufacturing applications.", image: "/images/social/manufacturing-social-share.jpg" },
  "building-construction": { title: "Building & Construction Timber NZ", description: "Explore structural, building, finishing and specialist construction timber through FPX for commercial projects across New Zealand.", image: "/images/social/building-construction-social-share.jpg" },
  "outdoor-landscaping": { title: "Outdoor & Landscaping Timber NZ", description: "Explore treated and purpose-made timber for fencing, decking, retaining, landscaping and outdoor construction through FPX.", image: "/images/social/outdoor-landscaping-social-share.jpg" },
  dunnage: { title: "Dunnage Timber for Freight & Shipping NZ", description: "Explore timber dunnage through FPX for freight, shipping, load support, storage and industrial transport applications across New Zealand.", image: "/images/social/dunnage-social-share.jpg" },
  "fpx-sourcing": { title: "FPX Sourcing | Source Commercial Timber in New Zealand", description: "Use FPX Sourcing to browse available timber, review current offers or send a specific commercial timber requirement anywhere in New Zealand." },
  "source-timber": { title: "FPX Sourcing | Source Commercial Timber in New Zealand", description: "Use FPX Sourcing to browse available timber, review current offers or send a specific commercial timber requirement anywhere in New Zealand.", canonical: "/fpx-sourcing" },
  "how-fpx-works": { title: "How FPX Timber Sourcing Works", description: "See how FPX supports New Zealand timber buyers from available stock, current offers and product requests through to orders and delivery." },
  "our-customers": { title: "Who Uses FPX | New Zealand Timber Buyers", description: "FPX supports contractors, builders, procurement teams, timber merchants and wood processors sourcing commercial timber across New Zealand." },
  "saw-point": { title: "Saw Point | New Zealand Timber Industry Insights", description: "Read Saw Point by George Harman for selected New Zealand timber industry news, market developments and issues worth paying attention to." },
  "industry-insights": { title: "FPX Insights | New Zealand Timber Guides", description: "Read FPX Insights for practical explanations of Radiata pine, kiln drying, timber characteristics, specifications and sourcing topics in New Zealand." },
  "industry-resources": { title: "FPX Insights | New Zealand Timber Guides", description: "Read FPX Insights for practical explanations of Radiata pine, kiln drying, timber characteristics, specifications and sourcing topics in New Zealand.", canonical: "/industry-insights" },
  "frequently-asked-questions": { title: "FPX Sourcing FAQ | Timber Buying Questions", description: "Get direct answers about browsing timber, current offers, product requests, orders and support through FPX Sourcing in New Zealand." },
  faq: { title: "FPX Sourcing FAQ | Timber Buying Questions", description: "Get direct answers about browsing timber, current offers, product requests, orders and support through FPX Sourcing in New Zealand.", canonical: "/frequently-asked-questions" },
  "about-us": { title: "About FPX | Forest Products Exchange New Zealand", description: "Learn about Forest Products Exchange Limited, the team behind FPX and how FPX supports commercial timber sourcing across New Zealand." },
  "contact-us": { title: "Contact FPX | New Zealand Timber Sourcing", description: "Contact Forest Products Exchange about commercial timber sourcing requirements, FPX platform support or general enquiries in New Zealand." },
  "terms-and-conditions": { title: "Terms and Conditions | Forest Products Exchange Ltd", description: "Terms and Conditions for Forest Products Exchange Limited and use of the FPX website and platform." },
  "privacy-policy": { title: "Privacy Policy | Forest Products Exchange Ltd", description: "How Forest Products Exchange Limited collects, uses, stores, protects and discloses personal information under New Zealand privacy law." },
  "cookie-policy": { title: "Cookie Policy | Forest Products Exchange Ltd", description: "How the FPX website uses cookies, browser storage and optional Google Analytics 4, including necessary, preference and analytics technologies." },
  "cookie-settings": { title: "Cookie Settings | FPX", description: "Review and update optional browser storage and analytics preferences for the FPX website." },
  "timber-growth-rings": { title: "Radiata Pine Characteristics | Growth & Environment", description: "FPX Insight on how growth and environment shape Radiata pine timber characteristics in New Zealand.", image: "/images/radiata-pine-growth-rings-hero.png", type: "article", publishedAt: "2026-03-13", modifiedAt: "2026-09-21", articleSection: "Timber Characteristics" },
  "the-science-of-kiln-drying": { title: "The Science of Kiln Drying Radiata Pine", description: "FPX Insight covering conventional and continuous kilns, moisture content and why kiln drying matters for Radiata pine.", image: "/images/kiln-drying-cover.png", type: "article", publishedAt: "2026-09-16", modifiedAt: "2026-09-21", articleSection: "Timber Processing" },
};

export function generateStaticParams() { return masterPages.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!masterPages.includes(slug as MasterPage)) return {};
  const data = pageMeta[slug as MasterPage];
  const image = data.image ?? defaultImage;
  const path = data.canonical ?? `/${slug}`;
  const isProduction = process.env.VERCEL_ENV === "production";
  const shouldIndex = isProduction && slug !== "faq" && slug !== "cookie-settings";
  const robots = { index: shouldIndex, follow: true, googleBot: { index: shouldIndex, follow: true, "max-image-preview": "large" as const, "max-snippet": -1, "max-video-preview": -1 } };
  const openGraph = data.type === "article"
    ? { type: "article" as const, locale: "en_NZ", url: path, siteName: "FPX | Forest Products Exchange", title: `${data.title} | FPX`, description: data.description, images: [{ url: image, width: 1200, height: 630, alt: `${data.title} | FPX` }], publishedTime: data.publishedAt, modifiedTime: data.modifiedAt, section: data.articleSection, authors: [`${siteUrl}/about-us`] }
    : { type: "website" as const, locale: "en_NZ", url: path, siteName: "FPX | Forest Products Exchange", title: `${data.title} | FPX`, description: data.description, images: [{ url: image, width: 1200, height: 630, alt: `${data.title} | FPX` }] };
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: path },
    robots,
    openGraph,
    twitter: { card: "summary_large_image", title: `${data.title} | FPX`, description: data.description, images: [image] },
  };
}


const faqSchemaItems = [
  ["What is FPX Sourcing?","FPX Sourcing is a digital timber sourcing service for commercial timber buyers in New Zealand. Buyers can browse available stock, review current offers or send FPX a specific timber requirement."],
  ["Who is FPX for?","FPX is built for commercial timber buyers including contractors, builders, procurement teams, timber merchants and wood processors across New Zealand."],
  ["How do I start sourcing timber through FPX?","Start by browsing available timber, reviewing current offers or creating a request. Choose the route that best matches how specific your requirement already is."],
  ["What if I cannot find the timber I need?","Create a request with the dimensions, grade, treatment, quantity and other requirements you know. FPX will review the requirement and source suitable options."],
  ["What information should I include in a timber request?","Include the product or application, dimensions, grade, treatment, quantity and required timing where known. Clear specifications help FPX identify suitable options."],
  ["What are FPX Offers?","Offers are current timber opportunities that buyers can review and enquire about. Pricing can then be provided based on the buyer’s volumes and requirements."],
  ["Can I manage orders through FPX?","Yes. FPX brings order information, deliveries and previously ordered products together in the buyer account."],
  ["Can I reorder timber I have bought before?","Previously ordered products can be used as a starting point for repeat requirements, reducing the need to rebuild the same request from scratch."],
  ["How much does FPX cost for buyers?","FPX is free for buyers to use."],
  ["Who can I contact if I need help?","Contact FPX at support@fpx.nz or use the Contact page for timber sourcing questions, platform support or general enquiries."],
] as const;

const sawPointMonthOrder=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
function sawPointIssueDateValue(value:string){
  const upper=value.toUpperCase();
  const year=Number(upper.match(/[0-9]{4}/)?.[0]||0);
  const month=sawPointMonthOrder.findIndex(name=>upper.includes(name));
  return year*12+(month>=0?month:0);
}
const sawPointSchemaIssues=[...sawPointIssues].sort((a,b)=>sawPointIssueDateValue(b.date)-sawPointIssueDateValue(a.date)||Number(b.issue)-Number(a.issue));

const howToSteps = [
  ["Start where you are","Browse available stock, review current offers or send a specific request. Start with the route that best matches what you know."],
  ["Share the detail","Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier."],
  ["Choose what fits","Review the timber options and the information around them, then choose the route that works for your team."],
  ["Keep it moving","FPX keeps the order and delivery path connected so your team can follow the handover through to site."],
] as const;

function breadcrumbSchema(slug: string) {
  const data = pageMeta[slug as MasterPage];
  const path = data.canonical ?? `/${slug}`;
  const parent = ["manufacturing","building-construction","outdoor-landscaping","dunnage"].includes(slug)
    ? [{ name: "Timber Range", item: `${siteUrl}/timber` }]
    : ["timber-growth-rings","the-science-of-kiln-drying"].includes(slug)
      ? [{ name: "FPX Insights", item: `${siteUrl}/industry-insights` }]
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
  const url = `${siteUrl}${path}`;

  if (["timber-growth-rings","the-science-of-kiln-drying"].includes(slug)) {
    return {
      "@context":"https://schema.org",
      "@type":"Article",
      headline:data.title,
      description:data.description,
      image:data.image ? [`${siteUrl}${data.image}`] : undefined,
      datePublished:data.publishedAt,
      dateModified:data.modifiedAt,
      articleSection:data.articleSection,
      citation:articleCitations[slug],
      keywords:slug==="the-science-of-kiln-drying"
        ? ["Radiata Pine kiln drying","timber moisture content","continuous kiln","conventional kiln","New Zealand timber"]
        : ["Radiata Pine characteristics","wood density","growth rings","New Zealand timber","Radiata Pine"],
      mainEntityOfPage:{"@type":"WebPage","@id":url},
      publisher:{"@id":`${siteUrl}/#organization`},
      author:{"@type":"Organization","@id":`${siteUrl}/#organization`,"name":"Forest Products Exchange Limited","url":`${siteUrl}/about-us`},
      isPartOf:{"@id":`${siteUrl}/#website`},
      about:[{"@type":"Thing","name":"Radiata Pine"},{"@type":"Thing","name":"New Zealand timber"}],
      inLanguage:"en-NZ"
    };
  }
  if (slug === "frequently-asked-questions") {
    return {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      name:data.title,
      description:data.description,
      url,
      mainEntity:faqSchemaItems.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}})),
      isPartOf:{"@id":`${siteUrl}/#website`},
      inLanguage:"en-NZ"
    };
  }
  if (slug === "how-fpx-works") {
    return {
      "@context":"https://schema.org",
      "@type":"HowTo",
      name:"How FPX Timber Sourcing Works",
      description:data.description,
      url,
      step:howToSteps.map(([name,text],index)=>({"@type":"HowToStep",position:index+1,name,text})),
      publisher:{"@id":`${siteUrl}/#organization`},
      inLanguage:"en-NZ"
    };
  }
  if (slug === "timber") {
    return {
      "@context":"https://schema.org",
      "@type":"CollectionPage",
      name:data.title,
      description:data.description,
      url,
      mainEntity:{"@type":"ItemList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Manufacturing","url":`${siteUrl}/manufacturing`},
        {"@type":"ListItem","position":2,"name":"Building & Construction","url":`${siteUrl}/building-construction`},
        {"@type":"ListItem","position":3,"name":"Outdoor & Landscaping","url":`${siteUrl}/outdoor-landscaping`},
        {"@type":"ListItem","position":4,"name":"Dunnage","url":`${siteUrl}/dunnage`}
      ]},
      isPartOf:{"@id":`${siteUrl}/#website`},
      inLanguage:"en-NZ"
    };
  }
  if (slug === "industry-insights") {
    return {
      "@context":"https://schema.org",
      "@type":"CollectionPage",
      name:data.title,
      description:data.description,
      url,
      mainEntity:{"@type":"ItemList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"The Science of Kiln Drying","url":`${siteUrl}/the-science-of-kiln-drying`},
        {"@type":"ListItem","position":2,"name":"Radiata Pine Characteristics","url":`${siteUrl}/timber-growth-rings`}
      ]},
      isPartOf:{"@id":`${siteUrl}/#website`},
      inLanguage:"en-NZ"
    };
  }
  if (slug === "fpx-sourcing") {
    return { "@context":"https://schema.org", "@type":"Service", name:"FPX Sourcing", description:data.description, url, provider:{"@id":`${siteUrl}/#organization`}, areaServed:{"@type":"Country","name":"New Zealand"}, audience:{"@type":"BusinessAudience","audienceType":"Commercial timber buyers"}, serviceType:"Commercial timber sourcing", isPartOf:{"@id":`${siteUrl}/#website`}, inLanguage:"en-NZ" };
  }
  const productSchemas:Record<string,string[]> = {
    "manufacturing":["Manufacturing Timber"],
    "building-construction":["Structural Timber","Weatherboards","House Piles","Ceiling Battens","Tile Battens","Mouldings","Fascia","Scaffold Planks","Soleboards","Kickboards","Stair Treads"],
    "outdoor-landscaping":["Outdoor","Posts","Rails","Palings","Decking","Retaining Boards","Sleepers, Squares & Beams","Screening","Pickets","Capping","Fence Battens","Trellis Battens","Roundwood","Pegs"],
    "dunnage":["Dunnage"]
  };
  if (productSchemas[slug]) {
    return { "@context":"https://schema.org", "@type":"CollectionPage", name:data.title, description:data.description, url, mainEntity:{"@type":"ItemList","itemListElement":productSchemas[slug].map((name,index)=>({"@type":"ListItem",position:index+1,name}))}, isPartOf:{"@id":`${siteUrl}/#website`}, inLanguage:"en-NZ" };
  }
  if (slug === "saw-point") {
    return { "@context":"https://schema.org", "@type":"CollectionPage", name:data.title, description:data.description, url, mainEntity:{"@type":"ItemList","itemListElement":sawPointSchemaIssues.map((issue,index)=>({"@type":"ListItem","position":index+1,"name":issue.title||`Saw Point | Issue ${issue.issue}`,"url":issue.body?`${siteUrl}/saw-point/${issue.slug}`:issue.linkedinUrl}))}, isPartOf:{"@id":`${siteUrl}/#website`}, inLanguage:"en-NZ" };
  }
  if (slug === "about-us") {
    return [
      { "@context":"https://schema.org", "@type":"AboutPage", name:data.title, description:data.description, url, about:{"@id":`${siteUrl}/#organization`}, isPartOf:{"@id":`${siteUrl}/#website`}, inLanguage:"en-NZ" },
      { "@context":"https://schema.org", "@type":"Person", "@id":`${siteUrl}/about-us#george-harman`, name:"George Harman", jobTitle:"Director", worksFor:{"@id":`${siteUrl}/#organization`}, url:`${siteUrl}/about-us#george-harman`, knowsAbout:["Commercial timber sourcing","New Zealand timber trade"] },
      { "@context":"https://schema.org", "@type":"Person", "@id":`${siteUrl}/about-us#gabriela-molloy`, name:"Gabriela Molloy", jobTitle:"General Manager", worksFor:{"@id":`${siteUrl}/#organization`}, url:`${siteUrl}/about-us#gabriela-molloy`, knowsAbout:["FPX operations","Commercial timber sourcing"] }
    ];
  }
  if (slug === "contact-us") {
    return { "@context":"https://schema.org", "@type":"ContactPage", name:data.title, description:data.description, url, about:{"@id":`${siteUrl}/#organization`}, isPartOf:{"@id":`${siteUrl}/#website`}, inLanguage:"en-NZ" };
  }
  return { "@context":"https://schema.org", "@type":"WebPage", name:data.title, description:data.description, url, isPartOf:{"@id":`${siteUrl}/#website`}, inLanguage:"en-NZ" };
}

const legacyRedirects: Record<string,string> = {
  "source-timber": "/fpx-sourcing",
  "products": "/timber",
  "industry-resources": "/industry-insights",
  "faq": "/frequently-asked-questions",
};

const contentSlug: Record<string,string> = {
  "fpx-sourcing": "source-timber",
  "timber": "products",
  "industry-insights": "industry-resources",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!masterPages.includes(slug as MasterPage)) notFound();
  if (legacyRedirects[slug]) permanentRedirect(legacyRedirects[slug]);
  const pageSchemas = pageSchema(slug);
  const schemas = [breadcrumbSchema(slug), ...(Array.isArray(pageSchemas)?pageSchemas:[pageSchemas])];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemas)}}/><MasterInnerPage slug={contentSlug[slug] ?? slug}/></>;
}
