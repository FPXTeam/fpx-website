import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, Linkedin, Mail } from "lucide-react";
import { Shell } from "@/components/site-shell";
import issues from "@/data/industry-news.json";
import "@/components/master-site.css";
import "@/components/premium-clean-sitewide.css";
import "@/components/revised-pages.css";
import "@/components/industry-news.css";

const base = "https://www.fpx.nz";
const socialImage = "/images/social/fpx-social-share.jpg";
const isProduction = process.env.VERCEL_ENV === "production";
type Insight = (typeof issues)[number];
const findIssue = (slug: string): Insight | undefined => issues.find(issue => issue.slug === slug);
const otherIssue = (issue: Insight) => issues.find(other => other.issue !== issue.issue)!;
const formatDate = (date: string) => new Date(date + "T00:00:00Z").toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function generateStaticParams() {
  return issues.map(issue => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const issue = findIssue(slug);
  if (!issue) return {};
  const path = `/industry-insights/${issue.slug}`;
  return {
    title: { absolute: issue.pageTitle + " | FPX" },
    description: issue.description,
    alternates: { canonical: path },
    robots: { index: isProduction, follow: true, googleBot: { index: isProduction, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      type: "article", locale: "en_NZ", siteName: "FPX | Forest Products Exchange",
      url: path, title: issue.pageTitle, description: issue.description,
      publishedTime: issue.publishedAt, modifiedTime: issue.updatedAt,
      authors: [`${base}/about-us#george-harman`], section: "Timber News",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Forest Products Exchange - Saw Point timber industry news" }]
    },
    twitter: { card: "summary_large_image", title: issue.pageTitle, description: issue.description, images: [socialImage] }
  };
}

export default async function InsightNewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = findIssue(slug);
  if (!issue) notFound();
  const next = otherIssue(issue);
  const url = `${base}/industry-insights/${issue.slug}`;
  const citations = Array.from(new Set([
    ...issue.sections.flatMap(section => section.sources.map(source => source.href)),
    ...issue.worthReading.map(source => source.href)
  ]));
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "FPX Insights", item: `${base}/industry-insights` },
      { "@type": "ListItem", position: 3, name: issue.pageTitle, item: url }
    ]
  };
  const articleSchema = {
    "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${url}#article`,
    headline: issue.pageTitle, alternativeHeadline: `Saw Point | Issue ${issue.issue} | ${issue.month} ${issue.year}`,
    description: issue.description, image: `${base}${socialImage}`,
    url, mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: issue.publishedAt, dateModified: issue.updatedAt,
    author: { "@type": "Person", "@id": `${base}/about-us#george-harman`, name: "George Harman", url: `${base}/about-us`, worksFor: { "@id": `${base}/#organization` } },
    publisher: { "@id": `${base}/#organization` },
    isPartOf: { "@id": `${base}/industry-insights#collection` },
    isBasedOn: issue.linkedinUrl, citation: citations,
    articleSection: "Timber News", keywords: issue.keywords.join(", "),
    about: issue.keywords.map(name => ({ "@type": "Thing", name })),
    inLanguage: "en-NZ"
  };
  const related = issue.issue === "001"
    ? [{ href: "/manufacturing", title: "Manufacturing timber" }, { href: "/timber-growth-rings", title: "Radiata Pine characteristics" }, { href: "/the-science-of-kiln-drying", title: "The science of kiln drying" }, { href: "/fpx-sourcing", title: "FPX timber sourcing" }]
    : [{ href: "/timber", title: "Explore the FPX timber range" }, { href: "/manufacturing", title: "Manufacturing timber" }, { href: "/fpx-intelligence", title: "FPX industry indicators" }, { href: "/the-science-of-kiln-drying", title: "Timber kiln drying guide" }];

  return <Shell>
    <main id="main-content" className="master-site m-inner-site spn-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, articleSchema]) }}/>
      <div className="spn-container">
        <nav className="spn-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/industry-insights">FPX Insights</Link><span aria-hidden="true">/</span><span aria-current="page">Saw Point Issue {issue.issue}</span>
        </nav>
        <header className="spn-heading">
          <div className="spn-heading-top"><span>TIMBER NEWS</span><span>SAW POINT · ISSUE {issue.issue}</span></div>
          <h1>{issue.headline}<span> | Saw Point {issue.month} {issue.year}</span></h1>
          <p>{issue.summary}</p>
          <div className="spn-byline">
            <span>By <Link href="/about-us">George Harman</Link>, Director, FPX</span>
            <span>Published <time dateTime={issue.publishedAt}>{formatDate(issue.publishedAt)}</time></span>
            <span>Full Saw Point issue</span>
          </div>
        </header>
        <div className="spn-layout">
          <aside className="spn-aside" aria-label="Article navigation">
            <div className="spn-sticky">
              <p className="spn-aside-label">IN THIS ISSUE</p>
              <nav aria-label="Issue contents">
                {issue.sections.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading.replace(/^(THE BIG STORY|MARKET UPDATE|EXPORT WATCH|ONE TO WATCH): /, "").replace(/^SAW POINT$/, "Saw Point")}</a>)}
                <a href="#worth-reading"><span>06</span>Worth reading this month</a>
              </nav>
              <Link className="spn-back" href="/industry-insights"><ArrowLeft aria-hidden="true" size={15}/> All FPX Insights</Link>
            </div>
          </aside>
          <article className="spn-article" aria-label={`Saw Point issue ${issue.issue} in full`}>
            <div className="spn-original">
              <p className="spn-introduction">{issue.introduction}</p>
              <blockquote>{issue.openingQuote}</blockquote>
              {issue.sections.map((section, index) => <section id={`section-${index + 1}`} className="spn-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paras.map((paragraph, p) => <p key={p}>{paragraph}</p>)}
                <div className="spn-sources">
                  <span>{section.sourceLabel}</span>{" "}
                  {section.sources.map((source, i) => <span key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.text}</a>{i < section.sources.length - 1 ? " " : ""}</span>)}
                </div>
              </section>)}
              <section className="spn-section spn-reading" id="worth-reading">
                <h2>WORTH READING THIS MONTH</h2>
                {issue.worthReading.map(item => <p key={item.href}><strong>{item.title}</strong> {item.description} <a href={item.href} target="_blank" rel="noopener noreferrer">{item.action}<ArrowUpRight aria-hidden="true" size={15}/></a></p>)}
              </section>
              <div className="spn-signoff">
                {issue.closing.map(line => <p key={line}>{line}</p>)}
                <p>Subscribe at <Link href="/saw-point#saw-point-subscribe">fpx.nz/saw-point</Link></p>
              </div>
            </div>
            <div className="spn-original-link">
              <span>ALSO PUBLISHED ON LINKEDIN</span>
              <a href={issue.linkedinUrl} target="_blank" rel="noopener noreferrer">View the original Saw Point issue <ArrowUpRight aria-hidden="true" size={17}/></a>
            </div>
          </article>
        </div>
        <aside className="spn-related" aria-label="Related FPX resources">
          <div className="spn-related-heading"><span>EXPLORE FPX</span><h2>More on timber and sourcing</h2><p>Related FPX resources and guides for readers of Saw Point.</p></div>
          <div className="spn-related-links">{related.map(item => <Link href={item.href} key={item.href}><BookOpen size={19} aria-hidden="true"/>{item.title}<ArrowUpRight size={17} aria-hidden="true"/></Link>)}</div>
        </aside>
        <aside className="spn-connect" aria-label="Stay connected with Saw Point">
          <span className="spn-connect-kicker">STAY CONNECTED</span><h2>Keep up with New Zealand&apos;s timber industry.</h2>
          <p>Get Saw Point&apos;s monthly updates from George Harman. Follow FPX on LinkedIn or have the next issue delivered to your inbox.</p>
          <div className="spn-connect-buttons">
            <a href="https://nz.linkedin.com/company/forest-products-exchange" target="_blank" rel="noopener noreferrer"><Linkedin size={20} aria-hidden="true"/> Follow FPX on LinkedIn <ArrowUpRight size={17} aria-hidden="true"/></a>
            <Link href="/saw-point#saw-point-subscribe"><Mail size={20} aria-hidden="true"/> Join the mailing list <ArrowUpRight size={17} aria-hidden="true"/></Link>
          </div>
        </aside>
        <nav className="spn-next" aria-label="Next article">
          <Link href="/industry-insights"><ArrowLeft size={17} aria-hidden="true"/> Timber News &amp; Guides</Link>
          <Link href={`/industry-insights/${next.slug}`}><span>READ ANOTHER ISSUE</span>{next.headline} <ArrowUpRight size={16} aria-hidden="true"/></Link>
        </nav>
      </div>
    </main>
  </Shell>;
}
