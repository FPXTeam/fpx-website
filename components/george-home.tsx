import Image from "next/image";
import Link from "next/link";
import { Shell } from "./site-shell";
import "./george-home.css";

const browseUrl = "https://app.fpx.nz/explore-fpx-sourcing";
const requestUrl = "https://app.fpx.nz/explore-fpx-sourcing?request=1";

function Arrow(){
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
}

function Icon({type}:{type:"range"|"price"|"delivery"|"insights"|"stock"|"request"|"quote"|"orders"}){
  const common = {width:28,height:28,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const,"aria-hidden":true};
  if(type==="range") return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/><path d="M7 4v16"/></svg>;
  if(type==="price") return <svg {...common}><path d="M20 12 12 20 4 12l8-8h6l2 2v6Z"/><circle cx="16" cy="8" r="1"/></svg>;
  if(type==="delivery") return <svg {...common}><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
  if(type==="insights") return <svg {...common}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>;
  if(type==="stock") return <svg {...common}><path d="M4 7 12 3l8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></svg>;
  if(type==="request") return <svg {...common}><path d="M21 3 9 15"/><path d="m21 3-7 18-4-7-7-4 18-7Z"/></svg>;
  if(type==="quote") return <svg {...common}><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5M9 13h6M9 17h4"/></svg>;
  return <svg {...common}><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>;
}

const productGroups = [
  {title:"Manufacturing",text:"Timber feedstock for processors and manufacturers.",image:"/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png"},
  {title:"Building & Construction",text:"Structural, building, finishing and specialist timber.",image:"/images/product-groups/building-construction/building-roof-framing.png"},
  {title:"Outdoor & Landscaping",text:"Treated timber for fencing, retaining and outdoor work.",image:"/images/product-groups/outdoor-landscaping/outdoor-slat-fence.png"},
  {title:"Dunnage",text:"Timber dunnage for freight, shipping and load support.",image:"/images/product-groups/dunnage/dunnage-stamped-stack.png"},
];

const customers = [
  {eyebrow:"WOOD PROCESSORS & MANUFACTURERS",title:"Source timber to specification.",text:"Submit grades, dimensions, lengths, quantities and delivery requirements for the timber your production needs.",cta:"Submit a timber request",href:requestUrl},
  {eyebrow:"TIMBER MERCHANTS",title:"Fill gaps in your timber supply.",text:"Browse available stock, specials and tier-volume pricing, or submit a requirement when you need something specific.",cta:"Browse timber",href:browseUrl},
  {eyebrow:"COMMERCIAL END USERS",title:"Timber for the job at hand.",text:"Browse available timber and commercial pricing, or submit the specification and quantities required for your project.",cta:"Browse timber",href:browseUrl},
];

export function GeorgeHome(){
  return <Shell>
    <main id="main-content" className="gh-home">
      <section className="gh-hero">
        <Image className="gh-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard" fill sizes="100vw" quality={70} priority/>
        <div className="gh-hero-overlay"/>
        <div className="gh-hero-inner">
          <div className="gh-hero-copy">
            <p className="gh-eyebrow">NEW ZEALAND TIMBER SOURCING</p>
            <h1>Browse timber.<br/><span>Submit what you need.</span></h1>
            <p className="gh-lead">FPX gives commercial timber buyers one place to browse available timber and pricing, submit timber requirements, review quotations and manage orders.</p>
            <div className="gh-actions">
              <a className="gh-btn gh-btn-light" href={browseUrl}>Browse Timber <Arrow/></a>
              <a className="gh-btn gh-btn-outline" href={requestUrl}>Submit a Timber Request <Arrow/></a>
            </div>
            <p className="gh-trust">FPX Sourcing is operated commercially by <strong>Sutcliffe Trading</strong>, a New Zealand timber trading business established in 1988.</p>
          </div>
          <div className="gh-device" aria-hidden="true">
            <img
              src="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/Laptop-phone.png"
              alt=""
              style={{width:"100%",height:"100%",display:"block",objectFit:"contain",objectPosition:"center right",filter:"drop-shadow(0 30px 34px rgba(0,0,0,.3))"}}
            />
          </div>
        </div>
      </section>

      <section className="gh-proof" aria-label="FPX sourcing benefits">
        <div className="gh-proof-item"><Icon type="range"/><div><strong>Wide timber range</strong><span>Treated, untreated and specialised products.</span></div></div>
        <div className="gh-proof-item"><Icon type="price"/><div><strong>Special pricing</strong><span>Access specials and tier-volume pricing.</span></div></div>
        <div className="gh-proof-item"><Icon type="delivery"/><div><strong>Delivery options</strong><span>Flexible New Zealand delivery to site or yard.</span></div></div>
        <div className="gh-proof-item"><Icon type="insights"/><div><strong>Market insights</strong><span>Industry data available through FPX Intelligence.</span></div></div>
      </section>

      <section className="gh-section gh-sourcing">
        <div className="gh-heading">
          <p className="gh-eyebrow gh-eyebrow-dark">FPX SOURCING</p>
          <h2>Two easy ways to source timber.</h2>
          <p>Browse what is available now, or tell us exactly what you need.</p>
        </div>
        <div className="gh-two-cards">
          <article className="gh-source-card gh-source-stock">
            <div className="gh-source-image"><Image src="/images/fpx-hero-timber-yard.webp" alt="Stacks of timber available to browse through FPX" fill sizes="(max-width: 800px) 100vw, 50vw"/></div>
            <div className="gh-source-body"><div className="gh-card-icon"><Icon type="stock"/></div><h3>Browse available stock</h3><p>See available timber, specifications, pricing, specials and tier-volume pricing.</p><a href={browseUrl}>Browse Timber <Arrow/></a></div>
          </article>
          <article className="gh-source-card">
            <div className="gh-source-image gh-source-request-image"><Image src="/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png" alt="Timber prepared for commercial requirements" fill sizes="(max-width: 800px) 100vw, 50vw"/></div>
            <div className="gh-source-body"><div className="gh-card-icon"><Icon type="request"/></div><h3>Submit a timber request</h3><p>Send the specification, quantity and delivery requirements for timber you need sourced and quoted.</p><a href={requestUrl}>Submit a Request <Arrow/></a></div>
          </article>
        </div>
        <div className="gh-account-row">
          <div><Icon type="quote"/><strong>Review quotations</strong><span>View supplied options through your FPX account.</span></div>
          <div><Icon type="orders"/><strong>Manage orders</strong><span>Keep order and delivery details together in FPX.</span></div>
          <div><Icon type="range"/><strong>Sutcliffe timber knowledge</strong><span>Commercial timber sourcing backed by decades of trading experience.</span></div>
        </div>
      </section>

      <section className="gh-section gh-range">
        <div className="gh-heading gh-heading-row">
          <div><p className="gh-eyebrow gh-eyebrow-dark">TIMBER RANGE</p><h2>Explore the timber range.</h2><p>Start with the product group, then continue into FPX to browse availability or submit a requirement.</p></div>
          <Link href="/timber" className="gh-text-link">View timber range <Arrow/></Link>
        </div>
        <div className="gh-range-grid">
          {productGroups.map((group)=><Link href="/timber" className="gh-range-card" key={group.title}>
            <div className="gh-range-image"><Image src={group.image} alt="" fill sizes="(max-width: 700px) 100vw, 25vw"/></div>
            <div className="gh-range-copy"><h3>{group.title}</h3><p>{group.text}</p><span>Explore range <Arrow/></span></div>
          </Link>)}
        </div>
      </section>

      <section className="gh-section gh-customers">
        <div className="gh-heading">
          <p className="gh-eyebrow gh-eyebrow-dark">WHO USES FPX</p>
          <h2>Built around how commercial timber buyers work.</h2>
          <p>Different buyers use FPX differently. Start with the path that matches what you need to do.</p>
        </div>
        <div className="gh-customer-grid">
          {customers.map((customer,i)=><article className="gh-customer-card" key={customer.eyebrow}>
            <span className="gh-customer-number">0{i+1}</span>
            <p className="gh-eyebrow gh-eyebrow-dark">{customer.eyebrow}</p>
            <h3>{customer.title}</h3>
            <p>{customer.text}</p>
            <a href={customer.href}>{customer.cta} <Arrow/></a>
          </article>)}
        </div>
      </section>

      <section className="gh-intelligence">
        <div className="gh-intelligence-inner">
          <div className="gh-intelligence-copy">
            <p className="gh-eyebrow">FPX INTELLIGENCE</p>
            <h2>Market data for better timber decisions.</h2>
            <p>FPX Intelligence brings key New Zealand market indicators into the platform, including Building Consents and the Diesel Price Index.</p>
          </div>
          <div className="gh-intelligence-visual">
            <img
              src="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/FPX%20Analytics%20Dashboard%20Overview.png"
              alt="Illustrative preview of the FPX Intelligence Building Consents and Diesel Price Index dashboards"
            />
            <p className="gh-intelligence-note"><strong>Sample data shown for display only.</strong> Actual Building Consents and Diesel Price Index data is available live in the FPX app.</p>
          </div>
        </div>
      </section>

      <section className="gh-section gh-sutcliffe">
        <div className="gh-sutcliffe-mark">
          <img
            className="gh-sutcliffe-logo"
            src="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/Sutcliffe%20Trading%20-%20Original%20(Square).png"
            alt="Sutcliffe Trading"
          />
        </div>
        <div className="gh-sutcliffe-copy"><p className="gh-eyebrow gh-eyebrow-dark">THE TIMBER BUSINESS BEHIND FPX SOURCING</p><h2>Digital access. Commercial timber experience.</h2><p>FPX is the customer-facing digital platform. FPX Sourcing is operated commercially by Sutcliffe Trading, which sources, sells and invoices timber supplied through the platform.</p><Link href="/about-us" className="gh-text-link">About FPX <Arrow/></Link></div>
      </section>

      <section className="gh-final">
        <div><p className="gh-eyebrow">START WITH FPX</p><h2>Browse timber or submit what you need.</h2></div>
        <div className="gh-actions"><a className="gh-btn gh-btn-green" href={browseUrl}>Browse Timber <Arrow/></a><a className="gh-btn gh-btn-outline" href={requestUrl}>Submit a Timber Request <Arrow/></a></div>
      </section>
    </main>
  </Shell>;
}
