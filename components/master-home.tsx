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
      <p>Explore current timber Stock and Offers, or send FPX a specific commercial timber requirement before creating an account. If the right timber is not shown online, FPX can source through suitable New Zealand sawmills, processors and trade supply routes.</p>
      <AppButtons/>
    </div>
    <div className="ph-hero-scroll">SCROLL TO EXPLORE</div>
  </section>;
}

function RangeStory(){
  return <section className="ph-range">
    <div className="ph-range-intro">
      <Eyebrow>WHAT TIMBER DO YOU NEED?</Eyebrow>
      <h2>Find the timber<br/><span className="headline-accent">that fits the job.</span></h2>
      <p>Browse the main timber categories to narrow your requirement. Then check current Stock and Offers, or create a Request if the exact product, specification, length or quantity is not listed.</p>
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
    ["Browse Stock","Review timber currently available and the product information relevant to your requirement.","https://app.fpx.nz/explore-fpx-sourcing","AVAILABLE TIMBER"],
    ["View Offers","Review current packet and bulk timber opportunities.","https://app.fpx.nz/explore-fpx-sourcing?view=offers","CURRENT OPPORTUNITIES"],
    ["Create a Request","Tell FPX what you need when the exact timber is not listed. Suitable sourcing options can then be identified.","https://app.fpx.nz/explore-fpx-sourcing?request=1","EXACT REQUIREMENTS"]
  ] as const;
  return <section className="ph-platform ph-platform-routes-only">
    <div className="ph-platform-head">
      <Eyebrow>FPX SOURCING</Eyebrow>
      <h2>Start with what is available.<br/><span className="headline-accent">Request what is not.</span></h2>
      <p>Current Stock and Offers are the starting point, not the limit of FPX timber sourcing. If the right timber is not shown, create a Request and FPX can identify suitable options through relevant New Zealand sawmills, processors and other trade supply routes.</p>
      <Link href="/fpx-sourcing">See how FPX sourcing works <Arrow/></Link>
    </div>
    <div className="fpx-route-showcase" aria-label="Ways to source timber through FPX">
      {routes.map((route,i)=><a href={route[2]} key={route[0]} className="fpx-route-card">
        <span>0{i+1}</span>
        <small>{route[3]}</small>
        <h3>{route[0]}</h3>
        <p>{route[1]}</p>
        <b>Explore in FPX <Arrow/></b>
      </a>)}
    </div>
  </section>;
}

function Closing(){
  return <section className="ph-close">
    <div><Eyebrow>START WITH FPX</Eyebrow><h2>Start with what is available.<br/><span className="headline-accent">Request what is not.</span></h2><p>Browse current Stock and Offers without creating an account. If you need something more specific, create a Request and continue the same FPX sourcing journey. Sign in or request access when you need the full customer experience.</p></div>
    <AppButtons/>
  </section>;
}

export function MasterHome(){
  return <Shell><main id="main-content" className="master-site premium-home"><HomeMotion/><PremiumHero/><RangeStory/><PlatformStory/><BuyerStory/><Closing/></main></Shell>;
}
