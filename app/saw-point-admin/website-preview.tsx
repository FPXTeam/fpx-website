"use client";

import { useMemo, useState } from "react";
import { Eye, FileText, LayoutGrid, Newspaper } from "lucide-react";
import { monthLabel, parseApprovedArticle } from "../../lib/saw-point-publishing";
import "./website-preview.css";

type PreviewTab="saw-point"|"insights"|"article";
type DraftContent={issue:string;date:string;title:string;body:string;excerpt:string;coverUrl:string;linkedinUrl:string};

export default function SawPointWebsitePreview({draft}:{draft:DraftContent}) {
  const [tab,setTab]=useState<PreviewTab>("saw-point");
  const parsed=useMemo(()=>parseApprovedArticle(draft.body,draft.title),[draft.body,draft.title]);
  const issue=draft.issue.padStart(3,"0");
  const month=monthLabel(draft.date);
  const headline=draft.title.replace(/^THE BIG STORY:\s*/i,"").trim();
  const articleTitle=headline+" | Saw Point "+month;
  const showCover=/^https:\/\/www\.fpx\.nz\/images\/(?:saw-point\/covers\/)?[^?#]+\.(?:png|jpe?g|webp)$/i.test(draft.coverUrl);
  const cover=showCover?<img src={draft.coverUrl} alt={"Saw Point Issue "+issue+" cover preview"} loading="lazy"/>:
    <div className="spwp-no-cover">Cover image preview will appear after Step 01.</div>;
  return <section className="spwp-panel" aria-labelledby="spwp-title">
    <div className="spwp-heading">
      <span className="spwp-kicker"><Eye size={15} aria-hidden="true"/> WEBSITE CONTENT PREVIEW</span>
      <h2 id="spwp-title">Review both website destinations.</h2>
      <p>This is a private, read-only content preview assembled from the same approved article, issue title and editable archive summary used for publishing. Previewing does not write to GitHub or change the live website.</p>
    </div>
    <div className="spwp-tabs" role="tablist" aria-label="Website content preview">
      <button type="button" role="tab" aria-selected={tab==="saw-point"} onClick={()=>setTab("saw-point")}><Newspaper size={16} aria-hidden="true"/> /saw-point</button>
      <button type="button" role="tab" aria-selected={tab==="insights"} onClick={()=>setTab("insights")}><LayoutGrid size={16} aria-hidden="true"/> Insights card</button>
      <button type="button" role="tab" aria-selected={tab==="article"} onClick={()=>setTab("article")}><FileText size={16} aria-hidden="true"/> Full article</button>
    </div>
    <div className="spwp-surface" role="tabpanel">
      <div className="spwp-preview-bar"><span>PREVIEW ONLY · NOT PUBLISHED</span><span>{tab==="saw-point"?"/saw-point":tab==="insights"?"/industry-insights":"/industry-insights/[article-slug]"}</span></div>
      {tab==="saw-point"&&<div className="spwp-landing">
        <div className="spwp-landing-top"><span>LATEST ISSUE</span><span>{draft.date}</span></div>
        <div className="spwp-feature">
          <div className="spwp-feature-issue">{issue}</div>
          <div className="spwp-feature-copy">
            <small>ISSUE {issue}</small>
            <h3>The latest<br/>Saw Point.</h3>
            <p>{draft.excerpt||"The generated short archive summary will appear here."}</p>
            <strong>Read full issue on FPX</strong>
          </div>
          <div className="spwp-feature-side">
            {cover}
            <span>MONTHLY INDUSTRY READ</span>
            <p>Selected developments. Clear context. Written for people working in and around New Zealand timber.</p>
          </div>
        </div>
        <div className="spwp-archive-heading"><span>THE ARCHIVE</span><h3>Previous issues.</h3></div>
        <div className="spwp-archive-row">
          <div className="spwp-archive-issue">ISSUE {issue}</div>
          <div className="spwp-archive-cover">{cover}</div>
          <div><small>{draft.date}</small><h4>Saw Point | Issue {issue}</h4><p>{draft.excerpt}</p></div>
          <strong>Read issue</strong>
        </div>
      </div>}
      {tab==="insights"&&<div className="spwp-insights">
        <span className="spwp-eyebrow">CURRENT &amp; ARCHIVED</span>
        <h3>Timber News</h3>
        <p>Market reporting and New Zealand timber industry developments from Saw Point.</p>
        <div className="spwp-card">
          <div className="spwp-card-image">{cover}</div>
          <div className="spwp-card-content">
            <div className="spwp-card-meta"><span>SAW POINT · ISSUE {issue}</span><span>{draft.date}</span></div>
            <h4>{articleTitle}</h4>
            <p>{draft.excerpt||"The generated short archive summary will appear here."}</p>
            <div className="spwp-card-footer"><span>By George Harman</span><strong>Read the full issue</strong></div>
          </div>
        </div>
        <p className="spwp-preview-note">This is the content for the new card in the Timber News carousel. Other published cards are unchanged.</p>
      </div>}
      {tab==="article"&&<div className="spwp-article">
        <div className="spwp-breadcrumb">Home / FPX Insights / Saw Point Issue {issue}</div>
        <div className="spwp-article-header">
          <span>TIMBER NEWS &nbsp;&nbsp; SAW POINT · ISSUE {issue}</span>
          <h2>{articleTitle}</h2>
          <p>{draft.excerpt||"The generated short archive summary will appear here."}</p>
          <small>By George Harman, Director, FPX &nbsp; · &nbsp; Full Saw Point issue</small>
        </div>
        <div className="spwp-article-cover">{cover}</div>
        <div className="spwp-article-body">
          <p className="spwp-article-issue">Saw Point | Issue {issue} | {month}</p>
          {parsed.sections.map((section,index)=><section key={index}>
            <h3>{section.heading}</h3>
            {section.paras.map((paragraph,j)=><p key={j}>{paragraph}</p>)}
            {section.sources.length>0&&<p className="spwp-article-source"><strong>{section.sourceLabel}</strong>{" "}{section.sources.map((source,k)=><span key={k}>{source.text}{k<section.sources.length-1?"; ":""}</span>)}</p>}
          </section>)}
          {parsed.worthReading.length>0&&<section>
            <h3>WORTH READING THIS MONTH</h3>
            {parsed.worthReading.map((item,i)=><p key={i}><strong>{item.title}</strong>{item.description?" "+item.description:""}</p>)}
          </section>}
          <div className="spwp-article-signoff">
            {parsed.closing.map((line,i)=><p key={i}>{line}</p>)}
            {!parsed.closing.some(line=>/^Subscribe at\b/i.test(line))&&<p>Subscribe at fpx.nz/saw-point</p>}
          </div>
          <p className="spwp-preview-note">Article wording above comes from the approved body you pasted. Missing source URLs remain plain text and must be verified before publication.</p>
        </div>
      </div>}
    </div>
    <div className="spwp-footnote">The live website applies its own responsive page layout and publishes only after you press <strong>Publish on Saw Point + FPX Insights</strong>. This preview uses the same source fields and article parser, but is not a pixel-for-pixel website rendering.</div>
  </section>;
}
