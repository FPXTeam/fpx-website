import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const LAB_COOKIE = "fpx_lead_journey_lab";

function configuredPassword(){
  return process.env.LEAD_JOURNEY_LAB_PASSWORD?.trim() || "";
}

export function labIsConfigured(){
  return configuredPassword().length >= 8;
}

export function accessToken(){
  const password=configuredPassword();
  if(!password)return "";
  return createHash("sha256").update("FPX_LEAD_JOURNEY_LAB:"+password).digest("hex");
}

export function passwordMatches(input:string){
  const expected=configuredPassword();
  if(!expected || !input)return false;
  const a=Buffer.from(createHash("sha256").update(input).digest("hex"));
  const b=Buffer.from(createHash("sha256").update(expected).digest("hex"));
  return a.length===b.length && timingSafeEqual(a,b);
}

export async function hasLabAccess(){
  if(!labIsConfigured())return false;
  const store=await cookies();
  return store.get(LAB_COOKIE)?.value===accessToken();
}
