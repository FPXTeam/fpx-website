"use client";

import Link from "next/link";
import Image from "next/image";
import { Arrow, Eyebrow } from "./master-shared";

const benefits = [
  ["Dimensional Stability", "Reduces warping, twisting, and movement after installation."],
  ["Increased Strength", "Strength improves as moisture content drops below fibre saturation."],
  ["Treatability & Gluability", "Improves absorption of adhesives and preservatives."],
  ["Biological Resistance", "Reduces mould, blue stain, and fungal growth risk."],
  ["Phytosanitary Compliance", "Meets export standards by eliminating insects and larvae."],
  ["Reduced Transport Weight", "Lowers freight cost by removing excess water weight."],
] as const;

const contents = [
  ["01", "Why Kiln Dry Timber?", "why-kiln-dry"],
  ["02", "Moisture Content Targets & Timber Dimensions", "moisture-content"],
  ["03", "Conventional Batch Kilns", "conventional-batch-kilns"],
  ["04", "Continuous Kilns", "continuous-kilns"],
  ["05", "Comparing the Two: A 2022 Study", "research-study"],
  ["06", "What This Means on Delivery", "on-delivery"],
  ["07", "Radiata Pine Sourcing in a Digital Market", "digital-market"],
  ["08", "Conclusion", "kiln-conclusion"],
] as const;

const sources = [
  {label:"Kumar, C., Faircloth, A., Leggate, W., and Redman, A. (2022). Impact of continuous drying method on drying quality of southern pine sawn timber. BioResources 17(1), 574–591.",href:"https://bioresources.cnr.ncsu.edu/resources/impact-of-continuous-drying-method-on-drying-quality-of-southern-pine-sawn-timber/"},
  {label:"Leggate, W., Kumar, C., McGavin, R.L., Faircloth, A., and Knackstedt, M. (2021). The effects of drying method on the wood permeability, wettability, treatability, and gluability of southern pine from Australia. BioResources 16(1), 698–720.",href:"https://bioresources.cnr.ncsu.edu/resources/the-effects-of-drying-method-on-the-wood-permeability-wettability-treatability-and-gluability-of-southern-pine-from-australia/"},
  {label:"Rahimi, S., Nasir, V., Avramidis, S., and Sassani, F. (2023). The role of drying schedule and conditioning in moisture uniformity in wood: A machine learning approach. Polymers 15, article 792.",href:"https://www.mdpi.com/2073-4360/15/4/792"},
  {label:"Andersson, S. (2008). Drying of timber in progressive kilns. Wood Material Science and Engineering 3(1–2)."},
  {label:"Cown, D.J. (1999). NZ Radiata Pine and Douglas-fir: Suitability for Processing. Forest Research Bulletin No. 216. New Zealand Forest Research Institute."},
  {label:"International Plant Protection Convention (IPPC). ISPM 15: Regulation of wood packaging material in international trade.",href:"https://www.ippc.int/en/publications/640/"},
  {label:"NZS 3604:2011. Timber-framed buildings. Standards New Zealand.",href:"https://www.standards.govt.nz/product-download/download/461950/0?formatId=1bd170ba-2514-eb11-a812-000d3a6aa268&mediaTypeId=4af995f7-f243-48a1-aec8-6016b05da360"},
  {label:"NZS 3631:1988. New Zealand Timber Grading Rules. Standards New Zealand."},
  {label:"AS/NZS 4787:2001. Timber — Assessment of Drying Quality. Standards Australia / Standards New Zealand."},
  {label:"Red Stag Timber. Measuring Moisture in Timber.",href:"https://www.redstagtimber.co.nz/products/new-zealand-products/technical-information/timber-briefs/timber-brief-3/"},
] as const;

export function KilnDryingArticle(){
  return <article className="ria kda">
    <header className="ria-hero kda-hero">
      <div className="ria-hero-copy">
        <Eyebrow>INDUSTRY INSIGHT</Eyebrow>
        <h1>The Science of<br/><span className="headline-accent">Kiln Drying</span></h1>
        <h2>Conventional and Continuous Kilns, Moisture Content, and Why It Matters for Radiata Pine</h2>
        <p>Every pack of sawn Radiata Pine in New Zealand starts its journey green, often containing more than 100 per cent moisture relative to its dry weight.</p>
        <div className="ria-meta"><span>BY FPX</span><span>16 SEPTEMBER 2026</span><span>10 MIN READ</span></div>
      </div>
      <div className="ria-hero-image">
        <Image src="/images/kiln-drying-cover.png" alt="Stacked Radiata Pine timber inside a kiln drying facility in New Zealand" width={1920} height={1200} sizes="(max-width: 900px) 100vw, 55vw" priority/>
        <span>RADIATA PINE · KILN DRYING</span>
      </div>
    </header>

    <section className="ria-start">
      <div><Eyebrow>START HERE</Eyebrow><h2>How controlled drying turns green Radiata Pine into stable, predictable timber — and what buyers should check on delivery.</h2></div>
      <nav aria-label="Article contents"><small>IN THIS ARTICLE</small>{contents.map(([number,title,id])=><a href={`#${id}`} key={id}><span>{number}</span>{title}</a>)}</nav>
    </section>

    <div className="ria-reading kda-reading">
      <div className="ria-intro">
        <p className="ria-lead">Kiln drying reduces moisture in a controlled environment, transforming raw timber into a stable, predictable material.</p>
        <p>Every pack of sawn Radiata Pine in New Zealand starts its journey green, often containing more than 100 per cent moisture relative to its dry weight. Kiln drying (KD) reduces that moisture in a controlled environment, transforming raw timber into a stable, predictable material. Whether a mill uses conventional batch kilns or continuous kilns, the goal is the same: to reach a specified moisture content so the timber performs reliably from the yard to the finished job.</p>
        <p>Both methods are widely used in New Zealand and can produce high-quality timber that meets industry standards when operated correctly. This article explains how each works, why moisture content targets matter, and what buyers should check on delivery.</p>
      </div>

      <section id="why-kiln-dry" className="ria-section kda-section">
        <header><span className="ria-number">01</span><div><small>THE CASE FOR KILN DRYING</small><h2>Why Kiln Dry Timber?</h2></div></header>
        <div className="ria-copy"><p>Kiln drying is more than a way to accelerate the natural drying process. It is a fundamental requirement for modern construction and export markets.</p></div>
        <div className="kda-benefits">{benefits.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section id="moisture-content" className="ria-section kda-section">
        <header><span className="ria-number">02</span><div><small>SPECIFICATIONS</small><h2>Moisture Content Targets &amp; Timber Dimensions</h2></div></header>
        <div className="ria-copy">
          <p>In New Zealand, kiln-dried structural Radiata Pine is commonly dried to around 12–16% moisture content (MC), although specific targets can vary by product and supplier.</p>
          <p>Treatment and hazard class are separate from kiln drying, but treatment can affect the timber’s moisture content. For H1.2 internal framing, boron treatment temporarily increases MC. New Zealand mills generally kiln dry the timber again after treatment. As a result, H1.2 framing is typically supplied at up to 18% MC, while retaining the dimensional stability expected of kiln-dried structural timber.</p>
        </div>
        <figure className="kda-technical-card"><div><Image src="/images/radiata-pine-moisture-content-h12-treatment.png" alt="New Zealand Radiata Pine moisture content before and after H1.2 boron treatment" width={1600} height={1600} sizes="(max-width: 800px) 92vw, 62vw"/></div><figcaption><span>TECHNICAL REFERENCE</span><strong>Moisture content before and after H1.2 treatment</strong><p>The visual is kept fully contained so moisture targets and treatment information remain legible.</p></figcaption></figure>
        <div className="ria-copy"><p>Under NZS 3604:2011, New Zealand’s timber-framing standard, framing timber must be at or below 20% MC before the building is closed in, meaning before wall and ceiling linings are installed.</p><p>Typical indoor equilibrium moisture content in New Zealand is around 12–15%. This is the range timber naturally moves towards once installed and exposed to normal indoor conditions. Timber installed above this range may continue to dry after enclosure, resulting in shrinkage and movement, including gaps, distortion and fixing issues.</p></div>
        <div className="kda-stats"><article><strong>16%</strong><span>Typical production target<br/>for structural Radiata Pine</span></article><article><strong>≤ 20%</strong><span>Maximum MC before enclosure<br/>(NZS 3604:2011)</span></article><article><strong>12–15%</strong><span>Indoor EMC in New Zealand<br/>(typical range)</span></article></div>
        <div className="ria-copy kda-subsection"><h3>Thickness, Width, and Drying Time</h3><p>Thicker and wider boards take longer to reach the same target moisture content (MC) than thinner material because moisture must travel from the core to the surface before it can escape. The greater the thickness, the longer this path, which slows the drying process. If thick sections are forced to dry too quickly, the outer layers dry and shrink first while the core remains wetter and swollen. This difference creates internal stress because the outer shell is tightening around a still-expanded core, which can lead to collapse or internal checking. For this reason, drying schedules are adjusted based on section size, and mixing significantly different thicknesses in the same kiln charge requires careful control.</p></div>
        <figure className="kda-photo-card kda-photo-right"><div><Image src="/images/radiata-pine-moisture-meter-kiln-dried-timber.png" alt="Moisture meter measuring kiln-dried Radiata Pine timber" width={1400} height={1000} sizes="(max-width: 800px) 92vw, 58vw"/></div><figcaption><span>DELIVERY CHECK</span><strong>Verify moisture content, don’t assume it.</strong><p>A calibrated pin-type moisture meter is the standard tool for verifying MC specifications on delivery.</p></figcaption></figure>
      </section>

      <section id="conventional-batch-kilns" className="ria-section kda-section">
        <header><span className="ria-number">03</span><div><small>TECHNOLOGY</small><h2>Conventional Batch Kilns</h2></div></header>
        <div className="ria-copy"><p>In a conventional batch kiln, a fixed stack of timber is loaded into a sealed chamber. Temperature, humidity, and airflow are controlled according to a schedule tailored to species, section size, and target MC. Once the charge reaches target, a conditioning phase is typically applied, reintroducing steam to equalise moisture between boards and relieve residual drying stress.</p><p>Conventional kilns are the most common type used by New Zealand mills and remain the backbone of the industry worldwide. Their flexibility is a genuine strength: mills processing mixed section sizes or specialty orders can adjust the schedule for each charge in ways a continuous kiln cannot easily accommodate. The capital cost is also substantially lower than a continuous system, which is why many mills continue to use this technology.</p><p>A well-managed conventional kiln, with a properly calibrated schedule, adequate conditioning, and experienced operators, is fully capable of producing timber that meets the New Zealand's standards (NZS 3631:1988 and AS/NZS 4787:2001). Because the stack is stationary, airflow is not perfectly uniform throughout the pack, particularly toward the centre. Without a thorough conditioning phase this can result in wider MC variation between boards. Quality of outcome depends significantly on schedule design, kiln maintenance, and operator experience.</p></div>
        <figure className="kda-photo-card"><div><Image src="/images/conventional-batch-kiln-radiata-pine-timber.png" alt="Conventional batch kiln loaded with stacked Radiata Pine timber" width={1600} height={1100} sizes="(max-width: 800px) 92vw, 62vw"/></div><figcaption><span>CONVENTIONAL BATCH</span><strong>Flexible schedules for varied production.</strong><p>Conventional batch kilns allow flexible scheduling across mixed section sizes, the industry standard across NZ mills.</p></figcaption></figure>
      </section>

      <section id="continuous-kilns" className="ria-section kda-section">
        <header><span className="ria-number">04</span><div><small>TECHNOLOGY</small><h2>Continuous Kilns</h2></div></header>
        <figure className="kda-photo-card kda-photo-right"><div><Image src="/images/continuous-kiln-radiata-pine-timber-drying.png" alt="Continuous kiln tunnel drying Radiata Pine timber on an automated line" width={1600} height={1100} sizes="(max-width: 800px) 92vw, 62vw"/></div><figcaption><span>CONTINUOUS KILN</span><strong>Fixed drying conditions at industrial scale.</strong><p>Continuous kilns move timber through a fixed drying environment, delivering tighter moisture distribution at scale.</p></figcaption></figure>
        <div className="ria-copy kda-after-figure"><p>A continuous kiln (also called a progressive or counter-flow kiln) moves timber slowly through a long tunnel. Green timber enters at one end and dried timber exits at the other. The counter-flow design recovers energy efficiently: heat from the exiting dried timber pre-heats the incoming green timber, while moisture from the wet timber naturally conditions the drier lengths. Research indicates this delivers thermal energy savings of approximately 30% compared with conventional batch kilns.</p><p>Because each board passes through the same fixed drying conditions in sequence and residence time is consistent, continuous kilns tend to produce tighter moisture distribution across a pack. They can run 24 hours a day, supporting more predictable throughput at high volumes. However, they require significantly higher capital investment and are generally optimised for a specific section size and species, making them less flexible for varied products.</p></div>
        <blockquote className="kda-pullquote">Because every board passes through identical drying conditions in sequence, continuous kilns tend to produce tighter moisture distribution across a pack.</blockquote>
      </section>

      <section id="research-study" className="ria-section kda-section">
        <header><span className="ria-number">05</span><div><small>WHAT THE RESEARCH SHOWS</small><h2>Comparing the Two: A 2022 Study</h2></div></header>
        <div className="ria-copy"><p>A 2022 peer-reviewed study by Kumar et al. (BioResources) compared a continuous kiln against ultra-high temperature (HTD) batch drying for Queensland plantation-grown southern pine, a plantation softwood closely related to Radiata Pine, using AS/NZS standard test methods.</p><p className="kda-source-note">Primary research: <a href="https://bioresources.cnr.ncsu.edu/resources/impact-of-continuous-drying-method-on-drying-quality-of-southern-pine-sawn-timber/" target="_blank" rel="noreferrer">Kumar et al. (2022), BioResources</a>.</p></div>
        <div className="kda-study"><div className="kda-study-head"><span>KUMAR ET AL., BIORESOURCES, 2022</span><h3>Key Findings: Continuous Kiln vs Ultra-High Temperature Batch Drying (HTD)</h3></div><div className="kda-findings"><article><strong>48% vs 6%</strong><p>Coefficient of variation in moisture content, HTD process versus continuous kiln</p></article><article><strong>51% vs 17%</strong><p>Boards showing internal checking, HTD process versus continuous kiln</p></article><article><strong>7×</strong><p>Higher resin accumulation in the HTD process due to elevated temperatures</p></article><article><strong>Lower</strong><p>Drying stress and moisture gradient significantly reduced in continuous kiln boards</p></article></div></div>
        <div className="ria-copy kda-study-note"><p><strong>Note:</strong> This study compares a continuous kiln against ultra-high temperature batch drying (up to 180°C), not against conventional batch kilns running at moderate temperatures with proper conditioning. The study is most useful for understanding how drying temperature and method affect quality outcomes, not as a blanket assessment of all conventional kilns. It is also one of the few direct comparisons available, so while the results are notable, further testing is needed to confirm performance across a wider range of conditions. Well-operated conventional kilns using optimised schedules regularly produce timber that meets all relevant NZ standards.</p></div>
        <div className="kda-comparison"><h3>Conventional vs Continuous: At a Glance</h3><div className="kda-table-wrap"><table><thead><tr><th>Attribute</th><th>Conventional Batch Kiln</th><th>Continuous Kiln</th></tr></thead><tbody><tr><th>MC Consistency</th><td>Varies with schedule and conditioning quality</td><td>Tight distribution at scale</td></tr><tr><th>Energy Efficiency</th><td>Standard</td><td>~30% savings via counter-flow</td></tr><tr><th>Flexibility</th><td>Adjustable per charge, mixed sections</td><td>Optimised for specific section/species</td></tr><tr><th>Capital Cost</th><td>Substantially lower</td><td>Significantly higher investment</td></tr><tr><th>Throughput</th><td>Batch cycles</td><td>Continuous, 24/7 operation</td></tr><tr><th>NZ Standard Compliance</th><td>Capable when well-managed</td><td>Capable when well-managed</td></tr></tbody></table></div></div>
      </section>

      <section id="on-delivery" className="ria-section kda-section">
        <header><span className="ria-number">06</span><div><small>FOR BUYERS</small><h2>What This Means on Delivery</h2></div></header>
        <div className="ria-copy"><p>The key consideration is not which kiln type was used, but whether the finished timber meets the moisture content, dimensional stability and quality requirements for its intended use. Both batch and continuous kilns can produce compliant timber when operated correctly.</p><p>All kiln-dried timber purchased through FPX is checked at the mill to confirm it is within the required specification before dispatch. The aim is for the timber to arrive ready for its intended application, with moisture content and product quality consistent with the listed specification.</p></div>
        <figure className="kda-photo-card"><div><Image src="/images/radiata-pine-timber-delivery-moisture-testing.png" alt="Radiata Pine timber packs being inspected for moisture content before delivery" width={1600} height={1100} sizes="(max-width: 800px) 92vw, 62vw"/></div><figcaption><span>BEFORE DISPATCH</span><strong>Check the specification at the mill.</strong><p>Kiln-dried timber purchased through FPX is checked at the mill to confirm it meets the required specification before dispatch.</p></figcaption></figure>
      </section>
    </div>

    <section id="digital-market" className="ria-sourcing kda-sourcing"><div><span>07 · FPX SOURCING</span><h2>Radiata Pine Sourcing<br/><em>with a Clear Way In</em></h2></div><div className="ria-sourcing-copy"><p>Purchasing decisions should be guided by whether timber meets the relevant grade, moisture and product specification for its intended use. FPX is a digital timber sourcing service for commercial buyers in New Zealand, supported by practical timber expertise behind the platform.</p><p>Buyers can browse available timber, review current offers or send FPX a specific timber requirement. For a defined requirement, including dimensions, grade, treatment, quantity and timing helps keep the sourcing brief clear from the start.</p><p>The website helps buyers understand the timber and sourcing options before moving into the detailed commercial requirement.</p><h3>Need Radiata Pine to a specific requirement?</h3><p>Browse available timber or send FPX the specification you already have.</p><div className="kda-actions"><a href="https://app.fpx.nz/stock">Browse timber <Arrow/></a><Link href="/fpx-sourcing">How FPX Sourcing works <Arrow/></Link></div></div></section>

    <section id="kiln-conclusion" className="ria-conclusion kda-conclusion"><div><span>08 · CONCLUSION</span><h2>Neither Kiln Type is Inherently Superior. Execution is Everything.</h2></div><div><p>Kiln drying transforms green Radiata Pine into a stable, strong, and export-ready material. Conventional batch kilns remain the most widely used technology in New Zealand, offering flexibility, lower capital cost, and a proven track record across a wide range of grades and section sizes. Continuous kilns offer advantages in energy efficiency and moisture uniformity at scale. Neither type is inherently superior for all situations, and both produce timber that meets NZ standards when properly managed.</p><p>Ultimately, kiln performance comes down to how well the process is controlled. Consistency in moisture content reflects operational discipline, process management, and experience, not just kiln type. FPX supports this by providing the visibility and structure needed to account for the variables that impact quality, consistency, and reliability. This helps buyers make more informed sourcing decisions and secure timber that meets specification.</p><blockquote className="kda-closing-quote">Consistency in timber quality comes from disciplined processes and clear visibility. Focus on specification, understand the variables, and make decisions with confidence.</blockquote></div></section>

    <section className="ria-sources"><Eyebrow>SOURCES</Eyebrow><h2>Research and industry references.</h2><p>This article draws on publicly available research and industry resources for accuracy. Key references include:</p><ol>{sources.map(source=><li key={source.label}>{source.href?<a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>:source.label}</li>)}</ol></section>
    <section className="ria-next"><div><Eyebrow>NEXT IN INDUSTRY INSIGHTS</Eyebrow><h2>More timber knowledge from FPX.</h2><p>Explore practical guides covering timber characteristics, processing, specifications and sourcing.</p><nav className="ria-related" aria-label="Related FPX timber pages"><Link href="/building-construction">Building &amp; construction timber</Link><Link href="/timber">Timber range</Link><Link href="/fpx-sourcing">FPX Sourcing</Link></nav></div><Link href="/industry-insights">View Industry Insights <Arrow/></Link></section>
  </article>;
}
