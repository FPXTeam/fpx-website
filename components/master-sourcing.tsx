"use client";
import { Eyebrow, Arrow, AppButtons, InnerHero, PageCTA, Breadcrumbs } from "./master-shared";

const requestOptions=[
  {num:"01",title:"From our catalogue",copy:"Add a product from the FPX catalogue to your Request List when it is not currently available to order."},
  {num:"02",title:"Custom request",copy:"Send the specification, quantity and requirements when you need something more specific."}
];
const shopOptions=[
  {num:"01",title:"Available stock",copy:"Browse timber that is currently available through FPX and move directly into the order process."},
  {num:"02",title:"Specials",copy:"Review discounted single-packet or multi-packet opportunities when they are available."}
];
const offerOptions=[
  {num:"01",title:"Current offers",copy:"Explore current timber opportunities, then enquire so FPX can respond for your volumes and requirements."}
];

const requestSteps=[
  {num:"01",title:"Submit request",copy:"Tell FPX what you need."},
  {num:"02",title:"FPX sources",copy:"Suitable options are identified."},
  {num:"03",title:"Review options",copy:"Compare product, pricing and lead time."},
  {num:"04",title:"Place order",copy:"Confirm what works for the job."}
];
const shopSteps=[
  {num:"01",title:"Add to cart",copy:"Choose one or more products."},
  {num:"02",title:"Order now",copy:"Review and confirm the order."},
  {num:"03",title:"Delivered to site",copy:"The order moves to delivery."}
];
const offerSteps=[
  {num:"01",title:"Enquire",copy:"Send an enquiry on the offer."},
  {num:"02",title:"FPX responds",copy:"Pricing is provided for your requirement."},
  {num:"03",title:"Review & confirm",copy:"Confirm the option that suits."}
];

function SourceLane({type,title,eyebrow,options,cta,href,steps}:{type:string,title:string,eyebrow:string,options:{num:string,title:string,copy:string}[],cta:string,href:string,steps:{num:string,title:string,copy:string}[]}){
  return <article className={`m-source-story-lane ${type}`}>
    <div className="m-source-story-lane-head"><small>{eyebrow}</small><h3>{title}</h3></div>
    <div className="m-source-story-options">{options.map(option=><div className="m-source-story-option" key={option.title}><span>{option.num}</span><div><h4>{option.title}</h4><p>{option.copy}</p></div></div>)}</div>
    <a className="m-source-story-cta" href={href}>{cta}<Arrow/></a>
    <div className="m-source-story-path"><small>{type==="request"?"REQUEST PATH":type==="shop"?"SHOP PATH":"OFFER PATH"}</small><div className={`m-source-story-path-grid path-${steps.length}`}>{steps.map(step=><div key={step.num}><b>{step.num}</b><h4>{step.title}</h4><p>{step.copy}</p></div>)}</div></div>
  </article>
}

function SourceStory(){return <section className="m-source-story m-animate-in">
  <div className="m-source-story-head"><Eyebrow>THERE ARE MULTIPLE WAYS TO SOURCE THROUGH FPX</Eyebrow><h2>Start with what you know.</h2><p>Use the route that matches the job. Request a specific product, order from available stock or enquire on a current opportunity.</p></div>
  <div className="m-source-story-chapters">
    <div className="m-source-story-chapter chapter-request"><span>01</span><div><h3>You know what you need</h3><p>Tell FPX your requirement and we’ll source suitable options for you.</p></div></div>
    <div className="m-source-story-chapter chapter-available"><span>02</span><div><h3>See what’s available</h3><p>Browse available stock, specials or current offers and choose the route that fits.</p></div></div>
  </div>
  <div className="m-source-story-grid">
    <SourceLane type="request" eyebrow="REQUESTS" title="Requests" options={requestOptions} cta="Go to Request List" href="https://app.fpx.nz/request-cart" steps={requestSteps}/>
    <SourceLane type="shop" eyebrow="SHOP - ORDER DIRECT" title="Shop - Order Direct" options={shopOptions} cta="Start shopping" href="https://app.fpx.nz/shop" steps={shopSteps}/>
    <SourceLane type="offer" eyebrow="OFFERS - ENQUIRE" title="Offers - Enquire" options={offerOptions} cta="View offers & enquire" href="https://app.fpx.nz/offers" steps={offerSteps}/>
  </div>
</section>}

function SourceClosing(){return <section className="m-source-closing m-animate-in">
  <div className="m-source-closing-inner">
    <div className="m-source-closing-copy"><Eyebrow>ONE NETWORK. MORE OPTIONS.</Eyebrow><h2>A clearer way to source across New Zealand.</h2><p>FPX brings different sourcing routes into one place for timber merchants, wood processors, builders, contractors and commercial project teams.</p></div>
    <div className="m-source-closing-audiences"><span>Timber merchants</span><span>Wood processors</span><span>Builders & contractors</span></div>
    <div className="m-source-closing-cta"><div><Eyebrow>START SOURCING</Eyebrow><h3>Ready to source timber?</h3><p>Browse available timber or tell FPX exactly what you need.</p></div><AppButtons/></div>
  </div>
</section>}

export function SourceTimberPage(){return <><Breadcrumbs items={[["Home","/"],["FPX Sourcing","/source-timber"]]}/><section className="m-source-hero-v2"><div><Eyebrow>FPX SOURCING</Eyebrow><h1>Source timber with a <em>clear way in.</em></h1><p>Start with what you know. Send a specific request, browse available timber or review current offers. Each route is designed to move you from requirement to order without unnecessary steps.</p><AppButtons/></div><div className="m-source-hero-v2-visual"><img src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in New Zealand"/><span className="m-source-hero-v2-badge">New Zealand timber sourcing</span></div></section><SourceStory/><SourceClosing/></>}

export function HowPage(){const steps=[["Start where you are","Shop available stock, review current offers or send a specific request. Start with the route that best matches what you know."],["Share the detail","Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier."],["Choose what fits","Review the timber options and the information around them, then choose the route that works for your team."],["Keep it moving","FPX keeps the order and delivery path connected so your team can follow the handover through to site."]];return <><Breadcrumbs items={[["Home","/"],["How FPX Works","/how-fpx-works"]]}/><InnerHero slug="how-fpx-works"/><section className="m-how-page-flow m-animate-in"><div className="m-how-page-intro"><Eyebrow>WHAT HAPPENS NEXT</Eyebrow><h2>From requirement<br/><em>to delivery.</em></h2><p>Once you start, FPX keeps the practical details moving, from the first specification through to the final handover.</p></div><div className="m-how-page-cards">{steps.map((s,i)=><article key={s[0]}><div className="m-how-page-marker" aria-hidden="true"/><div><small>{["BEGIN","DETAIL","DECIDE","DELIVER"][i]}</small><h3>{s[0]}</h3><p>{s[1]}</p></div></article>)}</div></section><PageCTA/></>}
