import { NextResponse } from "next/server";

export const runtime="nodejs";
export const maxDuration=30;

export async function POST(request:Request){
  const body=await request.json().catch(()=>({}));
  const issue=String(body.issue||"").trim().padStart(3,"0");
  if(!/^\d{3}$/.test(issue))return NextResponse.json({error:"Enter a valid issue number."},{status:400});

  const token=process.env.GITHUB_PUBLISH_TOKEN;
  const repo=process.env.GITHUB_REPO||"FPXTeam/fpx-website";
  const branch=process.env.SAW_POINT_PUBLISH_BRANCH||"main";
  const [owner,name]=repo.split("/");
  if(!token||!owner||!name)return NextResponse.json({error:"GitHub publishing connection unavailable."},{status:500});

  const root="https://api.github.com/repos/"+owner+"/"+name;
  const headers={
    Authorization:"Bearer "+token,Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"
  };
  const api=async(path:string,options:RequestInit={})=>{
    const response=await fetch(root+path,{...options,headers,cache:"no-store"});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error("GitHub "+response.status+": "+String(data?.message||"request failed").slice(0,150));
    return data;
  };
  try{
    const [archiveFile,newsFile,ref]=await Promise.all([
      api("/contents/data/saw-point-issues.json?ref="+encodeURIComponent(branch)),
      api("/contents/data/industry-news.json?ref="+encodeURIComponent(branch)),
      api("/git/ref/heads/"+encodeURIComponent(branch))
    ]);
    const archive=JSON.parse(Buffer.from(archiveFile.content.replace(/\n/g,""),"base64").toString("utf8")) as Record<string,unknown>[];
    const news=JSON.parse(Buffer.from(newsFile.content.replace(/\n/g,""),"base64").toString("utf8")) as Record<string,unknown>[];
    const found=archive.some(x=>String(x.issue).padStart(3,"0")===issue)||news.some(x=>String(x.issue).padStart(3,"0")===issue);
    if(!found)return NextResponse.json({error:"Saw Point Issue "+issue+" does not exist."},{status:404});
    const nextArchive=archive.filter(x=>String(x.issue).padStart(3,"0")!==issue);
    const nextNews=news.filter(x=>String(x.issue).padStart(3,"0")!==issue);
    const sha=String(ref.object?.sha||"");
    const parent=await api("/git/commits/"+sha);
    const tree=await api("/git/trees",{method:"POST",body:JSON.stringify({
      base_tree:parent.tree.sha,
      tree:[
        {path:"data/saw-point-issues.json",mode:"100644",type:"blob",content:JSON.stringify(nextArchive,null,2)+"\n"},
        {path:"data/industry-news.json",mode:"100644",type:"blob",content:JSON.stringify(nextNews,null,2)+"\n"}
      ]
    })});
    const commit=await api("/git/commits",{method:"POST",body:JSON.stringify({
      message:"Remove Saw Point Issue "+issue+" from both website libraries",
      tree:tree.sha,parents:[sha]
    })});
    await api("/git/refs/heads/"+encodeURIComponent(branch),{method:"PATCH",
      body:JSON.stringify({sha:commit.sha,force:false})});
    const hook=process.env.VERCEL_SAW_POINT_DEPLOY_HOOK;
    if(hook)fetch(hook,{method:"POST"}).catch(e=>console.error("Saw Point delete deploy hook:",e));
    return NextResponse.json({ok:true,commitSha:commit.sha});
  }catch(error){
    console.error("Saw Point delete:",error);
    return NextResponse.json({error:"Could not remove issue: "+(error instanceof Error?error.message:"unknown error")},{status:502});
  }
}
