"use client";
import React from "react";
import { Mail, Phone, MapPin, MessageSquareText } from "lucide-react";
import { LinkedInIcon, InstagramIcon, FacebookIcon } from "./social-icons";
import { Eyebrow, Arrow, Breadcrumbs, PageCTA } from "./master-shared";

const customerGroups=[
  {title:"Contractors & builders",blurb:"Timber for active jobs, upcoming projects and specific applications.",image:"product-groups/building-construction/building-deck-construction.png",alt:"Timber construction project in New Zealand"},
  {title:"Procurement teams",blurb:"Clear specifications and supported sourcing for commercial requirements.",image:"fpx-hero-timber-yard.webp",alt:"Commercial timber yard in New Zealand"},
  {title:"Timber merchants",blurb:"Ongoing product needs, spot requirements and supply opportunities.",image:"product-groups/manufacturing/manufacturing-warehouse-bundles.png",alt:"Timber bundles in a commercial warehouse"},
  {title:"Wood processors",blurb:"Feedstock and timber products aligned with manufacturing needs.",image:"product-groups/manufacturing/manufacturing-rollers.png",alt:"Timber processing line"}
];

export function CustomersPage(){
  const [active,setActive]=React.useState(0);
  const customerProfiles=[
    {title:"Contractors & builders",label:"BUILDERS & CONTRACTORS",blurb:"Timber for active jobs, upcoming projects and specific applications.",need:"Clear product fit, timing and an easy way to source what the job actually needs.",image:"fpx-customer-builder.png",alt:"Builder customer"},
    {title:"Procurement teams",label:"PROCUREMENT TEAMS",blurb:"Clear specifications and supported sourcing for commercial requirements.",need:"A structured way to compare requirements, keep specifications clear and move orders forward.",image:"fpx-customer-procurement.png",alt:"Procurement customer"},
    {title:"Timber merchants",label:"TIMBER MERCHANTS",blurb:"Ongoing product needs, spot requirements and supply opportunities.",need:"A practical way to handle repeat needs, spot requirements and opportunities without extra admin.",image:"fpx-customer-merchant.png",alt:"Timber merchant customer"},
    {title:"Wood processors",label:"WOOD PROCESSORS",blurb:"Feedstock and timber products aligned with manufacturing needs.",need:"Reliable feedstock visibility, useful specifications and a clear route to specific manufacturing requirements.",image:"fpx-customer-processor.png",alt:"Wood processor customer"}
  ];
  const current=customerProfiles[active];
  return <>
    <section className="poc2-hero">
      <img className="poc2-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="Commercial timber yard in New Zealand"/>
      <div className="poc2-hero-shade"/>
      <div className="poc2-hero-copy">
        <Eyebrow>OUR CUSTOMERS</Eyebrow>
        <h1>Built for businesses<br/>that buy timber.</h1>
        <p>FPX supports commercial timber buyers across New Zealand, from project teams to merchants and processors.</p>
      </div>
      <div className="poc2-hero-note"><span>4 CUSTOMER GROUPS</span><p>Different buying needs. One clearer sourcing experience.</p></div>
    </section>

    <section className="poc2-stage">
      <div className="poc2-stage-head">
        <Eyebrow>WHO USES FPX</Eyebrow>
        <h2>Choose a customer type.</h2>
        <p>Each group uses FPX differently. Select one to see where the platform fits.</p>
      </div>

      <div className="poc2-stage-body">
        <div className="poc2-people" role="tablist" aria-label="FPX customer groups">
          {customerProfiles.map((g,i)=><button key={g.title} type="button" className={active===i?"active":""} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} role="tab" aria-selected={active===i}>
            <img src={"/images/"+g.image} alt={g.alt}/>
            <span>0{i+1}</span>
            <b>{g.label}</b>
          </button>)}
        </div>

        <div className="poc2-detail" role="tabpanel">
          <span>0{active+1}</span>
          <small>{current.label}</small>
          <h3>{current.title}</h3>
          <p>{current.blurb}</p>
          <div className="poc2-need"><b>WHAT THEY NEED</b><p>{current.need}</p></div>
          <div className="poc2-detail-actions">
            <a href="https://app.fpx.nz/shop">Browse timber <Arrow/></a>
            <a href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a>
          </div>
        </div>
      </div>
    </section>

    <section className="poc2-deep">
      <div className="poc2-deep-head">
        <Eyebrow>BUYER PROFILES</Eyebrow>
        <h2>What each buyer actually needs.</h2>
        <p>Open a customer profile for the practical sourcing details that matter most to that type of buyer.</p>
      </div>

      <div className="poc2-deep-list">
        <details open>
          <summary><span>01</span><div><small>BUILDERS & CONTRACTORS</small><h3>Contractors & builders</h3></div><b aria-hidden="true">+</b></summary>
          <div className="poc2-deep-body">
            <article><small>TYPICAL NEED</small><h4>Timber matched to an active job.</h4><p>Product fit, dimensions, treatment, quantity and timing all need to line up with what is happening on site.</p></article>
            <article><small>WHAT MATTERS</small><h4>Clarity before commitment.</h4><p>Builders need to know what the product is, whether it suits the application, how much is available and when it can be supplied.</p></article>
            <article><small>HOW FPX HELPS</small><h4>Start with the job, not the catalogue.</h4><p>Browse suitable timber when the requirement is flexible, or create a request when the specification is already defined.</p></article>
            <article><small>BEST STARTING ROUTE</small><h4>Shop or Request List</h4><p>Use Shop for available timber. Use the Request List when the job needs a specific grade, dimension, treatment or quantity.</p></article>
            <article><small>PREPARE BEFORE SOURCING</small><h4>Bring the key job details.</h4><p>Application, dimensions, grade, treatment, quantity, required timing and delivery location where known.</p></article>
          </div>
        </details>

        <details>
          <summary><span>02</span><div><small>PROCUREMENT TEAMS</small><h3>Procurement teams</h3></div><b aria-hidden="true">+</b></summary>
          <div className="poc2-deep-body">
            <article><small>TYPICAL NEED</small><h4>A structured commercial requirement.</h4><p>Procurement teams often need to source to a defined specification while keeping product information, quantities and timing organised.</p></article>
            <article><small>WHAT MATTERS</small><h4>Consistency across the requirement.</h4><p>Clear specifications, comparable options and a sourcing trail that can be understood internally.</p></article>
            <article><small>HOW FPX HELPS</small><h4>Bring the requirement into one sourcing flow.</h4><p>FPX gives teams a place to browse, review offers or send a structured product request without rebuilding the requirement across separate emails and documents.</p></article>
            <article><small>BEST STARTING ROUTE</small><h4>Request List or Offers</h4><p>Use Requests for defined procurement requirements. Review Offers when a current opportunity may suit the specification or volume.</p></article>
            <article><small>PREPARE BEFORE SOURCING</small><h4>Define the commercial brief.</h4><p>Product, specification, quantity, treatment, timing, delivery requirements and any non-negotiable project conditions.</p></article>
          </div>
        </details>

        <details>
          <summary><span>03</span><div><small>TIMBER MERCHANTS</small><h3>Timber merchants</h3></div><b aria-hidden="true">+</b></summary>
          <div className="poc2-deep-body">
            <article><small>TYPICAL NEED</small><h4>Ongoing stock and spot requirements.</h4><p>Merchants may be filling a known gap, responding to a customer need or looking for commercially useful timber opportunities.</p></article>
            <article><small>WHAT MATTERS</small><h4>Product relevance and commercial fit.</h4><p>Grade, dimensions, quantity, pricing, lead time and whether the product complements existing stock or customer demand.</p></article>
            <article><small>HOW FPX HELPS</small><h4>More than one way to source.</h4><p>Browse available timber, review current offers or send a specific requirement when the product is not already visible.</p></article>
            <article><small>BEST STARTING ROUTE</small><h4>Shop, Offers or Requests</h4><p>Merchants can use all three sourcing routes depending on whether the requirement is immediate, opportunistic or highly specific.</p></article>
            <article><small>PREPARE BEFORE SOURCING</small><h4>Know the target product.</h4><p>Preferred grades, dimensions, quantity, treatment, acceptable alternatives and the commercial timing of the requirement.</p></article>
          </div>
        </details>

        <details>
          <summary><span>04</span><div><small>WOOD PROCESSORS</small><h3>Wood processors</h3></div><b aria-hidden="true">+</b></summary>
          <div className="poc2-deep-body">
            <article><small>TYPICAL NEED</small><h4>Feedstock that suits production.</h4><p>Processors need timber that aligns with manufacturing inputs, recovery expectations and the specifications of the finished product.</p></article>
            <article><small>WHAT MATTERS</small><h4>Grade, size and consistency.</h4><p>Feedstock characteristics need to make commercial sense for the process, yield and intended output.</p></article>
            <article><small>HOW FPX HELPS</small><h4>Make specific feedstock requirements easier to communicate.</h4><p>Browse available manufacturing timber or send FPX the exact grade, size, quantity and other requirements needed for production.</p></article>
            <article><small>BEST STARTING ROUTE</small><h4>Shop or Request List</h4><p>Use Shop when suitable feedstock is already available. Use Requests when the manufacturing requirement is more specific.</p></article>
            <article><small>PREPARE BEFORE SOURCING</small><h4>Define the feedstock requirement.</h4><p>Grade, dimensions, acceptable characteristics, volume, moisture or treatment requirements where relevant, and required timing.</p></article>
          </div>
        </details>
      </div>
    </section>

    <section className="poc2-close">
      <div><Eyebrow>START SOURCING</Eyebrow><h2>Start with the requirement you have.</h2><p>Browse available timber or send FPX the detail you already know.</p></div>
      <div className="m-actions"><a className="m-btn m-btn-primary" href="https://app.fpx.nz/shop">Browse timber <Arrow/></a><a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a></div>
    </section>
  </>;
}

export function AboutPage(){const team=[{name:"George Harman",role:"Director",image:"https://assets.softr-files.com/applications/bfc5c9f5-7e6e-44f9-b058-0da4dbec6efe/assets/6446200e-fdaf-4b71-8073-c9287ca48b93.png",copy:"George brings hands-on timber industry experience to FPX, with a focus on practical sourcing, commercial relationships and making the buying process easier to navigate."},{name:"Gabriela Molloy",role:"General Manager",image:"https://assets.softr-files.com/applications/bfc5c9f5-7e6e-44f9-b058-0da4dbec6efe/assets/2d8c0d1f-62c9-454a-8e12-a6786ac94371.png",copy:"Gabriela leads the day-to-day delivery of FPX, helping keep the sourcing experience clear, responsive and useful for timber buyers across New Zealand."}];return <>
  <section className="pa-hero"><div className="pa-hero-copy"><Eyebrow>ABOUT FPX</Eyebrow><h1>Built around the way<br/><span>New Zealand buys timber.</span></h1><p>FPX gives commercial timber buyers a clearer digital starting point for sourcing, backed by people who understand the products, the market and the practical details that matter.</p></div><div className="pa-hero-image"><img src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber yard"/></div></section>
  <section className="pa-facts"><article><small>LEGAL COMPANY</small><h3>Forest Products Exchange Limited</h3><p>Company number 8469278</p></article><article><small>WHAT FPX DOES</small><h3>Commercial timber sourcing across New Zealand</h3><p>Browse timber, review offers or send specific requirements.</p></article><article><small>COMPANY RELATIONSHIP</small><h3>FPX Sourcing is backed by Sutcliffe Trading Limited</h3><p>Digital sourcing supported by New Zealand timber trading experience.</p></article></section>
  <section className="pa-story"><div><Eyebrow>WHY FPX EXISTS</Eyebrow><h2>A simpler way to move from requirement to supply.</h2></div><div><p>Timber buying can involve a lot of moving parts: product specifications, availability, pricing, lead times and delivery requirements. FPX brings those starting points together so buyers can browse, compare and request timber in one place.</p><p>The website helps buyers understand the range. The FPX sourcing platform carries the detail, from current timber and offers through to specific product requests.</p></div></section>
  <section className="pa-principles"><article><span>01</span><h3>Clear product information</h3><p>Understand the timber range before moving into detailed specifications and current availability.</p></article><article><span>02</span><h3>Flexible ways to start</h3><p>Browse stock, review current offers or send a specific timber requirement.</p></article><article><span>03</span><h3>Timber knowledge when it matters</h3><p>Digital tools are supported by people who understand commercial timber sourcing in New Zealand.</p></article></section>
  <section className="pa-team"><header><Eyebrow>THE PEOPLE BEHIND FPX</Eyebrow><h2>Industry experience.<br/>Practical support.</h2><p>FPX combines a digital sourcing experience with a team that understands the New Zealand timber trade.</p></header><div>{team.map(person=><article key={person.name}><div className="pa-team-image"><img src={person.image} alt={person.name}/></div><small>{person.role}</small><h3>{person.name}</h3><p>{person.copy}</p></article>)}</div></section>
  <section className="pa-close"><div><Eyebrow>NEW ZEALAND FOCUSED</Eyebrow><h2>Designed for commercial timber buyers across New Zealand.</h2><p>FPX helps project teams, merchants, processors and other timber buyers move from product discovery to a clear sourcing path.</p></div><div className="m-actions"><a className="m-btn m-btn-primary" href="https://app.fpx.nz/shop">Browse timber <Arrow/></a><a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a></div></section>
</>;}

export function ContactPage(){return <>
  <section className="pct-hero"><img src="/images/fpx-hero-timber-yard.webp" alt="Commercial timber yard in New Zealand"/><div className="pct-hero-shade"/><div className="pct-hero-copy"><Eyebrow>CONTACT FPX</Eyebrow><h1>Tell us what timber<br/>you need.</h1><p>Contact Forest Products Exchange for commercial timber sourcing requirements, FPX platform support or general enquiries across New Zealand.</p><div className="pct-quick"><a href="mailto:support@fpx.nz"><Mail/>support@fpx.nz</a><a href="tel:+642108473262"><Phone/>+64 210 847 3262</a><span><MapPin/>New Zealand</span></div></div></section>
  <section className="pct-main"><aside><Eyebrow>START HERE</Eyebrow><h2>What can we help with?</h2><p>If you already know the timber specification, include the dimensions, grade, treatment and quantity. If you do not, tell us about the application and we can help you choose a starting point.</p><nav className="pct-routes"><a href="https://app.fpx.nz/shop"><span>01</span><b>Browse available timber</b><Arrow/></a><a href="https://app.fpx.nz/request-cart"><span>02</span><b>Create a timber request</b><Arrow/></a><a href="https://app.fpx.nz/offers"><span>03</span><b>Review current offers</b><Arrow/></a></nav><nav className="pct-social" aria-label="FPX social profiles"><a href="https://www.linkedin.com/company/forest-products-exchange" target="_blank" rel="noreferrer" aria-label="FPX on LinkedIn"><LinkedInIcon/></a><a href="https://www.instagram.com/fpx.nz/" target="_blank" rel="noreferrer" aria-label="FPX on Instagram"><InstagramIcon/></a><a href="https://www.facebook.com/people/Forest-Products-Exchange/61583101360304/" target="_blank" rel="noreferrer" aria-label="FPX on Facebook"><FacebookIcon/></a></nav></aside><form className="pct-form" aria-label="Contact FPX"><div className="pct-form-head"><MessageSquareText/><div><small>GENERAL ENQUIRY</small><h2>Send FPX a message.</h2></div></div><div className="pct-fields"><label>Full name<input name="name" autoComplete="name" placeholder="Your name"/></label><label>Company<input name="company" autoComplete="organization" placeholder="Company name"/></label><label>Email<input name="email" type="email" autoComplete="email" placeholder="you@company.co.nz"/></label><label>Phone<input name="phone" autoComplete="tel" placeholder="Your phone number"/></label><label className="wide">What can we help with?<select name="topic" defaultValue="Timber sourcing requirement"><option>Timber sourcing requirement</option><option>Using the FPX platform</option><option>General enquiry</option></select></label><label className="wide">Message<textarea name="message" placeholder="Tell us what timber you need, including dimensions, grade, treatment and quantity if known."/></label></div><a className="pct-email-link" href="mailto:support@fpx.nz">Email support@fpx.nz <Arrow/></a><small>Direct form sending will be connected once the FPX Resend integration is added.</small></form></section>
</>;}
