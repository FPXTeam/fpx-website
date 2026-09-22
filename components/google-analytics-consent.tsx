"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearFpxAnalyticsCookies, readFpxConsent } from "./cookie-consent";

const GA_MEASUREMENT_ID="G-480Y8RQVR3";

declare global {
 interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[])=>void;
 }
}

export function GoogleAnalyticsConsent(){
 const pathname=usePathname();
 const[enabled,setEnabled]=useState(false);
 const[ready,setReady]=useState(false);
 const lastPage=useRef("");
 const blocked=pathname.startsWith("/saw-point-admin");

 useEffect(()=>{
  const sync=()=>setEnabled(Boolean(readFpxConsent()?.analytics));
  const storage=(event:StorageEvent)=>{if(event.key===null||event.key==="fpx-cookie-consent-v2")sync()};
  sync();
  window.addEventListener("fpx-consent-change",sync as EventListener);
  window.addEventListener("storage",storage);
  return()=>{window.removeEventListener("fpx-consent-change",sync as EventListener);window.removeEventListener("storage",storage)};
 },[]);

 useEffect(()=>{
  if(!window.gtag)return;
  const granted=enabled&&!blocked;
  window.gtag("consent","update",{
   analytics_storage:granted?"granted":"denied",
   ad_storage:"denied",
   ad_user_data:"denied",
   ad_personalization:"denied"
  });
  if(granted)setReady(true);
  else{setReady(false);lastPage.current="";clearFpxAnalyticsCookies()}
 },[enabled,blocked]);

 useEffect(()=>{
  if(!enabled||!ready||blocked||!window.gtag)return;
  if(lastPage.current===pathname)return;
  lastPage.current=pathname;
  window.gtag("event","page_view",{
   page_path:pathname,
   page_location:window.location.href,
   page_title:document.title
  });
 },[enabled,ready,blocked,pathname]);

 useEffect(()=>{
  if(!enabled||!ready||blocked||!window.gtag)return;
  const onClick=(event:MouseEvent)=>{
   const target=event.target as Element|null;
   const anchor=target?.closest?.('a[href^="https://app.fpx.nz"]') as HTMLAnchorElement|null;
   if(!anchor)return;
   let eventName="login_click";
   try{
    const url=new URL(anchor.href);
    if(url.pathname.startsWith("/explore-fpx-sourcing")){
      if(url.searchParams.get("request")==="1")eventName="create_request_click";
      else if(url.searchParams.get("view")==="offers")eventName="view_offers_click";
      else eventName="browse_timber_click";
    }
    else if(url.pathname.startsWith("/stock"))eventName="browse_timber_click";
    else if(url.pathname.startsWith("/request-cart"))eventName="create_request_click";
    else if(url.pathname.startsWith("/offers"))eventName="view_offers_click";
    else if(url.pathname.startsWith("/sourcing-sign-up"))eventName="create_account_click";
   }catch{return}
   window.gtag?.("event",eventName,{
    link_url:anchor.href,
    link_text:(anchor.textContent||"").trim().slice(0,120),
    page_path:window.location.pathname
   });
  };
  document.addEventListener("click",onClick,true);
  return()=>document.removeEventListener("click",onClick,true);
 },[enabled,ready,blocked]);

 if(!enabled||blocked)return null;

 return <Script
  id="fpx-google-analytics"
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
  onReady={()=>{
   window.gtag?.("consent","update",{
    analytics_storage:"granted",
    ad_storage:"denied",
    ad_user_data:"denied",
    ad_personalization:"denied"
   });
   window.gtag?.("js",new Date());
   window.gtag?.("config",GA_MEASUREMENT_ID,{
    send_page_view:false,
    allow_google_signals:false,
    allow_ad_personalization_signals:false
   });
   setReady(true);
  }}
 />;
}
