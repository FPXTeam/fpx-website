"use client";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Eyebrow } from "./master-shared";
import news from "@/data/industry-news.json";
import archive from "@/data/saw-point-issues.json";

// Show the complete FPX articles, plus any original LinkedIn-only issues in date order.
// A LinkedIn-only issue is never represented as a full website article without source copy.
const newsCards = [
  ...news.map(issue => ({
    issue:issue.issue, headline:issue.headline, pageTitle:issue.pageTitle, summary:issue.summary,
    month:issue.month, year:issue.year, coverImage:issue.coverImage, coverAlt:issue.coverAlt,
    href:`/industry-insights/${issue.slug}`, external:false,
    searchText:[issue.headline,issue.pageTitle,issue.summary,issue.month,...issue.keywords,...issue.sections.map(s=>s.heading)].join(" ")
  })),
  ...archive.filter(item=>!news.some(article=>article.issue===item.issue)).map(issue=>({
    issue:issue.issue, headline:`Saw Point | Issue ${issue.issue} | ${issue.date.replace(/^(\w+)/, m=>m[0]+m.slice(1).toLowerCase())}`,
    pageTitle:issue.title, summary:issue.excerpt,
    month:issue.date.split(" ")[0].toLowerCase().replace(/^./,c=>c.toUpperCase()),
    year:Number(issue.year), coverImage:issue.coverImage, coverAlt:`Saw Point Issue ${issue.issue} ${issue.date} cover`,
    href:issue.linkedinUrl, external:true,
    searchText:[issue.title,issue.excerpt,issue.date].join(" ")
  }))
].sort((a,b)=>Number(b.issue)-Number(a.issue));

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
  const filteredNews = useMemo(() => newsCards.filter(issue => issue.searchText.toLowerCase().includes(term)), [term]);
  const newsTrack = useRef<HTMLDivElement>(null);
  const [newsPosition,setNewsPosition] = useState({first:1,canPrev:false,canNext:true});
  const updateNewsPosition=useCallback(()=>{
    const track=newsTrack.current;
    if(!track)return;
    const cards=Array.from(track.children) as HTMLElement[];
    const first=cards.length ? cards.reduce((best,card,index)=>Math.abs(card.offsetLeft-track.offsetLeft-track.scrollLeft)<Math.abs(cards[best].offsetLeft-track.offsetLeft-track.scrollLeft)?index:best,0)+1 : 1;
    setNewsPosition({first,canPrev:track.scrollLeft>2,canNext:track.scrollLeft+track.clientWidth<track.scrollWidth-2});
  },[]);
  useEffect(()=>{
    const track=newsTrack.current;if(!track)return;
    track.scrollTo({left:0,behavior:"instant"});
    updateNewsPosition();
    const resize=()=>updateNewsPosition();window.addEventListener("resize",resize);
    return ()=>window.removeEventListener("resize",resize);
  },[term,updateNewsPosition]);
  function moveNews(direction:-1|1){
    const track=newsTrack.current;if(!track)return;
    const card=track.querySelector<HTMLElement>(".fpi-news-card");
    const gap=20;
    track.scrollBy({left:direction*((card?.getBoundingClientRect().width||track.clientWidth)+gap),behavior:"smooth"});
  }
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
        <div className="fpi-carousel-toolbar" aria-label="Timber News carousel controls">
          <span aria-live="polite">Issue {String(filteredNews[Math.min(newsPosition.first-1,filteredNews.length-1)]?.issue||filteredNews[0]?.issue)} · {filteredNews.length} {filteredNews.length===1?"issue":"issues"} available</span>
          <div className="fpi-carousel-buttons">
            <button type="button" aria-label="Previous Timber News article" onClick={()=>moveNews(-1)} disabled={!newsPosition.canPrev}><ChevronLeft size={20} aria-hidden="true"/></button>
            <button type="button" aria-label="Next Timber News article" onClick={()=>moveNews(1)} disabled={!newsPosition.canNext}><ChevronRight size={20} aria-hidden="true"/></button>
          </div>
        </div>
        <div className="fpi-news-grid" role="region" aria-roledescription="carousel" aria-label="Saw Point Timber News" ref={newsTrack} onScroll={updateNewsPosition}>
          {filteredNews.map(issue => <Link className="fpi-news-card" href={issue.href} target={issue.external?"_blank":undefined} rel={issue.external?"noopener noreferrer":undefined} key={issue.issue} role="group" aria-roledescription="slide" aria-label={`Saw Point Issue ${issue.issue}`}>
            <div className="fpi-news-cover">
              <Image src={issue.coverImage} alt={issue.coverAlt} width={1280} height={720} sizes="(max-width: 720px) 88vw, 48vw" unoptimized/>
            </div>
            <div className="fpi-news-card-content">
              <div className="fpi-card-top"><span>SAW POINT · ISSUE {issue.issue}</span><span>{issue.month.toUpperCase()} {issue.year}</span></div>
              <div className="fpi-news-card-body">
                <h3>{issue.headline}{!issue.external && <span className="fpi-news-headline-suffix"> | Saw Point {issue.month} {issue.year}</span>}</h3>
                <p>{issue.summary}</p>
              </div>
              <div className="fpi-card-bottom"><span>By George Harman</span><strong>{issue.external?"Read on LinkedIn":"Read the full issue"} <ArrowUpRight size={17} aria-hidden="true"/></strong></div>
            </div>
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
