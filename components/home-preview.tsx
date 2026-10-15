import Image from "next/image";
import Link from "next/link";
import { Shell } from "./site-shell";
import { HomeMotion } from "./home-client";
import styles from "./home-preview.module.css";

const productAreas = [
  {
    title: "Manufacturing",
    copy: "Feedstock and production timber for processors, manufacturers and component makers.",
    image: "/images/product-groups/manufacturing/manufacturing-warehouse-bundles.png",
    href: "/manufacturing",
  },
  {
    title: "Building & Construction",
    copy: "Structural, building, finishing and specialist timber for commercial construction requirements.",
    image: "/images/product-groups/building-construction/building-roof-framing.png",
    href: "/building-construction",
  },
  {
    title: "Outdoor & Landscaping",
    copy: "Treated and purpose-made timber for fencing, retaining, landscaping and outdoor construction.",
    image: "/images/product-groups/outdoor-landscaping/outdoor-slat-fence.png",
    href: "/outdoor-landscaping",
  },
  {
    title: "Dunnage",
    copy: "Timber dunnage for freight, shipping, load support and industrial transport applications.",
    image: "/images/product-groups/dunnage/dunnage-stamped-stack.png",
    href: "/dunnage",
  },
] as const;

const sourcingRoutes = [
  {
    step: "01",
    label: "AVAILABLE TIMBER",
    title: "Browse Stock",
    copy: "Start with timber already available and inspect the product information that matters to your requirement.",
    image: "/images/fpx-app-shop.png",
    href: "https://app.fpx.nz/explore-fpx-sourcing",
    cta: "Browse current stock",
  },
  {
    step: "02",
    label: "CURRENT OPPORTUNITIES",
    title: "View Offers",
    copy: "Review current supplier-led packet and bulk opportunities when the specification and quantity suit.",
    image: "/images/fpx-app-offers.png",
    href: "https://app.fpx.nz/explore-fpx-sourcing?view=offers",
    cta: "View current offers",
  },
  {
    step: "03",
    label: "EXACT REQUIREMENTS",
    title: "Create a Request",
    copy: "If the right timber is not shown, tell FPX what you need and let the sourcing desk identify suitable options.",
    image: "/images/fpx-app-requests.png",
    href: "https://app.fpx.nz/explore-fpx-sourcing?request=1",
    cta: "Create a request",
  },
] as const;

const audiences = [
  ["Timber merchants", "Additional stock, current offers and support for specific customer demand."],
  ["Builders & contractors", "Project-specific timber with a clearer path from requirement to suitable supply."],
  ["Procurement teams", "A practical way to compare suitable timber options for planned purchasing."],
  ["Wood processors", "Feedstock sourcing aligned with production specifications, lengths and volumes."],
] as const;

function Arrow() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}

export function HomePreview() {
  return (
    <Shell>
      <main id="main-content" className={`${styles.preview} premium-home`}>
        <HomeMotion />

        <section className={styles.hero}>
          <Image
            className={styles.heroImage}
            src="/images/fpx-hero-timber-yard.webp"
            alt="Commercial timber stored in a New Zealand timber yard"
            width={1920}
            height={1080}
            sizes="100vw"
            quality={70}
            priority
          />
          <div className={styles.heroShade} />
          <div className={styles.heroInner}>
            <Eyebrow>NEW ZEALAND TIMBER SOURCING</Eyebrow>
            <h1>
              Find the timber you need.
              <span>Then keep sourcing if it is not listed.</span>
            </h1>
            <p className={styles.heroLead}>
              Explore current Stock and Offers, or send FPX a specific requirement. FPX can source beyond what is shown online through suitable New Zealand sawmills, processors and trade supply routes.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryButton} href="https://app.fpx.nz/explore-fpx-sourcing">
                Browse Stock <Arrow />
              </a>
              <a className={styles.secondaryButton} href="https://app.fpx.nz/explore-fpx-sourcing?request=1">
                Create a Request <Arrow />
              </a>
            </div>
          </div>
          <div className={styles.heroBridge}>
            <span>AVAILABLE NOW</span>
            <b>Current stock and offers</b>
            <i />
            <span>NEED SOMETHING ELSE?</span>
            <b>Send the exact requirement</b>
          </div>
        </section>

        <section className={styles.networkSection}>
          <div className={styles.networkIntro}>
            <Eyebrow>BEYOND THE ONLINE RANGE</Eyebrow>
            <h2>
              The listing is a starting point.
              <span>The sourcing network goes further.</span>
            </h2>
            <p>
              FPX is not limited to the timber currently displayed online. When the right product is not shown, the sourcing desk can look across suitable sawmills, processors and other trade supply routes, including direct supply where the quantity and specification suit.
            </p>
            <Link className={styles.textLink} href="/fpx-sourcing">
              See how FPX Sourcing works <Arrow />
            </Link>
          </div>

          <div className={styles.networkFlow} aria-label="Ways FPX can source timber">
            <article>
              <small>01</small>
              <strong>Current supply</strong>
              <p>Start with timber already shown as Stock or a current Offer.</p>
            </article>
            <div className={styles.flowConnector} aria-hidden="true"><span /></div>
            <article>
              <small>02</small>
              <strong>Wider supply network</strong>
              <p>FPX can look beyond the current listings when your requirement needs another option.</p>
            </article>
            <div className={styles.flowConnector} aria-hidden="true"><span /></div>
            <article>
              <small>03</small>
              <strong>Specific manufacture</strong>
              <p>Where the specification and quantity suit, sourcing can extend from mill stock to custom manufacture.</p>
            </article>
          </div>
        </section>

        <section className={styles.rangeSection}>
          <div className={styles.rangeHeading}>
            <div>
              <Eyebrow>WHAT TIMBER DO YOU NEED?</Eyebrow>
              <h2>
                Start with the job,
                <span>not the database.</span>
              </h2>
            </div>
            <div>
              <p>
                Browse timber by the type of work you are buying for. From there, inspect what is available now or move straight into a Request if the exact requirement is not listed.
              </p>
              <Link className={styles.textLink} href="/timber">
                Explore the full timber range <Arrow />
              </Link>
            </div>
          </div>

          <div className={styles.productGrid}>
            {productAreas.map((area, index) => (
              <Link className={styles.productCard} href={area.href} key={area.title}>
                <div className={styles.productImageWrap}>
                  <Image src={area.image} alt={`${area.title} timber applications`} width={1200} height={850} sizes="(max-width: 760px) 100vw, 25vw" quality={60} />
                </div>
                <div className={styles.productCopy}>
                  <small>0{index + 1}</small>
                  <h3>{area.title}</h3>
                  <p>{area.copy}</p>
                  <span>Explore timber <Arrow /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.routesSection}>
          <div className={styles.routesHeading}>
            <Eyebrow>CHOOSE THE FASTEST PATH</Eyebrow>
            <h2>
              See what is there.
              <span>Ask for what is not.</span>
            </h2>
            <p>
              The public site leads directly into the sourcing experience. You can look through current timber and Offers before creating an account, or start a Request when you already know what you need.
            </p>
          </div>

          <div className={styles.routeGrid}>
            {sourcingRoutes.map((route) => (
              <a className={styles.routeCard} href={route.href} key={route.title}>
                <div className={styles.routeMeta}>
                  <span>{route.step}</span>
                  <small>{route.label}</small>
                </div>
                <h3>{route.title}</h3>
                <p>{route.copy}</p>
                <div className={styles.routeScreenshot}>
                  <Image src={route.image} alt={`${route.title} in FPX Sourcing`} width={1200} height={800} sizes="(max-width: 900px) 100vw, 33vw" quality={70} />
                </div>
                <strong>{route.cta} <Arrow /></strong>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.requestSection}>
          <div className={styles.requestCopy}>
            <Eyebrow>WHEN THE EXACT TIMBER IS NOT LISTED</Eyebrow>
            <h2>
              Send the requirement.
              <span>FPX takes the sourcing from there.</span>
            </h2>
            <p>
              A Request is the handoff from browsing into active sourcing. Give FPX the product, grade, treatment, dimensions, lengths, quantities or project information you already have. The sourcing desk can then identify suitable options for review.
            </p>
            <a className={styles.darkButton} href="https://app.fpx.nz/explore-fpx-sourcing?request=1">
              Start a Request <Arrow />
            </a>
          </div>

          <ol className={styles.requestSteps}>
            <li>
              <span>01</span>
              <div><strong>Tell us what you need</strong><p>Start with a product, specification, project, drawing or known requirement.</p></div>
            </li>
            <li>
              <span>02</span>
              <div><strong>FPX sources suitable options</strong><p>The sourcing desk checks relevant supply routes beyond the products already shown online.</p></div>
            </li>
            <li>
              <span>03</span>
              <div><strong>Review before you commit</strong><p>Compare the suitable product, specification, commercial quantity and quoted option before moving to order.</p></div>
            </li>
          </ol>
        </section>

        <section className={styles.audienceSection}>
          <div className={styles.audienceHeading}>
            <Eyebrow>WHO USES FPX</Eyebrow>
            <h2>
              Built around the way
              <span>commercial timber buyers work.</span>
            </h2>
          </div>
          <div className={styles.audienceGrid}>
            {audiences.map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <Link className={styles.textLink} href="/our-customers">
            See who FPX is built for <Arrow />
          </Link>
        </section>

        <section className={styles.claritySection}>
          <div className={styles.clarityPanel}>
            <Eyebrow>CLARITY BEFORE COMMITMENT</Eyebrow>
            <h2>
              One sourcing journey.
              <span>From first search to the right next step.</span>
            </h2>
            <p>
              Learn what FPX does, browse what is available, move into a Request when needed, and sign in when the commercial process requires your account. The website and sourcing experience should feel like one continuous path—not two different products.
            </p>
            <div className={styles.clarityPath} aria-label="FPX customer journey">
              <span>Understand FPX</span><b>→</b><span>Browse Stock / Offers</span><b>→</b><span>Create a Request</span><b>→</b><span>Sign in when needed</span><b>→</b><span>Quote &amp; order</span>
            </div>
          </div>
        </section>

        <section className={styles.finalSection}>
          <div>
            <Eyebrow>START SOURCING</Eyebrow>
            <h2>
              Start with what is available.
              <span>Request what is not.</span>
            </h2>
            <p>Browse current timber without creating an account, or send FPX the exact requirement you need sourced.</p>
          </div>
          <div className={styles.finalActions}>
            <a className={styles.finalPrimary} href="https://app.fpx.nz/explore-fpx-sourcing">Browse Stock <Arrow /></a>
            <a className={styles.finalSecondary} href="https://app.fpx.nz/explore-fpx-sourcing?request=1">Create a Request <Arrow /></a>
            <a className={styles.finalText} href="https://app.fpx.nz/explore-fpx-sourcing?view=offers">View Offers <Arrow /></a>
          </div>
        </section>
      </main>
    </Shell>
  );
}
