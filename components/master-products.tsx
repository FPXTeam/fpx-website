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
  ["Fencing","Palings · Posts · Rails · Fence Capping · Pegs","product-groups/outdoor-landscaping/outdoor-townhouse-fence.png","https://app.fpx.nz/categories-products?recordId=recooQcbCktBh8rJA"],
  ["Retaining","Posts · Retaining Boards · Sleepers · Squares & Beams","product-groups/outdoor-landscaping/outdoor-steps.png","https://app.fpx.nz/categories-products?recordId=recRkQGH44OakERvd"],
  ["Decking","Decking Boards · Balustrade Timber · Posts · Rails","product-groups/building-construction/building-deck-construction.png","https://app.fpx.nz/categories-products?recordId=recR0Rtm3bul50Clo"],
  ["Commercial projects","Bridges · Boardwalks · Specialist outdoor structures","product-groups/outdoor-landscaping/outdoor-boardwalk.png","https://app.fpx.nz/categories-products?recordId=recnOUIy2AOU7E1LE"]
];

export function ProductsPage(){
  return <>
    <section className="ppr-hero">
      <img src="/images/product-groups/manufacturing/manufacturing-hero-pine-stack.png" alt="Stacked New Zealand timber products"/>
      <div className="ppr-hero-shade"/>
      <div className="ppr-hero-copy">
        <Eyebrow>OUR TIMBER RANGE</Eyebrow>
        <h1>Timber for the work<br/><span className="headline-accent">New Zealand does.</span></h1>
        <p>Explore the main FPX product groups, understand where they fit, then move into FPX for current stock, offers and detailed specifications.</p>
      </div>
    </section>

    <section className="ppr-intro">
      <Eyebrow>PRODUCT GROUPS</Eyebrow>
      <h2>Four clear ways to understand the range.</h2>
      <p>Each group is organised around what the timber is supplied for. Start with the application, then go deeper when you need the actual product detail.</p>
    </section>

    <section className="ppr-groups">
      {productGroups.map((group,i)=><article className={i%2===1?"is-reverse":""} key={group[0]}>
        <Link href={`/${group[3]}`} className="ppr-group-image">
          <img src={`/images/${group[2]}`} alt={`${group[0]} timber product group`}/>
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
        <p>Fencing, retaining, decking, commercial work and many more can also be a useful way into the range.</p>
      </header>
      <div className="ppr-application-grid">
        {endUses.map((use,i)=><article key={use[0]}>
          <a href={use[3]} className="ppr-application-image" aria-label={`View ${use[0]} products in FPX`}>
            <img src={`/images/${use[2]}`} alt={`${use[0]} timber application`}/>
          </a>
          <span>0{i+1}</span>
          <h3>{use[0]}</h3>
          <p>{use[1]}</p>
        </article>)}
      </div>
      <a className="ppr-view-all" href="https://app.fpx.nz/shop">View all categories <Arrow/></a>
    </section>

    <section className="ppr-close">
      <div>
        <Eyebrow>FULL PRODUCT DETAIL LIVES IN FPX</Eyebrow>
        <h2>Know the group?<br/><span className="headline-accent">Move into the detail.</span></h2>
        <p>Browse current timber, review offers or send FPX the requirement you already have.</p>
      </div>
      <AppButtons/>
    </section>
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
