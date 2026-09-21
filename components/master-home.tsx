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

const Eyebrow=({children}:{children:React.ReactNode})=><p className="m-eyebrow">{children}</p>;
const Arrow=()=> <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const AppButtons=()=> <div className="m-actions"><a className="m-btn m-btn-primary" href="https://app.fpx.nz/stock">Browse timber <Arrow/></a><a className="m-btn m-btn-ghost" href="https://app.fpx.nz/request-cart">Create a request <Arrow/></a></div>;

function PremiumHero(){
  return <section className="ph-hero">
    <Image className="ph-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard" width={1920} height={1080} sizes="100vw" quality={75} priority fetchPriority="high"/>
    <div className="ph-hero-shade"/>
    <div className="ph-hero-copy">
      <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
      <h1>Timber sourcing,<br/><span className="headline-accent">made clearer.</span></h1>
      <p>Browse available timber, review current offers or send FPX a specific requirement. One clear starting point for commercial timber sourcing across New Zealand.</p>
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
      <p>Explore the range at a high level first. Then move into FPX for current stock, offers and detailed specifications.</p>
      <Link href="/timber">Explore the full timber range <Arrow/></Link>
    </div>
    <div className="ph-range-list">
      {productGroups.map((group,i)=><Link href={`/${group[3]}`} className="ph-range-item" key={group[0]}>
        <div className="ph-range-image"><Image src={`/images/${group[2]}`} alt={`${group[0]} timber products in New Zealand`} width={1400} height={1000} sizes="(max-width: 700px) calc(100vw - 48px), 220px" quality={70}/></div>
        <span>0{i+1}</span>
        <div className="ph-range-copy"><h3>{group[0]}</h3><p>{group[1]}</p><b>Explore <Arrow/></b></div>
      </Link>)}
    </div>
  </section>;
}

function PlatformStory(){
  const routes=[
    ["Browse Stock","Search available timber by category, grade and specification.","https://app.fpx.nz/stock","AVAILABLE TIMBER"],
    ["View Offers","Review current packet and bulk timber opportunities.","https://app.fpx.nz/offers","CURRENT OPPORTUNITIES"],
    ["Create a Request","Tell FPX what you need and receive suitable sourcing options.","https://app.fpx.nz/request-cart","EXACT REQUIREMENTS"]
  ] as const;
  return <section className="ph-platform ph-platform-routes-only">
    <div className="ph-platform-head">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h2>Three ways in.<br/><span className="headline-accent">One place to start.</span></h2>
      <p>You do not need to learn the whole platform before you begin. Start with the route that matches the job.</p>
      <Link href="/fpx-sourcing">See how FPX sourcing works <Arrow/></Link>
    </div>
    <div className="fpx-route-showcase" aria-label="Ways to source timber through FPX">
      {routes.map((route,i)=><a href={route[2]} key={route[0]} className="fpx-route-card">
        <span>0{i+1}</span>
        <small>{route[3]}</small>
        <h3>{route[0]}</h3>
        <p>{route[1]}</p>
        <b>Start here <Arrow/></b>
      </a>)}
    </div>
  </section>;
}

function Closing(){
  return <section className="ph-close">
    <div><Eyebrow>START WITH FPX</Eyebrow><h2>Find the timber.<br/><span className="headline-accent">Move with clarity.</span></h2><p>Browse available timber or send FPX the requirement you already have.</p></div>
    <AppButtons/>
  </section>;
}

export function MasterHome(){
  return <Shell><main id="main-content" className="master-site premium-home"><HomeMotion/><PremiumHero/><RangeStory/><PlatformStory/><BuyerStory/><Closing/></main></Shell>;
}
