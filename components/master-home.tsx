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
const AppButtons=()=> <div className="m-actions"><a className="m-btn m-btn-primary" href="https://app.fpx.nz/explore-fpx-sourcing">Browse Stock <Arrow/></a><a className="m-btn m-btn-ghost" href="https://app.fpx.nz/explore-fpx-sourcing?request=1">Create a Request <Arrow/></a></div>;

function PremiumHero(){
  return <section className="ph-hero">
    <Image className="ph-hero-bg" src="/images/fpx-hero-timber-yard.webp" alt="New Zealand timber stored in a commercial yard" width={1920} height={1080} sizes="100vw" quality={60} priority fetchPriority="high"/>
    <div className="ph-hero-shade"/>
    <div className="ph-hero-copy">
      <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
      <h1>Timber sourcing,<br/><span className="headline-accent">made clearer.</span></h1>
      <p>Browse current Stock and Offers, or send FPX a specific requirement. If the right timber is not shown online, FPX can source wider through suitable New Zealand sawmills, processors and trade supply routes.</p>
      <AppButtons/>
    </div>
    <div className="ph-hero-scroll">SCROLL TO EXPLORE</div>
  </section>;
}

function RangeStory(){
  return <section className="ph-range">
    <div className="ph-range-intro">
      <Eyebrow>WHAT TIMBER DO YOU NEED?</Eyebrow>
      <h2>Start with the job.<br/><span className="headline-accent">Find the right timber.</span></h2>
      <p>Browse by the type of work you are buying for. From there, check what is available now or move straight into a Request if the exact product, specification, length or quantity is not listed.</p>
      <Link href="/timber">Browse the full timber range <Arrow/></Link>
    </div>
    <div className="ph-range-list">
      {productGroups.map((group,i)=><Link href={`/${group[3]}`} className="ph-range-item" key={group[0]}>
        <div className="ph-range-image"><Image src={`/images/${group[2]}`} alt={`${group[0]} timber products in New Zealand`} width={1400} height={1000} sizes="(max-width: 700px) calc(100vw - 48px), 220px" quality={55}/></div>
        <span>0{i+1}</span>
        <div className="ph-range-copy"><h3>{group[0]}</h3><p>{group[1]}</p><b>View timber <Arrow/></b></div>
      </Link>)}
    </div>
  </section>;
}

function PlatformStory(){
  const routes=[
    ["Browse Stock","See timber currently available and inspect useful product information before you enquire.","https://app.fpx.nz/explore-fpx-sourcing","AVAILABLE TIMBER","Browse Stock"],
    ["View Offers","Review current packet and bulk timber opportunities when the product and quantity suit.","https://app.fpx.nz/explore-fpx-sourcing?view=offers","CURRENT OPPORTUNITIES","View Offers"],
    ["Create a Request","Send the product, specification, quantity or project requirement when the exact timber is not listed.","https://app.fpx.nz/explore-fpx-sourcing?request=1","EXACT REQUIREMENTS","Create a Request"]
  ] as const;
  return <section className="ph-platform ph-platform-routes-only">
    <div className="ph-platform-head">
      <Eyebrow>HOW FPX SOURCES</Eyebrow>
      <h2>Start with what is available.<br/><span className="headline-accent">Keep going when it is not.</span></h2>
      <p>Stock and Offers are the starting point, not the limit of FPX sourcing. When the right timber is not shown, create a Request and the sourcing desk can look across suitable sawmills, processors and other trade supply routes, including direct supply where the quantity and specification suit — from mill stock to custom manufacture.</p>
      <Link href="/fpx-sourcing">See how FPX Sourcing works <Arrow/></Link>
    </div>
    <div className="fpx-route-showcase" aria-label="Ways to source timber through FPX">
      {routes.map((route,i)=><a href={route[2]} key={route[0]} className="fpx-route-card">
        <span>0{i+1}</span>
        <small>{route[3]}</small>
        <h3>{route[0]}</h3>
        <p>{route[1]}</p>
        <b>{route[4]} <Arrow/></b>
      </a>)}
    </div>
  </section>;
}

function Closing(){
  return <section className="ph-close">
    <div><Eyebrow>START SOURCING</Eyebrow><h2>Start with what is available.<br/><span className="headline-accent">Request what is not.</span></h2><p>Browse current timber without creating an account, move into a Request when you need something more specific, and sign in when the commercial process needs your account. One continuous path from first search to quote and order.</p></div>
    <AppButtons/>
  </section>;
}

export function MasterHome(){
  return <Shell><main id="main-content" className="master-site premium-home"><HomeMotion/><PremiumHero/><RangeStory/><PlatformStory/><BuyerStory/><Closing/></main></Shell>;
}
