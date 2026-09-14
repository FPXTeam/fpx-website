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
      blurb:"Timber for active jobs and specific project requirements.",
      need:"Clear product fit, timing and supply for the job.",
      focusTitle:"Product fit",
      focusCopy:"Match the timber to the application, specification and timing.",
      image:"fpx-customer-builder.png",
      alt:"Builder customer",
      pillars:[
        ["Know what fits.","Check product, grade, treatment and key specifications."],
        ["Start the right way.","Browse stock or create a request for a defined requirement."],
        ["Keep timing clear.","Keep quantity and delivery timing aligned with the job."]
      ]
    },
    {
      title:"Procurement teams",
      label:"PROCUREMENT TEAMS",
      blurb:"Structured sourcing for defined commercial requirements.",
      need:"Clear specifications and a consistent way to review options.",
      focusTitle:"Specification clarity",
      focusCopy:"Keep every option tied back to the same commercial brief.",
      image:"fpx-customer-procurement.png",
      alt:"Procurement customer",
      pillars:[
        ["Keep the brief consistent.","Bring the important specification into one sourcing requirement."],
        ["Compare like with like.","Review suitable options against the same commercial need."],
        ["Keep handovers clear.","Make the requirement easier for internal teams to follow."]
      ]
    },
    {
      title:"Timber merchants",
      label:"TIMBER MERCHANTS",
      blurb:"Ongoing stock needs, spot requirements and supply opportunities.",
      need:"A practical way to source repeat needs and spot opportunities.",
      focusTitle:"Commercial fit",
      focusCopy:"Find timber that makes sense for stock needs and customer demand.",
      image:"fpx-customer-merchant.png",
      alt:"Timber merchant customer",
      pillars:[
        ["See what is available.","Browse current timber and offers quickly."],
        ["Handle repeat needs faster.","Start from known product requirements."],
        ["Keep alternatives open.","Use Requests when the exact product is not visible."]
      ]
    },
    {
      title:"Wood processors",
      label:"WOOD PROCESSORS",
      blurb:"Feedstock and timber aligned with manufacturing requirements.",
      need:"Useful feedstock visibility and a clear route to specific needs.",
      focusTitle:"Feedstock fit",
      focusCopy:"Match grade, size and volume to the production requirement.",
      image:"fpx-customer-processor.png",
      alt:"Wood processor customer",
      pillars:[
        ["Define the feedstock.","Set grade, dimensions and volume clearly."],
        ["Separate stock from specific needs.","Browse first, then use Requests for exact requirements."],
        ["Source around production.","Keep volume and timing aligned with the manufacturing schedule."]
      ]
    }
  ];
  const [active,setActive]=React.useState(0);
  const current=customerProfiles[active];

  return <>
    <section className="poc2-hero">
      <img className="poc2-hero-bg" src="/images/product-groups/building-construction/building-symmetrical-framing.png" alt="Timber framing for a commercial construction project in New Zealand"/>
      <div className="poc2-hero-shade"/>
      <div className="poc2-hero-copy">
        <Eyebrow>OUR CUSTOMERS</Eyebrow>
        <h1>Built for businesses<br/>that buy timber.</h1>
        <p>FPX supports commercial timber buyers across New Zealand, from project teams to merchants and processors.</p>
      </div>
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
                <img src={"/images/"+g.image} alt={g.alt}/>
                <b>{g.label}</b>
              </button>
            })}
          </div>

          <div className="poc4-nav">
            <button type="button" onClick={()=>setActive((active-1+customerProfiles.length)%customerProfiles.length)} aria-label="Previous customer">←</button>
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

export function AboutPage(){
  const team=[
    {name:"George Harman",role:"Director",image:"https://assets.softr-files.com/applications/bfc5c9f5-7e6e-44f9-b058-0da4dbec6efe/assets/6446200e-fdaf-4b71-8073-c9287ca48b93.png",copy:"George brings hands-on timber industry experience to FPX, with a focus on practical sourcing, commercial relationships and making the buying process easier to navigate."},
    {name:"Gabriela Molloy",role:"General Manager",image:"https://assets.softr-files.com/applications/bfc5c9f5-7e6e-44f9-b058-0da4dbec6efe/assets/2d8c0d1f-62c9-454a-8e12-a6786ac94371.png",copy:"Gabriela leads the day-to-day delivery of FPX, helping keep the sourcing experience clear, responsive and useful for timber buyers across New Zealand."}
  ];

  return <>
    <section className="pab2-hero">
      <img src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in a New Zealand warehouse"/>
      <div className="pab2-hero-shade"/>
      <div className="pab2-hero-copy">
        <Eyebrow>ABOUT FPX</Eyebrow>
        <h1>Timber expertise.<br/>A clearer way to source.</h1>
        <p>FPX is a New Zealand timber sourcing service built to make commercial buying easier to understand, easier to start and easier to move forward.</p>
      </div>
    </section>

    <section className="pab2-intro">
      <div className="pab2-intro-kicker"><Eyebrow>FOREST PRODUCTS EXCHANGE</Eyebrow><span>New Zealand</span></div>
      <div className="pab2-intro-statement">
        <h2>We bring the timber requirement and the sourcing process into one place.</h2>
        <p>FPX gives commercial buyers a digital starting point for timber sourcing, supported by practical industry knowledge behind the platform.</p>
      </div>
      <div className="pab2-meta">
        <div><small>COMPANY</small><b>Forest Products Exchange Limited</b><span>Company number 8469278</span></div>
        <div><small>FOCUS</small><b>Commercial timber sourcing</b><span>Across New Zealand</span></div>
        <div><small>BACKED BY</small><b>Sutcliffe Trading Limited</b><span>Timber trading experience since 1988</span></div>
      </div>
    </section>

    <section className="pab2-duality">
      <div className="pab2-duality-copy">
        <Eyebrow>WHAT FPX BRINGS TOGETHER</Eyebrow>
        <h2>Digital when it helps.<br/>Human when it matters.</h2>
        <p>FPX combines a practical sourcing platform with people who understand timber. Buyers can browse available products, review current offers or send a specific requirement when the job needs something more exact.</p>
        <div className="pab2-duality-points">
          <div><span>01</span><p><b>Clear product detail</b> before moving into the sourcing decision.</p></div>
          <div><span>02</span><p><b>Different ways to start</b> depending on what the buyer already knows.</p></div>
          <div><span>03</span><p><b>Practical sourcing support</b> when the requirement needs more than a catalogue search.</p></div>
        </div>
      </div>

      <div className="pab2-duality-visual">
        <div className="pab2-timber-frame"><img src="/images/product-groups/manufacturing/manufacturing-rollers.png" alt="Timber processing in New Zealand"/></div>
        <div className="pab2-laptop">
          <img className="pab2-laptop-screen" src="/images/fpx-app-shop.png" alt="FPX timber sourcing platform"/>
          <img className="pab2-laptop-frame" src="/images/fpx-laptop-frame.png" alt=""/>
        </div>
      </div>
    </section>

    <section className="pab2-purpose">
      <div className="pab2-purpose-number">FPX</div>
      <div className="pab2-purpose-copy">
        <Eyebrow>WHY FPX EXISTS</Eyebrow>
        <h2>Clarity before commitment.</h2>
        <p>Commercial timber buying involves product specifications, availability, pricing, lead times and delivery requirements. FPX exists to make those moving parts easier to navigate from the first requirement through to the sourcing decision.</p>
      </div>
      <div className="pab2-purpose-lines">
        <article><small>UNDERSTAND</small><h3>Know what you’re looking at.</h3><p>Product groups and applications make the range easier to understand before detailed sourcing begins.</p></article>
        <article><small>START</small><h3>Choose the right way in.</h3><p>Shop available timber, review offers or send a specific requirement.</p></article>
        <article><small>MOVE</small><h3>Keep the requirement moving.</h3><p>Use the platform and FPX team to carry the sourcing detail forward.</p></article>
      </div>
    </section>

    <section className="pab2-team">
      <div className="pab2-team-head">
        <Eyebrow>THE PEOPLE BEHIND FPX</Eyebrow>
        <h2>Timber knowledge behind the platform.</h2>
        <p>FPX is digital by design, but the sourcing experience is supported by people who understand the New Zealand timber trade.</p>
      </div>

      <div className="pab2-team-grid">
        {team.map((person,i)=><article className={i===1?"is-second":""} key={person.name}>
          <div className="pab2-team-photo"><img src={person.image} alt={person.name}/></div>
          <div className="pab2-team-info">
            <span>0{i+1}</span>
            <small>{person.role}</small>
            <h3>{person.name}</h3>
            <p>{person.copy}</p>
          </div>
        </article>)}
      </div>
    </section>

    <section className="pab2-close">
      <div>
        <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
        <h2>Built for the requirement you have now.</h2>
        <p>Browse current timber or send FPX the detail you already know.</p>
      </div>
      <div className="m-actions">
        <a className="m-btn m-btn-primary" href="https://app.fpx.nz/shop">Browse timber <Arrow/></a>
        <a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a>
      </div>
    </section>
  </>;
}

export function ContactPage(){return <>
  <section className="pct-hero"><img src="/images/fpx-hero-timber-yard.webp" alt="Commercial timber yard in New Zealand"/><div className="pct-hero-shade"/><div className="pct-hero-copy"><Eyebrow>CONTACT FPX</Eyebrow><h1>Tell us what timber<br/>you need.</h1><p>Contact Forest Products Exchange for commercial timber sourcing requirements, FPX platform support or general enquiries across New Zealand.</p><div className="pct-quick"><a href="mailto:support@fpx.nz"><Mail/>support@fpx.nz</a><a href="tel:+642108473262"><Phone/>+64 210 847 3262</a><span><MapPin/>New Zealand</span></div></div></section>
  <section className="pct-main"><aside><Eyebrow>START HERE</Eyebrow><h2>What can we help with?</h2><p>If you already know the timber specification, include the dimensions, grade, treatment and quantity. If you do not, tell us about the application and we can help you choose a starting point.</p><nav className="pct-routes"><a href="https://app.fpx.nz/shop"><span>01</span><b>Browse available timber</b><Arrow/></a><a href="https://app.fpx.nz/request-cart"><span>02</span><b>Create a timber request</b><Arrow/></a><a href="https://app.fpx.nz/offers"><span>03</span><b>Review current offers</b><Arrow/></a></nav><nav className="pct-social" aria-label="FPX social profiles"><a href="https://www.linkedin.com/company/forest-products-exchange" target="_blank" rel="noreferrer" aria-label="FPX on LinkedIn"><LinkedInIcon/></a><a href="https://www.instagram.com/fpx.nz/" target="_blank" rel="noreferrer" aria-label="FPX on Instagram"><InstagramIcon/></a><a href="https://www.facebook.com/people/Forest-Products-Exchange/61583101360304/" target="_blank" rel="noreferrer" aria-label="FPX on Facebook"><FacebookIcon/></a></nav></aside><form className="pct-form" aria-label="Contact FPX"><div className="pct-form-head"><MessageSquareText/><div><small>GENERAL ENQUIRY</small><h2>Send FPX a message.</h2></div></div><div className="pct-fields"><label>Full name<input name="name" autoComplete="name" placeholder="Your name"/></label><label>Company<input name="company" autoComplete="organization" placeholder="Company name"/></label><label>Email<input name="email" type="email" autoComplete="email" placeholder="you@company.co.nz"/></label><label>Phone<input name="phone" autoComplete="tel" placeholder="Your phone number"/></label><label className="wide">What can we help with?<select name="topic" defaultValue="Timber sourcing requirement"><option>Timber sourcing requirement</option><option>Using the FPX platform</option><option>General enquiry</option></select></label><label className="wide">Message<textarea name="message" placeholder="Tell us what timber you need, including dimensions, grade, treatment and quantity if known."/></label></div><a className="pct-email-link" href="mailto:support@fpx.nz">Email support@fpx.nz <Arrow/></a><small>Direct form sending will be connected once the FPX Resend integration is added.</small></form></section>
</>;}
