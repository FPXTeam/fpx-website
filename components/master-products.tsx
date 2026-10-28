"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { productGroups, Eyebrow, Arrow, AppButtons } from "./master-shared";

const rawMain="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images";

function resolveImage(image:string){
  return image.startsWith("http")?image:`/images/${image}`;
}

function productImageAlt(groupTitle:string,image:string){
  const subject=(image.split("/").pop()||"timber")
    .replace(/\.(png|jpe?g|webp|avif)$/i,"")
    .replace(/^(manufacturing|building|outdoor|dunnage)-/i,"")
    .replace(/[-_]/g," ");
  return `${groupTitle} timber: ${subject}`;
}

type ProductGroupDetail={
  title:string;
  description:string;
  hero:string;
  heroImages?:string[];
  applications?:string[];
  gallery:string[];
  categories:string[];
  examples?:string[];
  note:string;
};

export const productGroupDetails:Record<string,ProductGroupDetail>={
  "manufacturing":{
    title:"Manufacturing",
    description:"Timber feedstock for New Zealand wood processors and timber manufacturers to remanufacture into finished products.",
    hero:`${rawMain}/Manufacturing1.png`,
    heroImages:[
      `${rawMain}/Manufacturing1.png`,
      `${rawMain}/Manufacturing2.png`,
      `${rawMain}/Manufacturing3.png`,
      `${rawMain}/Manufacturing4.png`
    ],
    applications:[
      "category-manufacturing-grades.webp",
      `${rawMain}/app-manufacturing1.png`,
      `${rawMain}/app-manufacturing2.png`,
      `${rawMain}/app-manufacturing3.png`
    ],
    gallery:[],
    categories:["Manufacturing Grades"],
    examples:["Clear 1","Clear 2","Mixed Clears","Dressing","Premium","Cuttings 1","Cuttings 2","Cuttings 3","COL","Merch","Industrial"],
    note:"The manufacturing timber range spans multiple grades and feedstock options. Individual grades, sizes and current specifications remain in FPX."
  },
  "building-construction":{
    title:"Building & Construction",
    description:"Structural, building, finishing and specialist construction timber for commercial projects across New Zealand.",
    hero:`${rawMain}/Construction1.png`,
    heroImages:[
      `${rawMain}/Construction1.png`,
      `${rawMain}/Construction2.png`,
      `${rawMain}/Construction3.png`,
      `${rawMain}/Construction4.png`,
      `${rawMain}/Construction5.png`,
      `${rawMain}/Construction6.png`
    ],
    applications:[
      "product-groups/building-construction/building-roof-framing.png",
      "product-groups/building-construction/building-symmetrical-framing.png",
      "product-groups/building-construction/building-house-piles.png",
      `${rawMain}/ConstructionUse1.png`,
      `${rawMain}/ConstructionUse2.png`,
      `${rawMain}/ConstructionUse3.png`
    ],
    gallery:[],
    categories:["Structural (Stress Graded)","Weatherboard","House Piles","Mouldings","Balustrades","Ceiling Batten","Fascia","Kickboards"],
    note:"A broad construction timber range covering structural requirements, finishing timber and specialist site applications."
  },
  "outdoor-landscaping":{
    title:"Outdoor & Landscaping",
    description:"Treated and purpose-made timber for fencing, retaining, landscaping and outdoor construction across New Zealand.",
    hero:`${rawMain}/Outdoor1.png`,
    heroImages:[
      `${rawMain}/Outdoor1.png`,
      `${rawMain}/Outdoor2.png`,
      `${rawMain}/Outdoor3.png`,
      `${rawMain}/Outdoor4.png`
    ],
    applications:[
      "product-groups/outdoor-landscaping/outdoor-slat-fence.png",
      "product-groups/outdoor-landscaping/outdoor-cedar-fence.png",
      "product-groups/outdoor-landscaping/outdoor-boardwalk.png",
      "product-groups/outdoor-landscaping/outdoor-steps.png",
      `${rawMain}/OutdoorUse1.png`
    ],
    gallery:[],
    categories:["Decking","Fencing","Retaining","Posts","Palings","Pegs","Rails","Roundwood","Screening","Sleepers, Squares and Beams","Trellis Batten"],
    note:"The outdoor and landscaping timber range supports fencing, decking, retaining structures and larger outdoor works."
  },
  "dunnage":{
    title:"Dunnage",
    description:"Timber dunnage for freight, shipping, load support, storage and industrial transport applications across New Zealand.",
    hero:"product-groups/dunnage/dunnage-stamped-stack.png",
    gallery:["product-groups/dunnage/dunnage-flatbed-support.png","product-groups/dunnage/dunnage-industrial-crate.png"],
    categories:["Dunnage"],
    examples:["Freight support","Shipping and container loading","Industrial transport","Load separation","Storage and handling"],
    note:"Dunnage timber is supplied for practical load support and protection across freight, shipping, storage and industrial transport environments."
  }
};

function ProductHeroMedia({group}:{group:ProductGroupDetail}){
  const images=group.heroImages?.length?group.heroImages:[group.hero];
  const [active,setActive]=useState(0);

  useEffect(()=>{
    setActive(0);
    if(images.length<2)return;
    const timer=window.setInterval(()=>setActive(current=>(current+1)%images.length),4500);
    return()=>window.clearInterval(timer);
  },[group.title,images.length]);

  if(images.length===1){
    return <div className="pg-hero-image"><Image src={resolveImage(images[0])} alt={`${group.title} timber`} width={1800} height={1200} sizes="(max-width: 900px) 100vw, 50vw" priority/></div>;
  }

  return <div className="pg-hero-image pg-hero-carousel">
    {images.map((image,index)=><img key={image} src={resolveImage(image)} alt={`${group.title} timber product ${index+1}`} className={index===active?"is-active":""} loading={index===0?"eager":"lazy"} decoding="async"/>)}
    <div className="pg-hero-carousel-dots" aria-label={`${group.title} product images`}>
      {images.map((_,index)=><button key={index} type="button" className={index===active?"is-active":""} onClick={()=>setActive(index)} aria-label={`Show product image ${index+1}`} aria-current={index===active?"true":undefined}/>)}
    </div>
  </div>;
}

function CommonApplications({group}:{group:ProductGroupDetail}){
  if(!group.applications?.length)return null;
  return <section className="pg-applications">
    <header className="pg-applications-head"><Eyebrow>COMMON APPLICATIONS</Eyebrow><h2>Where this timber is used.</h2></header>
    <div className="pg-application-grid">
      {group.applications.map((image,index)=><figure key={image}><img src={resolveImage(image)} alt={`${group.title} application ${index+1}`} loading="lazy" decoding="async"/></figure>)}
    </div>
  </section>;
}

const endUses=[
  ["Fencing","Palings · Posts · Rails · Fence Capping · Pegs","product-groups/outdoor-landscaping/outdoor-townhouse-fence.png","https://app.fpx.nz/explore-fpx-sourcing?search=Fencing"],
  ["Retaining","Posts · Retaining Boards · Sleepers · Squares & Beams","product-groups/outdoor-landscaping/outdoor-steps.png","https://app.fpx.nz/explore-fpx-sourcing?search=Retaining"],
  ["Decking","Decking Boards · Balustrade Timber · Posts · Rails","product-groups/building-construction/building-deck-construction.png","https://app.fpx.nz/explore-fpx-sourcing?search=Decking"],
  ["Commercial projects","Bridges · Boardwalks · Specialist outdoor structures","product-groups/outdoor-landscaping/outdoor-boardwalk.png","https://app.fpx.nz/explore-fpx-sourcing?search=Commercial%20projects"]
];

export function ProductsPage(){
  return <>
    <section className="ppr-hero">
      <Image src="/images/product-groups/manufacturing/manufacturing-hero-pine-stack.png" alt="Stacked New Zealand timber products" width={1920} height={1200} sizes="100vw" priority/>
      <div className="ppr-hero-shade"/>
      <div className="ppr-hero-copy">
        <Eyebrow>OUR TIMBER RANGE</Eyebrow>
        <h1>Timber for the work<br/><span className="headline-accent">New Zealand does.</span></h1>
        <p>Explore the main FPX timber product groups by application, then check current Stock and Offers or create a Request when the exact product, specification, length or quantity is not listed.</p>
      </div>
    </section>

    <section className="ppr-intro">
      <Eyebrow>TIMBER PRODUCT GROUPS</Eyebrow>
      <h2>Start with what the timber needs to do.</h2>
      <p>The range is organised around commercial applications. Start with the job, then move into the product detail, current Stock or a specific Request.</p>
    </section>

    <section className="ppr-groups">
      {productGroups.map((group,i)=><article className={i%2===1?"is-reverse":""} key={group[0]}>
        <Link href={`/${group[3]}`} className="ppr-group-image">
          <Image src={`/images/${group[2]}`} alt={`${group[0]} timber product group`} width={1400} height={1000} sizes="(max-width: 800px) 100vw, 52vw"/>
          <span>0{i+1}</span>
        </Link>
        <div className="ppr-group-copy">
          <Eyebrow>PRODUCT GROUP {String(i+1).padStart(2,"0")}</Eyebrow>
          <h2>{group[0]}</h2>
          <p>{group[1]}</p>
          <Link href={`/${group[3]}`}>Explore {group[0]} <Arrow/></Link>
        </div>
      </article>)}
    </section>

    <section className="ppr-applications">
      <header>
        <Eyebrow>EXPLORE BY APPLICATION</Eyebrow>
        <h2>Start with the job.</h2>
        <p>Fencing, retaining, decking and commercial projects are useful ways into the timber range when you know the application before the exact product.</p>
      </header>
      <div className="ppr-application-grid">
        {endUses.map((use,i)=><article key={use[0]}>
          <a href={use[3]} className="ppr-application-image" aria-label={`View ${use[0]} products in FPX`}>
            <Image src={`/images/${use[2]}`} alt={`${use[0]} timber application`} width={1200} height={900} sizes="(max-width: 800px) 100vw, 25vw"/>
          </a>
          <span>0{i+1}</span>
          <h3>{use[0]}</h3>
          <p>{use[1]}</p>
        </article>)}
      </div>
      <a className="ppr-view-all" href="https://app.fpx.nz/explore-fpx-sourcing">Browse current Stock <Arrow/></a>
    </section>

    <section className="ppr-close">
      <div>
        <Eyebrow>MOVE INTO FPX SOURCING</Eyebrow>
        <h2>Know what you need?<br/><span className="headline-accent">Check Stock or send the requirement.</span></h2>
        <p>Browse current Stock, review Offers or create a Request for the product, specification and quantity you need. If the right timber is not shown online, FPX can source wider through suitable New Zealand supply routes.</p>
      </div>
      <AppButtons/>
    </section>
  </>;
}

export function ProductGroupPage({slug}:{slug:string}){
  const group=productGroupDetails[slug];
  const audience=slug==="manufacturing"?"wood processors and timber manufacturers":slug==="building-construction"?"builders, contractors and commercial project teams":slug==="outdoor-landscaping"?"fencing, landscaping, retaining and outdoor construction buyers":"freight, shipping and industrial transport teams";
  const number=String(["manufacturing","building-construction","outdoor-landscaping","dunnage"].indexOf(slug)+1).padStart(2,"0");
  const relatedGuidance:Record<string,[string,string,string][]>={
    "manufacturing":[
      ["RADIATA PINE","How growth and environment shape Radiata Pine","/timber-growth-rings"],
      ["KILN DRYING","Moisture content and kiln-drying methods","/the-science-of-kiln-drying"],
      ["SOURCING","How to source a specific timber requirement","/fpx-sourcing"]
    ],
    "building-construction":[
      ["KILN DRYING","Moisture content and kiln-drying methods","/the-science-of-kiln-drying"],
      ["RADIATA PINE","Understand Radiata Pine characteristics","/timber-growth-rings"],
      ["SOURCING","How FPX timber sourcing works","/how-fpx-works"]
    ],
    "outdoor-landscaping":[
      ["RADIATA PINE","Understand Radiata Pine characteristics","/timber-growth-rings"],
      ["SOURCING","How to source timber through FPX","/fpx-sourcing"],
      ["QUESTIONS","Answers about requests, offers and orders","/frequently-asked-questions"]
    ],
    "dunnage":[
      ["SOURCING","How to source a specific dunnage requirement","/fpx-sourcing"],
      ["QUESTIONS","Answers about FPX sourcing and requests","/frequently-asked-questions"],
      ["TIMBER RANGE","Explore all FPX timber product groups","/timber"]
    ]
  };

  return <>
    <section className="pg-hero">
      <div className="pg-hero-copy"><span className="pg-number">{number}</span><Eyebrow>TIMBER RANGE</Eyebrow><h1>{group.title}</h1><p>{group.description}</p><div className="m-actions"><a href="https://app.fpx.nz/explore-fpx-sourcing" className="m-btn m-btn-primary">Browse Timber <Arrow/></a><a href="https://app.fpx.nz/explore-fpx-sourcing?request=1" className="m-btn m-btn-ghost">Submit a Timber Request <Arrow/></a></div></div>
      <ProductHeroMedia group={group}/>
    </section>

    <section className="pg-summary">
      <article><small>WHAT IT IS</small><p>{group.description}</p></article>
      <article><small>WHO IT IS FOR</small><p>FPX sources this timber for {audience} across New Zealand.</p></article>
      <article><small>HOW TO SOURCE IT</small><p>Browse current stock or submit a request with the grade, dimensions, treatment, quantity and timing you know. If the exact timber is not shown, FPX can source suitable options beyond listed stock.</p></article>
    </section>

    {group.applications?.length?<CommonApplications group={group}/>:<section className={`pg-gallery ${group.gallery.length===2?"is-two":""}`}>{group.gallery.map(image=><figure key={image}><Image src={`/images/${image}`} alt={productImageAlt(group.title,image)} width={1400} height={1000} sizes="(max-width: 800px) 100vw, 33vw"/></figure>)}</section>}

    <section className="pg-catalogue">
      <div><Eyebrow>WHAT WE SUPPLY</Eyebrow><h2>{group.categories.length===1?"Timber for this application.":"Explore the range."}</h2><p>{group.note}</p></div>
      <div className="pg-category-list">{group.categories.map((category,i)=><div key={category}><span>{String(i+1).padStart(2,"0")}</span><b>{category}</b></div>)}</div>
    </section>

    {group.examples&&<section className="pg-examples"><div><Eyebrow>{slug==="manufacturing"?"EXAMPLES ACROSS THE RANGE":"TYPICAL APPLICATIONS"}</Eyebrow><h2>{slug==="manufacturing"?"Breadth without the specification overload.":"Built around practical transport needs."}</h2></div><div>{group.examples.map(item=><span key={item}>{item}</span>)}</div></section>}

    <section className="pg-summary pg-related-links" aria-label="Related timber guidance">
      {relatedGuidance[slug].map(([label,title,href])=><article key={href}><small>{label}</small><p><Link href={href}>{title} <Arrow/></Link></p></article>)}
    </section>

    <section className="pg-close"><div><Eyebrow>EXPLORE IN FPX</Eyebrow><h2>Need the grade, size or specification?</h2><p>Browse current stock or submit a timber request in FPX. The range shown here introduces possible applications; individual listings and availability are shown in FPX.</p></div><AppButtons/></section>
  </>;
}

export const hasProductGroup=(slug:string)=>Boolean(productGroupDetails[slug]);
