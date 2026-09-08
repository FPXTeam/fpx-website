import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://fpx.nz";
const socialImage = "/images/social/fpx-social-share.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FPX | New Zealand Timber Sourcing",
    template: "%s | FPX",
  },
  description:
    "Browse available timber, discover current offers, or tell FPX what you need. A clear, supported way to source New Zealand timber.",
  applicationName: "FPX",
  alternates: {
    canonical: "/",
  },
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
    type: "website",
    locale: "en_NZ",
    url: siteUrl,
    siteName: "FPX | Forest Products Exchange",
    title: "FPX | New Zealand Timber Sourcing",
    description:
      "Browse available timber, discover current offers, or tell FPX what you need. A clear, supported way to source New Zealand timber.",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "FPX Forest Products Exchange, New Zealand timber sourcing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FPX | New Zealand Timber Sourcing",
    description:
      "Browse available timber, discover current offers, or tell FPX what you need. A clear, supported way to source New Zealand timber.",
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ">
      <body className="antialiased">{children}</body>
    </html>
  );
}
