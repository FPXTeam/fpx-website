"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./george-product-preview.module.css";

const browseUrl = "https://app.fpx.nz/explore-fpx-sourcing";
const requestUrl = "https://app.fpx.nz/explore-fpx-sourcing?request=1";

function Actions(){
  return <div className={styles.actions}>
    <a className={styles.primary} href={browseUrl}>Browse Timber</a>
    <a className={styles.secondary} href={requestUrl}>Submit a Timber Request</a>
  </div>;
}

export function SourceTimberPage(){return <div className={styles.page}>
  <section className={styles.sourcingHero}>
    <div className={styles.sourcingHeroInner}>
      <div>
        <p className={styles.eyebrow}>FPX SOURCING</p>
        <h1>Two ways to source timber through FPX.</h1>
        <p>Browse timber already available through FPX, or submit a timber requirement when the product, specification or quantity you need is not listed.</p>
        <Actions/>
      </div>
      <div className={styles.screenCard}>
        <Image src="/images/fpx-app-shop.png" alt="FPX Stock screen" width={1500} height={950} priority sizes="(max-width: 1050px) 90vw, 50vw"/>
      </div>
    </div>
  </section>

  <div className={styles.trustBar}><div className={styles.trustInner}>FPX Sourcing is operated by <b>Sutcliffe Trading</b>, established in 1988.</div></div>

  <section className={styles.section}>
    <div className={styles.sectionInner}>
      <div className={styles.sectionHead}>
        <p className={styles.eyebrow}>SOURCE TIMBER</p>
        <h2>Browse Stock or submit a Request.</h2>
        <p>New visitors can explore FPX and submit timber requirements without registering first.</p>
      </div>
      <div className={styles.processGrid}>
        <article className={styles.processCard}>
          <p className={styles.eyebrow}>01 — BROWSE STOCK</p>
          <h2>See what is available.</h2>
          <p>Explore timber currently available through FPX.</p>
          <ul>
            <li>Available stock and product specifications</li>
            <li>Pricing, specials and tier-volume pricing where available</li>
            <li>Merchants and commercial end users can order available timber, subject to account access</li>
          </ul>
          <a className={styles.primary} href={browseUrl}>Browse Timber</a>
        </article>
        <article className={styles.processCard}>
          <p className={styles.eyebrow}>02 — REQUEST TIMBER</p>
          <h2>Tell us what you need.</h2>
          <p>Submit a timber requirement when the timber you need is not listed or currently available.</p>
          <ul>
            <li>Product and specification</li>
            <li>Required quantity</li>
            <li>Delivery requirements and timing where known</li>
          </ul>
          <a className={styles.primary} href={requestUrl}>Submit a Timber Request</a>
        </article>
      </div>
    </div>
  </section>

  <section className={`${styles.section} ${styles.visualSection}`}>
    <div className={`${styles.sectionInner} ${styles.visualGrid}`}>
      <div className={styles.screenCard}><Image src="/images/fpx-app-requests.png" alt="FPX Request workflow" width={1500} height={950} sizes="(max-width: 1050px) 90vw, 46vw"/></div>
      <div className={styles.visualCopy}>
        <p className={styles.eyebrow}>REQUEST TIMBER</p>
        <h2>Submit requirements directly through FPX.</h2>
        <p>Customers can provide the timber details they know and continue the sourcing process through the same FPX experience.</p>
        <div className={styles.accessNote}>Wood processors use FPX to submit timber requirements and review their orders. Available Stock is presented to merchants and commercial end users according to account access.</div>
      </div>
    </div>
  </section>

  <section className={styles.accountBand}>
    <div className={styles.accountInner}>
      <div><p className={styles.eyebrow}>CUSTOMER ACCOUNT</p><h2>Review quotations and manage orders.</h2></div>
      <p>Once customers are using their FPX account, they can review quotations and manage order information through the platform. Get FPX Access is for registration; Login is for existing customers.</p>
    </div>
  </section>

  <section className={`${styles.section} ${styles.operator}`}>
    <div className={styles.operatorBox}>
      <div><p className={styles.eyebrow}>SUTCLIFFE TRADING</p><h2>The commercial operator behind FPX Sourcing.</h2></div>
      <p>FPX remains the customer-facing digital platform. Sutcliffe Trading operates FPX Sourcing commercially and sources, sells and invoices the timber supplied through FPX.</p>
    </div>
  </section>

  <section className={styles.close}>
    <div className={styles.closeInner}><h2>Browse timber or submit a requirement.</h2><Actions/></div>
  </section>
</div>}

export function HowPage(){return <div className={styles.page}>
  <section className={styles.sourcingHero}>
    <div className={styles.sourcingHeroInner}>
      <div><p className={styles.eyebrow}>HOW FPX WORKS</p><h1>Start in FPX. Continue through quote and order.</h1><p>Browse available timber or submit a Request. The customer journey then continues through quotation and order management in FPX.</p><Actions/></div>
      <div className={styles.screenCard}><Image src="/images/fpx-orders-laptop-tight.webp" alt="FPX order screen" width={1500} height={950} priority/></div>
    </div>
  </section>
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      <div className={styles.featureGrid}>
        <article className={styles.feature}><span>01</span><h3>Browse or Request</h3><p>Browse available timber or submit the specifications and quantities you need.</p></article>
        <article className={styles.feature}><span>02</span><h3>Review Quote</h3><p>Review the quotation provided against the requirement.</p></article>
        <article className={styles.feature}><span>03</span><h3>Confirm Order</h3><p>Confirm the timber that works for your requirement.</p></article>
        <article className={styles.feature}><span>04</span><h3>Manage Order</h3><p>Review order information through your FPX account.</p></article>
      </div>
      <div className={styles.actions}><Link className={styles.primary} href="/fpx-sourcing">FPX Sourcing</Link><Link className={styles.primary} href="/timber">Timber Range</Link></div>
    </div>
  </section>
</div>}
