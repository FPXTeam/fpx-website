"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, ClipboardCopy, FileText, Mail, Send, Upload, XCircle } from "lucide-react";
import SawPointCoverUpload from "./cover-upload";
import { formatLinkedInBody, formatLinkedInHtml, type PreparedContent } from "../../lib/saw-point-publishing";
import { renderSawPointBrevo } from "../../lib/saw-point-brevo";
import "./publisher.css";

type Draft={
  issue:string;date:string;title:string;body:string;linkedinBody?:string;coverUrl:string;linkedinUrl:string;
  excerpt:string;caption:string;prepared:PreparedContent|null;approved:boolean;
};
type Status="idle"|"working"|"deploying"|"ready"|"error";
const INITIAL:Draft={issue:"",date:"",title:"",body:"",coverUrl:"",linkedinUrl:"",excerpt:"",caption:"",prepared:null,approved:false};
const STORAGE="fpx-saw-point-multichannel-draft-v1";
function monthFromPicker(iso:string){
  const found=/^(\d{4})-(\d{2})$/.exec(iso);
  if(!found)return "";
  const d=new Date(Date.UTC(Number(found[1]),Number(found[2])-1,1));
  return d.toLocaleDateString("en-NZ",{month:"long",year:"numeric",timeZone:"UTC"}).toUpperCase();
}
function validLinkedIn(url:string) {
  try{const u=new URL(url);return u.protocol==="https:"&&["www.linkedin.com","linkedin.com"].includes(u.hostname)&&u.pathname.startsWith("/pulse/");}
  catch{return false;}
}
function looksHosted(url:string){return /^https:\/\/www\.fpx\.nz\/images\/saw-point\/covers\/[^ ]+\.(?:png|jpg|webp)$/i.test(url);}
export default function SawPointPublisher(){
  const [draft,setDraft]=useState<Draft>(INITIAL);
  const [hydrated,setHydrated]=useState(false);
  const [prepareStatus,setPrepareStatus]=useState<Status>("idle");
  const [prepareMessage,setPrepareMessage]=useState("");
  const [missingSources,setMissingSources]=useState<string[]>([]);
  const [publishStatus,setPublishStatus]=useState<Status>("idle");
  const [publishMessage,setPublishMessage]=useState("");
  const [articleUrl,setArticleUrl]=useState("");
  const [deleteIssue,setDeleteIssue]=useState("");
  const [deleteStatus,setDeleteStatus]=useState<Status>("idle");
  const [deleteMessage,setDeleteMessage]=useState("");
  const [richCopyMessage,setRichCopyMessage]=useState("");

  useEffect(()=>{
    try{const stored=localStorage.getItem(STORAGE);if(stored){
      const value=JSON.parse(stored) as Partial<Draft>;
      setDraft({...INITIAL,...value,approved:false});
    }}catch{}
    setHydrated(true);
  },[]);
  useEffect(()=>{if(hydrated){try{localStorage.setItem(STORAGE,JSON.stringify(draft));}catch{}}},[draft,hydrated]);

  const setField=(field:keyof Draft,value:string|boolean)=>{
    setDraft(prev=>({...prev,[field]:value}));
    setPublishStatus("idle");setPublishMessage("");
  };
  function setInput(field:"issue"|"date"|"title"|"body",value:string){
    setDraft(prev=>({...prev,[field]:value,linkedinBody:"",prepared:null,excerpt:"",caption:"",approved:false,linkedinUrl:""}));
    setPrepareStatus("idle");setPublishStatus("idle");setPrepareMessage("");setPublishMessage("");
    setMissingSources([]);
    setRichCopyMessage("");
  }
  const formattedBody=useMemo(()=>formatLinkedInBody(draft.body,draft.title),[draft.body,draft.title]);
  const richBody=useMemo(()=>formatLinkedInHtml(draft.linkedinBody||draft.body,draft.title),[draft.linkedinBody,draft.body,draft.title]);
  const brevoHtml=useMemo(()=>{
    if(!draft.prepared||!draft.linkedinUrl||!draft.coverUrl)return "";
    return renderSawPointBrevo({
      issue:draft.issue.padStart(3,"0"),
      date:draft.date,title:draft.title,coverUrl:draft.coverUrl,
      linkedinUrl:draft.linkedinUrl,prepared:draft.prepared
    });
  },[draft.issue,draft.date,draft.title,draft.coverUrl,draft.linkedinUrl,draft.prepared]);
  async function copy(value:string){
    if(!value)return;
    try{await navigator.clipboard.writeText(value);}
    catch{window.alert("Copy is unavailable in this browser. Select the text and copy manually.");}
  }
  async function copyLinkedInFormatted(){
    const plain=draft.linkedinBody||formattedBody;
    if(!plain)return;
    // Copy both formats. LinkedIn's editor may preserve heading styles only
    // when the clipboard includes text/html alongside the plain-text version.
    try {
      if(!navigator.clipboard?.write || !window.ClipboardItem)
        throw new Error("Rich clipboard is unavailable");
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html":new Blob([richBody],{type:"text/html"}),
          "text/plain":new Blob([plain],{type:"text/plain"})
        })
      ]);
      setRichCopyMessage("Formatted article copied. Paste into LinkedIn's ARTICLE BODY. Verify the headings and spacing in LinkedIn before publishing.");
    } catch {
      try {
        await navigator.clipboard.writeText(plain);
        setRichCopyMessage("Plain text copied. Your browser could not copy rich formatting. Use LinkedIn's heading/bold toolbar after pasting.");
      } catch {
        setRichCopyMessage("Copy failed. Select the article text below and copy it manually.");
      }
    }
  }
  function downloadEmail(){
    if(!brevoHtml)return;
    const url=URL.createObjectURL(new Blob([brevoHtml],{type:"text/html;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;
    link.download="SawPoint-Issue-"+draft.issue.padStart(3,"0")+"-Brevo.html";
    link.click();URL.revokeObjectURL(url);
  }
  async function prepare(){
    if(!draft.issue||!draft.date||!draft.title||draft.body.trim().length<120){
      setPrepareStatus("error");setPrepareMessage("Enter the issue number, month and year, issue title, and George's final approved article.");return;
    }
    setPrepareStatus("working");setPrepareMessage("Preparing article summary, LinkedIn caption and Brevo text from the approved copy...");
    try{
      const res=await fetch("/api/saw-point-admin/prepare",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({issue:draft.issue.padStart(3,"0"),date:draft.date,title:draft.title,body:draft.body})});
      const data=await res.json();
      if(!res.ok||!data?.prepared)throw new Error(data?.error||"Could not generate issue materials.");
      setDraft(prev=>({...prev,issue:prev.issue.padStart(3,"0"),prepared:data.prepared,excerpt:data.prepared.excerpt,caption:data.prepared.caption,approved:false}));
      setMissingSources(data.missingSourceUrls||[]);
      setPrepareStatus("ready");
      setPrepareMessage(data.note||"Generated from the approved article. Review the summary and caption before posting to LinkedIn.");
    }catch(error){setPrepareStatus("error");setPrepareMessage(error instanceof Error?error.message:"Preparation failed.");}
  }
  async function waitForDeployment(sha:string){
    for(let count=0;count<36;count++){
      await new Promise(resolve=>setTimeout(resolve,5000));
      try{
        const check=await fetch("/api/saw-point-admin/status?sha="+encodeURIComponent(sha),{cache:"no-store"});
        const state=await check.json();
        if(state?.status==="ready"){setPublishStatus("ready");setPublishMessage("Website deployment confirmed. Saw Point and FPX Insights have both been updated.");return;}
        if(state?.status==="error"){setPublishStatus("error");setPublishMessage(state.error||"The Vercel deployment failed.");return;}
      }catch{}
    }
    setPublishStatus("ready");setPublishMessage("Both files were committed to GitHub. Vercel has not yet confirmed production.");
  }
  async function publish(){
    if(!draft.prepared||!draft.excerpt||!draft.caption||!draft.approved||!looksHosted(draft.coverUrl)||!validLinkedIn(draft.linkedinUrl)){
      setPublishStatus("error");setPublishMessage("Finish all steps first: hosted image, generated summary/caption, published LinkedIn URL and approval checkbox.");return;
    }
    if(!window.confirm("Publish Issue "+draft.issue+" to both Saw Point and FPX Insights? This makes the full article public."))return;
    setPublishStatus("working");setPublishMessage("Publishing the full approved issue and updating both website pages...");
    try{
      const res=await fetch("/api/saw-point-admin/publish",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...draft,issue:draft.issue.padStart(3,"0")})});
      const data=await res.json();
      if(!res.ok||!data.commitSha)throw new Error(data.error||"Unable to publish the issue.");
      setArticleUrl(data.articleUrl||"");
      setPublishStatus("deploying");setPublishMessage("GitHub updated. Waiting for the Vercel production deployment...");
      await waitForDeployment(data.commitSha);
    }catch(error){setPublishStatus("error");setPublishMessage(error instanceof Error?error.message:"Publishing failed.");}
  }
  async function removeIssue(){
    const issue=deleteIssue.padStart(3,"0");
    if(!/^\d{3}$/.test(issue)){setDeleteStatus("error");setDeleteMessage("Enter an issue number.");return;}
    if(!window.confirm("Delete Saw Point Issue "+issue+" from Saw Point and FPX Insights (if it has an Insights article)?"))return;
    setDeleteStatus("working");setDeleteMessage("Removing the issue...");
    try{
      const res=await fetch("/api/saw-point-admin/delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({issue})});
      const data=await res.json();
      if(!res.ok||!data.commitSha)throw new Error(data.error||"Unable to remove the issue.");
      setDeleteStatus("ready");setDeleteMessage("Issue removed from GitHub. Production deployment has started.");
      setDeleteIssue("");
    }catch(error){setDeleteStatus("error");setDeleteMessage(error instanceof Error?error.message:"Deletion failed.");}
  }
  const canPrepare=!!draft.issue&&!!draft.date&&!!draft.title&&draft.body.trim().length>=120;
  const canPublish=!!draft.prepared&&!!draft.excerpt&&!!draft.caption&&draft.approved&&looksHosted(draft.coverUrl)&&validLinkedIn(draft.linkedinUrl);
  return <div className="spap-wrap">
    <header className="spap-top">
      <span>FPX CONTENT PUBLISHER</span>
      <h1>Publish Saw Point.</h1>
      <p>One approved article. One cover image. All publishing materials, prepared in the right order.</p>
    </header>
    <SawPointCoverUpload onCoverReady={(url,issue,month)=>{
      setDraft(prev=>({...prev,coverUrl:url,issue,date:monthFromPicker(month),approved:false}));
      setPublishStatus("idle");setPublishMessage("");
    }}/>
    <section className="spap-panel" aria-labelledby="spap-step2">
      <span className="spap-kicker">STEP 02 · APPROVED ARTICLE</span>
      <h2 id="spap-step2">Paste George's final copy.</h2>
      <p>Use the article approved by George. No LinkedIn URL is needed yet. Headings, paragraphs, figures and sources are kept intact.</p>
      <div className="spap-grid">
        <label><span>Issue number</span><input value={draft.issue} onChange={e=>setInput("issue",e.target.value)} placeholder="005" inputMode="numeric" maxLength={3}/></label>
        <label><span>Issue month and year</span><input value={draft.date} onChange={e=>setInput("date",e.target.value)} placeholder="DECEMBER 2026"/></label>
      </div>
      <label><span>Issue title</span><input value={draft.title} onChange={e=>setInput("title",e.target.value)} placeholder="THE BIG STORY: ..."/></label>
      <label><span>Final approved article body</span><textarea rows={18} value={draft.body} onChange={e=>setInput("body",e.target.value)} placeholder="Paste the entire approved newsletter article, including source references and Worth Reading..."/></label>
      <label><span>Hosted cover image URL from Step 01</span><input value={draft.coverUrl} onChange={e=>setField("coverUrl",e.target.value)} placeholder="https://www.fpx.nz/images/saw-point/covers/..." /></label>
      <button type="button" className="spap-primary" disabled={!canPrepare||prepareStatus==="working"} onClick={prepare}>
        <FileText size={17}/>{prepareStatus==="working"?"Generating materials...":"Generate archive summary, caption and email content"}
      </button>
      <div className={"spap-status "+prepareStatus} aria-live="polite">{prepareMessage||"Nothing is published by preparing an issue."}</div>
    </section>
    {draft.prepared&&<section className="spap-panel" aria-labelledby="spap-step3">
      <span className="spap-kicker">STEP 03 · REVIEW &amp; COPY</span>
      <h2 id="spap-step3">Your LinkedIn publishing materials.</h2>
      <p>Copy the title into LinkedIn’s Title field, then use <strong>Copy formatted article</strong> for the Article Body. The generated summary and caption are separate, editable drafts.</p>
      <div className="spap-inline"><strong>Article title</strong><button type="button" onClick={()=>copy(draft.title)}><ClipboardCopy size={15}/> Copy title</button></div>
      <div className="spap-readonly">{draft.title}</div>
      <div className="spap-inline"><strong>LinkedIn article preview</strong><div>
        <button type="button" onClick={copyLinkedInFormatted}><ClipboardCopy size={15}/> Copy formatted article</button>
        <button type="button" onClick={()=>{copy(draft.linkedinBody||formattedBody);setRichCopyMessage("Plain text copied. Headings and bold will need to be applied in LinkedIn.");}}>Copy plain text</button>
      </div></div>
      <div className="spap-linkedin-preview" aria-label="Preview of formatted LinkedIn article" dangerouslySetInnerHTML={{__html:richBody}}/>
      <div className="spap-status" role="status" aria-live="polite">{richCopyMessage||"Section headings and Worth Reading titles are formatted in the rich copy. The main story heading is omitted from the body when it matches your separate article title."}</div>
      <details className="spap-plaintext-details">
        <summary>Edit article body text and spacing</summary>
        <p>Each Notion line is treated as a separate paragraph. Edit here if needed; the rich copy and preview update automatically.</p>
        <textarea rows={16} className="spap-copy-area" value={draft.linkedinBody||formattedBody} onChange={e=>{setField("linkedinBody",e.target.value);setRichCopyMessage("");}}/>
      </details>
      <label><span>Generated short archive summary (editable)</span><textarea rows={3} value={draft.excerpt} onChange={e=>setField("excerpt",e.target.value)}/></label>
      <div className="spap-inline"><strong>LinkedIn post caption</strong><button type="button" onClick={()=>copy(draft.caption)}><ClipboardCopy size={15}/> Copy caption</button></div>
      <textarea rows={11} value={draft.caption} onChange={e=>setField("caption",e.target.value)}/>
      <div className="spap-note">Generation mode: {draft.prepared.source==="ai"?"AI-assisted draft":"Structured draft from article text"}. Review all numbers, headlines and wording before posting.</div>
      {missingSources.length>0&&<div className="spap-warning"><strong>Source references missing clickable URLs</strong><p>These source descriptions will be preserved, but won't be linked automatically. Add verified URLs to the approved article if available.</p><ul>{missingSources.slice(0,10).map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
    </section>}
    {draft.prepared&&<section className="spap-panel" aria-labelledby="spap-step4">
      <span className="spap-kicker">STEP 04 · LINKEDIN PUBLISHED</span>
      <h2 id="spap-step4">Paste the final LinkedIn link.</h2>
      <p>Publish the cover, title, complete article and caption manually on LinkedIn. Then return here with the new newsletter URL.</p>
      <label><span>Published LinkedIn article URL</span><input type="url" value={draft.linkedinUrl} onChange={e=>setField("linkedinUrl",e.target.value)} placeholder="https://www.linkedin.com/pulse/..."/></label>
      {draft.linkedinUrl&&!validLinkedIn(draft.linkedinUrl)&&<div className="spap-status error">Enter the published LinkedIn article URL, not a profile or feed URL.</div>}
    </section>}
    {draft.prepared&&validLinkedIn(draft.linkedinUrl)&&<section className="spap-panel" aria-labelledby="spap-step5">
      <span className="spap-kicker">STEP 05 · BREVO &amp; FPX WEBSITE</span>
      <h2 id="spap-step5">Generate the email. Publish the website.</h2>
      <p>Brevo uses the exact Issue 004 HTML layout. The image comes from FPX and the email CTA links to your published LinkedIn article. You paste and send the email manually.</p>
      <div className="spap-grid">
        <label><span>Email headline</span><input value={draft.prepared.emailHeadline} onChange={e=>setDraft(p=>({...p,prepared:p.prepared?{...p.prepared,emailHeadline:e.target.value}:null}))}/></label>
        <label><span>Email preheader</span><input value={draft.prepared.preheader} onChange={e=>setDraft(p=>({...p,prepared:p.prepared?{...p.prepared,preheader:e.target.value}:null}))}/></label>
      </div>
      <label><span>Email introduction</span><textarea rows={3} value={draft.prepared.emailIntro} onChange={e=>setDraft(p=>({...p,prepared:p.prepared?{...p.prepared,emailIntro:e.target.value}:null}))}/></label>
      <label><span>Saw Point teaser</span><textarea rows={3} value={draft.prepared.teaser} onChange={e=>setDraft(p=>({...p,prepared:p.prepared?{...p.prepared,teaser:e.target.value}:null}))}/></label>
      <div className="spap-inline"><strong>Brevo HTML</strong><div><button type="button" onClick={()=>copy(brevoHtml)}><ClipboardCopy size={15}/> Copy code</button><button type="button" onClick={downloadEmail}><Mail size={15}/> Download HTML</button></div></div>
      <textarea className="spap-code" rows={10} readOnly value={brevoHtml}/>
      <div className="spap-note">The original Brevo template layout is maintained, including native preference and unsubscribe placeholders. No email is sent from FPX Admin.</div>
      <label className="spap-checkbox"><input type="checkbox" checked={draft.approved} onChange={e=>setField("approved",e.target.checked)}/> I have reviewed the final copy and confirm George's approval for website publication.</label>
      <button type="button" className="spap-primary" disabled={!canPublish||publishStatus==="working"||publishStatus==="deploying"||publishStatus==="ready"} onClick={publish}>
        <Upload size={17}/>{publishStatus==="working"?"Publishing...":publishStatus==="deploying"?"Deploying...":"Publish on Saw Point + FPX Insights"}
      </button>
      <div className={"spap-status "+publishStatus} aria-live="polite">{publishMessage||"Website publication happens only when you press the button above."}</div>
      {articleUrl&&<div className="spap-links"><a href={articleUrl} target="_blank" rel="noopener noreferrer">View full FPX article <ArrowUpRight size={15}/></a><a href="/saw-point" target="_blank" rel="noopener noreferrer">View Saw Point archive <ArrowUpRight size={15}/></a><a href="/industry-insights" target="_blank" rel="noopener noreferrer">View Timber News <ArrowUpRight size={15}/></a></div>}
    </section>}
    <section className="spap-delete">
      <span>MANAGE ISSUES</span><h2>Remove a published issue.</h2>
      <p>Remove an issue from the Saw Point archive and its full Insights article, if one exists.</p>
      <div className="spap-inline">
        <input value={deleteIssue} onChange={e=>setDeleteIssue(e.target.value)} placeholder="Issue number, e.g. 005" inputMode="numeric"/>
        <button type="button" onClick={removeIssue} disabled={deleteStatus==="working"}>Delete issue</button>
      </div>
      <div className={"spap-status "+deleteStatus}>{deleteMessage||"Deletion requires confirmation."}</div>
    </section>
  </div>;
}
