import { NextResponse } from "next/server";
import { parseApprovedArticle, monthLabel, dateMonth, type PreparedContent } from "../../../../lib/saw-point-publishing";

export const runtime="nodejs";
export const maxDuration=30;

const SITE="https://www.fpx.nz";
function slugify(value:string){return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,110);}
function issueDateValue(value:string){const d=new Date(dateMonth(value)+"-01T00:00:00Z");return Number.isNaN(d.getTime())?0:d.getTime();}
function validLinkedIn(value:string){
  try{const u=new URL(value);return u.protocol==="https:"&&(u.hostname==="www.linkedin.com"||u.hostname==="linkedin.com")&&u.pathname.startsWith("/pulse/");}
  catch{return false;}
}
function validCover(value:string){
  try{const u=new URL(value);return u.origin===SITE&&u.pathname.startsWith("/images/saw-point/covers/")&&/\.(png|jpg|webp)$/i.test(u.pathname);}
  catch{return false;}
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const issue=String(input.issue||"").trim().padStart(3,"0");
  const date=String(input.date||"").trim().toUpperCase();
  const title=String(input.title||"").trim();
  const body=String(input.body||"").trim();
  const excerpt=String(input.excerpt||"").trim();
  const caption=String(input.caption||"").trim();
  const linkedinUrl=String(input.linkedinUrl||"").trim();
  const coverImage=String(input.coverUrl||"").trim();
  if(!/^\d{3}$/.test(issue)||!dateMonth(date)||!title||body.length<120||!excerpt||!caption){
    return NextResponse.json({error:"Complete the issue number, month, title, approved article, generated summary and caption."},{status:400});
  }
  if(!validLinkedIn(linkedinUrl))return NextResponse.json({error:"Add the final LinkedIn newsletter URL after posting the issue."},{status:400});
  if(!validCover(coverImage))return NextResponse.json({error:"Use the permanent FPX image URL created in Step 01."},{status:400});
  if(body.length>120000)return NextResponse.json({error:"Article is too long for this publishing workflow."},{status:413});

  const token=process.env.GITHUB_PUBLISH_TOKEN;
  const repo=process.env.GITHUB_REPO||"FPXTeam/fpx-website";
  const branch=process.env.SAW_POINT_PUBLISH_BRANCH||"main";
  const [owner,name]=repo.split("/");
  if(!token||!owner||!name)return NextResponse.json({error:"GitHub publishing connection is not configured."},{status:500});
  const root="https://api.github.com/repos/"+owner+"/"+name;
  const headers={
    Authorization:"Bearer "+token, Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28", "Content-Type":"application/json"
  };
  const api=async(path:string,options:RequestInit={})=>{
    const response=await fetch(root+path,{...options,headers,cache:"no-store"});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error("GitHub "+response.status+" "+String(result?.message||"request failed").slice(0,160));
    return result;
  };
  try{
    const [archiveResponse,newsResponse,ref]=await Promise.all([
      api("/contents/data/saw-point-issues.json?ref="+encodeURIComponent(branch)),
      api("/contents/data/industry-news.json?ref="+encodeURIComponent(branch)),
      api("/git/ref/heads/"+encodeURIComponent(branch))
    ]);
    const archive=JSON.parse(Buffer.from(archiveResponse.content.replace(/\n/g,""),"base64").toString("utf8")) as Record<string,unknown>[];
    const news=JSON.parse(Buffer.from(newsResponse.content.replace(/\n/g,""),"base64").toString("utf8")) as Record<string,unknown>[];
    if(archive.some(item=>String(item.issue).padStart(3,"0")===issue)||news.some(item=>String(item.issue).padStart(3,"0")===issue)){
      return NextResponse.json({error:"Issue "+issue+" already exists. Nothing was overwritten."},{status:409});
    }
    const parsed=parseApprovedArticle(body,title);
    const headline=title.replace(/^THE BIG STORY:\s*/i,"").trim();
    const month=dateMonth(date);
    const slug=slugify(headline)+"-saw-point-"+slugify(monthLabel(date));
    const publishedAt=new Date().toISOString().slice(0,10);
    const year=month.slice(0,4);
    const prepared=input.prepared as Partial<PreparedContent>|undefined;
    const coverAlt="Saw Point Issue "+issue+", "+monthLabel(date)+", original FPX newsletter cover";
    const newsItem={
      slug,issue,month:monthLabel(date).replace(/\s+\d{4}$/,""),year:Number(year),
      publishedAt,updatedAt:publishedAt,headline,
      pageTitle:headline+" | Saw Point "+monthLabel(date),
      description:excerpt.slice(0,200),summary:excerpt,
      linkedinUrl,coverImage,coverAlt,
      introduction:parsed.introduction,openingQuote:parsed.openingQuote,
      sections:parsed.sections,worthReading:parsed.worthReading,closing:parsed.closing,
      keywords:Array.from(new Set([headline,"NZ timber industry","New Zealand forestry",...parsed.sections.map(s=>s.heading.slice(0,80))])).slice(0,10)
    };
    const archiveItem={
      issue,date,year,publishedAt,title:"Saw Point | Issue "+issue,excerpt,linkedinUrl,
      slug:"issue-"+issue+"-"+slugify(date),
      articleSlug:slug,coverImage,caption,body
    };
    const updatedArchive=[archiveItem,...archive].sort((a,b)=>
      issueDateValue(String(b.date))-issueDateValue(String(a.date))||Number(b.issue)-Number(a.issue));
    const updatedNews=[newsItem,...news].sort((a,b)=>
      String(b.publishedAt).localeCompare(String(a.publishedAt))||Number(b.issue)-Number(a.issue));

    // Write both website destinations as one commit. No partial archive/article publication.
    const parentSha=String(ref?.object?.sha||"");
    if(!/^[0-9a-f]{40}$/i.test(parentSha))throw new Error("Could not read the current branch commit.");
    const parent=await api("/git/commits/"+parentSha);
    const tree=await api("/git/trees",{
      method:"POST",body:JSON.stringify({
        base_tree:parent.tree.sha,
        tree:[
          {path:"data/saw-point-issues.json",mode:"100644",type:"blob",content:JSON.stringify(updatedArchive,null,2)+"\n"},
          {path:"data/industry-news.json",mode:"100644",type:"blob",content:JSON.stringify(updatedNews,null,2)+"\n"}
        ]
      })
    });
    const commit=await api("/git/commits",{
      method:"POST",body:JSON.stringify({
        message:"Publish Saw Point Issue "+issue+" to archive and industry insights",
        tree:tree.sha,parents:[parentSha]
      })
    });
    await api("/git/refs/heads/"+encodeURIComponent(branch),{
      method:"PATCH",body:JSON.stringify({sha:commit.sha,force:false})
    });
    const hook=process.env.VERCEL_SAW_POINT_DEPLOY_HOOK;
    if(hook)fetch(hook,{method:"POST"}).catch(e=>console.error("Saw Point deploy hook:",e));
    return NextResponse.json({ok:true,commitSha:commit.sha,slug,articleUrl:SITE+"/industry-insights/"+slug,
      sawPointUrl:SITE+"/saw-point",missingSourceUrls:parsed.missingSourceUrls});
  }catch(error){
    console.error("Saw Point multi-channel publisher:",error);
    return NextResponse.json({error:"Publishing could not be completed. "+(error instanceof Error?error.message:"Check the connection.")},{status:502});
  }
}
