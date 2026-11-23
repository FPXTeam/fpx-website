export type SourceLink = {text:string;href:string};
export type StorySection = {heading:string;paras:string[];sourceLabel:string;sources:SourceLink[]};
export type WorthReading = {title:string;description:string;action:string;href:string};
export type PreparedContent = {
  excerpt:string;caption:string;emailHeadline:string;emailIntro:string;preheader:string;teaser:string;
  storySummaries:{title:string;summary:string}[];source:"ai"|"structured"
};

export type ArticleBlock = {kind:"heading"|"paragraph"|"source"|"reading-title"|"reading-description"|"signoff"|"divider";text:string};
const HEAD=/^(?:THE BIG STORY|MARKET UPDATE|EXPORT WATCH|DOMESTIC WATCH|INDUSTRY WATCH|ONE TO WATCH|SAW POINT|WORTH READING THIS MONTH)(?::|$)/i;
const END=/^(?:Saw Point is published|Written by George Harman|Looking for timber\?|Subscribe at\b)/i;
const MONTHS=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

export function normalizeBody(raw:string){
  // Notion blocks often arrive as individual single-newline paragraphs.
  // Keep those boundaries. Never collapse a full selection to one paragraph.
  return raw.replace(/\r\n?/g,"\n").replace(/[\u2028\u2029]/g,"\n")
    .split("\n").map(line=>line.trim()).join("\n").replace(/\n{3,}/g,"\n\n").trim();
}
export function monthLabel(raw:string){let v=raw.toUpperCase();let i=MONTHS.findIndex(m=>v.includes(m));let yr=v.match(/\b20\d{2}\b/)?.[0]||"";return i<0?raw:(MONTHS[i][0]+MONTHS[i].slice(1).toLowerCase()+" "+yr);}
export function dateMonth(raw:string){let v=raw.toUpperCase();let i=MONTHS.findIndex(m=>v.includes(m));let yr=v.match(/\b20\d{2}\b/)?.[0]||"";return i<0||!yr?"":yr+"-"+String(i+1).padStart(2,"0");}
export function escapeHtml(raw:string){return raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
export function toHeadline(heading:string){return heading.replace(/^(THE BIG STORY|MARKET UPDATE|EXPORT WATCH|DOMESTIC WATCH|INDUSTRY WATCH|ONE TO WATCH):\s*/i,"").trim();}
function shorten(value:string,n=190){const clean=value.replace(/\s+/g," ").trim();if(clean.length<=n)return clean;const sentence=clean.match(/^[^.!?]+[.!?]+/)?.[0];return sentence&&sentence.length<=n?sentence:clean.slice(0,n).replace(/\s+\S*$/,"").trim()+"…";}

function stripBlockMarkdown(raw:string){
  // Notion exports sometimes place Markdown heading markers in the copied text.
  const value=raw.replace(/^#{1,6}\s+/,"").trim();
  return /^\*\*[^*].*[^*]\*\*$/.test(value)?value.slice(2,-2).trim():value;
}
function heading(value:string){return HEAD.test(stripBlockMarkdown(value));}
function sameHeading(a:string,b:string){
  const plain=(v:string)=>stripBlockMarkdown(v).toLocaleLowerCase("en-NZ").replace(/\s+/g," ").trim();
  return plain(a)===plain(b);
}

export function parseArticleBlocks(raw:string):ArticleBlock[]{
  const result:ArticleBlock[]=[];
  let reading=false,signoff=false,expectsReadingTitle=true;
  for(const line of normalizeBody(raw).split("\n")){
    if(!line.trim())continue;
    const text=stripBlockMarkdown(line);
    if(/^(-{3,}|\*{3,})$/.test(text)){result.push({kind:"divider",text:""});continue;}
    if(END.test(text))signoff=true;
    if(signoff){result.push({kind:"signoff",text});continue;}
    if(heading(text)){
      result.push({kind:"heading",text});
      reading=/^WORTH READING THIS MONTH$/i.test(text);
      expectsReadingTitle=true;
      continue;
    }
    if(reading){
      result.push({kind:expectsReadingTitle?"reading-title":"reading-description",text});
      expectsReadingTitle=!expectsReadingTitle;
      continue;
    }
    if(/^Sources?:\s*/i.test(text)){result.push({kind:"source",text});continue;}
    result.push({kind:"paragraph",text});
  }
  return result;
}

export function linkedInArticleBlocks(raw:string,title:string=""):ArticleBlock[]{
  const blocks=parseArticleBlocks(raw);
  // The top headline belongs in LinkedIn's separate article TITLE field,
  // not repeated above its first paragraph in the article BODY.
  const first=blocks.findIndex(b=>b.kind!=="divider");
  return first>=0&&blocks[first].kind==="heading"&&title&&sameHeading(blocks[first].text,title)
    ? blocks.filter((_,i)=>i!==first):blocks;
}

export function formatLinkedInBody(raw:string,title:string=""):string{
  return linkedInArticleBlocks(raw,title).map(b=>b.kind==="divider"?"---":b.text).join("\n\n");
}

function inlineHtml(raw:string):string{
  // Escape first, then link the explicit subscription URL. Never guess source links.
  return escapeHtml(raw).replace(
    /\b(https?:\/\/(?:www\.)?fpx\.nz\/saw-point|fpx\.nz\/saw-point)\b/g,
    value=>'<a href="https://www.fpx.nz/saw-point">'+value+"</a>"
  );
}
export function formatLinkedInHtml(raw:string,title:string=""):string{
  return linkedInArticleBlocks(raw,title).map(block=>{
    const text=inlineHtml(block.text);
    if(block.kind==="heading")return "<h2><strong>"+text+"</strong></h2>";
    if(block.kind==="reading-title")return "<p><strong>"+text+"</strong></p>";
    if(block.kind==="source"){
      const match=/^(Sources?:)(.*)$/i.exec(block.text);
      return match?"<p><strong>"+escapeHtml(match[1])+"</strong>"+inlineHtml(match[2])+"</p>":"<p>"+text+"</p>";
    }
    if(block.kind==="divider")return "<hr />";
    return "<p>"+text+"</p>";
  }).join("\n");
}

function parseSourceLine(block:string):{sourceLabel:string;sources:SourceLink[]}{
  const sourceLabel=/^Sources:/i.test(block)?"Sources:":"Source:";
  const text=block.replace(/^Sources?:\s*/i,"");
  const markdown=[...text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)];
  if(markdown.length)return {sourceLabel,sources:markdown.map(m=>({text:m[1],href:m[2]}))};
  const urls=text.match(/https?:\/\/[^\s<>]+/g);
  if(urls?.length)return {sourceLabel,sources:urls.map(href=>({text:text.replace(href,"").trim()||href,href:href.replace(/[.,;]$/,"")}))};
  return {sourceLabel,sources:[{text,href:""}]};
}

export function parseApprovedArticle(raw:string,title:string){
  const blocks=parseArticleBlocks(raw);
  const sections:StorySection[]=[];
  const worthReading:WorthReading[]=[];
  const closing:string[]=[];
  let section:StorySection|null=null;
  for(const block of blocks){
    if(block.kind==="heading"){
      if(/^WORTH READING THIS MONTH$/i.test(block.text)){section=null;continue;}
      section={heading:block.text,paras:[],sourceLabel:"",sources:[]};sections.push(section);
      continue;
    }
    if(block.kind==="reading-title"){
      worthReading.push({title:block.text,description:"",action:"",href:""});
      continue;
    }
    if(block.kind==="reading-description"){
      if(worthReading.length)worthReading[worthReading.length-1].description=block.text;
      continue;
    }
    if(block.kind==="signoff"){closing.push(block.text);continue;}
    if(block.kind==="divider")continue;
    if(!section){section={heading:title,paras:[],sourceLabel:"",sources:[]};sections.push(section);}
    if(block.kind==="source"){
      const parsed=parseSourceLine(block.text);
      section.sourceLabel=parsed.sourceLabel;
      section.sources.push(...parsed.sources);
    }else section.paras.push(block.text);
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
    storySummaries:(()=>{
      const stories=sections.map(s=>({title:toHeadline(s.heading),summary:shorten(s.paras[0]||"",190),group:s.heading.split(":")[0]}));
      while(stories.length>6){
        let index=stories.findIndex((s,i)=>i<stories.length-1&&s.group===stories[i+1].group);
        if(index<0)index=stories.length-2;
        const first=stories[index],second=stories[index+1];
        stories.splice(index,2,{title:first.title+" / "+second.title,summary:shorten(first.summary+" "+second.summary,290),group:first.group});
      }
      return stories.map(({title,summary})=>({title,summary}));
    })(),
    source:"structured"
  };
}
