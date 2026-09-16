import { NextResponse } from "next/server";
import { sawPointAdminCookieName } from "../../../../lib/saw-point-admin-auth";

export async function POST(request:Request){
  const response=NextResponse.redirect(new URL("/saw-point-admin",request.url),303);
  response.cookies.set(sawPointAdminCookieName,"",{httpOnly:true,path:"/",maxAge:0});
  return response;
}
