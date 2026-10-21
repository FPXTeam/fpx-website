export const metadata = {
  title: "FPX Customer Section Mockup",
  robots: { index: false, follow: false },
};

const customers = [
  {
    label: "WOOD PROCESSORS & MANUFACTURERS",
    title: "Submit timber requirements to specification.",
    text: "Send grades, dimensions, lengths, quantities and delivery requirements for timber needed for production.",
    cta: "Submit a timber request",
    image: "https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/fpx-customer-processor.png",
    alt: "Wood processing and manufacturing customer",
  },
  {
    label: "TIMBER MERCHANTS",
    title: "Browse stock and fill supply gaps.",
    text: "View available timber, specials and tier-volume pricing, or submit a requirement when you need something specific.",
    cta: "Browse timber",
    image: "https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/fpx-customer-merchant.png",
    alt: "Timber merchant customer",
  },
  {
    label: "COMMERCIAL END USERS",
    title: "Source timber for your project.",
    text: "Browse available timber and commercial pricing, or submit specifications and quantities for construction and commercial work.",
    cta: "Browse timber",
    image: "https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/fpx-customer-builder.png",
    alt: "Commercial construction customer",
  },
];

export default function CustomerSectionMockup(){
  return (
    <main className="customer-mockup">
      <section className="customer-stage">
        <div className="customer-intro">
          <p className="customer-kicker">WHO USES FPX</p>
          <h1>Built around how commercial timber buyers work.</h1>
          <p className="customer-lead">Different buyers use FPX differently. Start with the path that matches what you need to do.</p>
        </div>

        <div className="customer-stories">
          {customers.map((customer, index) => (
            <article className={`customer-story ${index % 2 === 1 ? "customer-story-reverse" : ""}`} key={customer.label}>
              <div className="customer-image-wrap">
                <img src={customer.image} alt={customer.alt} />
              </div>
              <div className="customer-body">
                <div className="customer-index">0{index + 1}</div>
                <p className="customer-label">{customer.label}</p>
                <h2>{customer.title}</h2>
                <p className="customer-copy">{customer.text}</p>
                <span className="customer-link">{customer.cta} <b aria-hidden="true">→</b></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        *{box-sizing:border-box}
        body{margin:0;background:#f4f6f4;color:#040E0E}
        .customer-mockup{min-height:100vh;background:#f4f6f4;padding:92px 40px 110px;font-family:Arial,sans-serif}
        .customer-stage{max-width:1460px;margin:0 auto}
        .customer-intro{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:80px;align-items:end;padding-bottom:56px;border-bottom:1px solid #cfd7d2}
        .customer-kicker{grid-column:1/-1;margin:0 0 -38px;color:#2b725a;font-size:12px;font-weight:800;letter-spacing:.18em}
        .customer-intro h1{margin:0;max-width:900px;font-family:Montserrat,Arial,sans-serif;font-size:clamp(52px,5.4vw,84px);line-height:.96;letter-spacing:-.055em;font-weight:700}
        .customer-lead{margin:0 0 7px;max-width:560px;color:#65726c;font-size:17px;line-height:1.7}
        .customer-stories{display:block}
        .customer-story{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(360px,.9fr);min-height:540px;border-bottom:1px solid #cfd7d2}
        .customer-story-reverse{grid-template-columns:minmax(360px,.9fr) minmax(0,1.1fr)}
        .customer-story-reverse .customer-image-wrap{order:2}
        .customer-story-reverse .customer-body{order:1;padding-left:0;padding-right:84px}
        .customer-image-wrap{min-height:540px;overflow:hidden;background:#dfe5e1}
        .customer-image-wrap img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .45s ease}
        .customer-story:hover .customer-image-wrap img{transform:scale(1.018)}
        .customer-body{position:relative;display:flex;flex-direction:column;justify-content:center;padding:70px 0 70px 84px}
        .customer-index{position:absolute;top:56px;right:0;color:#aab7b1;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.14em}
        .customer-story-reverse .customer-index{right:auto;left:0}
        .customer-label{margin:0 0 22px;color:#2b725a;font-size:11px;font-weight:800;letter-spacing:.15em;line-height:1.45}
        .customer-body h2{margin:0 0 20px;max-width:520px;font-family:Montserrat,Arial,sans-serif;font-size:clamp(34px,3.15vw,52px);line-height:1.02;letter-spacing:-.04em}
        .customer-copy{margin:0 0 34px;max-width:540px;color:#66736d;font-size:16px;line-height:1.72}
        .customer-link{display:inline-flex;align-items:center;gap:12px;width:max-content;color:#2b725a;font-size:14px;font-weight:800;border-bottom:1px solid rgba(43,114,90,.28);padding-bottom:6px}
        .customer-link b{font-size:19px;font-weight:500}
        @media(max-width:1000px){
          .customer-intro{grid-template-columns:1fr;gap:24px}
          .customer-kicker{grid-column:auto;margin:0}
          .customer-intro h1{font-size:58px}
          .customer-story,.customer-story-reverse{grid-template-columns:1fr;min-height:0}
          .customer-story-reverse .customer-image-wrap,.customer-story-reverse .customer-body{order:initial}
          .customer-image-wrap{min-height:420px}
          .customer-body,.customer-story-reverse .customer-body{padding:48px 0 56px}
          .customer-index,.customer-story-reverse .customer-index{top:48px;right:0;left:auto}
        }
        @media(max-width:700px){
          .customer-mockup{padding:64px 20px 78px}
          .customer-intro{padding-bottom:38px}
          .customer-intro h1{font-size:43px}
          .customer-lead{font-size:15px}
          .customer-image-wrap{min-height:270px}
          .customer-body,.customer-story-reverse .customer-body{padding:36px 0 44px}
          .customer-body h2{font-size:34px;max-width:90%}
          .customer-copy{font-size:14px;max-width:92%}
          .customer-index,.customer-story-reverse .customer-index{top:36px}
        }
      `}</style>
    </main>
  );
}
