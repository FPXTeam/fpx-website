"use client";

import { ExternalLink, Mail, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Eyebrow } from "./master-shared";
import sawPointIssues from "../data/saw-point-issues.json";
import { trackFpxEvent } from "./analytics-events";

const monthOrder=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
function issueDateValue(value:string){
  const upper=value.toUpperCase();
  const year=Number(upper.match(/\b\d{4}\b/)?.[0]||0);
  const month=monthOrder.findIndex(name=>upper.includes(name));
  return year*12+(month>=0?month:0);
}
const issues=[...sawPointIssues].sort((a,b)=>issueDateValue(b.date)-issueDateValue(a.date)||Number(b.issue)-Number(a.issue));
function sawPointHref(item:(typeof issues)[number]){return item.body?`/saw-point/${item.slug}`:item.linkedinUrl}
function sawPointExternal(item:(typeof issues)[number]){return item.body?{}:{target:"_blank",rel:"noreferrer"}}

export function SawPointPage(){
  const latest = issues[0];
  const archive = issues.slice(1);
  const [archiveQuery,setArchiveQuery]=useState("");
  const [archiveYear,setArchiveYear]=useState("ALL");
  const [archivePage,setArchivePage]=useState(1);
  const [archivePerPage,setArchivePerPage]=useState(5);
  const [subscribeStatus,setSubscribeStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
  const [subscribeMessage,setSubscribeMessage]=useState("");

  const archiveYears=useMemo(
    ()=>Array.from(new Set(archive.map(item=>item.date.match(/\b\d{4}\b/)?.[0]).filter(Boolean) as string[])).sort((a,b)=>Number(b)-Number(a)),
    [archive]
  );
  const filteredArchive=useMemo(()=>{
    const query=archiveQuery.trim().toLowerCase();
    return archive.filter(item=>{
      const itemYear=item.date.match(/\b\d{4}\b/)?.[0]||"";
      const matchesYear=archiveYear==="ALL"||itemYear===archiveYear;
      const haystack=[item.issue,item.date,item.title,item.excerpt].join(" ").toLowerCase();
      return matchesYear&&(!query||haystack.includes(query));
    });
  },[archive,archiveQuery,archiveYear]);
  const totalArchivePages=Math.max(1,Math.ceil(filteredArchive.length/archivePerPage));
  const safeArchivePage=Math.min(archivePage,totalArchivePages);
  const archiveStart=(safeArchivePage-1)*archivePerPage;
  const visibleArchive=filteredArchive.slice(archiveStart,archiveStart+archivePerPage);

  function updateArchiveQuery(value:string){setArchiveQuery(value);setArchivePage(1)}
  function updateArchiveYear(value:string){setArchiveYear(value);setArchivePage(1)}
  function updateArchivePerPage(value:number){setArchivePerPage(value);setArchivePage(1)}
  async function subscribe(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setSubscribeStatus("sending");setSubscribeMessage("");
    const form=event.currentTarget;const payload=Object.fromEntries(new FormData(form).entries());
    try{
      const response=await fetch("/api/saw-point-subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data?.error||"Unable to subscribe right now.");
      form.reset();trackFpxEvent("saw_point_subscribe",{source:"saw_point_page"});setSubscribeStatus("success");setSubscribeMessage("You're on the Saw Point list.");
    }catch(error){setSubscribeStatus("error");setSubscribeMessage(error instanceof Error?error.message:"Unable to subscribe right now.")}
  }

  return <>
    <section className="spx-hero">
      <div className="spx-hero-copy">
        <div className="spx-presents"><span/><small>FPX PRESENTS</small><span/></div>
        <h1>Saw Point<span className="spx-dot">.</span></h1>
        <h2>Straight talk on NZ timber -<br/>no sawdust.</h2>
        <p className="spx-intro">Monthly NZ timber industry news, market updates,<br className="spx-desktop-break"/> and a straight read on what’s happening.</p>
        <div className="spx-mini-rule"/>
        <div className="spx-meta">
          <strong>Written by George Harman</strong>
          <span/>
          <p>Director, FPX</p>
          <span/>
          <b>Monthly</b>
        </div>
      </div>
    </section>

    <section className="spx-latest">
      <div className="spx-section-label">
        <Eyebrow>LATEST ISSUE</Eyebrow>
        <span>{latest.date}</span>
      </div>

      <a className="spx-feature" href={sawPointHref(latest)} {...sawPointExternal(latest)}>
        <div className="spx-feature-number">{latest.issue}</div>
        <div className="spx-feature-copy">
          <small>ISSUE {latest.issue}</small>
          <h2>The latest<br/>Saw Point.</h2>
          <p>{latest.excerpt}</p>
          <span className="spx-read">{latest.body?"Read issue on FPX":"Read issue on LinkedIn"} <ExternalLink size={16}/></span>
        </div>
        <div className="spx-feature-side">
          <span>MONTHLY INDUSTRY READ</span>
          <p>Selected developments. Clear context. Written for people working in and around New Zealand timber.</p>
          <ArrowRight aria-hidden="true"/>
        </div>
      </a>
    </section>

    <section className="spx-archive">
      <header>
        <div>
          <Eyebrow>THE ARCHIVE</Eyebrow>
          <h2>Previous issues.</h2>
        </div>
        <p>Saw Point is published by FPX and written by George Harman.</p>
      </header>

      <div className="spx-archive-tools">
        <div className="spx-archive-search">
          <Search size={17} aria-hidden="true"/>
          <label className="sr-only" htmlFor="saw-point-search">Search Saw Point issues</label>
          <input
            id="saw-point-search"
            type="search"
            value={archiveQuery}
            onChange={e=>updateArchiveQuery(e.target.value)}
            placeholder="Search issues, dates or topics"
          />
        </div>

        <div className="spx-year-filters" aria-label="Filter Saw Point archive by year">
          <button type="button" className={archiveYear==="ALL"?"active":""} onClick={()=>updateArchiveYear("ALL")}>All years</button>
          {archiveYears.map(year=><button type="button" key={year} className={archiveYear===year?"active":""} onClick={()=>updateArchiveYear(year)}>{year}</button>)}
        </div>

        <label className="spx-per-page">
          <span>Show</span>
          <select value={archivePerPage} onChange={e=>updateArchivePerPage(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div className="spx-archive-status">
        <span>{filteredArchive.length===0?"No issues found":`Showing ${archiveStart+1}–${Math.min(archiveStart+archivePerPage,filteredArchive.length)} of ${filteredArchive.length}`}</span>
      </div>

      <div className="spx-archive-list" aria-live="polite">
        {visibleArchive.map(item=>
          <a href={sawPointHref(item)} {...sawPointExternal(item)} key={item.issue}>
            <span className="spx-archive-issue">ISSUE {item.issue}</span>
            <div className="spx-archive-copy">
              <small>{item.date}</small>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </div>
            <span className="spx-archive-link">Read issue <ExternalLink size={14}/></span>
          </a>
        )}
        {visibleArchive.length===0&&<div className="spx-archive-empty"><strong>No matching issues.</strong><span>Try another search term or year.</span></div>}
      </div>

      <div className="spx-pagination" aria-label="Saw Point archive pagination">
        <button type="button" onClick={()=>setArchivePage(Math.max(1,safeArchivePage-1))} disabled={safeArchivePage<=1}><ChevronLeft size={16}/> Previous</button>
        <span>Page <b>{safeArchivePage}</b> of <b>{totalArchivePages}</b></span>
        <button type="button" onClick={()=>setArchivePage(Math.min(totalArchivePages,safeArchivePage+1))} disabled={safeArchivePage>=totalArchivePages}>Next <ChevronRight size={16}/></button>
      </div>
    </section>

    <section className="spx-subscribe">
      <div className="spx-subscribe-copy">
        <Eyebrow>GET THE NEXT ISSUE</Eyebrow>
        <h2>Saw Point,<br/>straight to your inbox.</h2>
        <p>One monthly industry read from George Harman, plus selected FPX updates. No daily noise.</p>
        <div className="spx-proof">
          <span>Monthly</span>
          <span>Written by George Harman</span>
          <span>Unsubscribe any time</span>
        </div>
      </div>

      <form className="spx-form" aria-label="Saw Point subscription" onSubmit={subscribe}>
        <input className="fpx-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
        <input type="hidden" name="source" value="Saw Point page"/>
        <div className="spx-form-icon"><Mail aria-hidden="true"/></div>
        <h3>Join the Saw Point list</h3>
        <label><span>Name</span><input name="name" autoComplete="name" placeholder="Your name" required/></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.co.nz" required/></label>
        <button type="submit" disabled={subscribeStatus==="sending"}>{subscribeStatus==="sending"?"Subscribing…":"Subscribe"} <ArrowRight size={17}/></button>
        <small aria-live="polite">{subscribeMessage||<>Monthly Saw Point updates. Unsubscribe any time. See our <a href="/privacy-policy">Privacy Policy</a>.</>}</small>
      </form>
    </section>

    <style jsx global>{`
      .spx-hero{
        min-height:720px;
        position:relative;
        isolation:isolate;
        overflow:hidden;
        display:flex;
        align-items:center;
        background-color:#F4F7F3;
      }
      .spx-hero:before{
        content:"";
        position:absolute;
        inset:0;
        z-index:-1;
        pointer-events:none;
        background:
          linear-gradient(90deg,
            rgba(247,249,246,1) 0%,
            rgba(247,249,246,1) 50%,
            rgba(247,249,246,.97) 55%,
            rgba(247,249,246,.78) 61%,
            rgba(247,249,246,.30) 69%,
            rgba(247,249,246,0) 77%);
      }
      .spx-hero:after{
        content:"";
        position:absolute;
        top:0;
        right:0;
        bottom:0;
        width:62%;
        z-index:-2;
        pointer-events:none;
        background-image:url("/images/saw-point.png");
        background-repeat:no-repeat;
        background-size:175% auto;
        background-position:right center;
      }
      .spx-hero-copy{
        width:min(760px,54vw);
        margin-left:max(6vw,72px);
        padding:82px 0 76px;
        display:flex;
        flex-direction:column;
        justify-content:center;
      }
      .spx-presents{
        width:min(600px,100%);
        display:grid;
        grid-template-columns:minmax(72px,1fr) auto minmax(72px,1fr);
        align-items:center;
        gap:18px;
        margin-bottom:34px;
      }
      .spx-presents span{height:2px;background:#40973C}
      .spx-presents small{white-space:nowrap;font:700 12px/1 Lato,Arial,sans-serif;letter-spacing:.23em;color:#40973C}
      .spx-hero h1{
        margin:0;
        font-size:clamp(84px,8.3vw,142px);
        line-height:.84;
        letter-spacing:-.078em;
        color:#071512;
      }
      .spx-dot{color:#40973C}
      .spx-hero h2{
        margin:32px 0 0;
        max-width:710px;
        font:700 clamp(34px,3.1vw,55px)/1.02 Lato,Arial,sans-serif;
        letter-spacing:-.045em;
        color:#071512;
      }
      .spx-intro{
        margin:28px 0 0;
        max-width:700px;
        color:#64736C;
        font-size:19px;
        line-height:1.62;
      }
      .spx-mini-rule{width:104px;height:3px;background:#40973C;margin:40px 0 34px}
      .spx-meta{display:flex;align-items:center;flex-wrap:wrap;gap:17px}
      .spx-meta strong{font:700 17px/1.3 Lato,Arial,sans-serif;color:#071512}
      .spx-meta p{margin:0;font-size:17px;color:#64736C}
      .spx-meta b{font:700 17px/1.3 Lato,Arial,sans-serif;color:#40973C}
      .spx-meta span{width:1px;height:27px;background:rgba(7,21,18,.25)}
      .spx-desktop-break{display:block}

      .spx-latest{padding:110px 7vw;background:#fff}
      .spx-section-label{display:flex;align-items:end;justify-content:space-between;gap:30px;margin-bottom:30px}
      .spx-section-label .m-eyebrow{margin:0}
      .spx-section-label>span{font:700 10px/1 Lato,Arial,sans-serif;letter-spacing:.15em;color:#758956}
      .spx-feature{display:grid;grid-template-columns:minmax(170px,.32fr) minmax(0,1fr) minmax(250px,.55fr);min-height:520px;color:#fff;background:#071512;text-decoration:none;border-radius:2px;overflow:hidden}
      .spx-feature-number{display:flex;align-items:flex-start;justify-content:center;padding:46px 20px;font:800 clamp(90px,12vw,190px)/.75 Montserrat,Arial,sans-serif;letter-spacing:-.08em;color:#53C396;border-right:1px solid rgba(255,255,255,.13)}
      .spx-feature-copy{padding:62px 6vw;display:flex;flex-direction:column;justify-content:center}
      .spx-feature-copy>small{font:700 9px/1 Lato,Arial,sans-serif;letter-spacing:.18em;color:#53C396}
      .spx-feature-copy h2{margin:18px 0 20px;font-size:clamp(48px,5.7vw,88px);line-height:.9;letter-spacing:-.055em;color:#fff}
      .spx-feature-copy p{max-width:580px;margin:0;color:#BAC6C0;line-height:1.7}
      .spx-read{margin-top:40px;display:flex;align-items:center;gap:9px;font:700 12px/1 Lato,Arial,sans-serif;color:#fff}
      .spx-feature-side{padding:55px 44px;border-left:1px solid rgba(255,255,255,.13);display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(180deg,rgba(83,195,150,.04),rgba(83,195,150,.11))}
      .spx-feature-side>span{font:700 9px/1 Lato,Arial,sans-serif;letter-spacing:.16em;color:#53C396}
      .spx-feature-side p{margin:18px 0 34px;color:#BAC6C0;line-height:1.65;font-size:14px}
      .spx-feature-side svg{color:#53C396;width:28px;height:28px}

      .spx-archive{padding:105px 7vw 120px;background:#F7F4EA;border-top:1px solid rgba(4,14,14,.09)}
      .spx-archive>header{display:grid;grid-template-columns:1fr minmax(260px,.55fr);gap:8vw;align-items:end;margin-bottom:42px}
      .spx-archive h2{margin:8px 0 0;font-size:clamp(50px,5.4vw,84px);line-height:.92;letter-spacing:-.055em}
      .spx-archive>header>p{margin:0;color:#64736C;font-size:15px;line-height:1.7}
      .spx-archive-tools{display:grid;grid-template-columns:minmax(280px,1fr) auto auto;gap:14px;align-items:center;padding:18px 0;border-top:1px solid rgba(4,14,14,.16);border-bottom:1px solid rgba(4,14,14,.16)}
      .spx-archive-search{height:46px;display:flex;align-items:center;gap:10px;padding:0 14px;background:#fff;border:1px solid rgba(4,14,14,.14)}
      .spx-archive-search svg{flex:0 0 auto;color:#758956}
      .spx-archive-search input{width:100%;border:0;outline:0;background:transparent;color:#040E0E;font:400 13px/1 Open Sans,Arial,sans-serif}
      .spx-archive-search input::placeholder{color:#89968F}
      .spx-year-filters{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
      .spx-year-filters button{min-height:38px;padding:0 13px;border:1px solid rgba(4,14,14,.15);background:transparent;color:#52645B;font:700 10px/1 Lato,Arial,sans-serif;letter-spacing:.04em;cursor:pointer;transition:.2s ease}
      .spx-year-filters button:hover,.spx-year-filters button.active{background:#071512;border-color:#071512;color:#fff}
      .spx-per-page{height:46px;display:flex;align-items:center;gap:8px;padding:0 10px 0 12px;background:#fff;border:1px solid rgba(4,14,14,.14)}
      .spx-per-page span{font:700 9px/1 Lato,Arial,sans-serif;letter-spacing:.10em;color:#758956;text-transform:uppercase}
      .spx-per-page select{border:0;outline:0;background:transparent;color:#040E0E;font:700 12px/1 Lato,Arial,sans-serif;cursor:pointer}
      .spx-archive-status{display:flex;justify-content:flex-end;padding:15px 0 10px}
      .spx-archive-status span{font:600 10px/1 Lato,Arial,sans-serif;letter-spacing:.06em;color:#758956}
      .spx-archive-list{border-top:1px solid rgba(4,14,14,.16)}
      .spx-archive{overflow-x:clip}
      .spx-archive>header,.spx-archive-tools,.spx-archive-list,.spx-archive-list>a,.spx-archive-copy{min-width:0}
      .spx-archive-tools{max-width:100%}
      .spx-year-filters{min-width:0;max-width:100%}
      .spx-archive-list>a{min-height:118px;display:grid;grid-template-columns:92px minmax(0,1fr) 96px;gap:22px;align-items:center;padding:20px 4px;border-bottom:1px solid rgba(4,14,14,.16);color:#040E0E;text-decoration:none;transition:padding .2s ease,background .2s ease}
      .spx-archive-list>a:hover{padding-left:14px;padding-right:14px;background:rgba(255,255,255,.58)}
      .spx-archive-issue{font:700 10px/1 Lato,Arial,sans-serif;letter-spacing:.12em;color:#40973C}
      .spx-archive-copy small{display:block;font:700 9px/1 Lato,Arial,sans-serif;letter-spacing:.13em;color:#758956}
      .spx-archive-list h3{margin:7px 0 5px;font-size:clamp(20px,1.8vw,28px);line-height:1.05;letter-spacing:-.025em;overflow-wrap:anywhere}
      .spx-archive-list p{margin:0;max-width:780px;color:#64736C;font-size:12px;line-height:1.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .spx-archive-link{display:flex;align-items:center;gap:7px;white-space:nowrap;font:700 10px/1 Lato,Arial,sans-serif}
      .spx-archive-empty{min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border-bottom:1px solid rgba(4,14,14,.16);color:#040E0E}
      .spx-archive-empty strong{font:700 18px/1.2 Lato,Arial,sans-serif}.spx-archive-empty span{font-size:13px;color:#758956}
      .spx-pagination{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;padding-top:24px}
      .spx-pagination button{display:flex;align-items:center;gap:6px;width:max-content;min-height:40px;padding:0 13px;border:1px solid rgba(4,14,14,.16);background:#fff;color:#040E0E;font:700 10px/1 Lato,Arial,sans-serif;cursor:pointer}
      .spx-pagination button:last-child{justify-self:end}
      .spx-pagination button:disabled{opacity:.35;cursor:not-allowed}
      .spx-pagination>span{font:600 10px/1 Lato,Arial,sans-serif;letter-spacing:.05em;color:#758956}

      .spx-subscribe{padding:115px 7vw;display:grid;grid-template-columns:minmax(0,.9fr) minmax(420px,.62fr);gap:10vw;background:#071512;color:#fff;align-items:center}
      .spx-subscribe .m-eyebrow{color:#53C396!important}
      .spx-subscribe h2{margin:10px 0 24px;font-size:clamp(52px,5.6vw,88px);line-height:.9;letter-spacing:-.055em;color:#fff}
      .spx-subscribe-copy>p{margin:0;max-width:570px;color:#BAC6C0;font-size:16px;line-height:1.75}
      .spx-proof{margin-top:38px;display:flex;flex-wrap:wrap;gap:10px}
      .spx-proof span{border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:10px 13px;font:700 9px/1 Lato,Arial,sans-serif;letter-spacing:.09em;color:#D9E2DE}
      .spx-form{padding:38px;background:#fff;color:#040E0E}
      .spx-form-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:#EEF6EF;color:#40973C}
      .spx-form h3{margin:24px 0 26px;font-size:30px;line-height:1}
      .spx-form label{display:block;margin-top:16px}
      .spx-form label>span{display:block;margin-bottom:8px;font:700 9px/1 Lato,Arial,sans-serif;letter-spacing:.13em;color:#758956}
      .spx-form input{width:100%;min-height:54px;border:1px solid #DDE4DF;background:#FBFCFB;padding:0 15px;font:400 14px/1 Open Sans,Arial,sans-serif;color:#040E0E}
      .spx-form button{width:100%;min-height:56px;margin-top:20px;border:0;display:flex;align-items:center;justify-content:center;gap:10px;background:#40973C;color:#fff;font:700 12px/1 Lato,Arial,sans-serif;cursor:pointer;opacity:1}
      .spx-form>small{display:block;margin-top:13px;color:#758956;font-size:10px;line-height:1.5}

      @media(max-width:1180px){
        .spx-archive-tools{grid-template-columns:minmax(0,1fr) auto}
        .spx-archive-search{grid-column:1/-1}
        .spx-year-filters{grid-column:1}
        .spx-per-page{grid-column:2}
      }
      @media(max-width:1000px){
        .spx-hero{min-height:680px}
        .spx-hero:before{background:linear-gradient(90deg,rgba(247,249,246,1) 0%,rgba(247,249,246,1) 48%,rgba(247,249,246,.94) 56%,rgba(247,249,246,.58) 66%,rgba(247,249,246,0) 82%)}
        .spx-hero:after{width:68%;background-size:185% auto;background-position:right center}
        .spx-hero-copy{width:min(680px,70vw);margin-left:6vw;padding:70px 0}
        .spx-feature{grid-template-columns:150px 1fr}.spx-feature-side{grid-column:1/-1;border-left:0;border-top:1px solid rgba(255,255,255,.13);min-height:200px}
        .spx-subscribe{grid-template-columns:1fr;gap:60px}.spx-form{max-width:650px}
      }
      @media(max-width:700px){
        .spx-hero{min-height:680px;align-items:flex-end}
        .spx-hero:after{top:0;right:0;bottom:auto;width:100%;height:52%;background-size:130% auto;background-position:right 42%}
        .spx-hero:before{background:linear-gradient(180deg,rgba(247,249,246,.08) 0%,rgba(247,249,246,.18) 24%,rgba(247,249,246,.80) 48%,rgba(247,249,246,.98) 62%,rgba(247,249,246,1) 100%)}
        .spx-hero-copy{width:auto;margin:0;padding:280px 24px 44px}
        .spx-presents{gap:12px;margin-bottom:24px}.spx-presents span{min-width:40px}.spx-presents small{font-size:10px;letter-spacing:.18em}
        .spx-hero h1{font-size:clamp(60px,19vw,88px)}
        .spx-hero h2{margin-top:20px;font-size:clamp(26px,7.8vw,36px)}
        .spx-intro{margin-top:18px;font-size:15px}.spx-desktop-break{display:none}
        .spx-mini-rule{margin:26px 0 22px}
        .spx-meta{gap:10px}.spx-meta strong,.spx-meta p,.spx-meta b{font-size:14px}.spx-meta span{height:17px}
        .spx-latest,.spx-archive,.spx-subscribe{padding-left:24px;padding-right:24px}.spx-latest{padding-top:76px;padding-bottom:76px}
        .spx-feature{grid-template-columns:1fr}.spx-feature-number{justify-content:flex-start;border-right:0;border-bottom:1px solid rgba(255,255,255,.13);font-size:100px;padding:32px}.spx-feature-copy{padding:42px 32px}.spx-feature-side{grid-column:auto;padding:34px 32px}
        .spx-archive{padding-top:76px;padding-bottom:82px}.spx-archive>header{grid-template-columns:1fr;gap:20px}.spx-archive-tools{grid-template-columns:1fr}.spx-year-filters{order:2}.spx-per-page{order:3;width:max-content}.spx-archive-status{justify-content:flex-start}.spx-archive-list>a{grid-template-columns:1fr auto;gap:8px 16px;min-height:102px;padding:18px 0}.spx-archive-issue{grid-column:1}.spx-archive-copy{grid-column:1}.spx-archive-list p{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.spx-archive-link{grid-column:2;grid-row:1/3;align-self:center}.spx-pagination{grid-template-columns:1fr 1fr}.spx-pagination>span{grid-column:1/-1;grid-row:1;text-align:center}.spx-pagination button:first-child{grid-column:1;grid-row:2}.spx-pagination button:last-child{grid-column:2;grid-row:2}
        .spx-subscribe{padding-top:82px;padding-bottom:82px}.spx-form{padding:28px 22px}
      }
    `}</style>
  </>;
}
