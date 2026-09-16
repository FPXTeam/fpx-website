"use client";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { LinkedInIcon, InstagramIcon, FacebookIcon } from "./social-icons";
import { useEffect,useState } from "react";
export function Preloader(){const[done,setDone]=useState(true);useEffect(()=>{if(sessionStorage.getItem("fpx-intro-seen"))return;setDone(false);const t=setTimeout(()=>{sessionStorage.setItem("fpx-intro-seen","1");setDone(true)},1800);return()=>clearTimeout(t)},[]);const skip=()=>{sessionStorage.setItem("fpx-intro-seen","1");setDone(true)};return <div className={`preloader ${done?"is-done":""}`} aria-hidden={done}><div className="pre-top"/><div className="pre-bottom"/><div className="pre-logo"><img src="/images/fpx-logo-x-original.png" alt="FPX"/><span>FOREST PRODUCTS EXCHANGE</span></div>{!done&&<button type="button" className="skip-intro" onClick={skip}>Skip intro</button>}</div>}
export function Header(){const[open,setOpen]=useState(false);return <header className="site-header"><div className="nav-wrap"><Link href="/" className="brand" aria-label="FPX home"><img src="/images/fpx-logo-horizontal-original.png" alt="FPX Forest Products Exchange"/></Link><nav className="desktop-nav" aria-label="Primary navigation"><Link href="/fpx-sourcing">FPX Sourcing</Link><Link href="/timber">Timber Range</Link><Link href="/our-customers">Our Customers</Link><div className="drop"><button type="button" aria-haspopup="true">FPX Insights <ChevronDown size={14}/></button><div className="drop-menu"><Link href="/saw-point"><b>Saw Point</b><span>Straight talk on NZ timber.</span></Link><Link href="/industry-insights"><b>FPX Insights</b><span>Guides and practical timber knowledge.</span></Link><Link href="/frequently-asked-questions"><b>FAQ</b><span>Answers about sourcing through FPX.</span></Link></div></div><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact</Link></nav><div className="nav-actions"><a href="https://app.fpx.nz">Login</a><a className="nav-cta" href="https://app.fpx.nz/shop">Browse Timber <ArrowUpRight size={15}/></a></div><button type="button" className="menu-btn" aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>{open&&<nav className="mobile-nav" aria-label="Mobile navigation"><Link href="/fpx-sourcing">FPX Sourcing</Link><Link href="/timber">Timber Range</Link><Link href="/our-customers">Our Customers</Link><span>FPX Insights</span><Link href="/saw-point">Saw Point</Link><Link href="/industry-insights">FPX Insights</Link><Link href="/frequently-asked-questions">FAQ</Link><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact</Link></nav>}</header>}
export function Footer(){
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
      if(!response.ok) throw new Error(data?.error||"Unable to subscribe right now.");
      form.reset();
      setStatus("success");
      setMessage("You're on the Saw Point list.");
    }catch(error){
      setStatus("error");
      setMessage(error instanceof Error?error.message:"Unable to subscribe right now.");
    }
  }
  return <footer>
    <div className="footer-saw-point">
      <div>
        <span>SAW POINT</span>
        <h3>Straight talk on NZ timber,<br/>straight to your inbox.</h3>
        <p>Monthly industry news and market updates from George Harman.</p>
      </div>
      <form onSubmit={subscribe} aria-label="Subscribe to Saw Point">
        <label><span>Name</span><input name="name" autoComplete="name" placeholder="Your name" required/></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.co.nz" required/></label>
        <button type="submit" disabled={status==="sending"}>{status==="sending"?"Subscribing…":"Subscribe"}</button>
        <small aria-live="polite">{message||"Monthly. Unsubscribe any time."}</small>
      </form>
    </div>
    <div className="footer-grid"><div className="footer-brand-column"><div className="footer-brand-mark"><img src="/images/brand-assets/fpx-logo-x-eggshell-white.png" alt="FPX"/></div><p>A clearer, supported way to source New Zealand timber.</p><nav className="footer-social" aria-label="FPX social profiles"><a href="https://www.linkedin.com/company/forest-products-exchange" target="_blank" rel="noreferrer" aria-label="FPX on LinkedIn"><LinkedInIcon/></a><a href="https://www.instagram.com/fpx.nz/" target="_blank" rel="noreferrer" aria-label="FPX on Instagram"><InstagramIcon/></a><a href="https://www.facebook.com/people/Forest-Products-Exchange/61583101360304/" target="_blank" rel="noreferrer" aria-label="FPX on Facebook"><FacebookIcon/></a></nav></div><div><h4>SOURCING</h4><Link href="/fpx-sourcing">FPX Sourcing</Link><Link href="/timber">Timber Range</Link><a href="https://app.fpx.nz/offers">View Offers</a><a href="https://app.fpx.nz/request-cart">Create a Request</a></div><div><h4>INSIGHTS</h4><Link href="/saw-point">Saw Point</Link><Link href="/industry-insights">FPX Insights</Link><Link href="/frequently-asked-questions">FAQ</Link><Link href="/our-customers">Our Customers</Link></div><div><h4>COMPANY</h4><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact</Link><Link href="/terms-and-conditions">Terms & Conditions</Link><Link href="/privacy-policy">Privacy Policy</Link></div></div>
    <div className="footer-bottom"><span>© 2026 Forest Products Exchange Limited</span><span>New Zealand</span></div>
  </footer>
}
export function Shell({children}:{children:React.ReactNode}){return <><Preloader/><Header/>{children}<Footer/></>}
