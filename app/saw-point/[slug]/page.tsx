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
    <style jsx global>{`
      .spi-page{background:#fff;color:#040E0E}
      .spi-hero{padding:90px max(24px,calc((100% - 980px)/2)) 55px;background:#F4F7F4}
      .spi-hero>a{display:inline-flex;align-items:center;gap:7px;color:#40973C;text-decoration:none;font:700 11px/1 Lato,sans-serif}
      .spi-hero>span{display:block;margin-top:54px;color:#758956;font:700 10px/1 Lato,sans-serif;letter-spacing:.14em}
      .spi-hero h1{margin:14px 0 18px;font-size:clamp(48px,7vw,86px);line-height:.95;letter-spacing:-.055em}
      .spi-hero>p{max-width:760px;margin:0;color:#64736C;font-size:18px;line-height:1.7}
      .spi-hero>div{display:flex;gap:16px;margin-top:32px;font-size:13px}.spi-hero>div span{color:#758956}
      .spi-article{max-width:780px;margin:0 auto;padding:70px 24px 110px}
      .spi-article p{margin:0 0 26px;color:#273630;font-size:17px;line-height:1.85;white-space:pre-line}
      .spi-article>a{display:inline-flex;align-items:center;gap:8px;margin-top:24px;color:#40973C;font-weight:700;text-decoration:none}
    `}</style>
  </main>;
}
