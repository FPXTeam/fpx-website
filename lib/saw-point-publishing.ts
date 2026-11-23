export type SourceLink = {text:string;href:string};
export type StorySection = {heading:string;paras:string[];sourceLabel:string;sources:SourceLink[]};
export type WorthReading = {title:string;description:string;action:string;href:string};
export type PreparedContent = {excerpt:string;caption:string;emailHeadline:string;emailIntro:string;preheader:string;teaser:string;storySummaries:{title:string;summary:string}[];source:"ai"|"structured"};

const HEAD=/^(?:THE BIG STORY|MARKET UPDATE|EXPORT WATCH|DOMESTIC WATCH|INDUSTRY WATCH|ONE TO WATCH|SAW POINT|WORTH READING THIS MONTH)(?::|$)/i;
const END=/^(?:Saw Point is published|Written by George Harman|Looking for timber\?|Subscribe at\b)/i;
const MONTHS=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
export function normalizeBody(raw:string){return raw.replace(/\r\n?/g,"\n").split("\n").map(x=>x.trim()).join("\n").replace(/\n{3,}/g,"\n\n").trim();}
export function monthLabel(raw:string){let v=raw.toUpperCase();let i=MONTHS.findIndex(m=>v.includes(m));let yr=v.match(/\b20\d{2}\b/)?.[0]||"";return i<0?raw:(MONTHS[i][0]+MONTHS[i].slice(1).toLowerCase()+" "+yr);}
export function dateMonth(raw:string){let v=raw.toUpperCase();let i=MONTHS.findIndex(m=>v.includes(m));let yr=v.match(/\b20\d{2}\b/)?.[0]||"";return i<0||!yr?"":yr+"-"+String(i+1).padStart(2,"0");}
export function escapeHtml(raw:string){return raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
export function toHeadline(heading:string){return heading.replace(/^(THE BIG STORY|MARKET UPDATE|EXPORT WATCH|DOMESTIC WATCH|INDUSTRY WATCH|ONE TO WATCH):\s*/i,"").trim();}
function shorten(value:string,n=190){const clean=value.replace(/\s+/g," ").trim();if(clean.length<=n)return clean;const sentence=clean.match(/^[^.!?]+[.!?]+/)?.[0];return sentence&&sentence.length<=n?sentence:clean.slice(0,n).replace(/\s+\S*$/,"").trim()+"…";}
export function formatLinkedInBody(raw:string) {
  return normalizeBody(raw).split("\n").map(line=>HEAD.test(line)?"\n"+line+"\n":line).join("\n").replace(/\n{3,}/g,"\n\n").trim();
}
export function parseApprovedArticle(raw:string,title:string){
  const chunks=normalizeBody(raw).split(/\n\s*\n/).flatMap(block=>{
    let current:string[]=[];const parts:string[]=[];
    for(const line of block.split("\n")){
      if(HEAD.test(line)){if(current.length)parts.push(current.join(" "));current=[];parts.push(line);}
      else current.push(line);
    }
    if(current.length)parts.push(current.join(" "));
    return parts.filter(Boolean);
  });
  const sections:StorySection[]=[];const worthReading:WorthReading[]=[];const closing:string[]=[];
  let reading=false,signoff=false,section:StorySection|null=null;
  for(const block of chunks){
    if(END.test(block))signoff=true;
    if(signoff){closing.push(block);continue;}
    if(/^WORTH READING THIS MONTH$/i.test(block)){reading=true;section=null;continue;}
    if(reading){worthReading.push({title:block,description:"",action:"",href:""});continue;}
    if(HEAD.test(block)){section={heading:block,paras:[],sourceLabel:"",sources:[]};sections.push(section);continue;}
    if(!section){section={heading:title,paras:[],sourceLabel:"",sources:[]};sections.push(section);}
    if(/^Sources?:\s*/i.test(block)){
      section.sourceLabel=/^Sources:/i.test(block)?"Sources:":"Source:";
      const text=block.replace(/^Sources?:\s*/i,"");
      const markdown=[...text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)];
      if(markdown.length)section.sources.push(...markdown.map(m=>({text:m[1],href:m[2]})));
      else {
        const urls=text.match(/https?:\/\/[^\s<>]+/g);
        if(urls?.length)section.sources.push(...urls.map(href=>({text:text.replace(href,"").trim()||href,href:href.replace(/[.,;]$/,"")})));
        else section.sources.push({text,href:""});
      }
    }else section.paras.push(block);
  }
  return {sections,worthReading,closing,introduction:"",openingQuote:"",
    missingSourceUrls:sections.flatMap(s=>s.sources.filter(link=>!link.href).map(link=>s.heading+": "+link.text))};
}
export function prepareFromBody(issue:string,date:string,title:string,body:string):PreparedContent{
  const parsed=parseApprovedArticle(body,title);
  const sections=parsed.sections.filter(s=>!/^SAW POINT$/i.test(s.heading));
  const topics=sections.slice(0,6).map(s=>toHeadline(s.heading).toLowerCase());
  const first=sections[0]?.paras[0]||"";
  const summary=monthLabel(date)+"'s Saw Point covers "+topics.slice(0,5).join(", ")+".";
  const teaser=parsed.sections.find(s=>/^SAW POINT$/i.test(s.heading))?.paras?.at(-1)||first;
  return {
    excerpt:shorten(summary,350),
    caption:[
      "Saw Point | Issue "+issue+" | "+monthLabel(date)+" is now live.",
      shorten(first,245),
      "In Issue "+issue+", George Harman covers "+topics.join(", ")+".",
      "Read the full Issue "+issue+" below.",
      "Subscribe for future issues at https://www.fpx.nz/saw-point",
      "#SawPoint #NZTimber #ForestryNZ #WoodProcessing #FPX"
    ].join("\n\n"),
    emailHeadline:shorten(toHeadline(sections[0]?.heading||title),100),
    emailIntro:shorten(first,280),
    preheader:shorten(summary,145),
    teaser:shorten(teaser,240),
    storySummaries:sections.slice(0,6).map(s=>({title:toHeadline(s.heading),summary:shorten(s.paras[0]||"",190)})),
    source:"structured"
  };
}
