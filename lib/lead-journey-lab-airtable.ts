// @ts-nocheck
const BASE_ID="app46QGfgQet1CPIu";
const JOURNEYS_TABLE="tbl8GQR6NDrgqjtF2";
const CARDS_TABLE="tblCvEEGIiT0AL3R1";
const LIBRARY_TABLE="tblRQEzsSkgvc4Fra";
const CONNECTIONS_TABLE="tblzBBKa4YFA3QoHh";

const JF={name:"fldR1mvKg5WmaHtxl",description:"fldAYmPtMLBa2ngkD",order:"fldqQz8GHBBjgntY4",active:"fld0vfdZCB4Eox35r"} as const;
const CF={title:"fldTZw5ZxJwTLSUsZ",notes:"fldyoNMq2nfoRtYpj",order:"fldUbg7Zc8a8rL2W8",x:"fldHOK01a4GClLdDy",y:"fldd51zLuP0kpLM81",journey:"fld7D6MCcepbVccze",library:"fldNKY9rbfF0ksfJT"} as const;
const LF={
  name:"fldsIQpP0q8B0ovAc",category:"fldk8rrrD2GBU8MiC",tool:"fldk8HqwHGVix9W8N",
  use:"fldjJma8AnOWORKJ4",action:"fld6tGJOJq6bACvc0",automated:"fldNXm2lkBUm4637T",
  automationTool:"fldtj3DqwwQzdSaZt",assignedPerson:"fldekExx7LZuhfnoQ",campaignName:"fldbGbTqoGkNvZTzN",
  subject:"fldHHAvFN2lpvRt7K",templateName:"fld0Py25FHr00nQWH",messagePurpose:"fld7i7fhPftgjQXnJ",
  timing:"fldB1f036jAgXMt5c",leadStatus:"fldNWEf7sSt4ChpIi",workshopStatus:"fld134QjRkl0fF6iQ",
  notes:"flduBE9ecTbGhwxYJ",active:"fldVkdrb1OjCC16VH",
  suggestedNext:"fldObxiWfVZnqtj0F",suggestedParent:"fld2u1vmpFdO87LVD",applicableJourneys:"fldyuRZmv4uDz2MxI"
} as const;
const XF={name:"fldT88PLhxFPLYwuM",from:"fld8tQx20OGXVsbKb",to:"flddUhwF3te7HbuJv",journey:"fldvgjq2BEcPzWrr8",label:"fldrvSdOTRBb1f6yi",order:"fldlk5mXijEwEqYc9",active:"fldaINUQmCwevzvdZ"} as const;

function token(){
  return process.env.AIRTABLE_TOKEN?.trim() || process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN?.trim() || "";
}
function headers(){
  const value=token();
  if(!value)throw new Error("AIRTABLE_TOKEN is not configured.");
  return {Authorization:`Bearer ${value}`,"Content-Type":"application/json"};
}
async function airtable(path:string,init?:RequestInit){
  const method=(init?.method||"GET").toUpperCase();
  const requestPath=method==="GET"
    ? `${path}${path.includes("?")?"&":"?"}returnFieldsByFieldId=true`
    : path;
  const response=await fetch(`https://api.airtable.com/v0/${BASE_ID}/${requestPath}`,{
    ...init,
    headers:{...headers(),...(init?.headers||{})},
    cache:"no-store",
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data?.error?.message||data?.error?.type||"Airtable request failed.");
  return data;
}
function links(value:any){return Array.isArray(value)?value:[]}
function val(record:any,id:string,fallback:any=""){return record?.fields?.[id]??fallback}

export type LabJourney={id:string;name:string;description:string;order:number;active:boolean};
export type LabLibraryCard={
  id:string;name:string;category:string;tool:string;use:string;action:string;automated:string;automationTool:string;
  assignedPerson:string;campaignName:string;subject:string;templateName:string;messagePurpose:string;timing:string;
  leadStatus:string;workshopStatus:string;notes:string;active:boolean;
  suggestedNextIds:string[];suggestedParentIds:string[];applicableJourneyIds:string[];
};
export type LabCard={id:string;title:string;notes:string;order:number;x:number;y:number;journeyIds:string[];libraryId:string};
export type LabConnection={id:string;name:string;fromId:string;toId:string;journeyIds:string[];label:string;order:number;active:boolean};

export async function getJourneyLabData(){
  if(!token())return {configured:false,journeys:[] as LabJourney[],library:[] as LabLibraryCard[],cards:[] as LabCard[],connections:[] as LabConnection[]};
  const [j,c,l,x]=await Promise.all([
    airtable(`${JOURNEYS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Order&sort%5B0%5D%5Bdirection%5D=asc`),
    airtable(`${CARDS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Sort%20Order&sort%5B0%5D%5Bdirection%5D=asc`),
    airtable(`${LIBRARY_TABLE}?pageSize=100`),
    airtable(`${CONNECTIONS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Order&sort%5B0%5D%5Bdirection%5D=asc`)
  ]);
  const journeys:LabJourney[]=j.records.map((r:any)=>({
    id:r.id,name:val(r,JF.name,"Untitled journey"),description:val(r,JF.description),order:Number(val(r,JF.order,0)),active:val(r,JF.active,true)!==false
  }));
  const library:LabLibraryCard[]=l.records.map((r:any)=>({
    id:r.id,name:val(r,LF.name,"Untitled card"),category:val(r,LF.category,"Action"),tool:val(r,LF.tool,"None"),
    use:val(r,LF.use),action:val(r,LF.action),automated:val(r,LF.automated,"No"),automationTool:val(r,LF.automationTool,"None"),
    assignedPerson:val(r,LF.assignedPerson),campaignName:val(r,LF.campaignName),subject:val(r,LF.subject),templateName:val(r,LF.templateName),
    messagePurpose:val(r,LF.messagePurpose),timing:val(r,LF.timing),leadStatus:val(r,LF.leadStatus,"Not Applicable"),
    workshopStatus:val(r,LF.workshopStatus,"Draft"),notes:val(r,LF.notes),active:val(r,LF.active,true)!==false,
    suggestedNextIds:links(val(r,LF.suggestedNext,[])),suggestedParentIds:links(val(r,LF.suggestedParent,[])),
    applicableJourneyIds:links(val(r,LF.applicableJourneys,[]))
  }));
  const cards:LabCard[]=c.records.map((r:any)=>({
    id:r.id,title:val(r,CF.title,"Untitled card"),notes:val(r,CF.notes),order:Number(val(r,CF.order,0)),
    x:Number(val(r,CF.x,100)),y:Number(val(r,CF.y,100)),journeyIds:links(val(r,CF.journey,[])),
    libraryId:links(val(r,CF.library,[]))[0]||""
  }));
  const connections:LabConnection[]=x.records.map((r:any)=>({
    id:r.id,name:val(r,XF.name,"Connection"),fromId:links(val(r,XF.from,[]))[0]||"",toId:links(val(r,XF.to,[]))[0]||"",
    journeyIds:links(val(r,XF.journey,[])),label:val(r,XF.label),order:Number(val(r,XF.order,0)),active:val(r,XF.active,true)!==false
  }));
  return {configured:true,journeys,library,cards,connections};
}

export async function createJourney(input:any){
  const fields:any={
    [JF.name]:String(input.name||"New Journey").trim()||"New Journey",
    [JF.description]:input.description||"",
    [JF.order]:Number(input.order||Date.now()),
    [JF.active]:true,
  };
  return airtable(JOURNEYS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
export async function updateJourney(id:string,input:any){
  const fields:any={};
  if(input.name!==undefined)fields[JF.name]=input.name;
  if(input.description!==undefined)fields[JF.description]=input.description;
  if(input.order!==undefined)fields[JF.order]=Number(input.order);
  if(input.active!==undefined)fields[JF.active]=Boolean(input.active);
  return airtable(JOURNEYS_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}

function libraryFields(input:any){
  const fields:any={};
  const map:any={
    name:LF.name,category:LF.category,tool:LF.tool,use:LF.use,action:LF.action,automated:LF.automated,
    automationTool:LF.automationTool,assignedPerson:LF.assignedPerson,campaignName:LF.campaignName,subject:LF.subject,
    templateName:LF.templateName,messagePurpose:LF.messagePurpose,timing:LF.timing,leadStatus:LF.leadStatus,
    workshopStatus:LF.workshopStatus,notes:LF.notes,active:LF.active,
    suggestedNextIds:LF.suggestedNext,suggestedParentIds:LF.suggestedParent,applicableJourneyIds:LF.applicableJourneys
  };
  for(const [key,id] of Object.entries(map)){
    if(input[key]===undefined)continue;
    const value=input[key];
    fields[id as string]=(key.endsWith("Ids")&&Array.isArray(value))?value:value;
  }
  return fields;
}
export async function createLibraryCard(input:any){
  const fields=libraryFields({...input,active:input.active??true});
  if(!fields[LF.name])fields[LF.name]="New Card";
  return airtable(LIBRARY_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
export async function updateLibraryCard(id:string,input:any){
  return airtable(LIBRARY_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields:libraryFields(input)}],typecast:true})});
}

export async function createJourneyCard(input:any){
  const fields:any={
    [CF.title]:String(input.title||"New Card").trim()||"New Card",
    [CF.notes]:input.notes||"",
    [CF.order]:Number(input.order||Date.now()),
    [CF.x]:Number(input.x??100),[CF.y]:Number(input.y??100),
    [CF.journey]:Array.isArray(input.journeyIds)?input.journeyIds:[],
    [CF.library]:input.libraryId?[input.libraryId]:[],
  };
  return airtable(CARDS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
export async function updateJourneyCard(id:string,input:any){
  const fields:any={};
  if(input.title!==undefined)fields[CF.title]=input.title;
  if(input.notes!==undefined)fields[CF.notes]=input.notes;
  if(input.order!==undefined)fields[CF.order]=Number(input.order);
  if(input.x!==undefined)fields[CF.x]=Number(input.x);
  if(input.y!==undefined)fields[CF.y]=Number(input.y);
  if(input.journeyIds!==undefined)fields[CF.journey]=input.journeyIds;
  if(input.libraryId!==undefined)fields[CF.library]=input.libraryId?[input.libraryId]:[];
  return airtable(CARDS_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}
export async function bulkMoveCards(items:any[]){
  const records=items.slice(0,50).map(item=>({id:String(item.id),fields:{[CF.x]:Number(item.x),[CF.y]:Number(item.y)}}));
  if(!records.length)return {records:[]};
  return airtable(CARDS_TABLE,{method:"PATCH",body:JSON.stringify({records,typecast:true})});
}
export async function deleteJourneyCard(id:string){return airtable(`${CARDS_TABLE}/${id}`,{method:"DELETE"});}

export async function createConnection(input:any){
  const fields:any={
    [XF.name]:input.name||"Connection",
    [XF.from]:input.fromId?[input.fromId]:[],
    [XF.to]:input.toId?[input.toId]:[],
    [XF.journey]:Array.isArray(input.journeyIds)?input.journeyIds:[],
    [XF.label]:input.label||"",
    [XF.order]:Number(input.order||Date.now()),
    [XF.active]:true,
  };
  return airtable(CONNECTIONS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
export async function updateConnection(id:string,input:any){
  const fields:any={};
  if(input.name!==undefined)fields[XF.name]=input.name;
  if(input.fromId!==undefined)fields[XF.from]=input.fromId?[input.fromId]:[];
  if(input.toId!==undefined)fields[XF.to]=input.toId?[input.toId]:[];
  if(input.journeyIds!==undefined)fields[XF.journey]=input.journeyIds;
  if(input.label!==undefined)fields[XF.label]=input.label;
  if(input.order!==undefined)fields[XF.order]=Number(input.order);
  if(input.active!==undefined)fields[XF.active]=Boolean(input.active);
  return airtable(CONNECTIONS_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}
export async function deleteConnection(id:string){return airtable(`${CONNECTIONS_TABLE}/${id}`,{method:"DELETE"});}
