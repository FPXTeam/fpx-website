"use client";

import { useState } from "react";

type PublishResult={ok?:boolean;commitSha?:string;error?:string};

export default function SawPointPublisher(){
  const [status,setStatus]=useState<"idle"|"publishing"|"deploying"|"done"|"error">("idle");
  const [message,setMessage]=useState("");

  async function publish(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    setStatus("publishing");
    setMessage("Saving issue to GitHub…");
    const form=event.currentTarget;
    const payload=Object.fromEntries(new FormData(form).entries());

    try{
      const response=await fetch("/api/saw-point-admin/publish",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data=(await response.json()) as PublishResult;
      if(!response.ok || !data.commitSha) throw new Error(data.error||"Unable to publish issue.");

      setStatus("deploying");
      setMessage("GitHub updated. Waiting for Vercel deployment…");

      const started=Date.now();
      while(Date.now()-started<180000){
        await new Promise(resolve=>setTimeout(resolve,5000));
        const check=await fetch("/api/saw-point-admin/status?sha="+encodeURIComponent(data.commitSha),{cache:"no-store"});
        const state=await check.json();
        if(state?.status==="ready"){
          setStatus("done");
          setMessage("DONE — GitHub updated and Vercel deployment is READY.");
          form.reset();
          return;
        }
        if(state?.status==="error") throw new Error(state?.error||"Deployment failed.");
      }

      setStatus("done");
      setMessage("GitHub is updated. Vercel is still deploying — refresh the live site in a minute.");
    }catch(error){
      setStatus("error");
      setMessage(error instanceof Error?error.message:"Unable to publish issue.");
    }
  }

  return <div className="spa-wrap">
    <div className="spa-top">
      <div>
        <span>PRIVATE FPX TOOL</span>
        <h1>Publish Saw Point.</h1>
        <p>Add the issue once. The website archive, featured issue and deployment are handled automatically.</p>
      </div>
      <form method="post" action="/api/saw-point-admin/logout"><button type="submit" className="spa-logout">Log out</button></form>
    </div>

    <form className="spa-form" onSubmit={publish}>
      <div className="spa-grid">
        <label><span>Issue number</span><input name="issue" placeholder="003" required/></label>
        <label><span>Publication date</span><input name="date" placeholder="OCTOBER 2026" required/></label>
      </div>
      <label><span>Title</span><input name="title" placeholder="Saw Point | Issue 003"/></label>
      <label><span>Short archive summary</span><textarea name="excerpt" rows={3} placeholder="One or two sentences describing this issue." required/></label>
      <label><span>LinkedIn article link</span><input name="linkedinUrl" type="url" placeholder="https://www.linkedin.com/pulse/..." required/></label>
      <label><span>Full article</span><textarea name="body" rows={18} placeholder="Paste the full Saw Point article here…" required/></label>
      <button className="spa-publish" type="submit" disabled={status==="publishing"||status==="deploying"}>
        {status==="publishing"?"Publishing…":status==="deploying"?"Deploying…":"Publish issue"}
      </button>
      <div className={"spa-status "+status} aria-live="polite">{message||"Nothing is published until you click Publish issue."}</div>
    </form>

    <style jsx>{`
      .spa-wrap{max-width:980px;margin:0 auto;padding:70px 28px 110px;color:#040E0E}
      .spa-top{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;margin-bottom:42px}
      .spa-top span{font:700 10px/1 Lato,sans-serif;letter-spacing:.16em;color:#40973C}
      .spa-top h1{margin:10px 0 12px;font-size:clamp(44px,6vw,76px);line-height:.92;letter-spacing:-.05em}
      .spa-top p{max-width:640px;margin:0;color:#64736C;line-height:1.7}
      .spa-logout{border:1px solid #d8dfda;background:#fff;padding:11px 15px;font-weight:700;cursor:pointer}
      .spa-form{display:grid;gap:20px;padding:30px;border:1px solid #dfe6e1;background:#fff}
      .spa-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
      label>span{display:block;margin-bottom:8px;font:700 10px/1 Lato,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#758956}
      input,textarea{width:100%;border:1px solid #dfe6e1;background:#fbfcfb;padding:13px 14px;font:400 14px/1.5 Open Sans,sans-serif;color:#040E0E;outline:none}
      input:focus,textarea:focus{border-color:#40973C}
      textarea{resize:vertical}
      .spa-publish{min-height:54px;border:0;background:#40973C;color:#fff;font:700 12px/1 Lato,sans-serif;cursor:pointer}
      .spa-publish:disabled{opacity:.6;cursor:wait}
      .spa-status{padding:13px 14px;background:#f4f7f4;color:#64736C;font-size:13px}
      .spa-status.done{background:#eef6ef;color:#275c25}.spa-status.error{background:#fff1ef;color:#8a3026}
      @media(max-width:700px){.spa-top{display:block}.spa-logout{margin-top:20px}.spa-grid{grid-template-columns:1fr}.spa-form{padding:22px}}
    `}</style>
  </div>;
}
