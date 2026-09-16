"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Eyebrow, Arrow, Breadcrumbs, PageCTA } from "./master-shared";
import { privacyPolicy } from "./legal-privacy";
import { termsAndConditions } from "./legal-terms";

export { SawPointPage } from "./saw-point-page";

export function ResourcesPage(){
  const [query,setQuery]=useState("");
  const items=[
    {title:"Radiata Pine Characteristics",subtitle:"How Growth and Environment Shape Timber in New Zealand",copy:"A practical FPX guide to the relationship between Radiata pine growth, environment and timber characteristics.",image:"category-appearance-grades.webp",href:"/timber-growth-rings",type:"TIMBER CHARACTERISTICS"},
    {title:"The Science of Kiln Drying",subtitle:"Conventional and Continuous Kilns, Moisture Content, and Why It Matters for Radiata Pine",copy:"An FPX guide to kiln-drying methods, moisture content and why drying matters when specifying Radiata pine.",image:"category-untreated-timber.webp",href:"/the-science-of-kiln-drying",type:"TIMBER PROCESSING"}
  ];
  const shown=items.filter(item=>(item.title+" "+item.subtitle+" "+item.copy+" "+item.type).toLowerCase().includes(query.toLowerCase()));
  const now=new Date();
  const daySeed=Number(`${now.getUTCFullYear()}${String(now.getUTCMonth()+1).padStart(2,"0")}${String(now.getUTCDate()).padStart(2,"0")}`);
  const dailyFeatured=items[daySeed%items.length];
  const featured=query.trim()?shown[0]:dailyFeatured;
  const remaining=query.trim()?shown.slice(1):shown.filter(item=>item.href!==featured?.href);

  return <>
    <section className="pri-hero">
      <div className="pri-hero-copy">
        <Eyebrow>INDUSTRY INSIGHTS</Eyebrow>
        <h1>Timber knowledge,<br/><span className="headline-accent">made useful.</span></h1>
        <p>Practical FPX guides covering timber characteristics, processing, specifications and sourcing topics for New Zealand buyers.</p>
      </div>
      <div className="pri-search-wrap">
        <span>EXPLORE THE LIBRARY</span>
        <div className="pri-search">
          <Search aria-hidden="true"/>
          <label className="sr-only" htmlFor="insight-search">Search Industry Insights</label>
          <input id="insight-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search timber topics"/>
        </div>
        <small>{shown.length} {shown.length===1?"article":"articles"} available</small>
      </div>
    </section>

    <section className="pri-library" aria-live="polite">
      {featured&&<>
        <div className="pri-library-label"><span>FEATURED INSIGHT</span><i/></div>
        <Link href={featured.href} className="pri-featured">
          <div className="pri-featured-image"><img src={`/images/${featured.image}`} alt={`${featured.title} FPX Insight`}/></div>
          <div className="pri-featured-copy">
            <small>{featured.type}</small>
            <h2>{featured.title}</h2>
            <h3>{featured.subtitle}</h3>
            <p>{featured.copy}</p>
            <b>Read FPX Insight <Arrow/></b>
          </div>
        </Link>
      </>}

      {remaining.length>0&&
        <div className="pri-more">
          <div className="pri-library-label"><span>MORE INSIGHTS</span><i/></div>
          <div className="pri-grid">
            {remaining.map((item,i)=><Link href={item.href} className="pri-card" key={item.title}>
              <div className="pri-card-image"><img src={`/images/${item.image}`} alt={`${item.title} FPX Insight`}/></div>
              <div className="pri-card-meta"><span>{String(i+2).padStart(2,"0")}</span><small>{item.type}</small></div>
              <h2>{item.title}</h2>
              <h3>{item.subtitle}</h3>
              <p>{item.copy}</p>
              <b>Read FPX Insight <Arrow/></b>
            </Link>)}
          </div>
        </div>
      }

      {shown.length===0&&<div className="m-no-results pri-empty"><h2>No matching Industry Insights.</h2><p>Try a broader timber topic.</p></div>}
    </section>
  </>;
}

const faqGroups=[
  {title:"Getting started",items:[["What is FPX Sourcing?","FPX Sourcing is a digital timber sourcing service for commercial timber buyers in New Zealand. Buyers can browse available stock, review current offers or send FPX a specific timber requirement."],["Who is FPX for?","FPX is built for commercial timber buyers including contractors, builders, procurement teams, timber merchants and wood processors across New Zealand."],["How do I start sourcing timber through FPX?","Start by browsing available timber, reviewing current offers or creating a request. Choose the route that best matches how specific your requirement already is."]]},
  {title:"Products and requests",items:[["What if I cannot find the timber I need?","Create a request with the dimensions, grade, treatment, quantity and other requirements you know. FPX will review the requirement and source suitable options."],["What information should I include in a timber request?","Include the product or application, dimensions, grade, treatment, quantity and required timing where known. Clear specifications help FPX identify suitable options."],["What are FPX Offers?","Offers are current timber opportunities that buyers can review and enquire about. Pricing can then be provided based on the buyer’s volumes and requirements."]]},
  {title:"Orders and account",items:[["Can I manage orders through FPX?","Yes. FPX brings order information, deliveries and previously ordered products together in the buyer account."],["Can I reorder timber I have bought before?","Previously ordered products can be used as a starting point for repeat requirements, reducing the need to rebuild the same request from scratch."],["How much does FPX cost for buyers?","FPX is free for buyers to use."]]},
  {title:"Support",items:[["Who can I contact if I need help?","Contact FPX at support@fpx.nz or use the Contact page for timber sourcing questions, platform support or general enquiries."]]}
];
export function FAQPage(){
  const [active,setActive]=useState("Getting started");
  const visible=faqGroups.find(g=>g.title===active)??faqGroups[0];
  return <>
    <section className="pfq-hero"><div><Eyebrow>FREQUENTLY ASKED QUESTIONS</Eyebrow><h1>Straight answers.<br/><span className="headline-accent">No clutter.</span></h1><p>Everything you need to know about sourcing timber through FPX, from browsing products to requests, orders and support.</p></div><aside><small>CAN'T FIND IT?</small><h2>Ask the FPX team.</h2><p>Send us your requirement and we will point you in the right direction.</p><Link href="/contact-us">Contact FPX <Arrow/></Link></aside></section>
    <section className="pfq-main">
      <nav aria-label="FAQ topics">{faqGroups.map((group,i)=><button key={group.title} type="button" className={active===group.title?"active":""} onClick={()=>setActive(group.title)}><span>0{i+1}</span>{group.title}</button>)}</nav>
      <div className="pfq-topic" key={visible.title}><small>FAQ TOPIC</small><h2>{visible.title}</h2>{visible.items.map(([question,answer],i)=><details key={question} open={i===0}><summary><span>{String(i+1).padStart(2,"0")}</span><b>{question}</b><ChevronDown/></summary><p>{answer}</p></details>)}</div>
    </section>
  </>;
}

export function LegalPage({slug}:{slug:string}){const doc=slug==="privacy-policy"?privacyPolicy:termsAndConditions;return <><Breadcrumbs items={[["Home","/"],[doc.title,`/${slug}`]]}/><section className="m-legal-hero m-animate-in"><Eyebrow>FPX LEGAL</Eyebrow><h1>{doc.title}</h1><p>Forest Products Exchange Limited</p></section><section className="m-legal m-legal-full"><aside><span>FOREST PRODUCTS EXCHANGE LIMITED</span><p>Official FPX legal document.</p><nav aria-label={`${doc.title} sections`}>{doc.toc.map(([num,title])=><a key={num} href={`#legal-${num}`}><b>{String(num).padStart(2,"0")}</b>{title}</a>)}</nav></aside><article className="m-legal-document" dangerouslySetInnerHTML={{__html:doc.html}}/></section></>}

export function InsightArticlePage({slug}:{slug:string}){const article=slug==="timber-growth-rings"?{title:"Radiata Pine Characteristics",subtitle:"How Growth and Environment Shape Timber in New Zealand",type:"TIMBER CHARACTERISTICS",image:"category-appearance-grades.webp",sections:[["What this FPX Insight covers","This guide focuses on how growth and environment relate to the characteristics visible in Radiata pine timber, and why those characteristics matter when buyers are considering timber for different applications."],["Growth rings and timber characteristics","Growth rings provide a visible record of how a tree developed over time. Reading those characteristics alongside the intended application helps buyers ask better questions about product suitability and specification."],["Why it matters when sourcing timber","Timber sourcing decisions are stronger when the product, application and specification are considered together. FPX uses product information and timber knowledge to help buyers move from a requirement to suitable options."]]}:{title:"The Science of Kiln Drying",subtitle:"Conventional and Continuous Kilns, Moisture Content, and Why It Matters for Radiata Pine",type:"TIMBER PROCESSING",image:"category-untreated-timber.webp",sections:[["What this FPX Insight covers","This guide introduces conventional and continuous kiln drying, moisture content and why controlled drying is an important part of preparing Radiata pine for many commercial applications."],["Why moisture content matters","Moisture content is one of the practical product details buyers may need to consider alongside grade, treatment, dimensions and intended use."],["How this connects to sourcing","When moisture condition matters to a requirement, include it in the timber specification or request so FPX can review suitable product options."]]};return <><Breadcrumbs items={[["Home","/"],["FPX Insights","/industry-insights"],[article.title,`/${slug}`]]}/><article className="m-insight-article"><header className="m-insight-hero m-animate-in"><div><Eyebrow>{article.type}</Eyebrow><h1>{article.title}</h1><p>{article.subtitle}</p><div className="m-article-meta"><span>FPX INSIGHTS</span><span>FOREST PRODUCTS EXCHANGE</span></div></div><div><img src={`/images/${article.image}`} alt={`${article.title} by FPX`}/></div></header><div className="m-insight-body m-animate-in">{article.sections.map(([heading,copy])=><section key={heading}><h2>{heading}</h2><p>{copy}</p></section>)}<section className="m-related-links"><h2>Related FPX pages</h2><div><Link href="/timber">Explore the FPX timber range <Arrow/></Link><Link href="/fpx-sourcing">See how FPX sourcing works <Arrow/></Link><Link href="/contact-us">Ask FPX a timber question <Arrow/></Link></div></section></div></article><PageCTA/></>}
