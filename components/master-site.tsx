"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { Shell } from "./site-shell";

const productGroups = [
  ["Manufacturing","Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products.","category-manufacturing-grades.webp","manufacturing"],
  ["Building & Construction","Timber products for structural, building, finishing and specialist construction applications.","category-structural-timber.webp","building-construction"],
  ["Outdoor & Landscaping","Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction.","category-outdoor-timber.webp","outdoor-landscaping"],
  ["Dunnage","Timber dunnage for freight, shipping, load support and industrial transport applications.","category-untreated-timber.webp","dunnage"],
];


const pageData: Record<string,{eyebrow:string;title:string;intro:string}> = {
  "products": {eyebrow:"OUR TIMBER RANGE",title:"Timber for the work New Zealand does.",intro:"Explore FPX product groups and the categories within them, then move into FPX for current stock, offers and detailed specifications."},
  "manufacturing": {eyebrow:"PRODUCT GROUP",title:"Manufacturing",intro:"Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products."},
  "building-construction": {eyebrow:"PRODUCT GROUP",title:"Building & Construction",intro:"Timber products for structural, building, finishing and specialist construction applications."},
  "outdoor-landscaping": {eyebrow:"PRODUCT GROUP",title:"Outdoor & Landscaping",intro:"Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction."},
  "dunnage": {eyebrow:"PRODUCT GROUP",title:"Dunnage",intro:"Timber dunnage for freight, shipping, load support and industrial transport applications."},
  "source-timber": {eyebrow:"SOURCE TIMBER THROUGH FPX",title:"Find the timber your project needs.",intro:"Browse available stock and current offers, or send FPX your exact requirements. We keep the sourcing process clear from product selection through to delivery."},
  "how-fpx-works": {eyebrow:"HOW FPX WORKS",title:"Three ways to start. One supported process.",intro:"Shop available timber, review current offers or create a detailed request. FPX keeps the next steps connected."},
  "our-customers": {eyebrow:"OUR CUSTOMERS",title:"Built for businesses that buy timber.",intro:"FPX serves commercial timber buyers across New Zealand—from project teams to merchants and processors."},
  "saw-point": {eyebrow:"FPX PRESENTS",title:"Saw Point.",intro:"Straight talk on New Zealand timber—no sawdust. Industry news, market updates and a direct read on what is happening."},
  "industry-resources": {eyebrow:"INDUSTRY RESOURCES",title:"Timber knowledge, without the runaround.",intro:"Practical guides on products, specifications and the New Zealand timber market."},
  "faq": {eyebrow:"FPX SOURCING FAQ",title:"Questions, answered.",intro:"Clear answers about finding, requesting and buying timber through FPX."},
  "about-us": {eyebrow:"ABOUT FPX",title:"A better sourcing experience, built around timber.",intro:"FPX is a New Zealand timber sourcing platform supported by people who understand the trade."},
  "contact-us": {eyebrow:"CONTACT FPX",title:"What timber are you looking for?",intro:"Tell us what you need, ask a sourcing question or get help choosing the right way to start."},
  "terms-and-conditions": {eyebrow:"FPX LEGAL",title:"Terms and Conditions",intro:"Forest Products Exchange Limited"},
  "privacy-policy": {eyebrow:"FPX LEGAL",title:"Privacy Policy",intro:"Forest Products Exchange Limited"},
};

export const masterPages = Object.keys(pageData);

function useParallax(){
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
        if(window.innerWidth>700){
          section.style.height=`${window.innerHeight+max+80}px`;
        }else{
          section.style.height="auto";
        }
        const r=section.getBoundingClientRect();
        const travel=Math.max(1,r.height-window.innerHeight);
        const progress=Math.max(0,Math.min(1,-r.top/travel));
        track.style.setProperty("--horizontal-x",`${-progress*max}px`);
      });
      frame=0;
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
    update(); window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onScroll,{passive:true});
    return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll);if(frame)cancelAnimationFrame(frame)};
  },[]);
}

const Eyebrow=({children}:{children:React.ReactNode})=><p className="m-eyebrow">{children}</p>;
const Arrow=()=> <ArrowRight aria-hidden="true" size={17}/>;
const AppButtons=()=> <div className="m-actions"><a className="m-btn m-btn-primary" href="https://app.fpx.nz/shop">Browse timber <Arrow/></a><a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a></div>;

function MasterHero(){
  return <section className="m-hero">
    <img className="m-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard" data-master-parallax data-speed=".35"/>
    <div className="m-hero-shade"/>
    <div className="m-hero-copy">
      <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
      <h1>A better way to source <em>New Zealand Timber</em></h1>
      <p>Browse available stock, discover current offers, or tell us what you need. FPX brings timber sourcing into one clear, supported process.</p>
      <AppButtons/>
    </div>
    <nav className="m-entry-float" aria-label="FPX sourcing entry points">
      <a href="https://app.fpx.nz/shop" data-master-parallax data-speed=".055"><span>01</span><div><b>Shop</b><small>Browse available timber</small></div><ArrowUpRight size={14}/></a>
      <a href="https://app.fpx.nz/offers" data-master-parallax data-speed=".085"><span>02</span><div><b>Offers</b><small>See current opportunities</small></div><ArrowUpRight size={14}/></a>
      <a href="https://app.fpx.nz/request-cart" data-master-parallax data-speed=".12"><span>03</span><div><b>Request</b><small>Tell FPX what you need</small></div><ArrowUpRight size={14}/></a>
    </nav>
    <div className="m-scroll-cue"><i/> Scroll to explore</div>
    <div className="m-hero-edge" aria-hidden="true"/>
  </section>;
}

function CategoryPocket({compact=false}:{compact?:boolean}){
  return <section className={`m-category-pocket ${compact?"is-compact":""}`}>
    <div className="m-category-pin">
      <div className="m-category-copy">
        <Eyebrow>EXPLORE OUR TIMBER RANGE</Eyebrow>
        <h2>Timber by product group.</h2>
        <p>Understand the range first, then move into FPX for current stock, offers and full specifications.</p>
        <Link href="/products">View the full timber range <Arrow/></Link>
      </div>
      <div className="m-category-window">
        <div className="m-category-track" data-horizontal-scroll>
          {productGroups.map((c,i)=><Link href={`/${c[3]}`} className={`m-category-card card-${i+1}`} key={c[0]} data-master-parallax data-speed={.035+(i%3)*.02}>
            <div className="m-category-image"><img src={`/images/${c[2]}`} alt=""/></div>
            <div className="m-category-card-copy"><h3>{c[0]}</h3><p>{c[1]}</p><b>Explore product group <Arrow/></b></div>
          </Link>)}
        </div>
      </div>
    </div>
  </section>;
}

function SourceWays(){
  return <section className="m-source-ways">
    <div className="m-section-heading m-section-heading-centered"><Eyebrow>HOW TO SOURCE</Eyebrow><h2>Three ways in. <em>One clear process.</em></h2><p>Start with what you already know.</p></div>
    <PlatformShowcase/>
  </section>;
}

function PlatformShowcase(){
  const [active,setActive]=useState(0);
  const screens=[
    ["Browse Stock","Search available timber by category, grade and specification.","fpx-app-shop.png","https://app.fpx.nz/shop","AVAILABLE TIMBER"],
    ["View Offers","Review current packet and bulk timber opportunities.","fpx-app-offers.png","https://app.fpx.nz/offers","CURRENT OPPORTUNITIES"],
    ["Create a Request","Tell FPX what you need and receive suitable sourcing options.","fpx-app-requests.png","https://app.fpx.nz/request-cart","EXACT REQUIREMENTS"],
  ];
  useEffect(()=>{const t=setInterval(()=>setActive(v=>(v+1)%screens.length),4800);return()=>clearInterval(t)},[]);
  return <div className="m-source-platform">
    <div className="m-laptop-wrap" data-master-parallax data-speed=".035">
      <div className="m-laptop-glow"/>
      <div className="m-laptop-screen">
        {screens.map((s,i)=><img key={s[0]} className={i===active?"active":""} src={`/images/${s[2]}`} alt={`${s[0]} view in the FPX platform`}/>)}
      </div>
      <img className="m-laptop-frame" src="/images/fpx-laptop-frame.png" alt="FPX sourcing platform displayed on a laptop"/>
      <div className="m-laptop-status"><span>LIVE PLATFORM VIEW</span><b>{screens[active][0]}</b></div>
    </div>
    <div className="m-source-cards" aria-label="Ways to source timber through FPX">
      {screens.map((s,i)=><a href={s[3]} key={s[0]} className={i===active?"active":""} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)}>
        <small>{s[4]}</small><h3>{s[0]}</h3><p>{s[1]}</p><b>Start here <Arrow/></b><i aria-hidden="true"/>
      </a>)}
    </div>
  </div>;
}

function HowFpxWorks(){
  const steps=[
    ["Tell us what you need","Share your timber requirements, quantities and key specifications."],
    ["FPX sources suitable options","We review the requirement and identify suitable timber options."],
    ["Review and choose","Compare the available options and decide what works for your project."],
    ["We coordinate the order","FPX keeps order progress and delivery information connected."],
  ];
  return <section className="m-how-works">
    <div className="m-how-heading"><Eyebrow>HOW FPX WORKS</Eyebrow><h2>From requirement<br/>to <em>delivery.</em></h2><p>FPX makes timber sourcing simpler, with clear steps from your first requirement through to delivery.</p></div>
    <div className="m-how-steps">{steps.map(s=><article key={s[0]}><h3>{s[0]}</h3><p>{s[1]}</p></article>)}</div>
  </section>;
}

function CustomersCinematic(){
  const [active,setActive]=useState(0);
  const groups=[
    ["Builders & Contractors","Project-specific timber without the sourcing runaround.","fpx-customer-builder.png"],
    ["Procurement Teams","Clear timber options for planned purchasing and ongoing requirements.","fpx-customer-procurement.png"],
    ["Timber Merchants","Additional stock, current offers and support for specific customer demand.","fpx-customer-merchant.png"],
    ["Wood Processors","Timber sourcing aligned with production specifications and required volumes.","fpx-customer-processor.png"],
  ];
  return <section className="m-customers">
    <div className="m-customers-title"><Eyebrow>OUR CUSTOMERS</Eyebrow><h2>Built for businesses<br/>that buy timber.</h2><Link href="/our-customers">Meet our customers <Arrow/></Link></div>
    <div className={`m-customer-stage active-${active+1}`} aria-label="Four New Zealand professionals who buy commercial timber">
      <div className="m-customer-people">
        {groups.map((g,i)=><button key={g[0]} className={`m-person-button ${i===active?"active":""}`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-label={`Show information for ${g[0]}`} data-master-parallax data-speed={.018+i*.008}><img className="m-person" src={`/images/${g[2]}`} alt=""/></button>)}
      </div>
      <div className={`m-customer-panel panel-${active+1}`} aria-live="polite"><h3>{groups[active][0]}</h3><p>{groups[active][1]}</p></div>
      <p className="m-customer-instruction"><span className="instruction-hover">Hover to meet our customers</span><span className="instruction-tap">Tap to meet our customers</span></p>
    </div>
  </section>;
}

function LightCTA(){
  return <section className="m-cta">
    <div className="m-cta-panel"><div className="m-cta-lines"/><div className="m-cta-content"><Eyebrow>START SOURCING</Eyebrow><h2>Ready to source <em>smarter?</em></h2><p>Browse available timber or tell FPX exactly what you need.</p><AppButtons/></div>
    <img className="m-cta-x" src="/images/fpx-mark-circle.png" alt="FPX"/></div>
  </section>;
}

export function MasterHome(){useParallax();return <Shell><main className="master-site"><MasterHero/><CategoryPocket/><SourceWays/><HowFpxWorks/><CustomersCinematic/><LightCTA/></main></Shell>}

function InnerHero({slug}:{slug:string}){
  const d=pageData[slug] ?? pageData["source-timber"];
  const image=slug==="our-customers"?"customer-buyers.webp":slug==="source-timber"?"category-manufacturing-grades.webp":slug==="about-us"?"fpx-hero-timber-yard.webp":"category-structural-timber.webp";
  return <section className={`m-inner-hero hero-${slug}`}>
    <div><Eyebrow>{d.eyebrow}</Eyebrow><h1>{d.title}</h1><p>{d.intro}</p>{!["faq","saw-point","industry-resources","terms-and-conditions","privacy-policy"].includes(slug)&&<AppButtons/>}</div>
    {!['terms-and-conditions','privacy-policy','faq','saw-point','industry-resources','contact-us'].includes(slug)&&<div className="m-inner-visual"><img src={`/images/${image}`} alt=""/>{slug!=="how-fpx-works"&&<span>{d.eyebrow}</span>}</div>}
  </section>;
}

function PageCTA(){return <LightCTA/>}
function SourcePageCTA(){return <section className="m-cta m-source-cta"><div className="m-cta-panel"><div className="m-cta-lines"/><div className="m-cta-content"><Eyebrow>START SOURCING</Eyebrow><h2>Ready to source <em>smarter?</em></h2><p>Browse available timber or tell FPX exactly what you need.</p><div className="m-source-cta-proof"><span>Searchable catalogue</span><span>Current offers</span><span>Trading-desk expertise</span></div><AppButtons/></div><img className="m-cta-x" src="/images/fpx-mark-circle.png" alt="FPX"/></div></section>}

function SourceJourney(){
  const stages=[
    {label:"START",title:"Start where the job starts.",copy:"Shop available stock, review current offers or send a specific request. There is no wrong place to begin.",image:"category-structural-timber.webp",links:[["Browse available stock","https://app.fpx.nz/shop"],["Review current offers","https://app.fpx.nz/offers"],["Request specific timber","https://app.fpx.nz/request-cart"]]},
    {label:"SPECIFY",title:"Shape the requirement.",copy:"Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier.",image:"category-appearance-grades.webp"},
    {label:"CHOOSE",title:"Choose what fits.",copy:"Review the timber options and the information around them, then choose the route that works for your team.",image:"category-treated-timber.webp"},
    {label:"MANAGE",title:"Keep the order moving.",copy:"Keep orders, deliveries and repeat purchases connected after the initial request.",image:"category-manufacturing-grades.webp",features:[["My Orders","Track progress from pending approval through to complete."],["My Deliveries","Keep dispatch dockets, dispatched items and destinations together."],["Previously Ordered","Request the same product again without starting from scratch."]]}
  ];
  const [active,setActive]=useState(0);
  useEffect(()=>{const nodes=[...document.querySelectorAll<HTMLElement>("[data-mill-stop]")];if(!nodes.length)return;const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)setActive(Number((entry.target as HTMLElement).dataset.millStop||0))}),{threshold:.2,rootMargin:"-43% 0px -43%"});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect()},[]);
  return <section className="m-mill-story">
    <div className="m-mill-story-sticky">
      <div className="m-mill-story-heading"><Eyebrow>THE FPX SOURCING JOURNEY</Eyebrow><h2>From requirement<br/><em>to repeat order.</em></h2><p>Follow one continuous sourcing line. Scroll, click a station or use the markers on the timber.</p></div>
      <div className="m-mill-stage" aria-live="polite">
        <div className="m-mill-copy">
          {stages.map((stage,i)=><article key={stage.label} className={i===active?"is-active":""} aria-hidden={i!==active}><small>{stage.label}</small><h3>{stage.title}</h3><p>{stage.copy}</p>{stage.links&&<div className="m-mill-links">{stage.links.map(([text,href])=><a key={text} href={href}>{text}<Arrow/></a>)}</div>}{stage.features&&<div className="m-mill-features">{stage.features.map(([title,copy])=><div key={title}><b>{title}</b><span>{copy}</span></div>)}</div>}</article>)}
        </div>
        <div className="m-mill-visual">
          {stages.map((stage,i)=><img key={stage.image} className={i===active?"is-active":""} src={`/images/${stage.image}`} alt="New Zealand timber products"/>) }
          <div className="m-mill-visual-tag"><span>FPX SOURCING</span><b>{stages[active].label}</b></div>
        </div>
      </div>
      <div className="m-mill-line">
        <div className="m-mill-beam">
          <div className="m-mill-beam-fill" style={{width:`${12.5+active*25}%`}}/>
          {stages.map((stage,i)=><button key={stage.label} className={i===active?"is-active":i<active?"is-complete":""} type="button" onClick={()=>setActive(i)}><span/>{stage.label}</button>)}
          <div className="m-mill-carriage" style={{left:`${12.5+active*25}%`}}><img src="/images/fpx-mark.png" alt=""/></div>
        </div>
        <p><span/>Scroll to move timber through the sourcing line</p>
      </div>
    </div>
    <div className="m-mill-stops" aria-hidden="true">{stages.map((stage,i)=><div key={stage.label} data-mill-stop={i}/>)}</div>
  </section>;
}

function SourceTimberPage(){
  return <>
    <section className="m-source-hero">
      <div className="m-source-hero-copy"><Eyebrow>SOURCE TIMBER THROUGH FPX</Eyebrow><h1>Find the timber<br/><em>your project needs.</em></h1><p>Browse available stock and current offers, or send FPX your exact requirements. We keep the sourcing process clear from product selection through to delivery.</p><AppButtons/></div>
      <div className="m-source-hero-visual" data-master-parallax data-speed=".12"><img src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard"/></div>
    </section>
    <SourceJourney/>
    <SourcePageCTA/>
  </>
}


const productGroupDetails: Record<string,{
  title:string;
  description:string;
  hero:string;
  gallery:string[];
  categories:string[];
  examples?:string[];
  note:string;
}> = {
  "manufacturing": {
    title:"Manufacturing",
    description:"Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products.",
    hero:"category-manufacturing-grades.webp",
    gallery:["category-manufacturing-grades.webp","category-appearance-grades.webp","category-untreated-timber.webp"],
    categories:["Manufacturing Timber"],
    examples:["Clear 1","Clear 2","Mixed Clears","Dressing","Premium","Cuttings 1","Cuttings 2","Cuttings 3","COL","Merch","Industrial"],
    note:"The manufacturing range spans multiple grades and feedstock options. Individual grades, sizes and live specifications remain in FPX."
  },
  "building-construction": {
    title:"Building & Construction",
    description:"Timber products for structural, building, finishing and specialist construction applications.",
    hero:"category-structural-timber.webp",
    gallery:["category-structural-timber.webp","category-appearance-grades.webp","category-treated-timber.webp"],
    categories:["Structural Timber","Weatherboards","House Piles","Ceiling Battens","Tile Battens","Mouldings","Fascia","Scaffold Planks","Soleboards","Kickboards","Stair Treads"],
    note:"A broad construction range covering structural requirements, finishing timber and specialist site applications."
  },
  "outdoor-landscaping": {
    title:"Outdoor & Landscaping",
    description:"Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction.",
    hero:"category-outdoor-timber.webp",
    gallery:["category-outdoor-timber.webp","category-treated-timber.webp","category-structural-timber.webp"],
    categories:["Outdoor","Posts","Rails","Palings","Decking","Retaining Boards","Sleepers, Squares & Beams","Screening","Pickets","Capping","Fence Battens","Trellis Battens","Roundwood","Pegs"],
    note:"The range supports everything from fences and decks to retaining structures and larger outdoor works."
  },
  "dunnage": {
    title:"Dunnage",
    description:"Timber dunnage for freight, shipping, load support and industrial transport applications.",
    hero:"category-untreated-timber.webp",
    gallery:["category-untreated-timber.webp","category-manufacturing-grades.webp","fpx-hero-timber-yard.webp"],
    categories:["Dunnage"],
    examples:["Freight support","Shipping and container loading","Industrial transport","Load separation","Storage and handling"],
    note:"Dunnage timber is supplied for practical load support and protection across freight, shipping and industrial transport environments."
  }
};

const endUses = [
  ["Fencing","Palings · Posts · Rails · Fence Capping · Pegs","category-outdoor-timber.webp"],
  ["Retaining","Posts · Retaining Boards · Sleepers · Squares & Beams","category-treated-timber.webp"],
  ["Decking","Decking Boards · Balustrade Timber · Posts · Rails","category-appearance-grades.webp"],
  ["Commercial projects","Bridges · Boardwalks · Specialist outdoor structures","category-structural-timber.webp"],
];

function ProductsPage(){
  return <>
    <section className="m-products-hero">
      <div className="m-products-hero-copy"><Eyebrow>OUR TIMBER RANGE</Eyebrow><h1>Products first.<br/><em>Specifications in FPX.</em></h1><p>Explore the main product groups and the categories we supply. When you need grades, sizes, treatment details, stock or pricing, move directly into FPX.</p></div>
      <div className="m-products-hero-image"><img src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber products in a commercial yard"/></div>
    </section>
    <section className="m-product-groups">
      <div className="m-product-groups-head"><Eyebrow>PRODUCT GROUPS</Eyebrow><h2>Four clear ways to understand the range.</h2><p>Each group reflects what the timber is supplied for—not every individual grade or specification.</p></div>
      <div className="m-product-groups-grid">
        {productGroups.map((group,i)=><Link href={`/${group[3]}`} key={group[0]} className="m-product-group-card">
          <div className="m-product-group-image"><img src={`/images/${group[2]}`} alt=""/><span>0{i+1}</span></div>
          <div className="m-product-group-copy"><small>PRODUCT GROUP</small><h3>{group[0]}</h3><p>{group[1]}</p><b>View range <Arrow/></b></div>
        </Link>)}
      </div>
    </section>
    <section className="m-end-uses">
      <div className="m-end-uses-intro"><Eyebrow>END USES / APPLICATIONS</Eyebrow><h2>What the timber<br/><em>can be used for.</em></h2><p>Applications sit separately from Product Categories so buyers can explore by job without changing the underlying product structure.</p></div>
      <div className="m-end-uses-list">{endUses.map((use,i)=><article key={use[0]}><div className="m-end-use-image"><img src={`/images/${use[2]}`} alt=""/><span>0{i+1}</span></div><div><h3>{use[0]}</h3><p>{use[1]}</p></div></article>)}</div>
    </section>
    <SourcePageCTA/>
  </>
}

function ProductGroupPage({slug}:{slug:string}){
  const group=productGroupDetails[slug];
  return <>
    <section className="m-product-detail-hero">
      <div className="m-product-detail-copy"><Eyebrow>PRODUCT GROUP</Eyebrow><span className="m-product-detail-number">{["manufacturing","building-construction","outdoor-landscaping","dunnage"].indexOf(slug)+1}</span><h1>{group.title}</h1><p>{group.description}</p><div className="m-product-detail-actions"><a href="https://app.fpx.nz/shop" className="m-btn m-btn-primary">Browse current timber <Arrow/></a><a href="https://app.fpx.nz/request-cart" className="m-text-link">Request a product <Arrow/></a></div></div>
      <div className="m-product-detail-hero-image"><img src={`/images/${group.hero}`} alt={`${group.title} timber`}/></div>
    </section>
    <section className="m-product-gallery" aria-label={`${group.title} product imagery`}>
      {group.gallery.map((image,i)=><div key={`${image}-${i}`} className={`gallery-${i+1}`}><img src={`/images/${image}`} alt=""/></div>)}
    </section>
    <section className="m-product-catalogue">
      <div className="m-product-catalogue-intro"><Eyebrow>WHAT WE SUPPLY</Eyebrow><h2>{group.categories.length===1?"The product group.":"Product categories."}</h2><p>{group.note}</p></div>
      <div className={`m-product-category-list ${group.categories.length===1?"is-single":""}`}>{group.categories.map((category,i)=><div key={category}><span>{String(i+1).padStart(2,"0")}</span><b>{category}</b></div>)}</div>
    </section>
    {group.examples&&<section className="m-product-examples"><div><Eyebrow>{slug==="manufacturing"?"EXAMPLES ACROSS THE RANGE":"TYPICAL APPLICATIONS"}</Eyebrow><h2>{slug==="manufacturing"?"Breadth without the specification overload.":"Built around practical transport needs."}</h2></div><div>{group.examples.map(item=><span key={item}>{item}</span>)}</div></section>}
    <section className="m-product-fpx-note"><div><Eyebrow>FULL PRODUCT DETAIL LIVES IN FPX</Eyebrow><h2>Need the grade, size or specification?</h2><p>Use the website to understand the range. Use FPX to work with the actual products, available stock, current offers and detailed specifications.</p></div><AppButtons/></section>
  </>
}

function HowPage(){
  const steps=[
    ["Start where you are","Shop available stock, review current offers or send a specific request. There is no wrong place to begin."],
    ["Share the detail","Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier."],
    ["Choose what fits","Review the timber options and the information around them, then choose the route that works for your team."],
    ["Keep it moving","FPX keeps the order and delivery path connected so your team can follow the handover through to site."],
  ];
  return <><InnerHero slug="how-fpx-works"/><section className="m-how-page-flow"><div className="m-how-page-intro"><Eyebrow>WHAT HAPPENS NEXT</Eyebrow><h2>From requirement<br/><em>to delivery.</em></h2><p>Once you start, FPX keeps the practical details moving—from the first specification through to the final handover.</p></div><div className="m-how-page-cards">{steps.map((s,i)=><article key={s[0]}><div className="m-how-page-marker" aria-hidden="true"/><div><small>{["BEGIN","DETAIL","DECIDE","DELIVER"][i]}</small><h3>{s[0]}</h3><p>{s[1]}</p></div></article>)}</div></section><PageCTA/></>;
}

function CustomersPage(){
  const groups=[["Contractors & builders","Timber for active jobs, upcoming projects and specific applications.","category-structural-timber.webp"],["Procurement teams","Clear specifications and supported sourcing for commercial requirements.","category-treated-timber.webp"],["Timber merchants","Ongoing product needs, spot requirements and supply opportunities.","category-manufacturing-grades.webp"],["Wood processors","Feedstock and timber products aligned with manufacturing needs.","category-untreated-timber.webp"]];
  return <><InnerHero slug="our-customers"/><section className="m-customer-stories"><div className="m-section-heading"><Eyebrow>WHO USES FPX</Eyebrow><h2>Different requirements.<br/><em>One clearer route to supply.</em></h2></div>{groups.map((g,i)=><article key={g[0]}><div><img src={`/images/${g[2]}`} alt=""/></div><span>0{i+1}</span><h3>{g[0]}</h3><p>{g[1]}</p><a href="https://app.fpx.nz/shop">Start sourcing <Arrow/></a></article>)}</section><section className="m-manifesto"><Eyebrow>BUILT AROUND BUYERS</Eyebrow><p>Clear product information. Flexible starting points. Timber knowledge when it matters.</p></section><PageCTA/></>;
}

function SawPointPage(){return <><section className="m-saw-hero"><Eyebrow>FPX PRESENTS</Eyebrow><h1>Saw Point<span>.</span></h1><h2>Straight talk on NZ timber—no sawdust.</h2><p>Monthly industry news, market updates and a direct read on what is happening.</p><small>WRITTEN BY GEORGE HARMAN · FPX</small></section><section className="m-subscribe"><div><span>THE NEXT ISSUE</span><h2>Get Saw Point in your inbox.</h2><p>One useful read. No clutter.</p></div><form><input placeholder="Your name"/><input type="email" placeholder="Email address"/><button>Subscribe <Arrow/></button></form></section><section className="m-archive"><Eyebrow>THE ARCHIVE</Eyebrow><h2>Previous issues.</h2><article><div className="m-issue-cover"><span>SAW<br/>POINT.</span><small>ISSUE 001</small></div><div><span>AUGUST 2026</span><h3>Issue 001</h3><p>New Zealand timber news, market movement and what matters next.</p></div><a href="#">Read issue <Arrow/></a></article></section><PageCTA/></>}

function ResourcesPage(){const items=[["Radiata pine characteristics","How growth and environment shape timber in New Zealand.","category-appearance-grades.webp"],["The science of kiln drying","Moisture content and why it matters for Radiata pine.","category-untreated-timber.webp"],["Understanding treatment classes","A practical guide to matching timber with its application.","category-treated-timber.webp"],["Nominal vs finished size","Specify dimensions with fewer surprises.","category-manufacturing-grades.webp"]];return <><section className="m-resource-hero"><Eyebrow>INDUSTRY RESOURCES</Eyebrow><h1>Timber knowledge,<br/><em>without the runaround.</em></h1><div className="m-resource-search"><Search/><input placeholder="Search guides, products or topics"/><button>Search</button></div></section><section className="m-resource-grid">{items.map((x,i)=><article key={x[0]}><div><img src={`/images/${x[2]}`} alt=""/><span>0{i+1}</span></div><small>FPX FIELD GUIDE</small><h2>{x[0]}</h2><p>{x[1]}</p><a href="#">Read guide <Arrow/></a></article>)}</section><PageCTA/></>}

const faqItems=[["What is FPX Sourcing?","FPX is a digital timber sourcing service for New Zealand buyers, combining product discovery, pricing visibility and industry support."],["Who is FPX for?","Contractors, builders, merchants, processors and procurement teams that buy commercial timber."],["Do I need to be a large buyer?","No. FPX supports businesses of different sizes and different requirement types."],["What can I do through FPX?","Browse stock, view current offers and create detailed multi-product requests."],["What if I cannot find the timber I need?","Create a request with the specifications and quantity required and FPX will review it."],["How much does FPX cost?","FPX is free for buyers to use."],["Can I apply for trade credit?","Eligible buyers can apply after account verification and credit assessment."],["Who do I contact for help?","Email support@fpx.nz or use the contact page."]];
function FAQPage(){return <><InnerHero slug="faq"/><section className="m-faq"><aside><span>08 QUESTIONS</span><h2>Everything buyers need to know.</h2><p>Still unsure? The FPX team can help.</p><Link href="/contact-us">Ask us directly <Arrow/></Link></aside><div>{faqItems.map((f,i)=><details key={f[0]} open={i===0}><summary><span>0{i+1}</span>{f[0]}<ChevronDown/></summary><p>{f[1]}</p></details>)}</div></section><PageCTA/></>}

function AboutPage(){return <><InnerHero slug="about-us"/><section className="m-about-statement"><Eyebrow>WHY FPX EXISTS</Eyebrow><p>Timber sourcing should not live across phone calls, static lists and email chains. FPX gives buyers a clearer digital starting point while keeping real industry support close.</p></section><section className="m-values">{[["01","Make timber easier to find."],["02","Keep specifications clear."],["03","Support the path to delivery."]].map(x=><article key={x[0]}><span>{x[0]}</span><h2>{x[1]}</h2></article>)}</section><section className="m-origin"><div><Eyebrow>NEW ZEALAND BUILT</Eyebrow><h2>Designed around the way the timber trade actually moves.</h2></div><p>FPX focuses on practical commercial requirements across categories, specifications and applications—not generic marketplace mechanics.</p></section><PageCTA/></>}

function ContactPage(){return <><InnerHero slug="contact-us"/><section className="m-contact"><aside><Eyebrow>REACH US DIRECTLY</Eyebrow><a href="mailto:support@fpx.nz"><Mail/> support@fpx.nz</a><a href="tel:+642108473262"><Phone/> +64 210 847 3262</a><p>Raglan · New Zealand</p></aside><form><label>Full name<input placeholder="Your name"/></label><label>Company<input placeholder="Company name"/></label><label>Email<input type="email" placeholder="you@company.co.nz"/></label><label>Phone<input placeholder="Your phone number"/></label><label className="wide">What can we help with?<select><option>Timber sourcing requirement</option><option>Using the FPX platform</option><option>General enquiry</option></select></label><label className="wide">Message<textarea placeholder="Tell us what timber you need, including dimensions, grade, treatment and quantity if known."/></label><button>Send enquiry <Arrow/></button></form></section><PageCTA/></>}

function LegalPage({slug}:{slug:string}){const privacy=slug==="privacy-policy";const sections=privacy?["Outline and application","Information we collect","How information is used","Cookies","Disclosure and protection","Your rights","Contact"]:["Using FPX","Accounts and information","Sourcing requests","Orders and delivery","Payments","Liability","Changes and contact"];return <><InnerHero slug={slug}/><section className="m-legal"><aside><span>FOREST PRODUCTS EXCHANGE LIMITED</span><p>Last reviewed September 2026</p><nav>{sections.map((x,i)=><a key={x} href={`#legal-${i+1}`}>0{i+1} {x}</a>)}</nav></aside><div>{sections.map((x,i)=><article id={`legal-${i+1}`} key={x}><span>0{i+1}</span><h2>{x}</h2><p>{privacy?"This section explains how Forest Products Exchange Limited collects, uses, stores and protects information in connection with FPX services.":"This section sets out the conditions that apply when using the FPX website and sourcing services."}</p><p>The approved production legal wording will be retained in full when this mockup is moved into the final repository.</p></article>)}</div></section></>}

export function MasterInnerPage({slug}:{slug:string}){useParallax();let body:React.ReactNode;if(slug==="products")body=<ProductsPage/>;else if(productGroupDetails[slug])body=<ProductGroupPage slug={slug}/>;else if(slug==="source-timber")body=<SourceTimberPage/>;else if(slug==="how-fpx-works")body=<HowPage/>;else if(slug==="our-customers")body=<CustomersPage/>;else if(slug==="saw-point")body=<SawPointPage/>;else if(slug==="industry-resources")body=<ResourcesPage/>;else if(slug==="faq")body=<FAQPage/>;else if(slug==="about-us")body=<AboutPage/>;else if(slug==="contact-us")body=<ContactPage/>;else body=<LegalPage slug={slug}/>;return <Shell><main className="master-site m-inner-site">{body}</main></Shell>}
