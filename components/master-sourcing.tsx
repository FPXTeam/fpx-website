"use client";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow, Arrow, AppButtons } from "./master-shared";

const requestSteps=[
  ["01","Submit request","Tell FPX what you need."],
  ["02","FPX sources","Suitable options are identified."],
  ["03","Review options","Compare product, pricing and lead time."],
  ["04","Place order","Confirm what works for the job."]
];
const shopSteps=[
  ["01","Explore supply","Browse current timber and product information."],
  ["02","Review fit","Check the detail and decide whether it suits the requirement."],
  ["03","Continue in FPX","Active customers can move into the full ordering experience."]
];
const offerSteps=[
  ["01","Enquire","Send an enquiry on the offer."],
  ["02","FPX responds","Pricing is provided for your requirement."],
  ["03","Review & confirm","Confirm the option that suits."]
];

function JourneySteps({label,steps}:{label:string,steps:string[][]}){
  return <div className="m-source-journey"><small>{label}</small><div>{steps.map(([num,title,copy])=><article key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div>
}

function SourceFeature({index,eyebrow,title,copy,items,cta,href,steps,label,reverse=false}:{index:string,eyebrow:string,title:string,copy:string,items:{title:string,copy:string}[],cta:string,href:string,steps:string[][],label:string,reverse?:boolean}){
  return <section className={`m-source-feature m-source-feature-no-app ${reverse?"is-reverse":""}`}>
    <div className="m-source-feature-copy">
      <span className="m-source-feature-index">{index}</span>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      <p className="m-source-feature-lead">{copy}</p>
      <div className="m-source-feature-points">{items.map(item=><div key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></div>)}</div>
      <a className="m-source-feature-link" href={href}>{cta}<Arrow/></a>
    </div>
    <JourneySteps label={label} steps={steps}/>
  </section>
}

function SourceStory(){return <section className="m-source-story-premium">
  <div className="m-source-story-intro">
    <Eyebrow>THERE ARE MULTIPLE WAYS TO SOURCE THROUGH FPX</Eyebrow>
    <h2>Start with what you know.</h2>
    <p>You do not need to learn the whole platform before you begin. Choose the route that matches the job, then FPX carries the detail forward.</p>
  </div>
  <SourceFeature index="01" eyebrow="REQUESTS" title="You know what you need." copy="Send a specific timber requirement and let FPX help source suitable options." items={[{title:"From our catalogue",copy:"Add a catalogue product to your Request List when it is not currently available."},{title:"Custom request",copy:"Send the specification, quantity and requirements when the job needs something more specific."}]} cta="Go to Request List" href="https://app.fpx.nz/explore-fpx-sourcing?request=1" steps={requestSteps} label="REQUEST PATH"/>
  <SourceFeature index="02" eyebrow="EXPLORE SUPPLY" title="See what’s available now." copy="Browse current timber and product information without creating an account. Active FPX customers can continue into the full ordering experience." items={[{title:"Public exploration",copy:"Browse current timber supply and inspect product information through Explore FPX Sourcing."},{title:"Full customer access",copy:"Sign in or request FPX access for customer-specific pricing, commercial quantities, orders and account tools."}]} cta="Browse timber" href="https://app.fpx.nz/explore-fpx-sourcing" steps={shopSteps} label="SUPPLY PATH" reverse/>
  <SourceFeature index="03" eyebrow="OFFERS - ENQUIRE" title="Spot an opportunity." copy="Explore current offers and enquire when an opportunity suits your requirement." items={[{title:"Current offers",copy:"Review current timber opportunities, then enquire so FPX can respond for your volumes and requirements."}]} cta="View offers & enquire" href="https://app.fpx.nz/explore-fpx-sourcing?view=offers" steps={offerSteps} label="OFFER PATH"/>
</section>}

function SourceClosing(){return <section className="m-source-closing-premium">
  <div><Eyebrow>ONE NETWORK. MORE OPTIONS.</Eyebrow><h2>One place to start.<br/><span className="headline-accent">Different ways to buy.</span></h2><p>FPX brings sourcing routes together for timber merchants, wood processors, builders, contractors and commercial project teams across New Zealand.</p></div>
  <div className="m-source-closing-actions"><AppButtons/></div>
</section>}

export function SourceTimberPage(){return <>
  <section className="pst-hero">
    <Image src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in New Zealand" width={1920} height={1200} sizes="100vw" priority/>
    <div className="pst-hero-shade"/>
    <div className="pst-hero-copy">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h1>Source timber with<br/><span className="headline-accent">a clear way in.</span></h1>
      <p>Start with what you know. Explore available timber, review current offers or build a specific request before creating an account. FPX gives each requirement a clear starting point.</p>
      <AppButtons/>
    </div>
  </section>

  <section className="pst-positioning" aria-labelledby="what-is-fpx-sourcing">
    <div className="pst-positioning-main">
      <Eyebrow>WHAT IS FPX SOURCING?</Eyebrow>
      <h2 id="what-is-fpx-sourcing">A clearer way to source commercial timber.</h2>
      <p>FPX Sourcing is a digital timber sourcing service for commercial buyers in New Zealand. Browse current timber, review offers or send a specific requirement, with practical timber sourcing expertise behind the platform.</p>
    </div>
    <aside className="pst-access-note" aria-label="Explore FPX before signing up">
      <span className="pst-access-kicker">EXPLORE BEFORE YOU SIGN UP</span>
      <h3>No account needed to start.</h3>
      <p>Explore timber, offers and requests first. Full customer access adds customer-specific pricing, commercial quantities, orders and account tools.</p>
      <a className="pst-access-primary" href="https://app.fpx.nz/explore-fpx-sourcing">Explore FPX Sourcing <Arrow/></a>
    </aside>
  </section>

  <section className="pst-intro">
    <Eyebrow>THREE SOURCING ROUTES</Eyebrow>
    <h2>Choose the route that matches the job.</h2>
    <p>Requests, available supply and offers each solve a different sourcing situation. Start with the route that best matches what you know today.</p>
    <nav aria-label="FPX sourcing routes">
      <a href="#source-request"><span>01</span>Request</a>
      <a href="#source-stock"><span>02</span>Stock</a>
      <a href="#source-offers"><span>03</span>Offers</a>
    </nav>
  </section>

  <section className="pst-routes pst-routes-no-app">
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
      </div>
      <details className="pst-route-path">
        <summary><span>REQUEST PATH</span><small>4 steps</small><b aria-hidden="true">+</b></summary>
        <div>{requestSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing?request=1">Go to Request List <Arrow/></a>
    </article>

    <article id="source-stock" className="pst-route is-reverse">
      <div className="pst-route-copy">
        <span className="pst-route-number">02</span>
        <Eyebrow>EXPLORE SUPPLY</Eyebrow>
        <h2>See what’s available now.</h2>
        <p>Browse current timber and product information without creating an account. Active FPX customers can continue into the full ordering experience.</p>
        <div className="pst-route-points">
          <div><h3>Public exploration</h3><p>Browse current timber supply and inspect product information through Explore FPX Sourcing.</p></div>
          <div><h3>Full customer access</h3><p>Sign in or request FPX access for customer-specific pricing, commercial quantities, orders and account tools.</p></div>
        </div>
      </div>
      <details className="pst-route-path">
        <summary><span>SUPPLY PATH</span><small>3 steps</small><b aria-hidden="true">+</b></summary>
        <div>{shopSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing">Browse timber <Arrow/></a>
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
      </div>
      <details className="pst-route-path">
        <summary><span>OFFER PATH</span><small>3 steps</small><b aria-hidden="true">+</b></summary>
        <div>{offerSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing?view=offers">View offers & enquire <Arrow/></a>
    </article>
  </section>

  <section className="pst-close">
    <div><Eyebrow>ONE PLACE TO START</Eyebrow><h2>Explore first.<br/><span className="headline-accent">Go further when you’re ready.</span></h2><p>Start with public FPX Sourcing to explore timber, offers and requests. Sign in or request access when you need the full customer experience.</p></div>
    <AppButtons/>
  </section>
</>}

export function HowPage(){const steps=[["01","Start where you are","Explore current timber supply, review offers or submit a specific request without creating an account. Start with the route that best matches what you know."],["02","Share the detail","Add the dimensions, grade, treatment and quantity that matter to the job. Clear inputs make the next step easier."],["03","Choose what fits","Review the timber options and the information around them, then choose the route that works for your team."],["04","Keep it moving","FPX keeps the order and delivery path connected so your team can follow the handover through to site."]];return <>
<section className="phw-hero phw-hero-no-app"><div><Eyebrow>HOW FPX WORKS</Eyebrow><h1>From requirement<br/><span className="headline-accent">to delivery.</span></h1><p>Start by exploring FPX without creating an account. Browse timber, review offers or build a request, then move into the full customer experience when you are ready.</p><div className="phw-route-tags" aria-label="Ways to start with FPX"><span>Browse timber</span><span>Review offers</span><span>Create a request</span></div></div></section>
<section className="phw-flow"><header><Eyebrow>THE PROCESS</Eyebrow><h2>Four clear stages.</h2><p>The detail changes by job. The shape of the process stays simple.</p></header><div>{steps.map(([num,title,copy])=><article key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
<section className="phw-close"><div><Eyebrow>START WHERE IT MAKES SENSE</Eyebrow><h2>Browse, enquire or request.</h2><p>Choose the route that best matches what you know about the job today.</p><nav className="phw-related" aria-label="Related FPX sourcing information"><Link href="/fpx-sourcing">FPX Sourcing</Link><Link href="/timber">Timber Range</Link><Link href="/frequently-asked-questions">Sourcing FAQ</Link></nav></div><AppButtons/></section>
</>}
