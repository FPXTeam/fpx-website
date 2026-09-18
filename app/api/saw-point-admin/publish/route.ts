import { NextResponse } from "next/server";
import { isSawPointAdmin } from "../../../../lib/saw-point-admin-auth";

export const maxDuration=30;

function slugify(value:string){
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}

const monthOrder=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
function issueDateValue(value:string){
  const upper=value.toUpperCase();
  const year=Number(upper.match(/\b\d{4}\b/)?.[0]||0);
  const month=monthOrder.findIndex(name=>upper.includes(name));
  return year*12+(month>=0?month:0);
}

export async function POST(request:Request){
  if(!(await isSawPointAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});

  const body=await request.json();
  const issue=String(body.issue||"").trim().padStart(3,"0");
  const date=String(body.date||"").trim().toUpperCase();
  const title=String(body.title||"").trim() || `Saw Point | Issue ${issue}`;
  const excerpt=String(body.excerpt||"").trim();
  const linkedinUrl=String(body.linkedinUrl||"").trim();
  const article=String(body.body||"").trim();

  if(!issue || !date || !excerpt || !linkedinUrl || !article){
    return NextResponse.json({error:"Complete all required fields."},{status:400});
  }

  try{ new URL(linkedinUrl); }catch{
    return NextResponse.json({error:"Enter a valid LinkedIn URL."},{status:400});
  }

  const token=process.env.GITHUB_PUBLISH_TOKEN;
  const repo=process.env.GITHUB_REPO || "FPXTeam/fpx-website";
  const branch=process.env.SAW_POINT_PUBLISH_BRANCH || "main";
  if(!token) return NextResponse.json({error:"GITHUB_PUBLISH_TOKEN is not configured."},{status:500});

  const [owner,name]=repo.split("/");
  if(!owner||!name) return NextResponse.json({error:"GITHUB_REPO must be owner/repo."},{status:500});

  const path="data/saw-point-issues.json";
  const api=`https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const headers={
    Authorization:`Bearer ${token}`,
    Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28"
  };

  const current=await fetch(api,{headers,cache:"no-store"});
  if(!current.ok){
    console.error("Saw Point publisher: unable to read data",await current.text());
    return NextResponse.json({error:"Unable to read the Saw Point data file from GitHub."},{status:502});
  }

  const file=await current.json();
  const decoded=Buffer.from(String(file.content||"").replace(/\n/g,""),"base64").toString("utf8");
  const issues=JSON.parse(decoded) as Array<Record<string,string>>;

  if(issues.some(item=>String(item.issue).padStart(3,"0")===issue)){
    return NextResponse.json({error:`Issue ${issue} already exists.`},{status:409});
  }

  const year=date.match(/\b\d{4}\b/)?.[0] || new Date().getFullYear().toString();
  const slug=`issue-${issue}-${slugify(date)}`;
  const next=[{issue,date,year,title,excerpt,linkedinUrl,slug,body:article},...issues]
    .sort((a,b)=>issueDateValue(String(b.date))-issueDateValue(String(a.date))||Number(b.issue)-Number(a.issue));

  const update=await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${path}`,{
    method:"PUT",
    headers:{...headers,"Content-Type":"application/json"},
    body:JSON.stringify({
      message:`Publish Saw Point issue ${issue}`,
      content:Buffer.from(JSON.stringify(next,null,2)+"\n","utf8").toString("base64"),
      sha:file.sha,
      branch
    })
  });

  if(!update.ok){
    console.error("Saw Point publisher: GitHub update failed",await update.text());
    return NextResponse.json({error:"GitHub update failed."},{status:502});
  }

  const result=await update.json();
  const commitSha=String(result?.commit?.sha||"");
  if(!commitSha) return NextResponse.json({error:"GitHub updated but no commit SHA was returned."},{status:502});

  const deployHook=process.env.VERCEL_SAW_POINT_DEPLOY_HOOK;
  if(deployHook){
    const deploy=await fetch(deployHook,{method:"POST"});
    if(!deploy.ok) console.error("Saw Point publisher: deploy hook failed",await deploy.text());
  }

  return NextResponse.json({ok:true,commitSha,slug,branch});
}
