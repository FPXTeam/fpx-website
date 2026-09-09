"use client";
import { Eyebrow, Arrow, AppButtons, SourcePageCTA, InnerHero, PageCTA, Breadcrumbs } from "./master-shared";

const requestOptions=[
  {num:"01",title:"From our catalogue",copy:"Found a product in the FPX catalogue but it is not currently available to order? Add it to your Request List and FPX will source it for you."},
  {num:"02",title:"Custom request",copy:"Can’t find exactly what you need? Send the specification, quantity and requirements and FPX will source suitable options."}
];
const shopOptions=[
  {num:"01",title:"Available stock",copy:"Order from timber that is currently available through FPX, with the product information you need to make a decision."},
  {num:"02",title:"Specials",copy:"Review discounted single-packet or multi-packet opportunities when they are available."}
];
const offerOptions=[
  {num:"01",title:"Current offers",copy:"Explore ad hoc timber opportunities from the FPX supplier network, then enquire so pricing can be provided for your volumes and requirements."}
];

function SourceLane({type,title,eyebrow,options,cta,href}:{type:string,title:string,eyebrow:string,options:{num:string,title:string,copy:string}[],cta:string,href:string}){
  return <article className={`m-source-lane ${type}`}><div className="m-source-lane-head"><small>{eyebrow}</small><h3>{title}</h3></div><div className="m-source-lane-options">{options.map(option=><div className="m-source-option" key={option.title}><span>{option.num}</span><h4>{option.title}</h4><p>{option.copy}</p></div>)}</div><a className="m-source-lane-cta" href={href}>{cta}<Arrow/></a></article>
}

function StepLane({label,steps}:{label:string,steps:{num:string,title:string,copy:string}[]}){
  return <div className="m-source-step-lane"><small>{label}</small><div className={`m-source-step-row cols-${steps.length}`}>{steps.map(step=><article className="m-source-step" key={step.num}><b>{step.num}</b><h4>{step.title}</h4><p>{step.copy}</p></article>)}</div></div>
}

function SourceMap(){return <>
  <section className="m-source-map m-animate-in">
    <div className="m-source-map-head"><Eyebrow>THERE ARE MULTIPLE WAYS TO SOURCE THROUGH FPX</Eyebrow><h2>Find it, request it or take advantage of it.</h2><p>Whether you know exactly what you need or want to see what is available, FPX gives you a clear route into the right timber and the right opportunity.</p></div>
    <div className="m-source-map-audiences">
      <article className="m-source-map-audience"><strong>01</strong><div><h3>You know what you need</h3><p>Tell FPX your requirement and we’ll source suitable options for you.</p></div></article>
      <article className="m-source-map-audience"><strong>02</strong><div><h3>See what’s available</h3><p>Browse available stock, specials or current offers and choose the route that fits.</p></div></article>
    </div>
    <div className="m-source-map-columns">
      <SourceLane type="request" eyebrow="REQUESTS" title="Requests" options={requestOptions} cta="Go to Request List" href="https://app.fpx.nz/request-cart"/>
      <SourceLane type="shop" eyebrow="SHOP - ORDER DIRECT" title="Shop - Order Direct" options={shopOptions} cta="Start shopping" href="https://app.fpx.nz/shop"/>
      <SourceLane type="offer" eyebrow="OFFERS - ENQUIRE" title="Offers - Enquire" options={offerOptions} cta="View offers & enquire" href="https://app.fpx.nz/offers"/>
    </div>
  </section>
  <section className="m-source-steps m-animate-in">
    <div className="m-source-steps-grid">
      <StepLane label="REQUEST PATH" steps={[{num:"01",title:"Submit request",copy:"Send the product, specification, quantity and timing you need."},{num:"02",title:"FPX sources",copy:"FPX reviews the requirement and identifies suitable sourcing options."},{num:"03",title:"Review options",copy:"Compare the product information, pricing and lead times provided."},{num:"04",title:"Place order",copy:"Confirm the option that works and move into the order process."}]}/>
      <StepLane label="SHOP PATH" steps={[{num:"01",title:"Add to cart",copy:"Choose one or more available products."},{num:"02",title:"Order now",copy:"Review the order and confirm your purchase."},{num:"03",title:"Delivered to site",copy:"The order moves through to delivery."}]}/>
      <StepLane label="OFFER PATH" steps={[{num:"01",title:"Enquire",copy:"Send an enquiry on the offer that interests you."},{num:"02",title:"FPX responds",copy:"Pricing is provided based on your volumes and requirements."},{num:"03",title:"Review & confirm",copy:"Confirm the option that suits your requirement."}]}/>
    </div>
  </section>
</>}

function SourceNetwork(){return <section className="m-source-network m-animate-in"><div><Eyebrow>ONE NETWORK. MORE OPTIONS.</Eyebrow><h2>A clearer way to source across New Zealand.</h2><p>FPX brings different sourcing routes into one place for timber merchants, wood processors, builders, contractors and commercial project teams.</p></div><div className="m-source-network-list"><span>Timber merchants</span><span>Wood processors</span><span>Builders & contractors</span></div></section>}

export function SourceTimberPage(){return <><Breadcrumbs items={[["Home","/"],["FPX Sourcing","/source-timber"]]}/><section className="m-source-hero-v2"><div><Eyebrow>FPX SOURCING</Eyebrow><h1>Source timber with a <em>clear way in.</em></h1><p>Start with what you know. Send a specific request, browse available timber or review current offers. Each route is designed to move you from requirement to order without unnecessary steps.</p><AppButtons/></div><div className="m-source-hero-v2-visual"><img src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in New Zealand"/><span className="m-source-hero-v2-badge">New Zealand timber sourcing</span></div></section><SourceMap/><SourceNetwork/><SourcePageCTA/></>}

export function HowPage(){const steps=[["Start where you are","Shop available stock, review current offers or send a specific request. Start with the route that best matches what you know."],["Share the detail","Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier."],["Choose what fits","Review the timber options and the information around them, then choose the route that works for your team."],["Keep it moving","FPX keeps the order and delivery path connected so your team can follow the handover through to site."]];return <><Breadcrumbs items={[["Home","/"],["How FPX Works","/how-fpx-works"]]}/><InnerHero slug="how-fpx-works"/><section className="m-how-page-flow m-animate-in"><div className="m-how-page-intro"><Eyebrow>WHAT HAPPENS NEXT</Eyebrow><h2>From requirement<br/><em>to delivery.</em></h2><p>Once you start, FPX keeps the practical details moving, from the first specification through to the final handover.</p></div><div className="m-how-page-cards">{steps.map((s,i)=><article key={s[0]}><div className="m-how-page-marker" aria-hidden="true"/><div><small>{["BEGIN","DETAIL","DECIDE","DELIVER"][i]}</small><h3>{s[0]}</h3><p>{s[1]}</p></div></article>)}</div></section><PageCTA/></>}
