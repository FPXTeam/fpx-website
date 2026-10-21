"use client";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow, Arrow, AppButtons } from "./master-shared";

const requestSteps=[
  ["01","Submit request","Add the product, specification, quantity and delivery requirements you know."],
  ["02","Requirement reviewed","The requirement is reviewed and suitable sourcing options are identified."],
  ["03","Review quotation","Review the product, pricing and relevant supply details."],
  ["04","Confirm order","Confirm the option that works for the requirement."]
];
const shopSteps=[
  ["01","Browse Stock","Explore available timber, specifications and pricing."],
  ["02","Review fit","Check product details, specials and tier-volume pricing where available."],
  ["03","Continue in FPX","Eligible customers can move into the ordering experience through their FPX account."]
];

export function SourceTimberPage(){return <>
  <section className="pst-hero">
    <Image src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in New Zealand" width={1920} height={1200} sizes="100vw" priority/>
    <div className="pst-hero-shade"/>
    <div className="pst-hero-copy">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h1>Source timber with<br/><span className="headline-accent">a clear way in.</span></h1>
      <p>Browse timber already available through FPX, or submit a timber requirement when the product, specification or quantity you need is not listed.</p>
      <AppButtons/>
    </div>
  </section>

  <section className="pst-positioning" aria-labelledby="what-is-fpx-sourcing">
    <div className="pst-positioning-main">
      <Eyebrow>WHAT IS FPX SOURCING?</Eyebrow>
      <h2 id="what-is-fpx-sourcing">A digital way to source commercial timber.</h2>
      <p>FPX is the customer-facing platform for browsing available timber and pricing, submitting requirements, reviewing quotations and managing orders. FPX Sourcing is operated commercially by Sutcliffe Trading.</p>
    </div>
    <aside className="pst-access-note" aria-label="Explore FPX before signing up">
      <span className="pst-access-kicker">EXPLORE BEFORE YOU SIGN UP</span>
      <h3>No account needed to start.</h3>
      <p>Browse available timber or submit a timber requirement first. Full FPX access adds the customer account experience for quotations, orders and account tools.</p>
      <a className="pst-access-primary" href="https://app.fpx.nz/explore-fpx-sourcing">Explore FPX Sourcing <Arrow/></a>
    </aside>
  </section>

  <section className="pst-intro">
    <Eyebrow>TWO SOURCING ROUTES</Eyebrow>
    <h2>Choose the route that matches the requirement.</h2>
    <p>Start with available Stock when the timber is already listed. Use a Request when the product, specification or quantity you need is not currently available.</p>
    <nav aria-label="FPX sourcing routes">
      <a href="#source-stock"><span>01</span>Stock</a>
      <a href="#source-request"><span>02</span>Request</a>
    </nav>
  </section>

  <section className="pst-routes pst-routes-no-app">
    <article id="source-stock" className="pst-route">
      <div className="pst-route-copy">
        <span className="pst-route-number">01</span>
        <Eyebrow>BROWSE STOCK</Eyebrow>
        <h2>See what is available.</h2>
        <p>Browse timber currently available through FPX and review the information provided for each listing.</p>
        <div className="pst-route-points">
          <div><h3>Product information</h3><p>Review available timber, specifications and pricing through FPX.</p></div>
          <div><h3>Commercial pricing</h3><p>Specials and tier-volume pricing can be shown where available. Merchants and commercial end users can order available timber subject to account access.</p></div>
        </div>
      </div>
      <details className="pst-route-path">
        <summary><span>STOCK PATH</span><small>3 steps</small><b aria-hidden="true">+</b></summary>
        <div>{shopSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing">Browse timber <Arrow/></a>
    </article>

    <article id="source-request" className="pst-route is-reverse">
      <div className="pst-route-copy">
        <span className="pst-route-number">02</span>
        <Eyebrow>REQUEST TIMBER</Eyebrow>
        <h2>Tell us what you need.</h2>
        <p>Submit a specific timber requirement when the product, specification or quantity you need is not listed or currently available.</p>
        <div className="pst-route-points">
          <div><h3>From the timber range</h3><p>Start with a known product or application and provide the specification and quantity required.</p></div>
          <div><h3>Specific requirement</h3><p>Submit the detail you know, including delivery requirements and timing where relevant.</p></div>
        </div>
      </div>
      <details className="pst-route-path">
        <summary><span>REQUEST PATH</span><small>4 steps</small><b aria-hidden="true">+</b></summary>
        <div>{requestSteps.map(([num,title,copy])=><div key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </details>
      <a className="pst-route-cta" href="https://app.fpx.nz/explore-fpx-sourcing?request=1">Submit a timber request <Arrow/></a>
    </article>
  </section>

  <section className="pst-close">
    <div><Eyebrow>ONE PLACE TO START</Eyebrow><h2>Browse what is available.<br/><span className="headline-accent">Request what is not.</span></h2><p>Start through public FPX Sourcing. Existing customers can continue through quotations and order management in their FPX account.</p></div>
    <AppButtons/>
  </section>
</>}

export function HowPage(){const steps=[["01","Browse or submit","Browse available Stock or submit a specific timber requirement without creating an account."],["02","Share the detail","Add the specification, quantity and delivery information that matters to the requirement."],["03","Review the quotation","Review the product, pricing and relevant supply information provided."],["04","Manage the order","Confirmed customers can continue through their FPX account for order information and account tools."]];return <>
<section className="phw-hero phw-hero-no-app"><div><Eyebrow>HOW FPX WORKS</Eyebrow><h1>From requirement<br/><span className="headline-accent">to order.</span></h1><p>Start by browsing available timber or submitting a Request. FPX keeps the customer journey connected through quotation and order management.</p><div className="phw-route-tags" aria-label="Ways to start with FPX"><span>Browse Stock</span><span>Submit a Request</span></div></div></section>
<section className="phw-flow"><header><Eyebrow>THE PROCESS</Eyebrow><h2>Four clear stages.</h2><p>The detail changes by requirement. The overall customer journey stays straightforward.</p></header><div>{steps.map(([num,title,copy])=><article key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
<section className="phw-close"><div><Eyebrow>START WHERE IT MAKES SENSE</Eyebrow><h2>Browse or submit a requirement.</h2><p>Choose the route that best matches what you need today.</p><nav className="phw-related" aria-label="Related FPX sourcing information"><Link href="/fpx-sourcing">FPX Sourcing</Link><Link href="/timber">Timber Range</Link><Link href="/frequently-asked-questions">Sourcing FAQ</Link></nav></div><AppButtons/></section>
</>}
