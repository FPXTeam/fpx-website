"use client";

import { readFpxConsent } from "./cookie-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[])=>void;
  }
}

export function trackFpxEvent(name:string,params:Record<string,unknown>={}){
  if(typeof window==="undefined")return;
  if(!readFpxConsent()?.analytics)return;
  if(!window.gtag)return;
  window.gtag("event",name,params);
}
