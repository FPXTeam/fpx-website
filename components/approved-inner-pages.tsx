import Image from "next/image";
import Link from "next/link";

const browse = "https://app.fpx.nz/explore-fpx-sourcing";
const request = "https://app.fpx.nz/explore-fpx-sourcing?request=1";
const timberGroups = [
  ["Manufacturing","Timber feedstock for processors and manufacturers.","product-groups/manufacturing/manufacturing-warehouse-bundles.png","manufacturing"],
  ["Building & Construction","Structural, building and finishing products.","product-groups/building-construction/building-roof-framing.png","building-construction"],
  ["Outdoor & Landscaping","Timber for fencing, decking and retaining.","product-groups/outdoor-landscaping/outdoor-slat-fence.png","outdoor-landscaping"],
  ["Dunnage","Timber for load support and industrial transport.","product-groups/dunnage/dunnage-stamped-stack.png","dunnage"]
];

function Actions({light=false}:{light?:boolean}) {
  return <div className="ap-actions">
    <a className={light?"ap-button ap-button-light":"ap-button ap-button-green"} href={browse}>Browse Timber <span aria-hidden="true">→</span></a>
    <a className={light?"ap-button ap-button-outline":"ap-button ap-button-line"} href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a>
  </div>;
}
function Intro({label,title,copy}:{label:string;title:string;copy:string}) {
  return <div className="ap-intro"><p className="ap-eyebrow">{label}</p><h2>{title}</h2><p>{copy}</p></div>;
}
function Hero({label,title,copy,image,children}:{label:string;title:string;copy:string;image:string;children?:React.ReactNode}) {
  return <section className="ap-hero">
    <Image src={image} alt="" fill sizes="100vw" priority className="ap-hero-image"/>
    <div className="ap-container ap-hero-content"><p className="ap-eyebrow">{label}</p><h1>{title}</h1><p className="ap-hero-lead">{copy}</p>{children}</div>
  </section>;
}
function Final({title,copy}:{title:string;copy?:string}) {
  return <section className="ap-final"><div className="ap-container ap-final-inner"><div><p className="ap-eyebrow">START WITH FPX</p><h2>{title}</h2>{copy&&<p>{copy}</p>}</div><Actions light/></div></section>;
}

export function ApprovedSourcing(){
  return <>
    <Hero label="FPX SOURCING" title="Two ways to source timber." copy="Spend less time finding suitable supply. Check listed stock or send a specific requirement for FPX to investigate." image="/images/fpx-hero-timber-yard.webp"><Actions light/><p className="ap-trust">FPX Sourcing by Sutcliffe Trading. Supplying New Zealand timber since 1988.</p></Hero>
    <section className="ap-section ap-warm"><div className="ap-container">
      <Intro label="CHOOSE YOUR STARTING POINT" title="Browse what is available. Request what you need." copy="Browse current listings in one place or send the grade, dimensions and quantity you need. Both routes are available before requesting full account access."/>
      <div className="ap-two">
        <article className="ap-card"><div className="ap-screen"><Image src="/images/fpx-browse-stock-homepage.png" alt="FPX Browse Stock interface" width={1300} height={780}/></div><div className="ap-card-body"><p className="ap-number">01 · FPX STOCK</p><h3>See what is available now.</h3><p>Review current listings, specifications and pricing in one place. Specials and volume pricing appear where available.</p><a className="ap-text-link" href={browse}>Browse Timber →</a></div></article>
        <article className="ap-card"><div className="ap-screen"><Image src="/images/fpx-submit-request-homepage.png" alt="FPX timber request interface" width={1300} height={780}/></div><div className="ap-card-body"><p className="ap-number">02 · TIMBER REQUEST</p><h3>Source a specific requirement.</h3><p>Send the grade, dimensions, treatment, quantity and delivery location you know. FPX can investigate options without you contacting multiple suppliers.</p><a className="ap-text-link" href={request}>Submit a Timber Request →</a></div></article>
      </div>
    </div></section>
    <section className="ap-section"><div className="ap-container ap-split"><div><Intro label="AFTER YOU START" title="From requirement to order." copy="With full customer access, FPX brings quotations, orders and delivery information into your account so your team can follow the purchase more easily."/></div><div className="ap-steps"><div><b>01</b><span>Browse stock or submit your requirement</span></div><div><b>02</b><span>Review product and commercial details</span></div><div><b>03</b><span>Follow quotations and orders through your FPX account</span></div></div></div></section>
    <Final title="Start with the timber you need." copy="Check current stock first, or send a specific requirement."/>
  </>;
}

const stock=[
  ["Rough Sawn Timber","Commercial sawn Radiata pine.","stock-sawn-timber.webp"],
  ["Structural Timber","SG graded framing and structural sections.","stock-structural.webp"],
  ["Dressed & Machined","Processed, dressed and machined timber.","stock-processed-remanufactured.webp"],
  ["Premium & Appearance","Clear and higher-grade timber.","stock-premium-appearance.webp"],
  ["Fencing & Outdoor","Treated timber for fencing and outdoor use.","stock-fencing-outdoor.webp"],
  ["Posts & Heavy Treated","Posts and heavier treated sections.","stock-posts-industrial.webp"]
];
export function ApprovedTimber(){
  return <>
    <Hero label="TIMBER RANGE" title="New Zealand timber for the requirement at hand." copy="Explore product types, check current listings, or request a specific grade or specification." image="/images/product-groups/manufacturing/manufacturing-hero-pine-stack.png"><Actions light/></Hero>
    <section className="ap-section ap-warm"><div className="ap-container"><Intro label="FPX STOCK" title="Explore common timber product types." copy="These examples show the types of timber you can look for through FPX. Check current listings for individual products, specifications and availability."/><div className="ap-stock-grid">{stock.map(([title,copy,image])=><article className="ap-card ap-stock" key={title}><Image src={`/images/${image}`} alt={title} width={700} height={450}/><div className="ap-card-body"><h3>{title}</h3><p>{copy}</p></div></article>)}</div><a className="ap-button ap-button-green ap-under-grid" href={browse}>Browse current stock →</a></div></section>
    <section className="ap-section"><div className="ap-container"><Intro label="TIMBER PRODUCT GROUPS" title="Explore our timber range" copy="Browse timber by category, or submit a request for products you can&apos;t find."/><div className="ap-group-grid">{timberGroups.map(([title,copy,image,slug])=><Link className="ap-card ap-group" href={`/${slug}`} key={slug}><Image src={`/images/${image}`} alt={`${title} timber`} width={700} height={450} sizes="(max-width: 650px) 50vw, 25vw"/><div className="ap-card-body"><h3>{title}</h3><p>{copy}</p><span className="ap-text-link">Explore range →</span></div></Link>)}</div></div></section>
    <section className="ap-section"><div className="ap-container ap-request-panel"><p className="ap-eyebrow">BROADER SOURCING</p><h2>Can&apos;t find the timber you need?</h2><p>Whether you need a specific grade, custom dimensions or ongoing supply, send us your requirements and we&apos;ll work with our suppliers to find suitable solutions.</p><a className="ap-button ap-button-green" href={request}>Submit a Timber Request →</a></div></section>
  </>;
}

const audiences=[
  ["WOOD PROCESSORS & MANUFACTURERS","Help keep production moving.","Source timber to your grade, dimensions and volume. Send repeat supply requirements so FPX can investigate suitable options and timing.","segment-wood-processors.webp",request,"Submit a Timber Request"],
  ["TIMBER MERCHANTS","Fill supply gaps and find opportunities.","Browse current listings and specials where available. Request products or volumes you cannot find to meet customer demand.","segment-timber-merchants.webp",browse,"Browse Timber"],
  ["COMMERCIAL END USERS","Keep project purchasing straightforward.","Check listed timber and competitive supply options, or request a project specification with its quantity and delivery location. FPX can discuss suitable delivery arrangements, including export shipping where applicable.","segment-commercial-end-users.webp",request,"Submit a Timber Request"]
];
export function ApprovedCustomers(){
  return <>
    <Hero label="OUR CUSTOMERS" title="Built for commercial timber buyers." copy="Find stock, fill supply gaps or send a requirement that fits the way your business buys timber." image="/images/fpx-hero-timber-yard.webp"/>
    <section className="ap-section"><div className="ap-container"><Intro label="WHO USES FPX" title="Start with the way you buy." copy="FPX supports different buying needs, from repeat manufacturing supply to merchant gaps and project specifications."/><div className="ap-audiences">{audiences.map(([label,title,copy,image,href,cta])=><article className="ap-audience" key={label}><div className="ap-audience-image"><Image src={`/images/${image}`} alt={label.toLowerCase()+" timber setting"} fill sizes="(max-width: 850px) 100vw, 48vw"/></div><div className="ap-audience-copy"><p className="ap-eyebrow">{label}</p><h2>{title}</h2><p>{copy}</p><div className="ap-audience-actions"><a className="ap-button ap-button-green" href={href}>{cta} →</a><a className="ap-text-link" href={href===browse?request:browse}>{href===browse?"Submit a Timber Request":"Browse Timber"} →</a></div></div></article>)}</div></div></section>
    <Final title="Browse timber or tell us what you need."/>
  </>;
}

export function ApprovedIntelligence(){
  return <>
    <Hero label="FPX INTELLIGENCE" title="Market data for better timber decisions." copy="Use selected New Zealand industry indicators to inform purchasing and business decisions within FPX." image="/images/fpx-hero-timber-yard.webp"/>
    <section className="ap-section ap-warm"><div className="ap-container"><Intro label="INSIDE FPX" title="See the market information in context." copy="Building Consents and the Diesel Price Index are examples of indicators available through FPX Intelligence. The screenshots below show data captured on specific dates."/><div className="ap-two ap-intel-grid"><figure className="ap-card"><Image src="/images/intelligence-building-consents.png" alt="FPX Intelligence Building Consents dashboard" width={1200} height={750}/><figcaption><strong>Building Consents</strong><span>Screenshot shown as at August 2026.</span></figcaption></figure><figure className="ap-card"><Image src="/images/intelligence-diesel-price-index.png" alt="FPX Intelligence Diesel Price Index dashboard" width={1200} height={750}/><figcaption><strong>Diesel Price Index</strong><span>Screenshot shown as at 2 October 2026.</span></figcaption></figure></div></div></section>
    <section className="ap-section"><div className="ap-container ap-split"><Intro label="ONE FPX PLATFORM" title="Sourcing and Intelligence have different jobs." copy="FPX Sourcing supports timber purchasing and requirements. FPX Intelligence provides industry data and insights. Both sit within FPX."/><div className="ap-note"><h3>Looking for timber?</h3><p>Browse available stock or send a specific timber requirement through FPX Sourcing.</p><Actions/></div></div></section>
  </>;
}

const team=[
  {id:"george-harman",name:"George Harman",role:"Director",image:"/images/team/George.png",copy:"George brings hands-on timber industry experience to FPX, with a focus on practical sourcing, commercial relationships and making the buying process easier to navigate."},
  {id:"gabriela-molloy",name:"Gabriela Molloy",role:"General Manager",image:"/images/team/Gabriela.png",copy:"Gabriela leads the day-to-day delivery of FPX, helping keep the sourcing experience clear, responsive and useful for timber buyers across New Zealand."}
];
export function ApprovedAbout(){
  return <>
    <Hero label="ABOUT FPX" title="A digital platform for the New Zealand timber industry." copy="FPX makes it easier for commercial buyers to browse timber, submit requirements and manage their purchasing." image="/images/fpx-hero-timber-yard.webp"/>
    <section className="ap-section"><div className="ap-container ap-split"><Intro label="FOREST PRODUCTS EXCHANGE" title="FPX is the place to start." copy="FPX Sourcing supports timber purchasing and ordering. FPX Intelligence brings selected industry data into the platform. Start with the part of FPX that matches the task you have."/ ><div className="ap-note"><h3>FPX Sourcing by Sutcliffe Trading.</h3><p>Sutcliffe Trading is the established timber trading business responsible for sourcing, selling and supplying timber through FPX. Its New Zealand timber experience dates back to 1988.</p><Link className="ap-text-link" href="/fpx-sourcing">How sourcing works →</Link></div></div></section>
    <section className="pab5-team"><div className="pab5-team-head"><p className="ap-eyebrow">THE PEOPLE BEHIND FPX</p><h2>Timber knowledge behind the platform.</h2><p>FPX is digital by design, but the sourcing experience is supported by people who understand the New Zealand timber trade.</p></div><div className="pab5-team-stage"><article id={team[0].id} className="pab5-bio pab5-bio-left"><small>{team[0].role}</small><h3>{team[0].name}</h3><p>{team[0].copy}</p></article><div className="pab5-figures" aria-label="George Harman and Gabriela Molloy"><div className="pab5-mark">FPX</div><Image className="pab5-figure pab5-george" src={team[0].image} alt={`${team[0].name}, ${team[0].role} at FPX`} width={800} height={1200} sizes="(max-width: 700px) 55vw, 28vw"/><Image className="pab5-figure pab5-gabriela" src={team[1].image} alt={`${team[1].name}, ${team[1].role} at FPX`} width={800} height={1200} sizes="(max-width: 700px) 55vw, 28vw"/></div><article id={team[1].id} className="pab5-bio pab5-bio-right"><small>{team[1].role}</small><h3>{team[1].name}</h3><p>{team[1].copy}</p></article></div></section>
    <Final title="Start with FPX." copy="Browse current timber or send us the requirement you have."/>
  </>;
}
