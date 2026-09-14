"use client";
import Link from "next/link";
import { productGroups, Eyebrow, Arrow, AppButtons } from "./master-shared";

export const productGroupDetails: Record<string,{title:string;description:string;hero:string;gallery:string[];categories:string[];examples?:string[];note:string;}> = {
  "manufacturing": {title:"Manufacturing",description:"Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products.",hero:"product-groups/manufacturing/manufacturing-warehouse-bundles.png",gallery:["product-groups/manufacturing/manufacturing-rollers.png","product-groups/manufacturing/manufacturing-hero-pine-stack.png","category-manufacturing-grades.webp"],categories:["Manufacturing Timber"],examples:["Clear 1","Clear 2","Mixed Clears","Dressing","Premium","Cuttings 1","Cuttings 2","Cuttings 3","COL","Merch","Industrial"],note:"The manufacturing range spans multiple grades and feedstock options. Individual grades, sizes and current specifications remain in FPX."},
  "building-construction": {title:"Building & Construction",description:"Timber products for structural, building, finishing and specialist construction applications.",hero:"product-groups/building-construction/building-roof-framing.png",gallery:["product-groups/building-construction/building-symmetrical-framing.png","product-groups/building-construction/building-house-piles.png","product-groups/building-construction/building-battens-stack.png"],categories:["Structural Timber","Weatherboards","House Piles","Ceiling Battens","Tile Battens","Mouldings","Fascia","Scaffold Planks","Soleboards","Kickboards","Stair Treads"],note:"A broad construction range covering structural requirements, finishing timber and specialist site applications."},
  "outdoor-landscaping": {title:"Outdoor & Landscaping",description:"Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction.",hero:"product-groups/outdoor-landscaping/outdoor-slat-fence.png",gallery:["product-groups/outdoor-landscaping/outdoor-cedar-fence.png","product-groups/outdoor-landscaping/outdoor-boardwalk.png","product-groups/outdoor-landscaping/outdoor-steps.png"],categories:["Outdoor","Posts","Rails","Palings","Decking","Retaining Boards","Sleepers, Squares & Beams","Screening","Pickets","Capping","Fence Battens","Trellis Battens","Roundwood","Pegs"],note:"The range supports everything from fences and decks to retaining structures and larger outdoor works."},
  "dunnage": {title:"Dunnage",description:"Timber dunnage for freight, shipping, load support and industrial transport applications.",hero:"product-groups/dunnage/dunnage-stamped-stack.png",gallery:["product-groups/dunnage/dunnage-flatbed-support.png","product-groups/dunnage/dunnage-industrial-crate.png"],categories:["Dunnage"],examples:["Freight support","Shipping and container loading","Industrial transport","Load separation","Storage and handling"],note:"Dunnage timber is supplied for practical load support and protection across freight, shipping and industrial transport environments."}
};

const endUses=[
  ["Fencing","Palings · Posts · Rails · Fence Capping · Pegs","product-groups/outdoor-landscaping/outdoor-townhouse-fence.png"],
  ["Retaining","Posts · Retaining Boards · Sleepers · Squares & Beams","product-groups/outdoor-landscaping/outdoor-steps.png"],
  ["Decking","Decking Boards · Balustrade Timber · Posts · Rails","product-groups/building-construction/building-deck-construction.png"],
  ["Commercial projects","Bridges · Boardwalks · Specialist outdoor structures","product-groups/outdoor-landscaping/outdoor-boardwalk.png"]
];

export function ProductsPage(){
  return <>
    <section className="pp-hero">
      <div className="pp-hero-copy"><Eyebrow>OUR TIMBER RANGE</Eyebrow><h1>Understand the range.<br/><span>Then source the detail.</span></h1><p>Explore the main FPX product groups and the applications they serve. Current stock, offers, grades, sizes and detailed specifications live in the FPX sourcing platform.</p></div>
      <div className="pp-hero-image"><img src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber products in a commercial yard"/></div>
    </section>

    <section className="pp-groups">
      <header><Eyebrow>PRODUCT GROUPS</Eyebrow><h2>Four clear ways to explore timber.</h2><p>Each group is organised around what the timber is supplied for, so buyers can understand the range without wading through every specification first.</p></header>
      <div className="pp-group-list">{productGroups.map((group,i)=><Link href={`/${group[3]}`} className="pp-group-row" key={group[0]}>
        <div className="pp-group-image"><img src={`/images/${group[2]}`} alt={`${group[0]} timber product group`}/></div>
        <span>0{i+1}</span>
        <div><small>PRODUCT GROUP</small><h3>{group[0]}</h3><p>{group[1]}</p></div>
        <b>Explore <Arrow/></b>
      </Link>)}</div>
    </section>

    <section className="pp-enduses">
      <div className="pp-enduses-intro"><Eyebrow>EXPLORE BY APPLICATION</Eyebrow><h2>Start with the job.</h2><p>Applications sit separately from Product Categories, giving buyers another simple way into the range.</p></div>
      <div className="pp-enduse-grid">{endUses.map((use,i)=><article key={use[0]}>
        <div><img src={`/images/${use[2]}`} alt={`${use[0]} timber application`}/><span>0{i+1}</span></div>
        <h3>{use[0]}</h3><p>{use[1]}</p>
      </article>)}</div>
    </section>

    <section className="pp-close"><div><Eyebrow>FULL PRODUCT DETAIL LIVES IN FPX</Eyebrow><h2>Ready to work with the actual product?</h2><p>Move into FPX for current timber, offers and detailed specifications.</p></div><AppButtons/></section>
  </>;
}

export function ProductGroupPage({slug}:{slug:string}){
  const group=productGroupDetails[slug];
  const audience=slug==="manufacturing"?"wood processors and timber manufacturers":slug==="building-construction"?"builders, contractors and commercial project teams":slug==="outdoor-landscaping"?"fencing, landscaping, retaining and outdoor construction buyers":"freight, shipping and industrial transport teams";
  const number=String(["manufacturing","building-construction","outdoor-landscaping","dunnage"].indexOf(slug)+1).padStart(2,"0");
  return <>
    <section className="pg-hero">
      <div className="pg-hero-copy"><span className="pg-number">{number}</span><Eyebrow>PRODUCT GROUP</Eyebrow><h1>{group.title}</h1><p>{group.description}</p><div className="m-actions"><a href="https://app.fpx.nz/shop" className="m-btn m-btn-primary">Browse current timber <Arrow/></a><a href="https://app.fpx.nz/request-cart" className="m-btn m-btn-ghost">Request a product <Arrow/></a></div></div>
      <div className="pg-hero-image"><img src={`/images/${group.hero}`} alt={`${group.title} timber`}/></div>
    </section>

    <section className="pg-summary">
      <article><small>WHAT IT IS</small><p>{group.description}</p></article>
      <article><small>WHO IT IS FOR</small><p>FPX supplies this product group for {audience} across New Zealand.</p></article>
      <article><small>HOW TO SOURCE IT</small><p>Browse current timber in FPX or send a product request with the specifications and quantity you need.</p></article>
    </section>

    <section className={`pg-gallery ${group.gallery.length===2?"is-two":""}`}>
      {group.gallery.map((image,i)=><figure key={image}><img src={`/images/${image}`} alt={`${group.title} timber example ${i+1}`}/></figure>)}
    </section>

    <section className="pg-catalogue">
      <div><Eyebrow>WHAT WE SUPPLY</Eyebrow><h2>{group.categories.length===1?"The product group.":"Product categories."}</h2><p>{group.note}</p></div>
      <div className="pg-category-list">{group.categories.map((category,i)=><div key={category}><span>{String(i+1).padStart(2,"0")}</span><b>{category}</b></div>)}</div>
    </section>

    {group.examples&&<section className="pg-examples"><div><Eyebrow>{slug==="manufacturing"?"EXAMPLES ACROSS THE RANGE":"TYPICAL APPLICATIONS"}</Eyebrow><h2>{slug==="manufacturing"?"Breadth without the specification overload.":"Built around practical transport needs."}</h2></div><div>{group.examples.map(item=><span key={item}>{item}</span>)}</div></section>}

    <section className="pg-close"><div><Eyebrow>MOVE INTO FPX</Eyebrow><h2>Need the grade, size or specification?</h2><p>Use the website to understand the range. Use FPX to work with current products, stock, offers and detailed specifications.</p></div><AppButtons/></section>
  </>;
}

export const hasProductGroup=(slug:string)=>Boolean(productGroupDetails[slug]);
