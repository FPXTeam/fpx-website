"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageSquareText } from "lucide-react";
import { Eyebrow, Arrow, Breadcrumbs, PageCTA } from "./master-shared";
import { trackFpxEvent } from "./analytics-events";

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
      alt:"New Zealand builder sourcing commercial timber",
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
      alt:"Procurement professional sourcing timber for commercial projects",
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
      alt:"New Zealand timber merchant sourcing stock",
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
      alt:"Wood processor sourcing timber feedstock",
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
      <Image className="poc2-hero-bg" src="/images/product-groups/building-construction/building-symmetrical-framing.png" alt="Timber framing for a commercial construction project in New Zealand" width={1920} height={1200} sizes="100vw" priority/>
      <div className="poc2-hero-shade"/>
      <div className="poc2-hero-copy">
        <Eyebrow>OUR CUSTOMERS</Eyebrow>
        <h1>Built for businesses<br/><span className="headline-accent">that buy timber.</span></h1>
        <p>FPX supports commercial timber buyers across New Zealand, from project teams to merchants and processors.</p>
      </div>
    </section>

    <section className="poc4-stage">
      <div className="poc4-head">
        <Eyebrow>WHO USES FPX</Eyebrow>
        <h2>Different buyers.<br/><span className="headline-accent">Different priorities.</span></h2>
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
                <Image src={"/images/"+g.image} alt={g.alt} width={900} height={1200} sizes="(max-width: 700px) 75vw, 30vw"/>
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
            <a href="https://app.fpx.nz/stock">Browse timber <Arrow/></a>
            <a href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a>
          </div>
        </div>
      </div>
    </section>

    <section className="poc2-close">
      <div><Eyebrow>START SOURCING</Eyebrow><h2>Start with the requirement you have.</h2><p>Browse available timber or send FPX the detail you already know.</p></div>
      <div className="m-actions"><a className="m-btn m-btn-primary" href="https://app.fpx.nz/stock">Browse timber <Arrow/></a><a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a></div>
    </section>
  </>;
}

export function AboutPage(){
  const team=[
    {name:"George Harman",role:"Director",image:"/images/team/George.png",copy:"George brings hands-on timber industry experience to FPX, with a focus on practical sourcing, commercial relationships and making the buying process easier to navigate."},
    {name:"Gabriela Molloy",role:"General Manager",image:"/images/team/Gabriela.png",copy:"Gabriela leads the day-to-day delivery of FPX, helping keep the sourcing experience clear, responsive and useful for timber buyers across New Zealand."}
  ];

  return <>
    <section className="pab3-hero">
      <Image src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Commercial timber bundles in a New Zealand warehouse" width={1920} height={1200} sizes="100vw" priority/>
      <div className="pab3-hero-shade"/>
      <div className="pab3-hero-copy">
        <Eyebrow>ABOUT FPX</Eyebrow>
        <h1>Timber expertise.<br/><span className="headline-accent">A clearer way to source.</span></h1>
        <p>FPX is a New Zealand timber sourcing service built to make commercial buying easier to understand, easier to start and easier to move forward.</p>
      </div>
    </section>

    <section className="pab3-frame pab3-statement">
      <div className="pab3-statement-main">
        <Eyebrow>FOREST PRODUCTS EXCHANGE</Eyebrow>
        <h2>We bring the timber requirement and the sourcing process into one place.</h2>
      </div>
      <div className="pab3-statement-side">
        <p>FPX gives commercial buyers a digital starting point for timber sourcing, supported by practical industry knowledge behind the platform.</p>
        <div className="pab3-meta">
          <div><small>COMPANY</small><b>Forest Products Exchange Limited</b><span>Company number 8469278</span></div>
          <div><small>FOCUS</small><b>Commercial timber sourcing</b><span>Across New Zealand</span></div>
          <div><small>BACKED BY</small><b>Sutcliffe Trading Limited</b><span>Timber trading experience since 1988</span></div>
        </div>
      </div>
    </section>

    <section className="pab3-frame pab3-platform">
      <div className="pab3-platform-copy">
        <Eyebrow>WHAT FPX BRINGS TOGETHER</Eyebrow>
        <h2>Digital when it helps.<br/><span className="headline-accent">Human when it matters.</span></h2>
        <p>Browse available timber, review current offers or send a specific requirement. FPX keeps the digital sourcing path simple while practical timber knowledge stays behind the process.</p>
        <div className="pab3-platform-points">
          <div><span>01</span><b>Clear product detail</b></div>
          <div><span>02</span><b>Different ways to start</b></div>
          <div><span>03</span><b>Practical sourcing support</b></div>
        </div>
      </div>
      <div className="pab3-platform-visual">
        <div className="pab3-platform-photo"><Image src="/images/product-groups/manufacturing/manufacturing-rollers.png" alt="Timber processing in New Zealand" width={1400} height={1000} sizes="(max-width: 900px) 100vw, 50vw"/></div>
        <div className="pab3-platform-device">
          <div className="pab3-device-top"><span/><span/><span/></div>
          <Image src="/images/fpx-app-shop.png" alt="FPX timber sourcing platform" width={1500} height={960} sizes="(max-width: 900px) 90vw, 48vw"/>
          <div className="pab3-device-base"/>
        </div>
      </div>
    </section>

    <section className="pab3-frame pab3-purpose">
      <div className="pab3-purpose-title">
        <Eyebrow>WHY FPX EXISTS</Eyebrow>
        <h2>Clarity before commitment.</h2>
        <p>Commercial timber buying involves product specifications, availability, pricing, lead times and delivery requirements. FPX makes those moving parts easier to navigate from the first requirement through to the sourcing decision.</p>
      </div>
      <div className="pab3-purpose-grid">
        <article><small>UNDERSTAND</small><h3>Know what you’re looking at.</h3><p>Product groups and applications make the range easier to understand before detailed sourcing begins.</p></article>
        <article><small>START</small><h3>Choose the right way in.</h3><p>Browse available timber, review offers or send a specific requirement.</p></article>
        <article><small>MOVE</small><h3>Keep the requirement moving.</h3><p>Use the platform and FPX team to carry the sourcing detail forward.</p></article>
      </div>
    </section>

    <section className="pab5-team">
      <div className="pab5-team-head">
        <Eyebrow>THE PEOPLE BEHIND FPX</Eyebrow>
        <h2>Timber knowledge behind the platform.</h2>
        <p>FPX is digital by design, but the sourcing experience is supported by people who understand the New Zealand timber trade.</p>
      </div>

      <div className="pab5-team-stage">
        <article className="pab5-bio pab5-bio-left">
          <small>{team[0].role}</small>
          <h3>{team[0].name}</h3>
          <p>{team[0].copy}</p>
        </article>

        <div className="pab5-figures" aria-label="George Harman and Gabriela Molloy">
          <div className="pab5-mark">FPX</div>
          <Image className="pab5-figure pab5-george" src={team[0].image} alt={`${team[0].name}, ${team[0].role} at FPX`} width={800} height={1200} sizes="(max-width: 700px) 55vw, 28vw"/>
          <Image className="pab5-figure pab5-gabriela" src={team[1].image} alt={`${team[1].name}, ${team[1].role} at FPX`} width={800} height={1200} sizes="(max-width: 700px) 55vw, 28vw"/>
        </div>

        <article className="pab5-bio pab5-bio-right">
          <small>{team[1].role}</small>
          <h3>{team[1].name}</h3>
          <p>{team[1].copy}</p>
        </article>
      </div>
    </section>

    <section className="pab3-close">
      <div>
        <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
        <h2>Built for the requirement you have now.</h2>
        <p>Browse current timber or send FPX the detail you already know.</p>
      </div>
      <div className="m-actions">
        <a className="m-btn m-btn-primary" href="https://app.fpx.nz/stock">Browse timber <Arrow/></a>
        <a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a>
      </div>
    </section>
  </>;
}

export function ContactPage(){
  const [status,setStatus]=React.useState<"idle"|"sending"|"success"|"error">("idle");
  const [message,setMessage]=React.useState("");

  async function handleSubmit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form=event.currentTarget;
    const payload=Object.fromEntries(new FormData(form).entries());
    try{
      const response=await fetch("/api/contact",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data?.error||"Unable to send your message.");
      form.reset();
      trackFpxEvent("contact_submit",{source:"contact_page"});
      setStatus("success");
      setMessage("Thanks — your message has been sent to FPX.");
    }catch(error){
      setStatus("error");
      setMessage(error instanceof Error?error.message:"Unable to send your message.");
    }
  }

  return <>
  <section className="pct2-hero">
    <Image className="pct2-hero-image" src="/images/george-gabriela.png" alt="George Harman and Gabriela Molloy discussing timber requirements" width={1920} height={1200} sizes="100vw" priority/>
    <div className="pct2-hero-wash"/>
    <div className="pct2-hero-copy">
      <Eyebrow>CONTACT FPX</Eyebrow>
      <h1>Tell us what timber<br/><span className="headline-accent">you need.</span></h1>
      <p>Share the requirement you already have, ask a sourcing question or get help choosing the right way to start.</p>
      <div className="pct2-direct">
        <a href="mailto:support@fpx.nz"><Mail/><span><small>EMAIL FPX</small><b>support@fpx.nz</b></span></a>
        <a href="tel:+642108473262"><Phone/><span><small>CALL FPX</small><b>+64 210 847 3262</b></span></a>
      </div>
    </div>
  </section>

  <section className="pct2-start">
    <div className="pct2-start-copy">
      <Eyebrow>START WHERE IT MAKES SENSE</Eyebrow>
      <h2>Already know the requirement?</h2>
      <p>If you know the product, dimensions, grade, treatment or quantity, use the route that best matches what you have. If you are not sure, contact FPX and we can help you choose a starting point.</p>
      <div className="pct2-team-note">
        <span><MapPin/>NEW ZEALAND</span>
        <p>FPX supports commercial timber buyers across New Zealand.</p>
      </div>
    </div>

    <nav className="pct2-routes" aria-label="Ways to start sourcing timber through FPX">
      <a href="https://app.fpx.nz/stock">
        <span>01</span>
        <div><small>AVAILABLE TIMBER</small><h3>Browse current timber.</h3><p>Start with products that are already available through FPX.</p></div>
        <Arrow/>
      </a>
      <a href="https://app.fpx.nz/request-cart">
        <span>02</span>
        <div><small>SPECIFIC REQUIREMENT</small><h3>Create a timber request.</h3><p>Send the specification and quantity when you already know what the job needs.</p></div>
        <Arrow/>
      </a>
      <a href="https://app.fpx.nz/offers">
        <span>03</span>
        <div><small>CURRENT OPPORTUNITIES</small><h3>Review current offers.</h3><p>See whether a current FPX opportunity suits the requirement.</p></div>
        <Arrow/>
      </a>
    </nav>
  </section>

  <section className="pct2-enquiry">
    <header className="pct2-enquiry-head">
      <Eyebrow>GENERAL ENQUIRY</Eyebrow>
      <h2>Send FPX<br/><span className="headline-accent">a message.</span></h2>
      <p>For timber sourcing, platform support or a general question, send through the detail you know and the FPX team can take it from there.</p>
    </header>

    <form className="pct2-form" aria-label="Contact FPX" onSubmit={handleSubmit}>
      <input className="fpx-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
      <div className="pct-fields">
        <label>Full name<input name="name" autoComplete="name" placeholder="Your name" required/></label>
        <label>Company<input name="company" autoComplete="organization" placeholder="Company name"/></label>
        <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@company.co.nz" required/></label>
        <label>Phone<input name="phone" autoComplete="tel" placeholder="Your phone number"/></label>
        <label className="wide">What can we help with?
          <select name="topic" defaultValue="Timber sourcing requirement">
            <option>Timber sourcing requirement</option>
            <option>Using the FPX platform</option>
            <option>General enquiry</option>
          </select>
        </label>
        <label className="wide">Message<textarea name="message" placeholder="Tell us what timber you need, including dimensions, grade, treatment and quantity if known." required/></label>
      </div>
      <div className="pct2-form-foot">
        <button className="m-btn m-btn-primary" type="submit" disabled={status==="sending"}>
          {status==="sending"?"Sending…":"Send message"} <Arrow/>
        </button>
        <small aria-live="polite">{message||"Your message will be sent directly to the FPX team."}</small><p className="pct2-privacy">By sending this form, you provide the information above to FPX so we can respond to your enquiry. See our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
      </div>
    </form>
  </section>
</>;}
