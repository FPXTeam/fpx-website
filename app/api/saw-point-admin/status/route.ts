import { NextResponse } from "next/server";
import { isSawPointAdmin } from "../../../../lib/saw-point-admin-auth";

export async function GET(request:Request){
  if(!(await isSawPointAdmin())) return NextResponse.json({status:"error",error:"Unauthorized"},{status:401});

  const sha=new URL(request.url).searchParams.get("sha")||"";
  if(!sha) return NextResponse.json({status:"error",error:"Missing commit SHA."},{status:400});

  const token=process.env.VERCEL_TOKEN;
  const projectId=process.env.VERCEL_PROJECT_ID;
  const teamId=process.env.VERCEL_TEAM_ID;
  if(!token||!projectId){
    return NextResponse.json({status:"deploying",note:"Vercel status credentials are not configured."});
  }

  const params=new URLSearchParams({projectId,limit:"20"});
  if(teamId) params.set("teamId",teamId);

  const response=await fetch("https://api.vercel.com/v6/deployments?"+params.toString(),{
    headers:{Authorization:`Bearer ${token}`},
    cache:"no-store"
  });

  if(!response.ok){
    console.error("Saw Point publisher: Vercel status failed",await response.text());
    return NextResponse.json({status:"deploying"});
  }

  const data=await response.json();
  const deployment=(data.deployments||[]).find((item:any)=>{
    const meta=item.meta||{};
    return meta.githubCommitSha===sha || meta.githubCommitSha?.startsWith(sha) || sha.startsWith(meta.githubCommitSha||"__");
  });

  if(!deployment) return NextResponse.json({status:"deploying"});

  const state=String(deployment.readyState||deployment.state||"").toUpperCase();
  if(state==="READY") return NextResponse.json({status:"ready",url:deployment.url?("https://"+deployment.url):null});
  if(state==="ERROR"||state==="CANCELED") return NextResponse.json({status:"error",error:"Vercel deployment failed."});
  return NextResponse.json({status:"deploying",state});
}
