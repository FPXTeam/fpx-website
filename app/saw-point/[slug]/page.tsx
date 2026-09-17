import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import issues from "../../../data/saw-point-issues.json";

export function generateStaticParams(){
  return issues.filter(item=>item.body).map(item=>({slug:item.slug}));
}

export default async function SawPointIssuePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const issue=issues.find(item=>item.slug===slug && item.body);
  if(!issue) notFound();

  const paragraphs=issue.body.split(/\n{2,}/).map(block=>block.trim()).filter(Boolean);

  return <main className="spi-page">
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

  </main>;
}
