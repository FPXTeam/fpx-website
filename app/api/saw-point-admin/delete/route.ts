import { NextResponse } from "next/server";
import { isSawPointAdmin } from "../../../../lib/saw-point-admin-auth";

export async function POST(request:Request){
  if(!(await isSawPointAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});

  const body=await request.json();
  const issue=String(body.issue||"").trim().padStart(3,"0");
  if(!issue) return NextResponse.json({error:"Enter an issue number."},{status:400});

  const token=process.env.GITHUB_PUBLISH_TOKEN;
  const repo=process.env.GITHUB_REPO || "FPXTeam/fpx-website";
  const branch=process.env.SAW_POINT_PUBLISH_BRANCH || "main";
  if(!token) return NextResponse.json({error:"GITHUB_PUBLISH_TOKEN is not configured."},{status:500});

  const [owner,name]=repo.split("/");
  const path="data/saw-point-issues.json";
  const api=`https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const headers={
    Authorization:`Bearer ${token}`,
    Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28"
  };

  const current=await fetch(api,{headers,cache:"no-store"});
  if(!current.ok) return NextResponse.json({error:"Unable to read Saw Point issue data."},{status:502});

  const file=await current.json();
  const decoded=Buffer.from(String(file.content||"").replace(/\n/g,""),"base64").toString("utf8");
  const issues=JSON.parse(decoded) as Array<Record<string,string>>;
  const exists=issues.some(item=>String(item.issue).padStart(3,"0")===issue);

  if(!exists) return NextResponse.json({error:`Issue ${issue} was not found.`},{status:404});

  const next=issues.filter(item=>String(item.issue).padStart(3,"0")!==issue);

  const update=await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${path}`,{
    method:"PUT",
    headers:{...headers,"Content-Type":"application/json"},
    body:JSON.stringify({
      message:`Delete Saw Point issue ${issue}`,
      content:Buffer.from(JSON.stringify(next,null,2)+"\n","utf8").toString("base64"),
      sha:file.sha,
      branch
    })
  });

  if(!update.ok){
    console.error("Saw Point delete failed",await update.text());
    return NextResponse.json({error:"GitHub update failed."},{status:502});
  }

  const result=await update.json();
  const commitSha=String(result?.commit?.sha||"");
  const deployHook=process.env.VERCEL_SAW_POINT_DEPLOY_HOOK;
  if(deployHook){
    const deploy=await fetch(deployHook,{method:"POST"});
    if(!deploy.ok) console.error("Saw Point delete deploy hook failed",await deploy.text());
  }

  return NextResponse.json({ok:true,commitSha});
}
