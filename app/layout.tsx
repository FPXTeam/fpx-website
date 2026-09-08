import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FPX | Timber Sourcing, Simplified",
  description: "A digital timber sourcing service built for New Zealand businesses.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
