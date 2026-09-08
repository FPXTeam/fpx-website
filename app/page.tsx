import { MasterHome } from "@/components/master-site";

const siteUrl = "https://fpx.nz";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Forest Products Exchange Limited",
  alternateName: "FPX",
  url: siteUrl,
  logo: `${siteUrl}/images/fpx-logo-horizontal-original.png`,
  description:
    "FPX is a New Zealand timber sourcing platform for commercial timber buyers. Buyers can browse available stock, review current offers or send specific timber requirements.",
  areaServed: { "@type": "Country", name: "New Zealand" },
  email: "support@fpx.nz",
  telephone: "+64 210 847 3262",
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
