"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Shell } from "./site-shell";
import { productGroups, Eyebrow, Arrow, AppButtons, useSiteMotion } from "./master-shared";

function PremiumHero(){
  return <section className="ph-hero">
    <Image className="ph-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard" width={1920} height={1080} sizes="100vw" priority/>
    <div className="ph-hero-shade"/>
    <div className="ph-hero-copy">
      <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
      <h1>Timber sourcing,<br/><span className="headline-accent">made clearer.</span></h1>
      <p>Browse available timber, review current offers or send FPX a specific requirement. One clear starting point for commercial timber sourcing across New Zealand.</p>
      <AppButtons/>
    </div>
    <div className="ph-hero-scroll">SCROLL TO EXPLORE</div>
  </section>
}

function RangeStory(){
  return <section className="ph-range">
    <div className="ph-range-intro">
      <Eyebrow>THE FPX TIMBER RANGE</Eyebrow>
      <h2>Start with the<br/><span className="headline-accent">right product group.</span></h2>
      <p>Explore the range at a high level first. Then move into FPX for current stock, offers and detailed specifications.</p>
      <Link href="/timber">Explore the full timber range <Arrow/></Link>
    </div>
    <div className="ph-range-list">
      {productGroups.map((group,i)=><Link href={`/${group[3]}`} className="ph-range-item" key={group[0]}>
        <div className="ph-range-image"><Image src={`/images/${group[2]}`} alt={`${group[0]} timber product group`} width={1400} height={1000} sizes="(max-width: 800px) 100vw, 45vw"/></div>
        <span>0{i+1}</span>
        <div className="ph-range-copy"><h3>{group[0]}</h3><p>{group[1]}</p><b>Explore <Arrow/></b></div>
      </Link>)}
    </div>
  </section>
}

function PlatformStory(){
  const routes=[
    ["Browse Stock","Search available timber by category, grade and specification.","https://app.fpx.nz/shop","AVAILABLE TIMBER"],
    ["View Offers","Review current packet and bulk timber opportunities.","https://app.fpx.nz/offers","CURRENT OPPORTUNITIES"],
    ["Create a Request","Tell FPX what you need and receive suitable sourcing options.","https://app.fpx.nz/request-cart","EXACT REQUIREMENTS"]
  ];
  return <section className="ph-platform ph-platform-routes-only">
    <div className="ph-platform-head">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h2>Three ways in.<br/><span className="headline-accent">One place to start.</span></h2>
      <p>You do not need to learn the whole platform before you begin. Start with the route that matches the job.</p>
      <Link href="/fpx-sourcing">See how FPX sourcing works <Arrow/></Link>
    </div>
    <div className="fpx-route-showcase" aria-label="Ways to source timber through FPX">
      {routes.map((route,i)=><a href={route[2]} key={route[0]} className="fpx-route-card">
        <span>0{i+1}</span>
        <small>{route[3]}</small>
        <h3>{route[0]}</h3>
        <p>{route[1]}</p>
        <b>Start here <Arrow/></b>
      </a>)}
    </div>
  </section>
}

function BuyerStory(){
  const [active,setActive]=useState(0);
  const groups=[
    ["Builders & Contractors","Project-specific timber without the sourcing runaround.","fpx-customer-builder.png"],
    ["Procurement Teams","Clear timber options for planned purchasing and ongoing requirements.","fpx-customer-procurement.png"],
    ["Timber Merchants","Additional stock, current offers and support for specific customer demand.","fpx-customer-merchant.png"],
    ["Wood Processors","Timber sourcing aligned with production specifications and required volumes.","fpx-customer-processor.png"]
  ];
  return <section className="m-customers ph-customers-returned">
    <div className="m-customers-title"><Eyebrow>OUR CUSTOMERS</Eyebrow><h2>Built for businesses<br/><span className="headline-accent">that buy timber.</span></h2><Link href="/our-customers">Meet our customers <Arrow/></Link></div>
    <div className={`m-customer-stage active-${active+1}`} aria-label="Four New Zealand professionals who buy commercial timber">
      <div className="m-customer-people">{groups.map((g,i)=><button type="button" key={g[0]} className={`m-person-button ${i===active?"active":""}`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-label={`Show information for ${g[0]}`}>
        <Image className="m-person" src={`/images/${g[2]}`} alt={`${g[0]} using FPX for commercial timber sourcing`} width={700} height={1000} sizes="(max-width: 700px) 42vw, 22vw"/>
      </button>)}</div>
      <div className={`m-customer-panel panel-${active+1}`} aria-live="polite"><h3>{groups[active][0]}</h3><p>{groups[active][1]}</p></div>
      <p className="m-customer-instruction"><span className="instruction-hover">Hover to meet our customers</span><span className="instruction-tap">Tap to meet our customers</span></p>
    </div>
  </section>
}

function Closing(){
  return <section className="ph-close">
    <div><Eyebrow>START WITH FPX</Eyebrow><h2>Find the timber.<br/><span className="headline-accent">Move with clarity.</span></h2><p>Browse available timber or send FPX the requirement you already have.</p></div>
    <AppButtons/>
  </section>
}

export function MasterHome(){useSiteMotion();return <Shell><main className="master-site premium-home"><PremiumHero/><RangeStory/><PlatformStory/><BuyerStory/><Closing/></main></Shell>}
