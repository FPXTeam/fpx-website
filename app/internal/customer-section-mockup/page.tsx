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

        <div className="customer-grid">
          {customers.map((customer) => (
            <article className="customer-card" key={customer.label}>
              <div className="customer-image-wrap">
                <img src={customer.image} alt={customer.alt} />
              </div>
              <div className="customer-body">
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
        body{margin:0;background:#f5f7f5;color:#040E0E}
        .customer-mockup{min-height:100vh;background:#f5f7f5;padding:88px 40px 100px;font-family:Arial,sans-serif}
        .customer-stage{max-width:1450px;margin:0 auto}
        .customer-intro{max-width:900px;margin-bottom:48px}
        .customer-kicker{margin:0 0 18px;color:#2b725a;font-size:12px;font-weight:800;letter-spacing:.18em}
        .customer-intro h1{margin:0 0 18px;max-width:960px;font-family:Montserrat,Arial,sans-serif;font-size:clamp(48px,5.2vw,78px);line-height:.98;letter-spacing:-.055em;font-weight:700}
        .customer-lead{margin:0;max-width:760px;color:#65726c;font-size:17px;line-height:1.65}
        .customer-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
        .customer-card{display:flex;flex-direction:column;overflow:hidden;background:#fff;border:1px solid #dde4e0;border-radius:22px;box-shadow:0 18px 42px rgba(4,14,14,.055);min-height:610px}
        .customer-image-wrap{height:305px;overflow:hidden;background:#dfe7e1}
        .customer-image-wrap img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .35s ease}
        .customer-card:hover .customer-image-wrap img{transform:scale(1.025)}
        .customer-body{display:flex;flex-direction:column;flex:1;padding:30px 30px 32px}
        .customer-label{margin:0 0 16px;color:#2b725a;font-size:11px;font-weight:800;letter-spacing:.14em;line-height:1.4}
        .customer-body h2{margin:0 0 15px;font-family:Montserrat,Arial,sans-serif;font-size:30px;line-height:1.04;letter-spacing:-.035em}
        .customer-copy{margin:0 0 28px;color:#66736d;font-size:14px;line-height:1.65}
        .customer-link{margin-top:auto;display:inline-flex;align-items:center;gap:10px;color:#2b725a;font-size:14px;font-weight:800}
        .customer-link b{font-size:18px;font-weight:500}
        @media(max-width:1000px){
          .customer-grid{grid-template-columns:1fr}
          .customer-card{display:grid;grid-template-columns:minmax(280px,.9fr) 1.1fr;min-height:0}
          .customer-image-wrap{height:100%;min-height:330px}
        }
        @media(max-width:700px){
          .customer-mockup{padding:60px 20px 70px}
          .customer-intro h1{font-size:46px}
          .customer-card{display:flex}
          .customer-image-wrap{height:240px;min-height:0}
          .customer-body{padding:25px 24px 28px}
        }
      `}</style>
    </main>
  );
}
