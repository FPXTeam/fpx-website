"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "./site-shell";
import { productGroups, Eyebrow, Arrow, AppButtons } from "./master-shared";

function PremiumHero(){
  return <section className="ph-hero">
    <img className="ph-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard"/>
    <div className="ph-hero-shade"/>
    <div className="ph-hero-copy">
      <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
      <h1>Timber sourcing,<br/><span>made clearer.</span></h1>
      <p>Browse available timber, review current offers or send FPX a specific requirement. One clear starting point for commercial timber sourcing across New Zealand.</p>
      <AppButtons/>
    </div>
    <div className="ph-hero-note"><span>01</span><p>Built for commercial buyers who need clarity before commitment.</p></div>
    <div className="ph-hero-scroll">SCROLL TO EXPLORE</div>
  </section>
}

function RangeStory(){
  return <section className="ph-range">
    <div className="ph-range-intro">
      <Eyebrow>THE FPX TIMBER RANGE</Eyebrow>
      <h2>Start with the<br/>right product group.</h2>
      <p>Explore the range at a high level first. Then move into FPX for current stock, offers and detailed specifications.</p>
      <Link href="/products">Explore the full timber range <Arrow/></Link>
    </div>
    <div className="ph-range-list">
      {productGroups.map((group,i)=><Link href={`/${group[3]}`} className="ph-range-item" key={group[0]}>
        <div className="ph-range-image"><img src={`/images/${group[2]}`} alt={`${group[0]} timber product group`}/></div>
        <span>0{i+1}</span>
        <div className="ph-range-copy"><h3>{group[0]}</h3><p>{group[1]}</p><b>Explore <Arrow/></b></div>
      </Link>)}
    </div>
  </section>
}

function PlatformStory(){
  const screens=[
    {label:"SHOP",title:"See what’s available.",copy:"Browse available timber by category, grade and specification, then order directly when the right product is ready.",image:"fpx-app-shop.png",href:"https://app.fpx.nz/shop"},
    {label:"OFFERS",title:"See current opportunities.",copy:"Review current timber offers and enquire when the opportunity suits your volumes and requirements.",image:"fpx-app-offers.png",href:"https://app.fpx.nz/offers"},
    {label:"REQUESTS",title:"Tell FPX what you need.",copy:"Start with a catalogue product or send a custom requirement when the timber you need is more specific.",image:"fpx-app-requests.png",href:"https://app.fpx.nz/request-cart"}
  ];
  const [active,setActive]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setActive(v=>(v+1)%screens.length),5200);return()=>clearInterval(t)},[]);
  return <section className="ph-platform">
    <div className="ph-platform-head">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h2>Three ways in.<br/>One place to start.</h2>
      <p>You do not need to learn the whole platform before you begin. Start with the route that matches the job.</p>
      <Link href="/source-timber">See how FPX sourcing works <Arrow/></Link>
    </div>
    <div className="ph-platform-stage">
      <div className="ph-platform-screen">
        {screens.map((s,i)=><img className={i===active?"active":""} key={s.image} src={`/images/${s.image}`} alt={`${s.label} in the FPX platform`}/>)}
      </div>
      <div className="ph-platform-tabs">
        {screens.map((s,i)=><button className={i===active?"active":""} onClick={()=>setActive(i)} onMouseEnter={()=>setActive(i)} key={s.label}>
          <span>0{i+1}</span><small>{s.label}</small><h3>{s.title}</h3><p>{s.copy}</p><a href={s.href}>Start here <Arrow/></a>
        </button>)}
      </div>
    </div>
  </section>
}

function BuyerStory(){
  const groups=[
    ["Builders & Contractors","Project-specific timber for active jobs and upcoming work.","/images/fpx-customer-builder.png"],
    ["Procurement Teams","A clearer sourcing path for planned purchasing and recurring requirements.","/images/fpx-customer-procurement.png"],
    ["Timber Merchants","Additional stock, current offers and support for specific customer demand.","/images/fpx-customer-merchant.png"],
    ["Wood Processors","Feedstock and timber aligned with production specifications and required volumes.","/images/fpx-customer-processor.png"]
  ];
  return <section className="ph-buyers">
    <div className="ph-buyers-head"><Eyebrow>OUR CUSTOMERS</Eyebrow><h2>Built for businesses<br/>that buy timber.</h2><Link href="/our-customers">Meet our customers <Arrow/></Link></div>
    <div className="ph-buyers-grid">{groups.map((g,i)=><article key={g[0]}>
      <div className="ph-buyers-image"><img src={g[2]} alt={g[0]}/></div>
      <span>0{i+1}</span><h3>{g[0]}</h3><p>{g[1]}</p>
    </article>)}</div>
  </section>
}

function Closing(){
  return <section className="ph-close">
    <div><Eyebrow>START WITH FPX</Eyebrow><h2>Find the timber.<br/>Move with clarity.</h2><p>Browse available timber or send FPX the requirement you already have.</p></div>
    <AppButtons/>
  </section>
}

export function MasterHome(){return <Shell><main className="master-site premium-home"><PremiumHero/><RangeStory/><PlatformStory/><BuyerStory/><Closing/></main></Shell>}
