"use client";
import { Eyebrow, Arrow, AppButtons, InnerHero, PageCTA, Breadcrumbs } from "./master-shared";

const requestSteps=[
  ["01","Submit request","Tell FPX what you need."],
  ["02","FPX sources","Suitable options are identified."],
  ["03","Review options","Compare product, pricing and lead time."],
  ["04","Place order","Confirm what works for the job."]
];
const shopSteps=[
  ["01","Add to cart","Choose one or more available products."],
  ["02","Order now","Review and confirm the order."],
  ["03","Delivered to site","The order moves through to delivery."]
];
const offerSteps=[
  ["01","Enquire","Send an enquiry on the offer."],
  ["02","FPX responds","Pricing is provided for your requirement."],
  ["03","Review & confirm","Confirm the option that suits."]
];

function JourneySteps({label,steps}:{label:string,steps:string[][]}){
  return <div className="m-source-journey"><small>{label}</small><div>{steps.map(([num,title,copy])=><article key={num}><span>{num}</span><h4>{title}</h4><p>{copy}</p></article>)}</div></div>
}

function SourceFeature({index,eyebrow,title,copy,image,alt,items,cta,href,steps,label,reverse=false}:{index:string,eyebrow:string,title:string,copy:string,image:string,alt:string,items:{title:string,copy:string}[],cta:string,href:string,steps:string[][],label:string,reverse?:boolean}){
  return <section className={`m-source-feature ${reverse?"is-reverse":""}`}>
    <div className="m-source-feature-copy">
      <span className="m-source-feature-index">{index}</span>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      <p className="m-source-feature-lead">{copy}</p>
      <div className="m-source-feature-points">{items.map(item=><div key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></div>)}</div>
      <a className="m-source-feature-link" href={href}>{cta}<Arrow/></a>
    </div>
    <div className="m-source-feature-visual"><div className="m-source-feature-screen"><img src={image} alt={alt}/></div></div>
    <JourneySteps label={label} steps={steps}/>
  </section>
}

function SourceStory(){return <section className="m-source-story-premium">
  <div className="m-source-story-intro">
    <Eyebrow>THERE ARE MULTIPLE WAYS TO SOURCE THROUGH FPX</Eyebrow>
    <h2>Start with what you know.</h2>
    <p>You do not need to learn the whole platform before you begin. Choose the route that matches the job, then FPX carries the detail forward.</p>
  </div>
  <SourceFeature index="01" eyebrow="REQUESTS" title="You know what you need." copy="Send a specific timber requirement and let FPX help source suitable options." image="/images/fpx-app-requests.png" alt="FPX request workflow" items={[{title:"From our catalogue",copy:"Add a catalogue product to your Request List when it is not currently available."},{title:"Custom request",copy:"Send the specification, quantity and requirements when the job needs something more specific."}]} cta="Go to Request List" href="https://app.fpx.nz/request-cart" steps={requestSteps} label="REQUEST PATH"/>
  <SourceFeature index="02" eyebrow="SHOP - ORDER DIRECT" title="See what’s available now." copy="Browse current timber, choose what fits and move directly into the order process." image="/images/fpx-app-shop.png" alt="FPX available timber shop" items={[{title:"Available stock",copy:"Browse timber that is currently available through FPX."},{title:"Specials",copy:"Review discounted single-packet or multi-packet opportunities when available."}]} cta="Start shopping" href="https://app.fpx.nz/shop" steps={shopSteps} label="SHOP PATH" reverse/>
  <SourceFeature index="03" eyebrow="OFFERS - ENQUIRE" title="Spot an opportunity." copy="Explore current offers and enquire when an opportunity suits your requirement." image="/images/fpx-app-offers.png" alt="FPX current timber offers" items={[{title:"Current offers",copy:"Review current timber opportunities, then enquire so FPX can respond for your volumes and requirements."}]} cta="View offers & enquire" href="https://app.fpx.nz/offers" steps={offerSteps} label="OFFER PATH"/>
</section>}

function SourceClosing(){return <section className="m-source-closing-premium">
  <div><Eyebrow>ONE NETWORK. MORE OPTIONS.</Eyebrow><h2>One place to start.<br/>Different ways to buy.</h2><p>FPX brings sourcing routes together for timber merchants, wood processors, builders, contractors and commercial project teams across New Zealand.</p></div>
  <div className="m-source-closing-actions"><AppButtons/></div>
</section>}

export function SourceTimberPage(){return <><section className="m-source-hero-v2"><div><Eyebrow>FPX SOURCING</Eyebrow><h1>Source timber with a <em>clear way in.</em></h1><p>Start with what you know. Send a specific request, browse available timber or review current offers. Each route is designed to move you from requirement to order without unnecessary steps.</p><AppButtons/></div><div className="m-source-hero-v2-visual"><img src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in New Zealand"/><span className="m-source-hero-v2-badge">New Zealand timber sourcing</span></div></section><SourceStory/><SourceClosing/></>}

export function HowPage(){const steps=[["Start where you are","Shop available stock, review current offers or send a specific request. Start with the route that best matches what you know."],["Share the detail","Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier."],["Choose what fits","Review the timber options and the information around them, then choose the route that works for your team."],["Keep it moving","FPX keeps the order and delivery path connected so your team can follow the handover through to site."]];return <><Breadcrumbs items={[["Home","/"],["How FPX Works","/how-fpx-works"]]}/><InnerHero slug="how-fpx-works"/><section className="m-how-page-flow m-animate-in"><div className="m-how-page-intro"><Eyebrow>WHAT HAPPENS NEXT</Eyebrow><h2>From requirement<br/><em>to delivery.</em></h2><p>Once you start, FPX keeps the practical details moving, from the first specification through to the final handover.</p></div><div className="m-how-page-cards">{steps.map((s,i)=><article key={s[0]}><div className="m-how-page-marker" aria-hidden="true"/><div><small>{["BEGIN","DETAIL","DECIDE","DELIVER"][i]}</small><h3>{s[0]}</h3><p>{s[1]}</p></div></article>)}</div></section><PageCTA/></>}
