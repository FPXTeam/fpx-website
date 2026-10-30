import Image from "next/image";

const browse="https://app.fpx.nz/explore-fpx-sourcing";
const request="https://app.fpx.nz/explore-fpx-sourcing?request=1";
const raw="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images";

const categories=[
  {
    title:"Manufacturing",
    href:"/manufacturing",
    images:["Manufacturing1.png","Manufacturing2.png","Manufacturing3.png","Manufacturing4.png"]
  },
  {
    title:"Building & Construction",
    href:"/building-construction",
    images:["Construction1.png","Construction2.png","Construction3.png","Construction4.png","Construction5.png","Construction6.png"]
  },
  {
    title:"Outdoor & Landscaping",
    href:"/outdoor-landscaping",
    images:["Outdoor1.png","Outdoor2.png","Outdoor3.png","Outdoor4.png"]
  },
  {
    title:"Dunnage",
    href:"/dunnage",
    images:["Dunnage1.png"]
  }
] as const;


export function GeorgeTimberPage(){
  return <>
    <section className="ap-hero">
      <Image src="/images/product-groups/manufacturing/manufacturing-hero-pine-stack.png" alt="" fill sizes="100vw" priority className="ap-hero-image"/>
      <div className="ap-container ap-hero-content">
        <p className="ap-eyebrow">TIMBER RANGE</p>
        <h1>New Zealand timber for the requirement at hand.</h1>
        <p className="ap-hero-lead">Explore product categories, check current listings, or request a specific grade or specification.</p>
        <div className="ap-actions">
          <a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a>
          <a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section className="gtr-section">
      <div className="ap-container">
        <div className="gtr-head">
          <p className="ap-eyebrow">TIMBER PRODUCT GROUPS</p>
          <h2>Explore our timber range</h2>
          <p>Browse timber by category, or submit a request for products you can’t find.</p>
        </div>
        <div className="gtr-grid">
          {categories.map((category,index)=><article className="gtr-card" key={category.title}>
            <a className={`gtr-media ${category.images.length>1?`gtr-carousel gtr-count-${category.images.length}`:""}`} href={category.href} aria-label={`Explore ${category.title}`}>
              {category.images.map((image,imageIndex)=><img key={image} className={imageIndex===0?"gtr-active":""} src={`${raw}/${image}`} alt={`${category.title} timber`} loading={index===0&&imageIndex===0?"eager":"lazy"}/>) }
              <span className="gtr-number">{String(index+1).padStart(2,"0")}</span>
            </a>
            <div className="gtr-copy"><h3>{category.title}</h3><a href={category.href}>Explore category <span aria-hidden="true">→</span></a></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="ap-section">
      <div className="ap-container ap-request-panel">
        <p className="ap-eyebrow">BROADER SOURCING</p>
        <h2>Can&apos;t find the timber you need?</h2>
        <p>Whether you need a specific grade, custom dimensions or ongoing supply, send us your requirements and we&apos;ll work with our suppliers to find suitable solutions.</p>
        <a className="ap-button ap-button-green" href={request}>Submit a Timber Request →</a>
      </div>
    </section>

    <section className="ap-final"><div className="ap-container ap-final-inner"><div><p className="ap-eyebrow">START WITH FPX</p><h2>Browse timber or tell us what you need.</h2></div><div className="ap-actions"><a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a><a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a></div></div></section>
  </>;
}
