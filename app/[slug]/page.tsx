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
];

export function generateStaticParams() {
  return masterPages.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!masterPages.includes(slug)) notFound();
  return <MasterInnerPage slug={slug} />;
}
