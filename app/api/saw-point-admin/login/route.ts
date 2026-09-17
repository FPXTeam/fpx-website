import { NextResponse } from "next/server";
import { sawPointAdminCookieName, sawPointAdminCookieValue } from "../../../../lib/saw-point-admin-auth";

export async function POST(request:Request){
  const form=await request.formData();
  const normalize=(value:string)=>{
    const trimmed=value.trim();
    if((trimmed.startsWith('"')&&trimmed.endsWith('"'))||(trimmed.startsWith("'")&&trimmed.endsWith("'"))){
      return trimmed.slice(1,-1).trim();
    }
    return trimmed;
  };
  const password=normalize(String(form.get("password")||""));
  const expected=normalize(process.env.SAW_POINT_ADMIN_PASSWORD || "");
  if(!expected || password!==expected){
    return NextResponse.redirect(new URL("/saw-point-admin?error=1",request.url),303);
  }
  const response=NextResponse.redirect(new URL("/saw-point-admin",request.url),303);
  response.cookies.set(sawPointAdminCookieName,sawPointAdminCookieValue(),{
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV==="production",
    path:"/",
    maxAge:60*60*8
  });
  return response;
}
