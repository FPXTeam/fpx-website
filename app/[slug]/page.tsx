import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MasterInnerPage } from "@/components/master-site";

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
  "faq",
  "about-us",
  "contact-us",
  "terms-and-conditions",
  "privacy-policy",
] as const;

type MasterPage = (typeof masterPages)[number];

type PageMeta = {
  title: string;
  description: string;
  image?: string;
};

const defaultImage = "/images/social/fpx-social-share.jpg";

const pageMeta: Record<MasterPage, PageMeta> = {
  products: {
    title: "Timber Range",
    description:
      "Explore FPX product groups for manufacturing, building and construction, outdoor and landscaping, and dunnage timber.",
  },
  manufacturing: {
    title: "Manufacturing Timber",
    description:
      "Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products.",
    image: "/images/social/manufacturing-social-share.jpg",
  },
  "building-construction": {
    title: "Building & Construction Timber",
    description:
      "Timber products for structural, building, finishing and specialist construction applications.",
    image: "/images/social/building-construction-social-share.jpg",
  },
  "outdoor-landscaping": {
    title: "Outdoor & Landscaping Timber",
    description:
      "Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction.",
    image: "/images/social/outdoor-landscaping-social-share.jpg",
  },
  dunnage: {
    title: "Dunnage Timber",
    description:
      "Timber dunnage for freight, shipping, load support and industrial transport applications.",
    image: "/images/social/dunnage-social-share.jpg",
  },
  "source-timber": {
    title: "Source Timber",
    description:
      "Browse available timber and current offers, or send FPX your exact requirements for a clear, supported sourcing process.",
  },
  "how-fpx-works": {
    title: "How FPX Works",
    description:
      "See how FPX supports timber sourcing from the initial requirement through product selection, order coordination and delivery.",
  },
  "our-customers": {
    title: "Our Customers",
    description:
      "FPX supports commercial timber buyers across New Zealand, including builders, merchants, processors and procurement teams.",
  },
  "saw-point": {
    title: "Saw Point",
    description:
      "Selected New Zealand timber industry news, market updates and developments worth paying attention to.",
  },
  "industry-resources": {
    title: "Industry Resources",
    description:
      "Practical guides covering timber products, specifications and the New Zealand timber market.",
  },
  faq: {
    title: "FAQ",
    description:
      "Answers to common questions about finding, requesting and buying timber through FPX.",
  },
  "about-us": {
    title: "About FPX",
    description:
      "FPX is a New Zealand timber sourcing platform supported by people who understand the trade.",
  },
  "contact-us": {
    title: "Contact FPX",
    description:
      "Contact FPX about timber sourcing requirements, platform support or general enquiries.",
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    description: "Terms and Conditions for Forest Products Exchange Limited.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Privacy Policy for Forest Products Exchange Limited.",
  },
};

export function generateStaticParams() {
  return masterPages.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!masterPages.includes(slug as MasterPage)) return {};

  const data = pageMeta[slug as MasterPage];
  const image = data.image ?? defaultImage;
  const path = `/${slug}`;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_NZ",
      url: path,
      siteName: "FPX | Forest Products Exchange",
      title: `${data.title} | FPX`,
      description: data.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${data.title} | FPX Forest Products Exchange`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | FPX`,
      description: data.description,
      images: [image],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!masterPages.includes(slug as MasterPage)) notFound();
  return <MasterInnerPage slug={slug} />;
}
