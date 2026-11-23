import { NextResponse } from "next/server";
import { prepareFromBody, parseApprovedArticle } from "../../../../lib/saw-point-publishing";

export const runtime="nodejs";
export const maxDuration=30;

type Generated={excerpt:string;caption:string;emailHeadline:string;emailIntro:string;preheader:string;teaser:string;storySummaries:{title:string;summary:string}[]};

export async function POST(request:Request){
  const payload=await request.json().catch(()=>({}));
  const issue=String(payload.issue||"").padStart(3,"0");
  const date=String(payload.date||"").trim();
  const title=String(payload.title||"").trim();
  const body=String(payload.body||"");
  if(!/^\d{3}$/.test(issue)||!date||!title||body.trim().length<120)
    return NextResponse.json({error:"Enter an issue number, month, title and full approved article."},{status:400});

  const parsed=parseApprovedArticle(body,title);
  const fallback=prepareFromBody(issue,date,title,body);
  const key=process.env.OPENAI_API_KEY;
  if(!key)return NextResponse.json({ok:true,prepared:fallback,missingSourceUrls:parsed.missingSourceUrls,
    note:"Structured draft generated from the article. Review the language before posting. AI drafting is not configured."});

  const instructions=[
    "You are drafting FPX Saw Point newsletter publishing assets.",
    "Use only the supplied fully approved article. Never add facts, numbers, links, sources or interpretations not directly supported by the source.",
    "Keep the writing precise, concise, natural, NZ English. No em dashes, fluff or marketing exaggeration.",
    "Follow the previous FPX caption style: first line 'Saw Point | Issue NNN | Month YYYY is now live.',",
    "then a short context sentence, a paragraph introducing George Harman and the principal story topics,",
    "then 'Read the full Issue NNN below.', subscription link https://www.fpx.nz/saw-point,",
    "and hashtags #SawPoint #NZTimber #ForestryNZ #WoodProcessing #FPX.",
    "The short archive summary should mention the main actual news topics and be under 320 characters.",
    "Email subject/lead text and preheader should accurately reflect the main news without inventing anything.",
    "Return JSON ONLY with keys excerpt, caption, emailHeadline, emailIntro, preheader, teaser, storySummaries.",
    "storySummaries must be an array with one short title and short summary per major article section (max 8);",
    "do not include the SAW POINT author commentary or WORTH READING list as a news story.",
    "Write an email intro of at most 300 characters, a teaser of at most 250, and a preheader of at most 150.",
    "Do not rewrite the source article; these are metadata and distribution copy only."
  ].join(" ");
  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),22000);
    let response:Response;
    try{
      response=await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json",Authorization:"Bearer "+key},
        body:JSON.stringify({
          model:process.env.SAW_POINT_AI_MODEL||"gpt-4.1-mini",
          temperature:0.25,
          response_format:{type:"json_object"},
          messages:[
            {role:"system",content:instructions},
            {role:"user",content:JSON.stringify({issue,date,title,article:body})}
          ]
        }),
        signal:controller.signal
      });
    }finally{clearTimeout(timeout);}
    if(!response.ok)throw new Error("Drafting service unavailable");
    const data=await response.json();
    const parsedAI=JSON.parse(String(data?.choices?.[0]?.message?.content||"{}")) as Generated;
    if(!parsedAI.excerpt||!parsedAI.caption||!Array.isArray(parsedAI.storySummaries))
      throw new Error("Invalid generated draft");
    const usable=parsedAI.storySummaries.filter(s=>typeof s.title==="string"&&typeof s.summary==="string").slice(0,8);
    return NextResponse.json({ok:true,prepared:{
      excerpt:parsedAI.excerpt,
      caption:parsedAI.caption,
      emailHeadline:parsedAI.emailHeadline||fallback.emailHeadline,
      emailIntro:parsedAI.emailIntro||fallback.emailIntro,
      preheader:parsedAI.preheader||fallback.preheader,
      teaser:parsedAI.teaser||fallback.teaser,
      storySummaries:usable.length?usable:fallback.storySummaries,
      source:"ai" as const
    },missingSourceUrls:parsed.missingSourceUrls});
  }catch(error){
    console.error("Saw Point AI drafting fallback:",error instanceof Error?error.message:error);
    return NextResponse.json({ok:true,prepared:fallback,missingSourceUrls:parsed.missingSourceUrls,
      note:"AI draft could not be generated. A structured, editable draft was created from the approved article."});
  }
}
