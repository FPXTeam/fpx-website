"use client";

import Link from "next/link";
import { useState } from "react";
import { trackFpxEvent } from "./analytics-events";

export function FooterSubscribe(){
  const[status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
  const[message,setMessage]=useState("");
  async function subscribe(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form=event.currentTarget;
    const payload=Object.fromEntries(new FormData(form).entries());
    try{
      const response=await fetch("/api/saw-point-subscribe",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data?.error||"Unable to subscribe right now.");
      form.reset();
      trackFpxEvent("saw_point_subscribe",{source:"footer"});
      setStatus("success");
      setMessage("You're on the Saw Point list.");
    }catch(error){
      setStatus("error");
      setMessage(error instanceof Error?error.message:"Unable to subscribe right now.");
    }
  }
  return <div className="footer-saw-point">
    <div className="footer-saw-copy"><span>SAW POINT</span><b>Monthly NZ timber updates.</b></div>
    <form onSubmit={subscribe} aria-label="Subscribe to Saw Point">
      <input className="fpx-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
      <input type="hidden" name="source" value="FPX website footer"/>
      <input name="name" autoComplete="name" placeholder="Name" aria-label="Name" required/>
      <input name="email" type="email" autoComplete="email" placeholder="Email" aria-label="Email" required/>
      <button type="submit" disabled={status==="sending"}>{status==="sending"?"Subscribing…":"Subscribe"}</button>
    </form>
    <small aria-live="polite">{message||<>Unsubscribe any time. See our <Link href="/privacy-policy">Privacy Policy</Link>.</>}</small>
  </div>;
}
