"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export type FpxConsent={version:2;necessary:true;preferences:boolean;analytics:boolean;marketing:boolean;updatedAt:string};
export const FPX_CONSENT_KEY="fpx-cookie-consent-v2";

export function clearFpxAnalyticsCookies(){
 if(typeof document==="undefined")return;
 const names=document.cookie.split(";").map(part=>part.split("=")[0]?.trim()).filter(name=>name==="_ga"||name?.startsWith("_ga_")||name==="_gid");
 for(const name of names){
  if(!name)continue;
  document.cookie=`${name}=; Max-Age=0; path=/; SameSite=Lax`;
  document.cookie=`${name}=; Max-Age=0; path=/; domain=.fpx.nz; SameSite=Lax`;
 }
}

export function readFpxConsent():FpxConsent|null{
 if(typeof window==="undefined")return null;
 try{
  const raw=window.localStorage.getItem(FPX_CONSENT_KEY);
  if(!raw)return null;
  const value=JSON.parse(raw);
  if(value?.version!==2)return null;
  return {version:2,necessary:true,preferences:Boolean(value.preferences),analytics:Boolean(value.analytics),marketing:Boolean(value.marketing),updatedAt:String(value.updatedAt||"")};
 }catch{return null}
}

export function saveFpxConsent(next:{preferences:boolean;analytics:boolean;marketing:boolean}){
 const value:FpxConsent={version:2,necessary:true,...next,updatedAt:new Date().toISOString()};
 window.localStorage.setItem(FPX_CONSENT_KEY,JSON.stringify(value));
 if(!value.analytics)clearFpxAnalyticsCookies();
 window.dispatchEvent(new CustomEvent("fpx-consent-change",{detail:value}));
 return value;
}

export function CookieConsent(){
 const[visible,setVisible]=useState(false);
 useEffect(()=>{setVisible(!readFpxConsent())},[]);
 if(!visible)return null;
 const necessary=()=>{saveFpxConsent({preferences:false,analytics:false,marketing:false});setVisible(false)};
 const optional=()=>{saveFpxConsent({preferences:true,analytics:true,marketing:false});setVisible(false)};
 return <aside className="cookie-banner" aria-label="FPX cookie choices" role="dialog" aria-live="polite"><div><strong>Your privacy choices</strong><p>FPX uses necessary browser storage to run the site and remember your privacy choice. Optional preferences can remember site experience choices. If you allow analytics, FPX uses Google Analytics 4 to understand how the website is used. Marketing trackers are not enabled through FPX website code.</p><span><Link href="/cookie-policy">Cookie Policy</Link> · <Link href="/privacy-policy">Privacy Policy</Link></span></div><div className="cookie-banner-actions"><button type="button" className="cookie-secondary" onClick={necessary}>Necessary only</button><button type="button" className="cookie-primary" onClick={optional}>Allow optional</button><Link href="/cookie-settings">Cookie settings</Link></div></aside>
}

export function CookieSettingsPanel(){
 const[prefs,setPrefs]=useState(false);
 const[analytics,setAnalytics]=useState(false);
 const[saved,setSaved]=useState(false);
 useEffect(()=>{const consent=readFpxConsent();setPrefs(Boolean(consent?.preferences));setAnalytics(Boolean(consent?.analytics))},[]);
 const save=()=>{
  const previous=readFpxConsent();
  saveFpxConsent({preferences:prefs,analytics,marketing:false});
  setSaved(true);
  if(previous?.analytics&&!analytics){
   window.setTimeout(()=>window.location.reload(),250);
   return;
  }
  setTimeout(()=>setSaved(false),2200);
 };
 return <div className="cookie-settings-panel"><article><div><strong>Strictly necessary</strong><p>Required for core website functions and to remember your privacy choice.</p></div><span className="cookie-status is-on">Always on</span></article><article><div><strong>Preferences</strong><p>Allows FPX to remember optional experience choices, including whether the introductory animation has already been shown.</p></div><label className="cookie-switch"><input type="checkbox" checked={prefs} onChange={e=>setPrefs(e.target.checked)}/><span/><b>{prefs?"On":"Off"}</b></label></article><article><div><strong>Analytics</strong><p>Allows Google Analytics 4 to measure website usage so FPX can understand visits, page use and website performance. Analytics is off unless you choose to enable it.</p></div><label className="cookie-switch"><input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)}/><span/><b>{analytics?"On":"Off"}</b></label></article><article><div><strong>Marketing</strong><p>No non-essential advertising tracker is currently enabled through FPX public website code.</p></div><span className="cookie-status">Not in use</span></article><div className="cookie-settings-save"><button type="button" onClick={save}>Save cookie settings</button><span aria-live="polite">{saved?"Settings saved.":""}</span></div></div>
}