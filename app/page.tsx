import { MasterHome } from "@/components/master-home";

const siteUrl = "https://www.fpx.nz";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Forest Products Exchange Limited",
  legalName: "Forest Products Exchange Limited",
  alternateName: "FPX",
  url: siteUrl,
  logo: `${siteUrl}/images/fpx-logo-horizontal-original.png`,
  description:
    "FPX is a New Zealand digital timber sourcing service for commercial timber buyers. Explore FPX Sourcing lets visitors browse current timber supply, review offers and submit specific timber requirements before creating an account.",
  areaServed: { "@type": "Country", name: "New Zealand" },
  knowsAbout: [
    "Commercial timber sourcing",
    "New Zealand timber",
    "Radiata Pine",
    "Timber processing",
    "Timber procurement"
  ],
  email: "support@fpx.nz",
  telephone: "+64 210 847 3262",
  identifier: {
    "@type": "PropertyValue",
    name: "New Zealand Companies Register company number",
    value: "8469278",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@fpx.nz",
    telephone: "+64 210 847 3262",
    areaServed: "NZ",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.linkedin.com/company/forest-products-exchange",
    "https://www.instagram.com/fpx.nz/",
    "https://www.facebook.com/people/Forest-Products-Exchange/61583101360304/",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "FPX",
  alternateName: "Forest Products Exchange",
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-NZ",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
      />
      <MasterHome />
    </>
  );
}
