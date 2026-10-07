import type { Metadata } from "next";
import LogoIntroPreview from "./logo-intro-preview";

export const metadata: Metadata = {
  title: "FPX Logo Intro Preview",
  description: "Temporary internal FPX logo animation preview for video capture.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function LogoIntroPreviewPage() {
  return <LogoIntroPreview />;
}
