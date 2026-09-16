import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME="fpx_saw_point_admin";

function secret(){
  return process.env.SAW_POINT_ADMIN_PASSWORD || "";
}

function token(){
  const value=secret();
  if(!value) return "";
  return createHmac("sha256",value).update("fpx-saw-point-admin-session").digest("hex");
}

export async function isSawPointAdmin(){
  const expected=token();
  if(!expected) return false;
  const store=await cookies();
  const actual=store.get(COOKIE_NAME)?.value || "";
  if(actual.length!==expected.length) return false;
  return timingSafeEqual(Buffer.from(actual),Buffer.from(expected));
}

export function sawPointAdminCookieValue(){
  return token();
}

export const sawPointAdminCookieName=COOKIE_NAME;
