const browse="https://app.fpx.nz/explore-fpx-sourcing";
const request="https://app.fpx.nz/explore-fpx-sourcing?request=1";
const raw="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images";

export function GeorgeSourcingPage(){
  return <>
    <section className="ap-hero gsp-hero">
      <img src="/images/fpx-hero-timber-yard.webp" alt="" className="ap-hero-image"/>
      <div className="ap-container ap-hero-content"><p className="ap-eyebrow">FPX SOURCING</p><h1>Two ways to source timber.</h1><p className="ap-hero-lead">Spend less time finding suitable supply. Check listed stock or send a specific requirement for FPX to investigate.</p><div className="ap-actions"><a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a><a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a></div><p className="ap-trust">FPX Sourcing by Sutcliffe Trading. Supplying New Zealand timber since 1988.</p></div>
    </section>

    <section className="ap-section ap-warm"><div className="ap-container">
      <div className="ap-intro"><p className="ap-eyebrow">CHOOSE YOUR STARTING POINT</p><h2>Find stock faster. Source the rest.</h2><p>Browse current listings in one place or send the grade, dimensions and quantity you need. Both routes are available before requesting full account access.</p></div>
      <div className="ap-two">
        <article className="ap-card"><div className="gsp-screen"><img src={`${raw}/BrowseStock2.png`} alt="FPX Browse Stock interface"/></div><div className="ap-card-body"><p className="ap-number">01 · FPX STOCK</p><h3>Spend less time checking supply.</h3><p>Review current listings, specifications and pricing in one place. Specials and volume pricing appear where available.</p><a className="ap-button ap-button-green" href={browse}>Browse Timber →</a></div></article>
        <article className="ap-card"><div className="gsp-screen"><img src={`${raw}/RequestList.png`} alt="FPX timber request interface"/></div><div className="ap-card-body"><p className="ap-number">02 · TIMBER REQUEST</p><h3>Source a specific requirement.</h3><p>Send the grade, dimensions, treatment, quantity and delivery location you know. FPX can investigate options without you contacting multiple suppliers.</p><a className="ap-button ap-button-green" href={request}>Submit a Timber Request →</a></div></article>
      </div>
    </div></section>

    <section className="ap-section"><div className="ap-container ap-split"><div><div className="ap-intro"><p className="ap-eyebrow">AFTER YOU START</p><h2>Keep purchasing details together.</h2><p>With full customer access, FPX brings quotations, orders and delivery information into your account so your team can follow the purchase more easily.</p></div></div><div className="ap-steps"><div><b>01</b><span>Browse stock or submit your requirement</span></div><div><b>02</b><span>Review product and commercial details</span></div><div><b>03</b><span>Follow quotations and orders through your FPX account</span></div></div></div></section>

    <section className="ap-final"><div className="ap-container ap-final-inner"><div><p className="ap-eyebrow">START WITH FPX</p><h2>Start with the timber you need.</h2><p>Check current stock first, or send a specific requirement.</p></div><div className="ap-actions"><a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a><a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a></div></div></section>
  </>;
}
