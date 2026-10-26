"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** Start fresh page visits and internal transitions at the new page's hero. */
export function NavigationScrollReset(){
  const pathname=usePathname();
  useLayoutEffect(()=>{
    if(window.location.hash)return;

    const toTop=()=>window.scrollTo({top:0,left:0,behavior:"instant"});
    toTop();
    const frame=requestAnimationFrame(toTop);
    return()=>cancelAnimationFrame(frame);
  },[pathname]);

  return null;
}
