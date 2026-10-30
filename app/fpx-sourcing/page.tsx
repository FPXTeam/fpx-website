import type { Metadata } from "next";
import { MasterInnerPage } from "@/components/master-site";
import "../../components/master-site.css";
import "../../components/premium-clean-sitewide.css";
import "../../components/revised-pages.css";
import "../../components/inner-refresh.css";
import "../../components/source-timber-redesign.css";
import "../../components/premium-inner-pages.css";

const siteUrl = "https://www.fpx.nz";
const description = "Browse current FPX Stock listings and specials or submit a specific timber requirement. FPX works with suppliers to source suitable options.";

export const metadata: Metadata = {
  title: { absolute: "FPX Sourcing | Browse Stock or Submit a Timber Request" },
  description,
  alternates: { canonical: "/fpx-sourcing" },
  robots: process.env.VERCEL_ENV === "production"
    ? { index: true, follow: true }
    : { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: `${siteUrl}/fpx-sourcing`,
    siteName: "FPX | Forest Products Exchange",
    title: "FPX Sourcing | Browse Stock or Submit a Timber Request",
    description,
    images: [{ url: "/images/social/fpx-social-share.jpg", width: 1200, height: 630, alt: "FPX digital timber sourcing platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FPX Sourcing | Browse Stock or Submit a Timber Request",
    description,
    images: ["/images/social/fpx-social-share.jpg"],
  },
};

const serviceSchema = {
  "@context":"https://schema.org",
  "@type":"Service",
  name:"FPX Sourcing",
  description,
  url:`${siteUrl}/fpx-sourcing`,
  provider:{"@id":`${siteUrl}/#organization`},
  audience:{"@type":"BusinessAudience","audienceType":"Commercial timber buyers"},
  serviceType:"Digital timber sourcing",
  isPartOf:{"@id":`${siteUrl}/#website`},
  inLanguage:"en-NZ",
};

export default function FpxSourcingPage(){
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(serviceSchema)}}/>
    <MasterInnerPage slug="source-timber"/>
  </>;
}
