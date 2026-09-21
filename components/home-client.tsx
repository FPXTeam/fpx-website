"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function ArrowIcon(){
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}

export function HomeMotion(){
  useEffect(()=>{
    const root=document.querySelector<HTMLElement>(".premium-home");
    if(!root)return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets=Array.from(root.querySelectorAll<HTMLElement>(":scope > section:not(.ph-hero), .ph-range-item"))
      .filter((el,index,self)=>self.indexOf(el)===index);
    root.classList.add("site-motion-ready");
    targets.forEach((el,index)=>{
      el.classList.add("site-reveal");
      el.style.setProperty("--site-reveal-delay",`${Math.min(index%4,3)*55}ms`);
    });
    if(reduced){
      targets.forEach(el=>el.classList.add("is-visible"));
      return()=>root.classList.remove("site-motion-ready");
    }
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.01,rootMargin:"0px 0px -7% 0px"});
    targets.forEach(el=>observer.observe(el));
    return()=>{observer.disconnect();root.classList.remove("site-motion-ready")};
  },[]);
  return null;
}

export function BuyerStory(){
  const [active,setActive]=useState(0);
  const groups=[
    ["Builders & Contractors","Project-specific timber without the sourcing runaround.","fpx-customer-builder.png"],
    ["Procurement Teams","Clear timber options for planned purchasing and ongoing requirements.","fpx-customer-procurement.png"],
    ["Timber Merchants","Additional stock, current offers and support for specific customer demand.","fpx-customer-merchant.png"],
    ["Wood Processors","Timber sourcing aligned with production specifications and required volumes.","fpx-customer-processor.png"]
  ];
  return <section className="m-customers ph-customers-returned">
    <div className="m-customers-title"><p className="m-eyebrow">OUR CUSTOMERS</p><h2>Built for businesses<br/><span className="headline-accent">that buy timber.</span></h2><Link href="/our-customers">Meet our customers <ArrowIcon/></Link></div>
    <div className={`m-customer-stage active-${active+1}`} aria-label="Four New Zealand professionals who buy commercial timber">
      <div className="m-customer-people">{groups.map((g,i)=><button type="button" key={g[0]} className={`m-person-button ${i===active?"active":""}`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-label={`Show information for ${g[0]}`} aria-pressed={active===i}>
        <Image className="m-person" src={`/images/${g[2]}`} alt={`${g[0]} using FPX for commercial timber sourcing`} width={700} height={1000} sizes="(max-width: 700px) 42vw, 22vw" quality={75}/>
      </button>)}</div>
      <div className={`m-customer-panel panel-${active+1}`} aria-live="polite"><h3>{groups[active][0]}</h3><p>{groups[active][1]}</p></div>
      <p className="m-customer-instruction"><span className="instruction-hover">Hover to meet our customers</span><span className="instruction-tap">Tap to meet our customers</span></p>
    </div>
  </section>;
}
