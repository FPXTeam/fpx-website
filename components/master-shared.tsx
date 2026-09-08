"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
export const productGroups = [
  ["Manufacturing","Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products.","product-groups/manufacturing/manufacturing-warehouse-bundles.png","manufacturing"],
  ["Building & Construction","Timber products for structural, building, finishing and specialist construction applications.","product-groups/building-construction/building-roof-framing.png","building-construction"],
  ["Outdoor & Landscaping","Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction.","product-groups/outdoor-landscaping/outdoor-slat-fence.png","outdoor-landscaping"],
  ["Dunnage","Timber dunnage for freight, shipping, load support and industrial transport applications.","product-groups/dunnage/dunnage-stamped-stack.png","dunnage"],
];

export const pageData: Record<string,{eyebrow:string;title:string;intro:string}> = {
  "products": {eyebrow:"OUR TIMBER RANGE",title:"Timber for the work New Zealand does.",intro:"Explore FPX product groups and the categories within them, then move into FPX for current stock, offers and detailed specifications."},
  "manufacturing": {eyebrow:"PRODUCT GROUP",title:"Manufacturing",intro:"Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products."},
  "building-construction": {eyebrow:"PRODUCT GROUP",title:"Building & Construction",intro:"Timber products for structural, building, finishing and specialist construction applications."},
  "outdoor-landscaping": {eyebrow:"PRODUCT GROUP",title:"Outdoor & Landscaping",intro:"Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction."},
  "dunnage": {eyebrow:"PRODUCT GROUP",title:"Dunnage",intro:"Timber dunnage for freight, shipping, load support and industrial transport applications."},
  "source-timber": {eyebrow:"SOURCE TIMBER THROUGH FPX",title:"Find the timber your project needs.",intro:"Browse available stock and current offers, or send FPX your exact requirements. We keep the sourcing process clear from product selection through to delivery."},
  "how-fpx-works": {eyebrow:"HOW FPX WORKS",title:"Three ways to start. One supported process.",intro:"Shop available timber, review current offers or create a detailed request. FPX keeps the next steps connected."},
  "our-customers": {eyebrow:"OUR CUSTOMERS",title:"Built for businesses that buy timber.",intro:"FPX serves commercial timber buyers across New Zealand, from project teams to merchants and processors."},
  "saw-point": {eyebrow:"FPX PRESENTS",title:"Saw Point.",intro:"Straight talk on New Zealand timber. No sawdust. Selected industry news, market updates and developments worth paying attention to."},
  "industry-resources": {eyebrow:"FPX INSIGHTS",title:"Practical timber knowledge for New Zealand buyers.",intro:"FPX Insights explains timber characteristics, processing, specifications and sourcing topics for commercial timber buyers in New Zealand."},
  "faq": {eyebrow:"FPX SOURCING FAQ",title:"Questions about sourcing timber through FPX.",intro:"Direct answers for New Zealand timber buyers about browsing stock, current offers, product requests, orders and support."},
  "frequently-asked-questions": {eyebrow:"FPX SOURCING FAQ",title:"Questions about sourcing timber through FPX.",intro:"Direct answers for New Zealand timber buyers about browsing stock, current offers, product requests, orders and support."},
  "timber-growth-rings": {eyebrow:"FPX INSIGHTS",title:"Radiata Pine Characteristics",intro:"How growth and environment shape timber in New Zealand."},
  "the-science-of-kiln-drying": {eyebrow:"FPX INSIGHTS",title:"The Science of Kiln Drying",intro:"Conventional and continuous kilns, moisture content, and why it matters for Radiata pine."},
  "about-us": {eyebrow:"ABOUT FPX",title:"A better sourcing experience, built around timber.",intro:"Forest Products Exchange Limited operates FPX, a New Zealand timber sourcing platform for commercial buyers, supported by industry experience and the Sutcliffe Trading team."},
  "contact-us": {eyebrow:"CONTACT FPX",title:"What timber are you looking for?",intro:"Tell us what you need, ask a sourcing question or get help choosing the right way to start."},
  "terms-and-conditions": {eyebrow:"FPX LEGAL",title:"Terms and Conditions",intro:"Forest Products Exchange Limited"},
  "privacy-policy": {eyebrow:"FPX LEGAL",title:"Privacy Policy",intro:"Forest Products Exchange Limited"},
};

export const masterPages = Object.keys(pageData);

export function useParallax(){
  useEffect(()=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update=()=>{
      document.querySelectorAll<HTMLElement>("[data-master-parallax]").forEach(el=>{
        const r=el.getBoundingClientRect();
        const speed=Number(el.dataset.speed||.08);
        const y=(window.innerHeight/2-(r.top+r.height/2))*speed;
        el.style.setProperty("--parallax-y",`${Math.max(-90,Math.min(90,y))}px`);
      });
      document.querySelectorAll<HTMLElement>("[data-horizontal-scroll]").forEach(track=>{
        const section=track.closest<HTMLElement>(".m-category-pocket");
        if(!section) return;
        const windowEl=track.parentElement;
        const max=Math.max(0,track.scrollWidth-(windowEl?.clientWidth||0)+80);
        if(window.innerWidth>700){section.style.height=`${window.innerHeight+max+80}px`;}else{section.style.height="auto";}
        const r=section.getBoundingClientRect();
        const travel=Math.max(1,r.height-window.innerHeight);
        const progress=Math.max(0,Math.min(1,-r.top/travel));
        track.style.setProperty("--horizontal-x",`${-progress*max}px`);
      });
      frame=0;
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
    update(); window.addEventListener("scroll",onScroll,{passive:true}); window.addEventListener("resize",onScroll,{passive:true});
    return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll);if(frame)cancelAnimationFrame(frame)};
  },[]);
}

export const Eyebrow=({children}:{children:React.ReactNode})=><p className="m-eyebrow">{children}</p>;
export const Arrow=()=> <ArrowRight aria-hidden="true" size={17}/>;
export const AppButtons=()=> <div className="m-actions"><a className="m-btn m-btn-primary" href="https://app.fpx.nz/shop">Browse timber <Arrow/></a><a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a></div>;
export const Breadcrumbs=({items}:{items:[string,string][]})=><nav className="m-breadcrumbs" aria-label="Breadcrumb">{items.map(([label,href],i)=><span key={href}>{i>0&&<b>/</b>}{i===items.length-1?<span aria-current="page">{label}</span>:<Link href={href}>{label}</Link>}</span>)}</nav>;
export function LightCTA(){return <section className="m-cta"><div className="m-cta-panel"><div className="m-cta-lines"/><div className="m-cta-content"><Eyebrow>START SOURCING</Eyebrow><h2>Ready to source <em>smarter?</em></h2><p>Browse available timber or tell FPX exactly what you need.</p><AppButtons/></div><img className="m-cta-x" src="/images/fpx-logo-x-original.png" alt="FPX"/></div></section>;}
export function InnerHero({slug}:{slug:string}){const d=pageData[slug] ?? pageData["source-timber"];const image=slug==="our-customers"?"customer-buyers.webp":slug==="source-timber"?"category-manufacturing-grades.webp":slug==="about-us"?"fpx-hero-timber-yard.webp":"category-structural-timber.webp";return <section className={`m-inner-hero hero-${slug} m-animate-in`}><div><Eyebrow>{d.eyebrow}</Eyebrow><h1>{d.title}</h1><p>{d.intro}</p>{!["faq","saw-point","industry-resources","terms-and-conditions","privacy-policy"].includes(slug)&&<AppButtons/>}</div>{!['terms-and-conditions','privacy-policy','faq','saw-point','industry-resources','contact-us'].includes(slug)&&<div className="m-inner-visual"><img src={`/images/${image}`} alt={`${d.title} in the New Zealand timber sector`}/>{slug!=="how-fpx-works"&&<span>{d.eyebrow}</span>}</div>}</section>;}
export function PageCTA(){return <LightCTA/>}
export function SourcePageCTA(){return <section className="m-cta m-source-cta"><div className="m-cta-panel"><div className="m-cta-lines"/><div className="m-cta-content"><Eyebrow>START SOURCING</Eyebrow><h2>Ready to source <em>smarter?</em></h2><p>Browse available timber or tell FPX exactly what you need.</p><div className="m-source-cta-proof"><span>Searchable catalogue</span><span>Current offers</span><span>Trading-desk expertise</span></div><AppButtons/></div><img className="m-cta-x" src="/images/fpx-logo-x-original.png" alt="FPX"/></div></section>}
