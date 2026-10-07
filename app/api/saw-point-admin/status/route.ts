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
  if(state==="ERROR"||state==="CANCELED") return NextResponse.json({status:"error",error:"Vercel deployment failed."});
  if(state!=="READY") return NextResponse.json({status:"deploying",state});

  const target=String(deployment.target||"").toLowerCase();
  if(target==="production"){
    return NextResponse.json({status:"ready",production:true,url:deployment.url?("https://"+deployment.url):null});
  }

  const deploymentId=String(deployment.uid||deployment.id||"");
  if(!deploymentId){
    return NextResponse.json({status:"error",error:"Vercel deployment is ready but its deployment ID is missing."});
  }

  const promoteParams=new URLSearchParams();
  if(teamId) promoteParams.set("teamId",teamId);
  const promoteQuery=promoteParams.toString();
  const promoteUrl=`https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/promote/${encodeURIComponent(deploymentId)}${promoteQuery?`?${promoteQuery}`:""}`;
  const promote=await fetch(promoteUrl,{
    method:"POST",
    headers:{Authorization:`Bearer ${token}`},
    cache:"no-store"
  });

  if(promote.ok){
    return NextResponse.json({status:"ready",production:true,promoted:true,url:deployment.url?("https://"+deployment.url):null});
  }

  if(promote.status===409){
    return NextResponse.json({status:"deploying",state:"PROMOTING"});
  }

  console.error("Saw Point publisher: production promotion failed",await promote.text());
  return NextResponse.json({status:"error",error:"Vercel deployment was created, but automatic promotion to Production failed."},{status:502});
}
