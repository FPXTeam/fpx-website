"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

/** Start internal page transitions at the new page's hero. */
export function NavigationScrollReset(){
  const pathname=usePathname();
  const previousPath=useRef(pathname);

  useLayoutEffect(()=>{
    if(previousPath.current!==pathname){
      previousPath.current=pathname;
      if(!window.location.hash)window.scrollTo(0,0);
    }
  },[pathname]);

  return null;
}
