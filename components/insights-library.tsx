"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Eyebrow } from "./master-shared";
import news from "@/data/industry-news.json";

const guides = [
  {
    title: "The Science of Kiln Drying",
    subtitle: "Conventional and Continuous Kilns, Moisture Content, and Why It Matters for Radiata Pine",
    description: "An FPX guide to kiln-drying methods, moisture content and why drying matters when specifying Radiata pine.",
    href: "/the-science-of-kiln-drying",
    category: "TIMBER PROCESSING",
    date: "16 SEPTEMBER 2026",
    image: "/images/kiln-drying-cover.png",
    alt: "Stacked Radiata pine timber inside a kiln-drying facility"
  },
  {
    title: "Radiata Pine Characteristics",
    subtitle: "How Growth and Environment Shape Timber in New Zealand",
    description: "A practical FPX guide to the relationship between Radiata pine growth, environment and timber characteristics.",
    href: "/timber-growth-rings",
    category: "TIMBER CHARACTERISTICS",
    date: "13 MARCH 2026",
    image: "/images/radiata-pine-characteristics-cover.png",
    alt: "Close-up of Radiata pine timber growth rings"
  }
];

export function InsightsLibrary() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const filteredNews = useMemo(() => news.filter(issue => (
    [issue.headline, issue.pageTitle, issue.summary, issue.month, ...issue.keywords, ...issue.sections.map(section => section.heading)].join(" ").toLowerCase().includes(term)
  )), [term]);
  const filteredGuides = useMemo(() => guides.filter(guide => (
    [guide.title, guide.subtitle, guide.description, guide.category].join(" ").toLowerCase().includes(term)
  )), [term]);
  const count = filteredNews.length + filteredGuides.length;

  return <>
    <section className="pri-hero">
      <div className="pri-hero-copy">
        <Eyebrow>INDUSTRY INSIGHTS</Eyebrow>
        <h1>Timber knowledge,<br/><span className="headline-accent">made useful.</span></h1>
        <p>New Zealand timber news, market developments and practical timber guides from Forest Products Exchange.</p>
      </div>
      <div className="pri-search-wrap">
        <span>EXPLORE THE LIBRARY</span>
        <div className="pri-search">
          <Search aria-hidden="true"/>
          <label className="sr-only" htmlFor="insight-search">Search FPX Insights</label>
          <input id="insight-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search timber news and guides"/>
        </div>
        <small aria-live="polite">{count} {count === 1 ? "article" : "articles"} available</small>
      </div>
    </section>
    <div className="fpi-library">
      {filteredNews.length > 0 && <section className="fpi-section" aria-labelledby="timber-news">
        <div className="fpi-heading">
          <div><span className="fpi-eyebrow">CURRENT &amp; ARCHIVED</span><h2 id="timber-news">Timber News</h2><p>Market reporting and New Zealand timber industry developments from Saw Point.</p></div>
          <Link href="/saw-point" className="fpi-text-link">About Saw Point <ArrowUpRight aria-hidden="true" size={17}/></Link>
        </div>
        <div className="fpi-news-grid">
          {filteredNews.map((issue, index) => <Link className={index === 0 && !term ? "fpi-news-card fpi-lead" : "fpi-news-card"} href={`/industry-insights/${issue.slug}`} key={issue.issue}>
            <div className="fpi-card-top"><span>SAW POINT · ISSUE {issue.issue}</span><span>{issue.month.toUpperCase()} {issue.year}</span></div>
            <div className="fpi-news-card-body">
              <h3>{issue.headline}<span className="fpi-news-headline-suffix"> | Saw Point {issue.month} {issue.year}</span></h3>
              <p>{issue.summary}</p>
            </div>
            <div className="fpi-card-bottom"><span>By George Harman</span><strong>Read the full issue <ArrowUpRight size={17} aria-hidden="true"/></strong></div>
          </Link>)}
        </div>
      </section>}
      {filteredGuides.length > 0 && <section className="fpi-section fpi-guide-section" aria-labelledby="timber-guides">
        <div className="fpi-heading">
          <div><span className="fpi-eyebrow">PRACTICAL KNOWLEDGE</span><h2 id="timber-guides">Timber Guides</h2><p>Information on Radiata pine, timber processing and product characteristics for New Zealand buyers.</p></div>
        </div>
        <div className="fpi-guides">
          {filteredGuides.map(guide => <Link href={guide.href} key={guide.href} className="fpi-guide-card">
            <div className="fpi-guide-image"><Image src={guide.image} alt={guide.alt} fill sizes="(max-width: 700px) 100vw, 45vw"/></div>
            <div className="fpi-guide-text"><small>{guide.category} · {guide.date}</small><h3>{guide.title}</h3><p className="fpi-guide-subtitle">{guide.subtitle}</p><p>{guide.description}</p><strong>Read timber guide <ArrowUpRight size={17} aria-hidden="true"/></strong></div>
          </Link>)}
        </div>
      </section>}
      {count === 0 && <section className="fpi-empty" aria-live="polite"><h2>No matching FPX Insights.</h2><p>Try another timber topic or clear the search to see all articles.</p><button type="button" onClick={() => setQuery("")}>Clear search</button></section>}
      <aside className="fpi-bottom-cta" aria-label="Saw Point newsletter">
        <div><span>SAW POINT NEWSLETTER</span><h2>Stay across the New Zealand timber market.</h2><p>Read the monthly issue on LinkedIn or subscribe to receive Saw Point by email.</p></div>
        <div className="fpi-cta-actions"><a href="https://nz.linkedin.com/company/forest-products-exchange" target="_blank" rel="noopener noreferrer">Follow FPX on LinkedIn <ArrowUpRight size={18} aria-hidden="true"/></a><Link href="/saw-point#saw-point-subscribe">Join the mailing list <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
      </aside>
    </div>
  </>;
}
