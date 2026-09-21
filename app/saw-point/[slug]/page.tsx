import "../../../components/master-site.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import issues from "../../../data/saw-point-issues.json";

const siteUrl = "https://www.fpx.nz";

export function generateStaticParams(){
  return issues.filter(item=>item.body).map(item=>({slug:item.slug}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const issue=issues.find(item=>item.slug===slug && item.body);
  if(!issue)return {};
  const path=`/saw-point/${issue.slug}`;
  return {
    title:issue.title,
    description:issue.excerpt,
    alternates:{canonical:path},
    openGraph:{
      type:"article",
      locale:"en_NZ",
      url:path,
      siteName:"FPX | Forest Products Exchange",
      title:`${issue.title} | FPX`,
      description:issue.excerpt,
      authors:[`${siteUrl}/about-us#george-harman`]
    },
    twitter:{card:"summary_large_image",title:`${issue.title} | FPX`,description:issue.excerpt}
  };
}

export default async function SawPointIssuePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const issue=issues.find(item=>item.slug===slug && item.body);
  if(!issue) notFound();

  const paragraphs=issue.body.split(/\n{2,}/).map(block=>block.trim()).filter(Boolean);
  const url=`${siteUrl}/saw-point/${issue.slug}`;
  const articleSchema={
    "@context":"https://schema.org",
    "@type":"Article",
    headline:issue.title,
    description:issue.excerpt,
    mainEntityOfPage:{"@type":"WebPage","@id":url},
    author:{"@type":"Person","@id":`${siteUrl}/about-us#george-harman`,"name":"George Harman","jobTitle":"Director"},
    publisher:{"@id":`${siteUrl}/#organization`},
    isPartOf:{"@id":`${siteUrl}/#website`},
    inLanguage:"en-NZ"
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}}/><main className="spi-page">
    <header className="spi-hero">
      <Link href="/saw-point"><ArrowLeft size={15}/> Back to Saw Point</Link>
      <span>ISSUE {issue.issue} · {issue.date}</span>
      <h1>{issue.title}</h1>
      <p>{issue.excerpt}</p>
      <div><strong>Written by George Harman</strong><span>Director, FPX</span></div>
    </header>
    <article className="spi-article">
      {paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
      <a href={issue.linkedinUrl} target="_blank" rel="noreferrer">View this issue on LinkedIn <ExternalLink size={15}/></a>
    </article>

  </main></>;
}
