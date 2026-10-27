const browse="https://app.fpx.nz/explore-fpx-sourcing";
const request="https://app.fpx.nz/explore-fpx-sourcing?request=1";
const raw="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images";

export function GeorgeSourcingPage(){
  return <>
    <section className="ap-hero gsp-hero">
      <img src="/images/fpx-hero-timber-yard.webp" alt="" className="ap-hero-image"/>
      <div className="ap-container ap-hero-content"><p className="ap-eyebrow">FPX SOURCING</p><h1>Two ways to source timber.</h1><p className="ap-hero-lead">Browse timber available through FPX Stock, or send the product, quantity and delivery requirements for timber you need sourced.</p><div className="ap-actions"><a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a><a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a></div><p className="ap-trust">FPX Sourcing by Sutcliffe Trading. Supplying New Zealand timber since 1988.</p></div>
    </section>

    <section className="ap-section ap-warm"><div className="ap-container">
      <div className="ap-intro"><p className="ap-eyebrow">CHOOSE YOUR STARTING POINT</p><h2>Browse what is available. Request what you need.</h2><p>The public FPX experience lets you begin with either route before requesting full account access.</p></div>
      <div className="ap-two">
        <article className="ap-card"><div className="gsp-screen"><img src={`${raw}/BrowseStock.png`} alt="FPX Browse Stock interface"/></div><div className="ap-card-body"><p className="ap-number">01 · FPX STOCK</p><h3>See what is available now.</h3><p>Review listed products, specifications and pricing. Specials and volume-based pricing may be available for some products.</p><a className="ap-button ap-button-green" href={browse}>Browse Timber →</a></div></article>
        <article className="ap-card"><div className="gsp-screen"><img src={`${raw}/RequestList.png`} alt="FPX timber request interface"/></div><div className="ap-card-body"><p className="ap-number">02 · TIMBER REQUEST</p><h3>Tell us what you need.</h3><p>Send the grade, dimensions, treatment, quantity and delivery details you know. Sutcliffe Trading can source and quote suitable options.</p><a className="ap-button ap-button-green" href={request}>Submit a Request →</a></div></article>
      </div>
    </div></section>

    <section className="ap-section"><div className="ap-container ap-split"><div><div className="ap-intro"><p className="ap-eyebrow">AFTER YOU START</p><h2>From requirement to order.</h2><p>The route depends on whether the timber is listed or needs to be sourced. FPX gives customers a place to follow quotations, orders and delivery details after account access.</p></div></div><div className="ap-steps"><div><b>01</b><span>Browse stock or submit your requirement</span></div><div><b>02</b><span>Review product and commercial details</span></div><div><b>03</b><span>Continue through your FPX account when ready</span></div></div></div></section>

    <section className="ap-final"><div className="ap-container ap-final-inner"><div><p className="ap-eyebrow">START WITH FPX</p><h2>Start with the timber you need.</h2><p>Check current stock first, or send a specific requirement.</p></div><div className="ap-actions"><a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a><a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a></div></div></section>
  </>;
}
