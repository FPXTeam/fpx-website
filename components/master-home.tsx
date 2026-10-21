import Link from "next/link";
import Image from "next/image";
import { Shell } from "./site-shell";
import styles from "./george-product-preview.module.css";

const browseUrl = "https://app.fpx.nz/explore-fpx-sourcing";
const requestUrl = "https://app.fpx.nz/explore-fpx-sourcing?request=1";

function Actions(){
  return <div className={styles.actions}>
    <a className={styles.primary} href={browseUrl}>Browse Timber</a>
    <a className={styles.secondary} href={requestUrl}>Submit a Timber Request</a>
  </div>;
}

function ProductVisual(){
  return <div className={styles.deviceStage} aria-label="FPX platform shown on desktop and phone">
    <div className={styles.laptop}>
      <div className={styles.laptopTop}><span/><span/><span/></div>
      <div className={styles.laptopScreen}>
        <Image src="/images/fpx-app-shop.png" alt="FPX Stock screen" width={1600} height={1000} priority sizes="(max-width: 1050px) 90vw, 52vw"/>
      </div>
    </div>
    <div className={styles.phone}>
      <div className={styles.phoneScreen}>
        <Image src="/images/fpx-app-requests.png" alt="FPX Request screen" width={900} height={1600} priority sizes="190px"/>
      </div>
    </div>
    <p className={styles.deviceNote}>Actual FPX application screens</p>
  </div>;
}

const productGroups = [
  ["Manufacturing", "Timber for wood processors and manufacturers."],
  ["Building & Construction", "Structural, building and specialist construction timber."],
  ["Outdoor & Landscaping", "Timber for fencing, decking, retaining and outdoor work."],
  ["Dunnage", "Timber for freight, shipping and load support."],
] as const;

export function MasterHome(){
  return <Shell><main id="main-content" className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          <p className={styles.eyebrow}>FPX</p>
          <h1>Browse timber. Check pricing. Submit requirements.</h1>
          <p className={styles.heroLead}>Use FPX to browse available timber and pricing, or submit a timber requirement when you cannot find what you need.</p>
          <Actions/>
        </div>
        <ProductVisual/>
      </div>
    </section>

    <div className={styles.trustBar}>
      <div className={styles.trustInner}><span>FPX Sourcing is operated by <b>Sutcliffe Trading</b>, established in 1988.</span></div>
    </div>

    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>WHAT YOU CAN DO IN FPX</p>
          <h2>Use FPX from requirement through to order.</h2>
          <p>The website introduces the platform. The guest FPX experience lets new visitors start browsing timber or submit a requirement without registering first.</p>
        </div>
        <div className={styles.featureGrid}>
          <article className={styles.feature}><span>01</span><h3>Browse Stock</h3><p>View available timber, specifications, pricing, specials and tier-volume pricing where available.</p></article>
          <article className={styles.feature}><span>02</span><h3>Submit Requests</h3><p>Send product specifications, quantities and delivery requirements for timber you need.</p></article>
          <article className={styles.feature}><span>03</span><h3>Review Quotes</h3><p>Customers can review quotations associated with their timber requirements through FPX.</p></article>
          <article className={styles.feature}><span>04</span><h3>Manage Orders</h3><p>Signed-in customers can review and manage their timber orders through their FPX account.</p></article>
        </div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.visualSection}`}>
      <div className={`${styles.sectionInner} ${styles.visualGrid}`}>
        <div className={styles.visualCopy}>
          <p className={styles.eyebrow}>FPX SOURCING</p>
          <h2>Two ways to source timber.</h2>
          <p>Browse timber already available through FPX, or submit a requirement when the product, specification or quantity you need is not listed.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={browseUrl}>Browse Timber</a>
            <a className={styles.primary} href={requestUrl}>Submit a Request</a>
          </div>
        </div>
        <div className={styles.screenCard}>
          <Image src="/images/fpx-app-requests.png" alt="FPX timber Request workflow" width={1500} height={950} sizes="(max-width: 1050px) 90vw, 46vw"/>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>SOURCE THROUGH FPX</p>
          <h2>Browse available timber or tell us what you need.</h2>
        </div>
        <div className={styles.twoGrid}>
          <article className={styles.routeCard}>
            <small>AVAILABLE TIMBER</small>
            <h3>Browse Stock</h3>
            <p>Explore available stock, product specifications, specials and quantity-based pricing. Merchants and commercial end users can order available timber, subject to their account access.</p>
            <a href={browseUrl}>Browse Timber →</a>
          </article>
          <article className={styles.routeCard}>
            <small>TIMBER REQUIREMENTS</small>
            <h3>Request Timber</h3>
            <p>Submit specifications, quantities and delivery requirements for timber that is not listed or currently available through FPX.</p>
            <a href={requestUrl}>Submit a Timber Request →</a>
          </article>
        </div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.intelligence}`}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>FPX INTELLIGENCE</p>
          <h2>Market data available through FPX.</h2>
          <p>FPX Intelligence gives customers access to live information that can support timber and market decisions.</p>
        </div>
        <div className={styles.intelGrid}>
          <article className={styles.intelCard}><h3>Building Consents</h3><p>View building consent information currently available through FPX Intelligence.</p></article>
          <article className={styles.intelCard}><h3>Diesel Price Index</h3><p>View diesel price index information currently available through FPX Intelligence.</p></article>
        </div>
        <p className={styles.intelNote}>Preview note: the final Explore Intelligence link should use the confirmed live analytics destination.</p>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>WHO USES FPX</p>
          <h2>Different customers use FPX in different ways.</h2>
        </div>
        <div className={styles.customerGrid}>
          <article className={styles.customerCard}><h3>Wood Processors &amp; Manufacturers</h3><p>Submit timber requirements to specification and review orders through FPX.</p></article>
          <article className={styles.customerCard}><h3>Timber Merchants</h3><p>Browse additional stock, specials and tier-volume pricing to help fill supply gaps.</p></article>
          <article className={styles.customerCard}><h3>Commercial End Users</h3><p>Browse available timber and commercial pricing, or submit specific project requirements.</p></article>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>TIMBER RANGE</p>
          <h2>Start with the product category. Continue in FPX.</h2>
          <p>The public Timber Range introduces the main product groups. Availability, pricing and timber requirements continue through FPX.</p>
        </div>
        <div className={styles.featureGrid}>
          {productGroups.map(([title,copy])=><article className={styles.feature} key={title}><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className={styles.actions}><Link className={styles.primary} href="/timber">View Timber Range</Link><a className={styles.primary} href={browseUrl}>Browse Timber in FPX</a></div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.operator}`}>
      <div className={styles.operatorBox}>
        <div><p className={styles.eyebrow}>OPERATED BY SUTCLIFFE TRADING</p><h2>Digital access backed by an established timber business.</h2></div>
        <p>FPX Sourcing is operated commercially by Sutcliffe Trading. Sutcliffe Trading sources, sells and invoices timber supplied through FPX, bringing its timber trading experience into the FPX customer journey.</p>
      </div>
    </section>

    <section className={styles.close}>
      <div className={styles.closeInner}><h2>Start using FPX.</h2><Actions/></div>
    </section>
  </main></Shell>;
}
