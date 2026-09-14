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
  const customerProfiles=[
    {
      title:"Contractors & builders",
      label:"BUILDERS & CONTRACTORS",
      blurb:"Timber for active jobs, upcoming projects and specific applications.",
      need:"Clear product fit, timing and an easy way to source what the job actually needs.",
      focusTitle:"Product fit",
      focusCopy:"Clear product fit, timing and an easy way to source what the job actually needs.",
      image:"fpx-customer-builder.png",
      alt:"Builder customer",
      pillars:[
        ["Know what fits the job.","Understand product group, application, grade, treatment and key specifications before committing."],
        ["Start with the job requirement.","Browse available timber when the need is flexible, or create a request when the specification is already defined."],
        ["Keep timing visible.","Use FPX to keep product, quantity and delivery timing connected to what is happening on site."]
      ]
    },
    {
      title:"Procurement teams",
      label:"PROCUREMENT TEAMS",
      blurb:"Clear specifications and supported sourcing for commercial requirements.",
      need:"A structured way to compare requirements, keep specifications clear and move orders forward.",
      focusTitle:"Specification clarity",
      focusCopy:"Keep the requirement organised so options can be reviewed against the same commercial brief.",
      image:"fpx-customer-procurement.png",
      alt:"Procurement customer",
      pillars:[
        ["Keep the brief consistent.","Bring dimensions, grade, treatment, quantity, timing and delivery requirements into one clear sourcing requirement."],
        ["Compare against the same need.","Use FPX to review suitable options without losing the original commercial specification."],
        ["Keep handovers clear.","Move from requirement to review and order with the detail easier for internal teams to follow."]
      ]
    },
    {
      title:"Timber merchants",
      label:"TIMBER MERCHANTS",
      blurb:"Ongoing product needs, spot requirements and supply opportunities.",
      need:"A practical way to handle repeat needs, spot requirements and opportunities without extra admin.",
      focusTitle:"Commercial fit",
      focusCopy:"Find products that make sense for current stock needs, customer demand and spot opportunities.",
      image:"fpx-customer-merchant.png",
      alt:"Timber merchant customer",
      pillars:[
        ["See what is available.","Browse current timber and offers when the opportunity is immediate or commercially useful."],
        ["Handle repeat needs faster.","Use known product requirements as the starting point instead of rebuilding the same sourcing detail each time."],
        ["Keep alternatives open.","Use Requests when the exact product is not visible and suitable alternatives may still work."]
      ]
    },
    {
      title:"Wood processors",
      label:"WOOD PROCESSORS",
      blurb:"Feedstock and timber products aligned with manufacturing needs.",
      need:"Reliable feedstock visibility, useful specifications and a clear route to specific manufacturing requirements.",
      focusTitle:"Feedstock fit",
      focusCopy:"Match grade, size, quantity and timber characteristics to the needs of the manufacturing process.",
      image:"fpx-customer-processor.png",
      alt:"Wood processor customer",
      pillars:[
        ["Define the feedstock clearly.","Set the grade, dimensions, volume and characteristics that matter to the process and finished product."],
        ["Separate available stock from specific needs.","Browse current manufacturing timber first, then use Requests when the feedstock requirement is more exact."],
        ["Source around production needs.","Keep timing, consistency and required volume connected to the manufacturing schedule."]
      ]
    }
  ];
  const [active,setActive]=React.useState(0);
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

    <section className="poc4-stage">
      <div className="poc4-head">
        <Eyebrow>WHO USES FPX</Eyebrow>
        <h2>Different buyers.<br/>Different priorities.</h2>
        <p>Move through the customer types to see how FPX fits the way each one buys timber.</p>
      </div>

      <div className="poc4-experience">
        <div className="poc4-carousel" aria-live="polite">
          <div className="poc4-carousel-stage">
            {customerProfiles.map((g,i)=>{
              const total=customerProfiles.length;
              const offset=(i-active+total)%total;
              const position=offset===0?"is-active":offset===1?"is-next":offset===total-1?"is-prev":"is-back";
              return <button
                key={g.title}
                type="button"
                className={"poc4-card "+position}
                onClick={()=>setActive(i)}
                aria-label={`Show ${g.title}`}
                aria-pressed={active===i}
              >
                <span className="poc4-card-number">0{i+1}</span>
                <img src={"/images/"+g.image} alt={g.alt}/>
                <b>{g.label}</b>
              </button>
            })}
          </div>

          <div className="poc4-nav">
            <button type="button" onClick={()=>setActive((active-1+customerProfiles.length)%customerProfiles.length)} aria-label="Previous customer">←</button>
            <span>0{active+1} / 04</span>
            <button type="button" onClick={()=>setActive((active+1)%customerProfiles.length)} aria-label="Next customer">→</button>
          </div>
        </div>

        <div className="poc4-details">
          <div className="poc4-title">
            <small>{current.label}</small>
            <h3>{current.title}</h3>
            <p>{current.blurb}</p>
          </div>

          <div className="poc4-need">
            <small>WHAT THEY NEED</small>
            <p>{current.need}</p>
          </div>

          <div className="poc4-focus">
            <small>PRIMARY FOCUS</small>
            <h4>{current.focusTitle}</h4>
            <p>{current.focusCopy}</p>
          </div>

          <div className="poc4-pillars">
            <small>THREE THINGS FPX KEEPS SIMPLE</small>
            <div>{current.pillars.map((pillar,i)=><article key={pillar[0]}>
              <span>0{i+1}</span>
              <div><h4>{pillar[0]}</h4><p>{pillar[1]}</p></div>
            </article>)}</div>
          </div>

          <div className="poc4-actions">
            <a href="https://app.fpx.nz/shop">Browse timber <Arrow/></a>
            <a href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a>
          </div>
        </div>
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
