"use client";

import { ExternalLink, Mail, ArrowRight } from "lucide-react";
import { Eyebrow } from "./master-shared";

const issues = [
  {
    issue: "002",
    date: "SEPTEMBER 2026",
    title: "Saw Point | Issue 002",
    copy: "New Zealand timber market developments and industry news selected by George Harman.",
    href: "https://www.linkedin.com/pulse/saw-point-issue-002-september-2026-forest-products-exchange-j04nc"
  },
  {
    issue: "001",
    date: "AUGUST 2026",
    title: "Saw Point | Issue 001",
    copy: "The first edition of Saw Point, covering selected developments worth paying attention to across the New Zealand timber industry.",
    href: "https://www.linkedin.com/pulse/saw-point-issue-001-august-2026-forest-products-exchange-rctec"
  }
];

export function SawPointPage(){
  const latest = issues[0];
  const archive = issues.slice(1);

  return <>
    <section className="spx-hero">
      <div className="spx-hero-shell">
        <div className="spx-hero-card">
          <div className="spx-hero-copy">
            <div className="spx-presents"><span/><small>FPX PRESENTS</small><span/></div>
            <h1>Saw Point<span className="spx-dot">.</span></h1>
            <h2>Straight talk on NZ timber - no sawdust.</h2>
            <p className="spx-intro">Monthly NZ timber industry news, market updates, and a straight read on what’s happening.</p>
            <div className="spx-mini-rule"/>
            <div className="spx-meta">
              <strong>Written by George Harman</strong>
              <span/>
              <p>Director, FPX</p>
              <span/>
              <b>Monthly</b>
            </div>
          </div>

          <div className="spx-hero-image">
            <img src="/images/product-groups/manufacturing/manufacturing-hero-pine-stack.png" alt="New Zealand timber stacks"/>
          </div>
        </div>
      </div>
    </section>

    <section className="spx-latest">
      <div className="spx-section-label">
        <Eyebrow>LATEST ISSUE</Eyebrow>
        <span>{latest.date}</span>
      </div>

      <a className="spx-feature" href={latest.href} target="_blank" rel="noreferrer">
        <div className="spx-feature-number">{latest.issue}</div>
        <div className="spx-feature-copy">
          <small>ISSUE {latest.issue}</small>
          <h2>The latest<br/>Saw Point.</h2>
          <p>{latest.copy}</p>
          <span className="spx-read">Read issue on LinkedIn <ExternalLink size={16}/></span>
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

      <div className="spx-archive-list">
        {archive.map((item,index)=>
          <a href={item.href} target="_blank" rel="noreferrer" key={item.issue}>
            <span className="spx-archive-index">{String(index+1).padStart(2,"0")}</span>
            <div>
              <small>ISSUE {item.issue} · {item.date}</small>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
            <span className="spx-archive-link">Read issue <ExternalLink size={15}/></span>
          </a>
        )}
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

      <form className="spx-form" aria-label="Saw Point subscription">
        <div className="spx-form-icon"><Mail aria-hidden="true"/></div>
        <h3>Join the Saw Point list</h3>
        <label><span>Name</span><input name="name" autoComplete="name" placeholder="Your name"/></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.co.nz"/></label>
        <button type="button" disabled aria-disabled="true">Subscribe <ArrowRight size={17}/></button>
        <small>Subscription connection will be reconnected to the existing FPX Make workflow at launch.</small>
      </form>
    </section>

    <style jsx global>{`
      .spx-hero{background:linear-gradient(180deg,#F2F5F1 0%,#EDF2ED 100%);padding:34px 24px 0}
      .spx-hero-shell{width:min(1540px,100%);margin:0 auto}
      .spx-hero-card{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(440px,.85fr);min-height:760px;border-radius:28px;overflow:hidden;background:#F4F6F3}
      .spx-hero-copy{padding:74px 56px 58px;display:flex;flex-direction:column;justify-content:center}
      .spx-presents{display:flex;align-items:center;gap:18px;margin-bottom:34px;max-width:520px}
      .spx-presents span{flex:1;height:2px;background:#6AA869}
      .spx-presents small{white-space:nowrap;font:700 12px/1 Lato,Arial,sans-serif;letter-spacing:.22em;color:#40973C}
      .spx-hero h1{margin:0;font-size:clamp(76px,9vw,140px);line-height:.84;letter-spacing:-.075em;color:#071512}
      .spx-dot{color:#53C396}
      .spx-hero h2{margin:32px 0 0;max-width:900px;font:700 clamp(30px,3.1vw,54px)/1.04 Lato,Arial,sans-serif;letter-spacing:-.04em;color:#071512}
      .spx-intro{margin:28px 0 0;max-width:760px;color:#6A7684;font-size:19px;line-height:1.65}
      .spx-mini-rule{width:106px;height:3px;background:#5AA05A;margin:42px 0 36px}
      .spx-meta{display:flex;align-items:center;flex-wrap:wrap;gap:18px}
      .spx-meta strong{font:700 17px/1.3 Lato,Arial,sans-serif;color:#071512}
      .spx-meta p{margin:0;font-size:17px;color:#6A7684}
      .spx-meta b{font:700 17px/1.3 Lato,Arial,sans-serif;color:#40973C}
      .spx-meta span{width:1px;height:26px;background:rgba(7,21,18,.2)}
      .spx-hero-image{position:relative;min-height:760px;overflow:hidden;border-bottom-left-radius:72px}
      .spx-hero-image:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,14,14,0) 60%,rgba(4,14,14,.12) 100%);pointer-events:none}
      .spx-hero-image img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;transform:scale(1.015)}

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
      .spx-archive>header{display:grid;grid-template-columns:1fr minmax(260px,.55fr);gap:8vw;align-items:end;margin-bottom:52px}
      .spx-archive h2{margin:8px 0 0;font-size:clamp(50px,5.4vw,84px);line-height:.92;letter-spacing:-.055em}
      .spx-archive>header>p{margin:0;color:#64736C;font-size:15px;line-height:1.7}
      .spx-archive-list{border-top:1px solid rgba(4,14,14,.16)}
      .spx-archive-list>a{min-height:210px;display:grid;grid-template-columns:70px minmax(0,1fr) auto;gap:36px;align-items:center;padding:38px 0;border-bottom:1px solid rgba(4,14,14,.16);color:#040E0E;text-decoration:none;transition:padding .25s ease,background .25s ease}
      .spx-archive-list>a:hover{padding-left:18px;padding-right:18px;background:rgba(255,255,255,.55)}
      .spx-archive-index{font:700 11px/1 Lato,Arial,sans-serif;color:#40973C}
      .spx-archive-list small{font:700 9px/1 Lato,Arial,sans-serif;letter-spacing:.15em;color:#758956}
      .spx-archive-list h3{margin:10px 0 10px;font-size:clamp(28px,3vw,46px);line-height:1}
      .spx-archive-list p{margin:0;max-width:740px;color:#64736C;font-size:14px;line-height:1.65}
      .spx-archive-link{display:flex;align-items:center;gap:8px;white-space:nowrap;font:700 11px/1 Lato,Arial,sans-serif}

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
      .spx-form button{width:100%;min-height:56px;margin-top:20px;border:0;display:flex;align-items:center;justify-content:center;gap:10px;background:#40973C;color:#fff;font:700 12px/1 Lato,Arial,sans-serif;cursor:not-allowed;opacity:.72}
      .spx-form>small{display:block;margin-top:13px;color:#758956;font-size:10px;line-height:1.5}

      @media(max-width:1000px){
        .spx-hero{padding:24px 18px 0}
        .spx-hero-card{grid-template-columns:1fr;min-height:auto}
        .spx-hero-copy{padding:64px 38px 50px}
        .spx-hero-image{min-height:500px;border-bottom-left-radius:0}
        .spx-feature{grid-template-columns:150px 1fr}.spx-feature-side{grid-column:1/-1;border-left:0;border-top:1px solid rgba(255,255,255,.13);min-height:200px}
        .spx-subscribe{grid-template-columns:1fr;gap:60px}.spx-form{max-width:650px}
      }
      @media(max-width:700px){
        .spx-hero{padding:16px 12px 0}
        .spx-hero-card{border-radius:22px}
        .spx-hero-copy{padding:42px 22px 34px}
        .spx-presents{gap:12px;margin-bottom:24px}.spx-presents span{max-width:64px}.spx-presents small{font-size:10px;letter-spacing:.18em}
        .spx-hero h1{font-size:clamp(58px,18vw,84px)}
        .spx-hero h2{margin-top:20px;font-size:clamp(24px,7vw,34px)}
        .spx-intro{margin-top:20px;font-size:16px}
        .spx-mini-rule{margin:28px 0 24px}
        .spx-meta{gap:12px}.spx-meta strong,.spx-meta p,.spx-meta b{font-size:15px}.spx-meta span{height:18px}
        .spx-hero-image{min-height:340px;border-bottom-left-radius:0}
        .spx-latest,.spx-archive,.spx-subscribe{padding-left:24px;padding-right:24px}.spx-latest{padding-top:76px;padding-bottom:76px}
        .spx-feature{grid-template-columns:1fr}.spx-feature-number{justify-content:flex-start;border-right:0;border-bottom:1px solid rgba(255,255,255,.13);font-size:100px;padding:32px}.spx-feature-copy{padding:42px 32px}.spx-feature-side{grid-column:auto;padding:34px 32px}
        .spx-archive{padding-top:76px;padding-bottom:82px}.spx-archive>header{grid-template-columns:1fr;gap:20px}.spx-archive-list>a{grid-template-columns:34px 1fr;gap:18px}.spx-archive-link{grid-column:2;margin-top:4px}
        .spx-subscribe{padding-top:82px;padding-bottom:82px}.spx-form{padding:28px 22px}
      }
    `}</style>
  </>;
}
