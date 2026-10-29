const browse="https://app.fpx.nz/explore-fpx-sourcing";
const request="https://app.fpx.nz/explore-fpx-sourcing?request=1";
const raw="https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images";

export function GeorgeSourcingPage(){
  return <>
    <section className="ap-hero gsp-hero">
      <img src="/images/fpx-hero-timber-yard.webp" alt="" className="ap-hero-image"/>
      <div className="ap-container ap-hero-content"><p className="ap-eyebrow">FPX SOURCING</p><h1>Two ways to source timber.</h1><p className="ap-hero-lead">Browse current listings and product details in one place. For a particular grade, size or volume, send your requirement through FPX and our team will work to source suitable timber.</p><div className="ap-actions"><a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a><a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a></div><p className="ap-trust">FPX Sourcing by Sutcliffe Trading. Supplying New Zealand timber since 1988.</p></div>
    </section>

    <section className="ap-section ap-warm"><div className="ap-container">
      <div className="ap-intro"><p className="ap-eyebrow">CHOOSE YOUR STARTING POINT</p><h2>Browse what is available. Request what you need.</h2><p>Check listed timber and its details in one place. If you need a particular grade, size or volume, send us your requirement. You can start either way before requesting full account access.</p></div>
      <div className="ap-two">
        <article className="gsp-option"><a className="gsp-screen" href={`${raw}/BrowseStock2.png`} target="_blank" rel="noopener noreferrer" aria-label="View the full FPX Browse Stock screenshot"><img src={`${raw}/BrowseStock2.png`} alt="FPX Browse Stock interface" loading="lazy" decoding="async"/></a><div className="gsp-copy"><p className="ap-number">01 · FPX STOCK</p><h3>See what is available now.</h3><p>Review current listings, specifications and pricing in one place. Specials and volume pricing appear where available.</p><a className="ap-button ap-button-green" href={browse}>Browse Timber →</a></div></article>
        <article className="gsp-option"><a className="gsp-screen" href={`${raw}/RequestList.png`} target="_blank" rel="noopener noreferrer" aria-label="View the full FPX timber request screenshot"><img src={`${raw}/RequestList.png`} alt="FPX timber request interface" loading="lazy" decoding="async"/></a><div className="gsp-copy"><p className="ap-number">02 · TIMBER REQUEST</p><h3>Source a specific requirement.</h3><p>Send the grade, dimensions, treatment, quantity and delivery location you know. FPX will work with suppliers to source a suitable option.</p><a className="ap-button ap-button-green" href={request}>Submit a Timber Request →</a></div></article>
      </div>
    </div></section>

    <section className="ap-section"><div className="ap-container ap-split"><div><div className="ap-intro"><p className="ap-eyebrow">AFTER YOU START</p><h2>From requirement to order.</h2><p>With full customer access, you can keep quotations, orders and delivery details together in FPX.</p></div></div><div className="ap-steps"><div><b>01</b><span>Browse stock or submit your requirement</span></div><div><b>02</b><span>Review product and commercial details</span></div><div><b>03</b><span>Follow quotations and orders through your FPX account</span></div></div></div></section>

    <section className="ap-final"><div className="ap-container ap-final-inner"><div><p className="ap-eyebrow">START WITH FPX</p><h2>Start with the timber you need.</h2><p>Check current stock first, or send a specific requirement. International buyers can include their destination so we can discuss export shipping for that order.</p></div><div className="ap-actions"><a className="ap-button ap-button-light" href={browse}>Browse Timber <span aria-hidden="true">→</span></a><a className="ap-button ap-button-outline" href={request}>Submit a Timber Request <span aria-hidden="true">→</span></a></div></div></section>
  </>;
}
