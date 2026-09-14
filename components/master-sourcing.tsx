"use client";
import { Eyebrow, Arrow, AppButtons } from "./master-shared";

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

export function SourceTimberPage(){return <>
  <section className="pst-hero">
    <img src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in New Zealand"/>
    <div className="pst-hero-shade"/>
    <div className="pst-hero-copy">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h1>Source timber with<br/>a clear way in.</h1>
      <p>Start with what you know. Send a specific request, browse available timber or review current offers. FPX gives each requirement a clear starting point.</p>
      <AppButtons/>
    </div>
  </section>

  <section className="pst-intro">
    <Eyebrow>THREE WAYS TO START</Eyebrow>
    <h2>Choose the route that matches the job.</h2>
    <p>You do not need to learn the whole platform before you begin. Start with the sourcing route that fits what you already know, then move into the detail from there.</p>
    <nav aria-label="FPX sourcing routes">
      <a href="#source-request"><span>01</span>Request</a>
      <a href="#source-shop"><span>02</span>Shop</a>
      <a href="#source-offers"><span>03</span>Offers</a>
    </nav>
  </section>

  <section className="pst-routes">
    <article id="source-request" className="pst-route">
      <div className="pst-route-copy">
        <span className="pst-route-number">01</span>
        <Eyebrow>REQUESTS</Eyebrow>
        <h2>You know what you need.</h2>
        <p>Send a specific timber requirement and let FPX help source suitable options.</p>
        <div className="pst-route-points">
          <div><h3>From our catalogue</h3><p>Add a catalogue product to your Request List when it is not currently available.</p></div>
          <div><h3>Custom request</h3><p>Send the specification, quantity and requirements when the job needs something more specific.</p></div>
        </div>
        <a href="https://app.fpx.nz/request-cart">Go to Request List <Arrow/></a>
      </div>
      <div className="pst-route-visual"><img src="/images/fpx-app-requests.png" alt="FPX request workflow"/></div>
      <div className="pst-route-path">
        <small>REQUEST PATH</small>
        <div>{requestSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h4>{title}</h4><p>{copy}</p></div>)}</div>
      </div>
    </article>

    <article id="source-shop" className="pst-route is-reverse">
      <div className="pst-route-copy">
        <span className="pst-route-number">02</span>
        <Eyebrow>SHOP / ORDER DIRECT</Eyebrow>
        <h2>See what’s available now.</h2>
        <p>Browse current timber, choose what fits and move directly into the order process.</p>
        <div className="pst-route-points">
          <div><h3>Available stock</h3><p>Browse timber that is currently available through FPX.</p></div>
          <div><h3>Specials</h3><p>Review discounted single-packet or multi-packet opportunities when available.</p></div>
        </div>
        <a href="https://app.fpx.nz/shop">Start shopping <Arrow/></a>
      </div>
      <div className="pst-route-visual"><img src="/images/fpx-app-shop.png" alt="FPX available timber shop"/></div>
      <div className="pst-route-path">
        <small>SHOP PATH</small>
        <div>{shopSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h4>{title}</h4><p>{copy}</p></div>)}</div>
      </div>
    </article>

    <article id="source-offers" className="pst-route">
      <div className="pst-route-copy">
        <span className="pst-route-number">03</span>
        <Eyebrow>OFFERS / ENQUIRE</Eyebrow>
        <h2>Spot an opportunity.</h2>
        <p>Explore current offers and enquire when an opportunity suits your requirement.</p>
        <div className="pst-route-points">
          <div><h3>Current offers</h3><p>Review current timber opportunities, then enquire so FPX can respond for your volumes and requirements.</p></div>
        </div>
        <a href="https://app.fpx.nz/offers">View offers & enquire <Arrow/></a>
      </div>
      <div className="pst-route-visual"><img src="/images/fpx-app-offers.png" alt="FPX current timber offers"/></div>
      <div className="pst-route-path">
        <small>OFFER PATH</small>
        <div>{offerSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h4>{title}</h4><p>{copy}</p></div>)}</div>
      </div>
    </article>
  </section>

  <section className="pst-close">
    <div><Eyebrow>ONE PLACE TO START</Eyebrow><h2>Different ways to buy.<br/>One sourcing service.</h2><p>FPX brings requests, available timber and current offers together for commercial timber buyers across New Zealand.</p></div>
    <AppButtons/>
  </section>
</>}

export function HowPage(){const steps=[["01","Start where you are","Shop available stock, review current offers or send a specific request. Start with the route that best matches what you know."],["02","Share the detail","Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier."],["03","Choose what fits","Review the timber options and the information around them, then choose the route that works for your team."],["04","Keep it moving","FPX keeps the order and delivery path connected so your team can follow the handover through to site."]];return <>
<section className="phw-hero"><div><Eyebrow>HOW FPX WORKS</Eyebrow><h1>From requirement<br/><span>to delivery.</span></h1><p>Start with the information you already have. FPX keeps the sourcing steps connected from the first requirement through to delivery.</p></div><div><img src="/images/fpx-app-requests.png" alt="FPX sourcing workflow"/></div></section>
<section className="phw-flow"><header><Eyebrow>THE PROCESS</Eyebrow><h2>Four clear stages.</h2><p>The detail changes by job. The shape of the process stays simple.</p></header><div>{steps.map(([num,title,copy])=><article key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
<section className="phw-close"><div><Eyebrow>START WHERE IT MAKES SENSE</Eyebrow><h2>Browse, enquire or request.</h2><p>Choose the route that best matches what you know about the job today.</p></div><AppButtons/></section>
</>}