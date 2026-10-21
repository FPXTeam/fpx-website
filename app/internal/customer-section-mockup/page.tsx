export const metadata = {
  title: "FPX Customer Section Mockup",
  robots: { index: false, follow: false },
};

const customers = [
  {
    label: "WOOD PROCESSORS & MANUFACTURERS",
    title: "Source timber to specification.",
    cta: "Submit a timber request",
    image: "https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/fpx-customer-processor.png",
    alt: "Wood processing and manufacturing customer",
  },
  {
    label: "TIMBER MERCHANTS",
    title: "Browse stock and fill supply gaps.",
    cta: "Browse timber",
    image: "https://raw.githubusercontent.com/FPXTeam/fpx-website/main/public/images/fpx-customer-merchant.png",
    alt: "Timber merchant customer",
  },
  {
    label: "COMMERCIAL END USERS",
    title: "Source timber for the job at hand.",
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
          <div>
            <p className="customer-kicker">WHO USES FPX</p>
            <h1>Built around how commercial timber buyers work.</h1>
          </div>
          <p className="customer-lead">Different buyers use FPX differently. Start with the path that matches what you need to do.</p>
        </div>

        <div className="customer-strip">
          {customers.map((customer) => (
            <article className="customer-panel" key={customer.label}>
              <img src={customer.image} alt={customer.alt} />
              <div className="customer-shade" />
              <div className="customer-copy">
                <p>{customer.label}</p>
                <h2>{customer.title}</h2>
                <span>{customer.cta} <b aria-hidden="true">→</b></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        *{box-sizing:border-box}
        body{margin:0;background:#f4f6f4;color:#040E0E}
        .customer-mockup{min-height:100vh;background:#f4f6f4;padding:80px 40px 90px;font-family:Arial,sans-serif}
        .customer-stage{max-width:1460px;margin:0 auto}
        .customer-intro{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);gap:72px;align-items:end;margin-bottom:38px}
        .customer-kicker{margin:0 0 14px;color:#2b725a;font-size:12px;font-weight:800;letter-spacing:.18em}
        .customer-intro h1{margin:0;max-width:860px;font-family:Montserrat,Arial,sans-serif;font-size:clamp(46px,4.7vw,72px);line-height:.98;letter-spacing:-.05em;font-weight:700}
        .customer-lead{margin:0 0 5px;max-width:530px;color:#65726c;font-size:16px;line-height:1.7}
        .customer-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));height:430px;overflow:hidden;background:#0a1914}
        .customer-panel{position:relative;overflow:hidden;min-width:0}
        .customer-panel+.customer-panel{border-left:1px solid rgba(255,255,255,.4)}
        .customer-panel img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .45s ease}
        .customer-panel:hover img{transform:scale(1.025)}
        .customer-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,14,14,.05) 25%,rgba(4,14,14,.88) 100%)}
        .customer-copy{position:absolute;left:30px;right:30px;bottom:28px;color:#fff}
        .customer-copy p{margin:0 0 10px;color:#bfe8d8;font-size:10px;font-weight:800;letter-spacing:.14em;line-height:1.45}
        .customer-copy h2{margin:0 0 16px;max-width:380px;font-family:Montserrat,Arial,sans-serif;font-size:clamp(25px,2.25vw,35px);line-height:1.02;letter-spacing:-.035em}
        .customer-copy span{display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:800}
        .customer-copy b{font-size:18px;font-weight:500}
        @media(max-width:900px){
          .customer-intro{grid-template-columns:1fr;gap:18px}
          .customer-intro h1{font-size:54px}
          .customer-strip{grid-template-columns:1fr;height:auto}
          .customer-panel{height:330px}
          .customer-panel+.customer-panel{border-left:0;border-top:1px solid rgba(255,255,255,.4)}
        }
        @media(max-width:650px){
          .customer-mockup{padding:58px 20px 70px}
          .customer-intro{margin-bottom:28px}
          .customer-intro h1{font-size:42px}
          .customer-lead{font-size:15px}
          .customer-panel{height:285px}
          .customer-copy{left:22px;right:22px;bottom:22px}
          .customer-copy h2{font-size:28px}
        }
      `}</style>
    </main>
  );
}
