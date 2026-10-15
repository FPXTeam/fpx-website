"use client";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow, Arrow, AppButtons } from "./master-shared";

const requestSteps=[
  ["01","Submit Request","Tell FPX the product, specification, quantity and timing you know."],
  ["02","FPX sources","FPX identifies suitable options from current supply and wider timber supply routes."],
  ["03","Review options","Compare product, pricing and lead time."],
  ["04","Place order","Confirm what works for the requirement."]
];
const shopSteps=[
  ["01","Browse Stock","Review current timber Stock and product information."],
  ["02","Review fit","Check the detail and decide whether it suits the requirement."],
  ["03","Continue in FPX","Active customers can move into the full ordering experience."]
];
const offerSteps=[
  ["01","Enquire","Send an enquiry on the Offer."],
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
    <Eyebrow>THREE WAYS TO SOURCE THROUGH FPX</Eyebrow>
    <h2>Start with what you know.</h2>
    <p>Browse current Stock, review Offers or send a specific Request. If the right timber is not shown online, FPX can source wider through suitable New Zealand sawmills, processors and trade supply routes.</p>
  </div>
  <SourceFeature index="01" eyebrow="REQUESTS" title="You know what you need." copy="Send a specific commercial timber requirement and let FPX identify suitable sourcing options." items={[{title:"From the catalogue",copy:"Add a catalogue product to your Request List when it is not currently available."},{title:"Specific requirement",copy:"Send the specification, quantity and timing when the job needs something more specific or the product is not listed."}]} cta="Create a Request" href="https://app.fpx.nz/explore-fpx-sourcing?request=1" steps={requestSteps} label="REQUEST PATH"/>
  <SourceFeature index="02" eyebrow="BROWSE STOCK" title="See what’s available now." copy="Browse current timber Stock and product information without creating an account. Active FPX customers can continue into the full ordering experience." items={[{title:"Public exploration",copy:"Browse current Stock and inspect useful product information through Explore FPX Sourcing."},{title:"Full customer access",copy:"Sign in or request FPX access for customer-specific pricing, commercial quantities, orders and account tools."}]} cta="Browse Stock" href="https://app.fpx.nz/explore-fpx-sourcing" steps={shopSteps} label="STOCK PATH" reverse/>
  <SourceFeature index="03" eyebrow="VIEW OFFERS" title="Spot an opportunity." copy="Review current timber Offers and enquire when an opportunity suits your requirement." items={[{title:"Current Offers",copy:"Review current packet and bulk timber opportunities, then enquire so FPX can respond for your volumes and requirements."}]} cta="View Offers" href="https://app.fpx.nz/explore-fpx-sourcing?view=offers" steps={offerSteps} label="OFFER PATH"/>
</section>}

function SourceClosing(){return <section className="m-source-closing-premium">
  <div><Eyebrow>ONE SOURCING JOURNEY</Eyebrow><h2>Start with what is available.<br/><span className="headline-accent">Request what is not.</span></h2><p>FPX brings Stock, Offers and specific timber Requests into one sourcing path for timber merchants, wood processors, builders, contractors and commercial project teams across New Zealand.</p></div>
  <div className="m-source-closing-actions"><AppButtons/></div>
</section>}

export function SourceTimberPage(){return <>
  <section className="pst-hero">
    <Image src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in New Zealand" width={1920} height={1200} sizes="100vw" priority/>
    <div className="pst-hero-shade"/>
    <div className="pst-hero-copy">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h1>Commercial timber sourcing,<br/><span className="headline-accent">with a clear way in.</span></h1>
      <p>Browse current Stock, review Offers or send FPX a specific timber Request before creating an account. If the right timber is not listed, FPX can source wider through suitable New Zealand sawmills, processors and trade supply routes.</p>
      <AppButtons/>
    </div>
  </section>

  <section className="pst-positioning" aria-labelledby="what-is-fpx-sourcing">
    <div className="pst-positioning-main">
      <Eyebrow>WHAT IS FPX SOURCING?</Eyebrow>
      <h2 id="what-is-fpx-sourcing">A clearer way to source commercial timber.</h2>
      <p>FPX Sourcing is a digital timber sourcing service for commercial buyers in New Zealand, supported by practical timber trading and sourcing expertise. Current Stock and Offers are the starting point; specific Requests let FPX source beyond what is shown online.</p>
    </div>
    <aside className="pst-access-note" aria-label="Explore FPX before signing up">
      <span className="pst-access-kicker">EXPLORE BEFORE YOU SIGN UP</span>
      <h3>No account needed to start.</h3>
      <p>Browse Stock, review Offers and create a Request first. Full customer access adds customer-specific pricing, commercial quantities, orders and account tools.</p>
      <a className="pst-access-primary" href="https://app.fpx.nz/explore-fpx-sourcing">Explore FPX Sourcing <Arrow/></a>
    </aside>
  </section>

  <section className="pst-intro">
    <Eyebrow>THREE SOURCING ROUTES</Eyebrow>
    <h2>Choose the route that matches the requirement.</h2>
    <p>Requests, current Stock and Offers each suit a different sourcing situation. Start with what you know today and keep the same FPX journey as the requirement develops.</p>
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
        <p>Send a specific commercial timber requirement and let FPX identify suitable sourcing options.</p>
        <div className="pst-route-points">
          <div><h3>From the catalogue</h3><p>Add a catalogue product to your Request List when it is not currently available.</p></div>
          <div><h3>Specific requirement</h3><p>Send the specification, quantity and timing when the job needs something more specific or the product is not listed.</p></div>
        </div>
      </div>
      <details className="pst-route-path">
        <summary><span>REQUEST PATH</span><small>4 steps</small><b aria-hidden="true">+</b></summary>
        <div>{requestSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing?request=1">Create a Request <Arrow/></a>
    </article>

    <article id="source-stock" className="pst-route is-reverse">
      <div className="pst-route-copy">
        <span className="pst-route-number">02</span>
        <Eyebrow>BROWSE STOCK</Eyebrow>
        <h2>See what’s available now.</h2>
        <p>Browse current timber Stock and product information without creating an account. Active FPX customers can continue into the full ordering experience.</p>
        <div className="pst-route-points">
          <div><h3>Public exploration</h3><p>Browse current Stock and inspect useful product information through Explore FPX Sourcing.</p></div>
          <div><h3>Full customer access</h3><p>Sign in or request FPX access for customer-specific pricing, commercial quantities, orders and account tools.</p></div>
        </div>
      </div>
      <details className="pst-route-path">
        <summary><span>STOCK PATH</span><small>3 steps</small><b aria-hidden="true">+</b></summary>
        <div>{shopSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing">Browse Stock <Arrow/></a>
    </article>

    <article id="source-offers" className="pst-route">
      <div className="pst-route-copy">
        <span className="pst-route-number">03</span>
        <Eyebrow>VIEW OFFERS</Eyebrow>
        <h2>Spot an opportunity.</h2>
        <p>Review current timber Offers and enquire when an opportunity suits your requirement.</p>
        <div className="pst-route-points">
          <div><h3>Current Offers</h3><p>Review current packet and bulk timber opportunities, then enquire so FPX can respond for your volumes and requirements.</p></div>
        </div>
      </div>
      <details className="pst-route-path">
        <summary><span>OFFER PATH</span><small>3 steps</small><b aria-hidden="true">+</b></summary>
        <div>{offerSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing?view=offers">View Offers <Arrow/></a>
    </article>
  </section>

  <section className="pst-close">
    <div><Eyebrow>ONE PLACE TO START</Eyebrow><h2>Start with what is available.<br/><span className="headline-accent">Request what is not.</span></h2><p>Browse current Stock and Offers first. If you need something more specific, create a Request and continue the same FPX sourcing journey. Sign in or request access when you need the full customer experience.</p></div>
    <AppButtons/>
  </section>
</>}

export function HowPage(){const steps=[["01","Start where you are","Browse current Stock, review Offers or submit a specific Request without creating an account. Start with the route that best matches what you know."],["02","Share the detail","Add the dimensions, grade, treatment, quantity and timing that matter to the requirement. Clear inputs make sourcing easier."],["03","Review what fits","FPX helps identify suitable timber options, including wider sourcing when the right product is not shown online."],["04","Keep it moving","Once the right option is agreed, FPX keeps the quote, order and delivery path connected for the customer."]];return <>
<section className="phw-hero phw-hero-no-app"><div><Eyebrow>HOW FPX WORKS</Eyebrow><h1>From requirement<br/><span className="headline-accent">to delivery.</span></h1><p>Start by exploring FPX without creating an account. Browse current Stock, review Offers or create a Request. If the right timber is not listed, FPX can source wider before the process moves into quote, order and delivery.</p><div className="phw-route-tags" aria-label="Ways to start with FPX"><span>Browse Stock</span><span>View Offers</span><span>Create a Request</span></div></div></section>
<section className="phw-flow"><header><Eyebrow>THE PROCESS</Eyebrow><h2>Four clear stages.</h2><p>The detail changes by requirement. The sourcing path stays connected.</p></header><div>{steps.map(([num,title,copy])=><article key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
<section className="phw-close"><div><Eyebrow>START WHERE IT MAKES SENSE</Eyebrow><h2>Browse Stock, view Offers or create a Request.</h2><p>Choose the route that best matches what you know about the requirement today.</p><nav className="phw-related" aria-label="Related FPX sourcing information"><Link href="/fpx-sourcing">FPX Sourcing</Link><Link href="/timber">Timber Range</Link><Link href="/frequently-asked-questions">Sourcing FAQ</Link></nav></div><AppButtons/></section>
</>}
