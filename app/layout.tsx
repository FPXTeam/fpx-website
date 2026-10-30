import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalyticsConsent } from "../components/google-analytics-consent";
import { NavigationScrollReset } from "../components/navigation-scroll-reset";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import "../components/brand-system-2026.css";
import "../components/premium-home-shared.css";
import "../components/site-motion.css";
import "../components/hero-image-quality.css";
import "../components/app-visuals-hidden.css";
import "../components/saw-point-hero-fix.css";
import "../components/strict-brand-kit.css";

const cormorant = Cormorant_Garamond({
  subsets:["latin"],
  style:["italic"],
  weight:["500","600"],
  variable:"--font-accent-serif",
  display:"swap",
});

const siteUrl = "https://www.fpx.nz";
const socialImage = "/images/social/fpx-social-share.jpg";
const isProduction = process.env.VERCEL_ENV === "production";

const organizationSchema = {
  "@context":"https://schema.org",
  "@type":"Organization",
  "@id":`${siteUrl}/#organization`,
  name:"Forest Products Exchange Limited",
  legalName:"Forest Products Exchange Limited",
  alternateName:"FPX",
  url:siteUrl,
  logo:{
    "@type":"ImageObject",
    url:`${siteUrl}/images/fpx-logo-horizontal-original.png`,
  },
};

const websiteSchema = {
  "@context":"https://schema.org",
  "@type":"WebSite",
  "@id":`${siteUrl}/#website`,
  url:siteUrl,
  name:"FPX",
  alternateName:"Forest Products Exchange",
  publisher:{"@id":`${siteUrl}/#organization`},
  inLanguage:"en-NZ",
};

const platformDescription = "Browse New Zealand timber and current stock, submit a specific requirement, and use FPX customer tools for quotations and orders when you have full access.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FPX | New Zealand Timber Sourcing", template: "%s | FPX" },
  description: platformDescription,
  applicationName: "FPX",
  alternates: { canonical: "/" },
  robots: isProduction
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false, googleBot: { index: false, follow: false, noarchive: true } },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website", locale: "en_NZ", url: siteUrl, siteName: "FPX | Forest Products Exchange",
    title: "FPX | New Zealand Timber Sourcing",
    description: platformDescription,
    images: [{ url: socialImage, width: 1200, height: 630, alt: "FPX Forest Products Exchange digital timber platform" }],
  },
  twitter: {
    card: "summary_large_image", title: "FPX | New Zealand Timber Sourcing",
    description: platformDescription,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NZ"><body className={`${cormorant.variable} antialiased`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify([organizationSchema,websiteSchema])}}/><Script id="fpx-google-consent-default" strategy="beforeInteractive" dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});`}}/><NavigationScrollReset/>{children}<GoogleAnalyticsConsent/></body></html>;
}
