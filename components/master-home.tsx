import Link from "next/link";
import Image from "next/image";
import { Shell } from "./site-shell";
import { BuyerStory, HomeMotion } from "./home-client";

const productGroups = [
  ["Manufacturing","Timber feedstock for wood processors and timber manufacturers to remanufacture into finished products.","product-groups/manufacturing/manufacturing-warehouse-bundles.png","manufacturing"],
  ["Building & Construction","Timber products for structural, building, finishing and specialist construction applications.","product-groups/building-construction/building-roof-framing.png","building-construction"],
  ["Outdoor & Landscaping","Treated and purpose-made timber for landscaping, fencing, retaining and outdoor construction.","product-groups/outdoor-landscaping/outdoor-slat-fence.png","outdoor-landscaping"],
  ["Dunnage","Timber dunnage for freight, shipping, load support and industrial transport applications.","product-groups/dunnage/dunnage-stamped-stack.png","dunnage"],
] as const;

const browseUrl = "https://app.fpx.nz/explore-fpx-sourcing";
const requestUrl = "https://app.fpx.nz/explore-fpx-sourcing?request=1";

const Eyebrow=({children}:{children:React.ReactNode})=><p className="m-eyebrow">{children}</p>;
const Arrow=()=> <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const AppButtons=()=> <div className="m-actions"><a className="m-btn m-btn-primary" href={browseUrl}>Browse timber <Arrow/></a><a className="m-btn m-btn-ghost" href={requestUrl}>Submit a request <Arrow/></a></div>;

function PremiumHero(){
  return <section className="ph-hero">
    <Image className="ph-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard" width={1920} height={1080} sizes="100vw" quality={60} priority fetchPriority="high"/>
    <div className="ph-hero-shade"/>
    <div className="ph-hero-copy">
      <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
      <h1>Timber sourcing,<br/><span className="headline-accent">made clearer.</span></h1>
      <p>FPX gives commercial timber buyers one place to browse available timber and pricing, submit timber requirements, review quotations and manage orders.</p>
      <AppButtons/>
    </div>
    <div className="ph-hero-scroll">SCROLL TO EXPLORE</div>
  </section>;
}

function RangeStory(){
  return <section className="ph-range">
    <div className="ph-range-intro">
      <Eyebrow>THE FPX TIMBER RANGE</Eyebrow>
      <h2>Start with the<br/><span className="headline-accent">right product group.</span></h2>
      <p>Explore the range at a high level first. Then use FPX to check available timber, pricing and product information or submit a requirement.</p>
      <Link href="/timber">Explore the full timber range <Arrow/></Link>
    </div>
    <div className="ph-range-list">
      {productGroups.map((group,i)=><Link href={`/${group[3]}`} className="ph-range-item" key={group[0]}>
        <div className="ph-range-image"><Image src={`/images/${group[2]}`} alt={`${group[0]} timber products in New Zealand`} width={1400} height={1000} sizes="(max-width: 700px) calc(100vw - 48px), 220px" quality={55}/></div>
        <span>0{i+1}</span>
        <div className="ph-range-copy"><h3>{group[0]}</h3><p>{group[1]}</p><b>Explore <Arrow/></b></div>
      </Link>)}
    </div>
  </section>;
}

function PlatformStory(){
  const routes=[
    ["Browse Stock","View available timber, specifications, pricing, specials and tier-volume pricing where available.",browseUrl,"AVAILABLE TIMBER"],
    ["Submit a Request","Send the product specification, quantity and delivery requirements for timber you need.",requestUrl,"TIMBER REQUIREMENTS"]
  ] as const;
  return <section className="ph-platform ph-platform-routes-only">
    <div className="ph-platform-head">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h2>Two ways to source.<br/><span className="headline-accent">One place to start.</span></h2>
      <p>Browse timber already available through FPX, or submit a requirement when the product, specification or quantity you need is not listed. New visitors can start without registering first.</p>
      <Link href="/fpx-sourcing">See how FPX sourcing works <Arrow/></Link>
    </div>
    <div className="fpx-route-showcase" aria-label="Ways to source timber through FPX">
      {routes.map((route,i)=><a href={route[2]} key={route[0]} className="fpx-route-card">
        <span>0{i+1}</span>
        <small>{route[3]}</small>
        <h3>{route[0]}</h3>
        <p>{route[1]}</p>
        <b>Open in FPX <Arrow/></b>
      </a>)}
    </div>
    <p className="fpx-operator-note">FPX Sourcing is operated commercially by Sutcliffe Trading, bringing established timber trading experience behind the digital FPX customer experience.</p>
  </section>;
}

function IntelligenceStory(){
  const items=[
    ["Building Consents","View building consent information available through FPX Intelligence."],
    ["Diesel Price Index","View diesel price index information available through FPX Intelligence."]
  ] as const;
  return <section className="ph-platform ph-intelligence-story">
    <div className="ph-platform-head">
      <Eyebrow>FPX INTELLIGENCE</Eyebrow>
      <h2>Useful market information.<br/><span className="headline-accent">Inside FPX.</span></h2>
      <p>FPX Intelligence brings selected information into the platform to support day-to-day timber and market decisions.</p>
    </div>
    <div className="fpx-route-showcase" aria-label="FPX Intelligence information">
      {items.map((item,i)=><div className="fpx-route-card" key={item[0]}>
        <span>0{i+1}</span>
        <small>FPX INTELLIGENCE</small>
        <h3>{item[0]}</h3>
        <p>{item[1]}</p>
      </div>)}
    </div>
  </section>;
}

function Closing(){
  return <section className="ph-close">
    <div><Eyebrow>START WITH FPX</Eyebrow><h2>Browse timber.<br/><span className="headline-accent">Submit what you need.</span></h2><p>Browse available timber and pricing or submit a timber requirement before creating an account. Existing customers can continue through quotations and order management in FPX.</p></div>
    <AppButtons/>
  </section>;
}

export function MasterHome(){
  return <Shell><main id="main-content" className="master-site premium-home"><HomeMotion/><PremiumHero/><RangeStory/><PlatformStory/><IntelligenceStory/><BuyerStory/><Closing/></main></Shell>;
}
