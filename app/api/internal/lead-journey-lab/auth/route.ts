import { NextResponse } from "next/server";
import { LAB_COOKIE, accessToken, labIsConfigured, passwordMatches } from "../../../../../lib/lead-journey-lab-auth";

export async function POST(request:Request){
  if(!labIsConfigured())return NextResponse.json({error:"Lead Journey Lab password is not configured."},{status:503});
  const body=await request.json().catch(()=>({}));
  if(!passwordMatches(String(body.password||"")))return NextResponse.json({error:"Incorrect password."},{status:401});

  const response=NextResponse.json({ok:true});
  response.cookies.set(LAB_COOKIE,accessToken(),{
    httpOnly:true,
    sameSite:"lax",
    secure:true,
    path:"/",
    maxAge:60*60*8,
  });
  return response;
}

export async function DELETE(){
  const response=NextResponse.json({ok:true});
  response.cookies.set(LAB_COOKIE,"",{httpOnly:true,sameSite:"lax",secure:true,path:"/",maxAge:0});
  return response;
}
