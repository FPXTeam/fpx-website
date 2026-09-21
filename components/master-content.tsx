"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Eyebrow, Arrow, Breadcrumbs, PageCTA } from "./master-shared";
import { privacyPolicy } from "./legal-privacy";
import { termsAndConditions } from "./legal-terms";
import { cookiePolicy } from "./legal-cookies";
import { CookieSettingsPanel } from "./cookie-consent";
import { KilnDryingArticle } from "./kiln-drying-article";

export { SawPointPage } from "./saw-point-page";

export function ResourcesPage(){
  const [query,setQuery]=useState("");
  const items=[
    {title:"Radiata Pine Characteristics",subtitle:"How Growth and Environment Shape Timber in New Zealand",copy:"A practical FPX guide to the relationship between Radiata pine growth, environment and timber characteristics.",image:"radiata-pine-characteristics-cover.png",href:"/timber-growth-rings",type:"TIMBER CHARACTERISTICS",publishedAt:"2026-03-13",displayDate:"13 MARCH 2026"},
    {title:"The Science of Kiln Drying",subtitle:"Conventional and Continuous Kilns, Moisture Content, and Why It Matters for Radiata Pine",copy:"An FPX guide to kiln-drying methods, moisture content and why drying matters when specifying Radiata pine.",image:"kiln-drying-cover.png",href:"/the-science-of-kiln-drying",type:"TIMBER PROCESSING",publishedAt:"2026-09-16",displayDate:"16 SEPTEMBER 2026"}
  ];
  const sorted=[...items].sort((a,b)=>new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime());
  const shown=sorted.filter(item=>(item.title+" "+item.subtitle+" "+item.copy+" "+item.type).toLowerCase().includes(query.toLowerCase()));
  const featured=shown[0];
  const remaining=shown.slice(1);

  return <>
    <section className="pri-hero">
      <div className="pri-hero-copy">
        <Eyebrow>INDUSTRY INSIGHTS</Eyebrow>
        <h1>Timber knowledge,<br/><span className="headline-accent">made useful.</span></h1>
        <p>Practical FPX guides covering timber characteristics, processing, specifications and sourcing topics for New Zealand buyers.</p>
      </div>
      <div className="pri-search-wrap">
        <span>EXPLORE THE LIBRARY</span>
        <div className="pri-search">
          <Search aria-hidden="true"/>
          <label className="sr-only" htmlFor="insight-search">Search Industry Insights</label>
          <input id="insight-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search timber topics"/>
        </div>
        <small>{shown.length} {shown.length===1?"article":"articles"} available</small>
      </div>
    </section>

    <section className="pri-library" aria-live="polite">
      {featured&&<>
        <div className="pri-library-label"><span>FEATURED INSIGHT</span><i/></div>
        <Link href={featured.href} className="pri-featured">
          <div className={`pri-featured-image ${featured.image==="radiata-pine-characteristics-cover.png"?"is-contain":""}`}><Image src={`/images/${featured.image}`} alt={`${featured.title} FPX Insight`} width={1400} height={1000} sizes="(max-width: 1000px) 100vw, 52vw" priority/></div>
          <div className="pri-featured-copy">
            <small>{featured.type} · {featured.displayDate}</small>
            <h2>{featured.title}</h2>
            <h3>{featured.subtitle}</h3>
            <p>{featured.copy}</p>
            <b>Read FPX Insight <Arrow/></b>
          </div>
        </Link>
      </>}

      {remaining.length>0&&
        <div className="pri-more">
          <div className="pri-library-label"><span>MORE INSIGHTS</span><i/></div>
          <div className="pri-grid">
            {remaining.map((item,i)=><Link href={item.href} className="pri-card" key={item.title}>
              <div className="pri-card-image"><Image src={`/images/${item.image}`} alt={`${item.title} FPX Insight`} width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw"/></div>
              <div className="pri-card-meta"><span>{String(i+2).padStart(2,"0")}</span><small>{item.type} · {item.displayDate}</small></div>
              <h2>{item.title}</h2>
              <h3>{item.subtitle}</h3>
              <p>{item.copy}</p>
              <b>Read FPX Insight <Arrow/></b>
            </Link>)}
          </div>
        </div>
      }

      {shown.length===0&&<div className="m-no-results pri-empty"><h2>No matching Industry Insights.</h2><p>Try a broader timber topic.</p></div>}
    </section>
  </>;
}

const faqGroups=[
  {title:"Getting started",items:[["What is FPX Sourcing?","FPX Sourcing is a digital timber sourcing service for commercial timber buyers in New Zealand. Buyers can browse available stock, review current offers or send FPX a specific timber requirement."],["Who is FPX for?","FPX is built for commercial timber buyers including contractors, builders, procurement teams, timber merchants and wood processors across New Zealand."],["How do I start sourcing timber through FPX?","Start by browsing available timber, reviewing current offers or creating a request. Choose the route that best matches how specific your requirement already is."]]},
  {title:"Products and requests",items:[["What if I cannot find the timber I need?","Create a request with the dimensions, grade, treatment, quantity and other requirements you know. FPX will review the requirement and source suitable options."],["What information should I include in a timber request?","Include the product or application, dimensions, grade, treatment, quantity and required timing where known. Clear specifications help FPX identify suitable options."],["What are FPX Offers?","Offers are current timber opportunities that buyers can review and enquire about. Pricing can then be provided based on the buyer’s volumes and requirements."]]},
  {title:"Orders and account",items:[["Can I manage orders through FPX?","Yes. FPX brings order information, deliveries and previously ordered products together in the buyer account."],["Can I reorder timber I have bought before?","Previously ordered products can be used as a starting point for repeat requirements, reducing the need to rebuild the same request from scratch."],["How much does FPX cost for buyers?","FPX is free for buyers to use."]]},
  {title:"Support",items:[["Who can I contact if I need help?","Contact FPX at support@fpx.nz or use the Contact page for timber sourcing questions, platform support or general enquiries."]]}
];
export function FAQPage(){
  const [active,setActive]=useState("Getting started");
  function goTo(title:string){
    setActive(title);
    const id="faq-"+title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
    requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"}));
  }
  return <>
    <section className="pfq-hero"><div><Eyebrow>FREQUENTLY ASKED QUESTIONS</Eyebrow><h1>Straight answers.<br/><span className="headline-accent">No clutter.</span></h1><p>Everything you need to know about sourcing timber through FPX, from browsing products to requests, orders and support.</p></div><aside><small>CAN&apos;T FIND IT?</small><h2>Ask the FPX team.</h2><p>Send us your requirement and we will point you in the right direction.</p><Link href="/contact-us">Contact FPX <Arrow/></Link></aside></section>
    <section className="pfq-main pfq-main-all">
      <nav aria-label="FAQ topics">{faqGroups.map((group,i)=><button key={group.title} type="button" className={active===group.title?"active":""} onClick={()=>goTo(group.title)}><span>0{i+1}</span>{group.title}</button>)}</nav>
      <div className="pfq-all-topics">{faqGroups.map(group=>{
        const id="faq-"+group.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
        return <section className="pfq-topic" id={id} key={group.title}><small>FAQ TOPIC</small><h2>{group.title}</h2>{group.items.map(([question,answer],i)=><details key={question} open={group.title==="Getting started"&&i===0}><summary><span>{String(i+1).padStart(2,"0")}</span><b>{question}</b><ChevronDown/></summary><p>{answer}</p></details>)}</section>
      })}</div>
    </section>
  </>;
}

export function LegalPage({slug}:{slug:string}){
  if(slug==="cookie-settings")return <><Breadcrumbs items={[["Home","/"],["Cookie Settings","/cookie-settings"]]}/><section className="m-legal-hero m-animate-in"><Eyebrow>FPX PRIVACY</Eyebrow><h1>Cookie Settings</h1><p>Review optional browser storage and analytics preferences for the FPX website.</p></section><section className="m-cookie-settings"><div><Eyebrow>YOUR CHOICES</Eyebrow><h2>Choose what FPX can use.</h2><p>Strictly necessary storage remains active because it is required for core website functionality and to remember your privacy choice. Optional preferences and analytics can be changed below at any time.</p><p>Google Analytics 4 is used only when Analytics is enabled. Marketing trackers are not currently enabled through FPX public website code.</p><div className="m-cookie-links"><Link href="/cookie-policy">Read Cookie Policy <Arrow/></Link><Link href="/privacy-policy">Read Privacy Policy <Arrow/></Link></div></div><CookieSettingsPanel/></section></>;
  const doc=slug==="privacy-policy"?privacyPolicy:slug==="cookie-policy"?cookiePolicy:termsAndConditions;
  return <><Breadcrumbs items={[["Home","/"],[doc.title,`/${slug}`]]}/><section className="m-legal-hero m-animate-in"><Eyebrow>FPX LEGAL</Eyebrow><h1>{doc.title}</h1><p>Forest Products Exchange Limited</p>{doc.lastUpdated&&<small>Last updated: {doc.lastUpdated}</small>}</section><section className="m-legal m-legal-full"><aside><span>FOREST PRODUCTS EXCHANGE LIMITED</span><p>Official FPX legal document.</p><nav aria-label={`${doc.title} sections`}>{doc.toc.map(([num,title])=><a key={num} href={`#legal-${num}`}><b>{String(num).padStart(2,"0")}</b>{title}</a>)}</nav></aside><article className="m-legal-document" dangerouslySetInnerHTML={{__html:doc.html}}/></section></>;
}


const radiataSections = [
  {
    id:"plantation-species",
    number:"01",
    eyebrow:"PLANTATION SPECIES",
    title:"The Evolution of Radiata Pine as a Key Plantation Species",
    image:"/images/radiata-pine-plantation-growth.png",
    imageAlt:"Radiata Pine plantation illustrating annual growth rate variations in New Zealand",
    imageClass:"ria-image-photo",
    paragraphs:[
      "New Zealand’s reliance on Radiata Pine was a strategic decision made in the early 20th century. At that time, the depletion of native forests became a significant concern for the government and the building industry. To ensure a sustainable future for the country, plantation expansion was accelerated. Radiata Pine was selected because of its rapid growth, consistent yields, and how well it responded to silvicultural practices like pruning and thinning.",
      "Unlike many native species that traditionally take around 40-60+ years, Radiata Pine reaches a harvestable size much more quickly, typically in 25 to 30 years. This timeframe varies slightly depending on the specific site conditions, the intended end-product, and sometimes market factors such as log prices or volume needs, which can push forests to be harvested sooner or later. Overall, the average harvest age in New Zealand appears to be trending closer to 25 years rather than 30.",
      "Within the professional industry, the focus is placed on grading, treatment, and compliance with national and international standards. Features like ring width, colour and growth can tell us a lot about the properties of the timber."
    ],
    caption:"Radiata Pine plantation illustrating annual growth rate variations and how growth conditions influence timber development."
  },
  {
    id:"growth-rings",
    number:"02",
    eyebrow:"SEASONAL GROWTH",
    title:"How Growth Rings Develop in the New Zealand Climate",
    image:"/images/radiata-pine-earlywood-latewood.png",
    imageAlt:"Radiata Pine earlywood and latewood growth pattern",
    imageClass:"ria-image-technical",
    paragraphs:[
      "Growth rings are the result of a tree’s natural response to seasonal cycles. Every year, a Radiata Pine forms a new layer consisting of two distinct wood types: earlywood and latewood. Earlywood is produced during the spring when growth is rapid and water is plentiful, resulting in wood that is generally lighter in colour and less dense. As growth slows during the summer and autumn, the wood cells become thicker and more robust, forming the denser latewood.",
      "In New Zealand, the ratio of earlywood to latewood shifts based on climate, soil quality, and hydration levels. Because our trees grow in a temperate climate with relatively high rainfall, they typically exhibit wider rings than the slower-growing softwoods found in the Northern Hemisphere. This accelerated growth cycle is a direct reflection of New Zealand conditions, and these environmental factors directly influence the regional density variations found across the country."
    ],
    caption:"Seasonal growth produces lighter earlywood and denser latewood within each annual ring."
  },
  {
    id:"wood-density",
    number:"03",
    eyebrow:"WOOD DENSITY",
    title:"The Practical Importance of Wood Density",
    image:"/images/one-timber-stack.png",
    imageAlt:"Stacked Radiata Pine timber for commercial use in New Zealand",
    imageClass:"ria-image-photo",
    paragraphs:[
      "Density is a core attribute that influences the strength and the stiffness of the timber. Radiata Pine is classified as a moderately low-density softwood. Although this classification may seem counterintuitive it is one of the species greatest strengths because it provides an effective weight-to-strength ratio suitable for a wide range of applications.",
      "Historically in New Zealand, dense hardwoods were used for structural and outdoor purposes. However because Radiata pine has a favourable weight-to-strength ratio and can be effectively treated, it can perform similarly in many of these uses.",
      "There are variations in density in Radiata Pine due to both the tree’s growth rate and the climate conditions where it was grown. These two factors vary considerably throughout New Zealand.",
      "Typically rapid growth produces a higher proportion of earlywood, which is less dense, while slower or more moderated growth increases the proportion of latewood, boosting overall density."
    ],
    caption:"Processed Radiata Pine timber showing the scale of commercial material supplied into the New Zealand market."
  },
  {
    id:"density-variation",
    number:"04",
    eyebrow:"REGIONAL VARIATION",
    title:"Density Variation in Radiata Pine",
    image:"/images/radiata-pine-density-variation.png",
    imageAlt:"New Zealand map illustrating regional Radiata Pine density variation",
    imageClass:"ria-image-technical",
    paragraphs:[
      "These regional environmental factors create distinct density profiles by influencing how growth rings develop. In warmer northern regions such as Northland and the Coromandel, forests benefit from longer growing seasons and reliable rainfall. However, the higher density typically found in these areas is also a result of soil variability. Many northern forests grow on less fertile clay-based soils, which moderate growth rates and encourage a stronger proportion of latewood. This combination of warmth and controlled growth contributes to relatively dense timber.",
      "By contrast, forests in the Central North Island, particularly around the Rotorua and Taupō areas, grow on highly fertile volcanic ash soils. These nutrient-rich conditions support very rapid tree growth, which often results in wider growth rings with a higher proportion of earlywood. This can lead to slightly lower average wood density compared with slower or more moderated sites. In cooler southern areas, growth is typically slower due to shorter growing seasons and colder winter temperatures. While this slow growth generally favours latewood formation, the overall annual wood volume is reduced. Beyond these geographical differences, density also varies within the log itself, where timber from the outer area contains mature wood that is typically much denser than the juvenile wood found near the core."
    ],
    caption:"Regional climate, soils and growing season length contribute to density variation across New Zealand."
  },
  {
    id:"cell-structure",
    number:"05",
    eyebrow:"CELL STRUCTURE",
    title:"Cell Structure and Its Influence on Processing",
    image:"/images/radiata-pine-mature-outerwood.png",
    imageAlt:"Radiata Pine cross section showing sapwood heartwood and pith",
    imageClass:"ria-image-technical",
    paragraphs:[
      "The fibre makeup of Radiata Pine refers to the length, alignment, and integrity of the wood cells. The structure of the cells shapes how the timber behaves during drying and preservative treatments and evolves over the life of the tree depending on growth conditions.",
      "Consistent growth rates across the plantation life of a tree tend to produce more uniform fibres/cells. Better cell uniformity helps moisture leave the wood evenly during kiln drying, reducing warping, cracking, and internal stresses, and also supports more consistent preservative uptake throughout the timber.",
      "Timber cut from the outer sections of a log generally contains mature wood which Is characterised as having longer and sturdier fibres than the juvenile wood found closer to the core.",
      "Radiata Pine consists of sapwood and heartwood, each with distinct characteristics. Sapwood is lighter in colour, contains living cells, and is highly permeable, while heartwood is darker in colour and less permeable.",
      "Radiata from the Central North Island tends to have larger sapwood zones and therefore highly permeable cell structures, which makes it particularly well suited to preservative treatment.",
      "However proper treatment ensures both sapwood and heartwood are treated to the required hazard class throughout the country."
    ],
    caption:"A Radiata Pine cross-section showing the relationship between sapwood, heartwood and the central pith."
  }
] as const;

function RadiataPineArticle(){
  const intro=[
    "For Radiata Pine, which is the dominant species in our forestry sector, this quality is determined by a combination of biological growth processes and the specific environmental influences found across our plantation landscapes.",
    "Radiata Pine, known scientifically as Pinus radiata, is the engine room of New Zealand's commercial forestry. It supports a vast network of industries including construction, engineered wood products, packaging, and international export markets. Although it originated in the coastal regions of California, Radiata Pine has adapted remarkably well to the unique climate and soil profiles of New Zealand. While it is planted most extensively in the North Island, large areas of Radiata Pine are also grown in the South Island, alongside Douglas Fir which performs well in the cooler southern regions.",
    "This article examines Radiata Pine as a managed plantation species. It highlights how specific growth characteristics and regional conditions in New Zealand affect the timber produced for the market. We will look at growth rings as a biological indicator to provide context for the development of the species. These rings serve as a retrospective look at the tree's life and properties rather than a primary tool for timber selection in the modern processing or market stages."
  ];
  const sourcing=[
    "In the modern industry, sourcing timber is about identifying the correct grades and specifications for a particular project. Professionals need clear visibility into what is available in the market and how it meets the necessary standards.",
    "At FPX, our focus is on providing that visibility. We provide a digital platform that reflects the current availability of timber products across New Zealand. We understand that our users value clarity and accountability, and our goal is to simplify the sourcing process by connecting buyers and suppliers through a transparent system. While a knowledge of growth traits and forest biology offers useful context, it is the established industry standards and mechanical grading that should guide purchasing decisions.",
    "By providing a stable structure for these transactions, we ensure that the sourcing process is as efficient and reliable as the timber itself. Our platform is designed to align with the needs of a professional industry that expects performance, consistency, compliance and a straightforward approach to business."
  ];
  const conclusion=[
    "Radiata Pine remains the anchor of the New Zealand forestry sector because of its versatility and the predictability that comes from managed plantations. While the biological factors like growth rings and regional climates inform how the wood is formed, it is the industry’s rigorous processing and grading standards that ensure a standardized outcome for every user.",
    "Understanding the relationship between the environment and timber characteristics underscores the value of Radiata Pine across the entire supply chain. As management practices and technology continue to evolve, this species will continue to be a vital contributor to New Zealand’s manufacturing, construction, and export industries."
  ];
  const sources=[
    'Cown, D.J. (1972). "Density of Radiata Pine: Its Variation and Manipulation." New Zealand Institute of Forestry Journal.',
    'Beets, P.N., et al. (2001). "Wood Density of Radiata Pine: Effect of Nitrogen Supply." Forest Ecology and Management.',
    '"Radiata Pine." Te Ara – The Encyclopedia of New Zealand.',
    '"Radiata Pine Characteristics." Kiwi Lumber.',
    'Palmer, D.J., et al. (2013). "Modelling Variation in Wood Density Within and Among Trees in Stands of New Zealand-Grown Radiata Pine." New Zealand Journal of Forestry Science.',
    "Kimberley et al. (2015): Modelling variation in wood density",
    "RPBC Bulletin No. 2: Radiata Pine Wood Density",
    "Cown, D. J. (1999): NZ Radiata Pine and Douglas-fir: Suitability for Processing"
  ];
  return <article className="ria">
    <header className="ria-hero">
      <div className="ria-hero-copy">
        <Eyebrow>INDUSTRY INSIGHT</Eyebrow>
        <h1>Radiata Pine<br/><span className="headline-accent">Characteristics</span></h1>
        <h2>How Growth and Environment Shape Timber in New Zealand</h2>
        <p>Understanding timber quality begins long before installation: it starts with the tree itself.</p>
        <div className="ria-meta"><span>BY FPX</span><span>13 MARCH 2026</span><span>6 MIN READ</span></div>
      </div>
      <div className="ria-hero-image">
        <Image src="/images/radiata-pine-growth-rings-hero.png" alt="Close-up of Radiata Pine growth rings" width={1920} height={900} sizes="(max-width: 900px) 100vw, 55vw" priority/>
        <span>RADIATA PINE · GROWTH RINGS</span>
      </div>
    </header>

    <section className="ria-start">
      <div>
        <Eyebrow>START HERE</Eyebrow>
        <h2>A practical guide to how growth, climate and wood structure shape Radiata Pine in New Zealand.</h2>
      </div>
      <nav aria-label="Article contents">
        <small>IN THIS ARTICLE</small>
        {radiataSections.map(section=><a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.title}</a>)}
        <a href="#digital-market"><span>06</span>Sourcing Radiata Pine in a Digital Market</a>
        <a href="#radiata-conclusion"><span>07</span>Conclusion</a>
      </nav>
    </section>

    <div className="ria-reading">
      <div className="ria-intro">
        <p className="ria-lead">The quality of timber in the New Zealand market is the result of a long-term process that starts decades before a single log reaches a sawmill.</p>
        {intro.map(p=><p key={p}>{p}</p>)}
      </div>

      {radiataSections.map((section,index)=><section id={section.id} className={`ria-section ${section.imageClass}`} key={section.id}>
        <header>
          <span className="ria-number">{section.number}</span>
          <div><small>{section.eyebrow}</small><h2>{section.title}</h2></div>
        </header>
        <div className="ria-copy">{section.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
        {index===0&&<blockquote>These rings serve as a retrospective look at the tree&apos;s life and properties rather than a primary tool for timber selection in the modern processing or market stages.</blockquote>}
        <figure><Image src={section.image} alt={section.imageAlt} width={1600} height={1200} sizes="(max-width: 800px) 92vw, 72vw"/><figcaption>{section.caption}</figcaption></figure>
      </section>)}
    </div>

    <section id="digital-market" className="ria-sourcing">
      <div>
        <span>06 · SOURCING</span>
        <h2>Sourcing Radiata Pine<br/><em>in a Digital Market</em></h2>
      </div>
      <div className="ria-sourcing-copy">{sourcing.map(p=><p key={p}>{p}</p>)}<Link href="/fpx-sourcing">Explore FPX Sourcing <Arrow/></Link></div>
    </section>

    <section id="radiata-conclusion" className="ria-conclusion">
      <div><span>07 · CONCLUSION</span><h2>Conclusion</h2></div>
      <div>{conclusion.map(p=><p key={p}>{p}</p>)}</div>
    </section>

    <section className="ria-sources">
      <Eyebrow>SOURCES</Eyebrow>
      <h2>Research and industry references.</h2>
      <p>This article draws on publicly available research and industry resources for accuracy. Key references include:</p>
      <ol>{sources.map(source=><li key={source}>{source}</li>)}</ol>
    </section>

    <section className="ria-next">
      <div><Eyebrow>NEXT IN INDUSTRY INSIGHTS</Eyebrow><h2>The Science of Kiln Drying</h2><p>Conventional and continuous kilns, moisture content, and why it matters for Radiata Pine.</p></div>
      <Link href="/the-science-of-kiln-drying">Read next <Arrow/></Link>
    </section>
  </article>;
}

export function InsightArticlePage({slug}:{slug:string}){if(slug==="timber-growth-rings")return <RadiataPineArticle/>;if(slug==="the-science-of-kiln-drying")return <KilnDryingArticle/>;return null;}
