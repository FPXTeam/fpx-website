// @ts-nocheck
const BASE_ID="app46QGfgQet1CPIu";
const JOURNEYS_TABLE="tbl8GQR6NDrgqjtF2";
const CARDS_TABLE="tblCvEEGIiT0AL3R1";
const LIBRARY_TABLE="tblRQEzsSkgvc4Fra";
const CONNECTIONS_TABLE="tblzBBKa4YFA3QoHh";
const SNAPSHOTS_TABLE="tblKeb91K0Hx4FUjs";
const CHANGE_LOG_TABLE="tblt6YPVAye7Ji2HB";

const JF={
  name:"fldR1mvKg5WmaHtxl",description:"fldAYmPtMLBa2ngkD",order:"fldqQz8GHBBjgntY4",
  active:"fld0vfdZCB4Eox35r",group:"fldi5SapPGOcYaMLR",archived:"fldbpdvPFJm8fST39",template:"fldWhznnQsmF5otee"
} as const;
const CF={
  title:"fldTZw5ZxJwTLSUsZ",notes:"fldyoNMq2nfoRtYpj",comments:"fldN01OoPVu6wLB2O",
  order:"fldUbg7Zc8a8rL2W8",x:"fldHOK01a4GClLdDy",y:"fldd51zLuP0kpLM81",
  journey:"fld7D6MCcepbVccze",library:"fldNKY9rbfF0ksfJT"
} as const;
const LF={
  name:"fldsIQpP0q8B0ovAc",category:"fldk8rrrD2GBU8MiC",tool:"fldk8HqwHGVix9W8N",
  use:"fldjJma8AnOWORKJ4",action:"fld6tGJOJq6bACvc0",automated:"fldNXm2lkBUm4637T",
  automationTool:"fldtj3DqwwQzdSaZt",assignedPerson:"fldekExx7LZuhfnoQ",campaignName:"fldbGbTqoGkNvZTzN",
  subject:"fldHHAvFN2lpvRt7K",templateName:"fld0Py25FHr00nQWH",messagePurpose:"fld7i7fhPftgjQXnJ",
  timing:"fldB1f036jAgXMt5c",leadStatus:"fldNWEf7sSt4ChpIi",workshopStatus:"fld134QjRkl0fF6iQ",
  notes:"flduBE9ecTbGhwxYJ",active:"fldVkdrb1OjCC16VH",global:"fldxsxqYkRpa9NhTo",
  suggestedNext:"fldObxiWfVZnqtj0F",suggestedParent:"fld2u1vmpFdO87LVD",applicableJourneys:"fldyuRZmv4uDz2MxI"
} as const;
const XF={
  name:"fldT88PLhxFPLYwuM",from:"fld8tQx20OGXVsbKb",to:"flddUhwF3te7HbuJv",
  journey:"fldvgjq2BEcPzWrr8",label:"fldrvSdOTRBb1f6yi",order:"fldlk5mXijEwEqYc9",active:"fldaINUQmCwevzvdZ"
} as const;
const SF={name:"fldSdlemWaw8XgzZ5",journey:"fldcRZ4N9cgMcqLQO",createdAt:"fldL3PiCzd4fWSOLJ",createdBy:"fldLUsfY4316Fai8v",json:"fld6VvuOdiyRtCwRr"} as const;
const GF={event:"fldciLs2nCvg36DaW",action:"fldgEDhvqhYxrdOC9",itemType:"fldBARvD5dnrsvMN3",itemName:"fldiuhJaaKoMdKsYm",journey:"fldYTs9jFFvzZ6O6c",changedAt:"fldQlsRbRRYYgqFKb",changedBy:"fld6KEtFxjEPIZxgs",details:"fldM4aOFt1fIoNtYa"} as const;

function token(){return process.env.AIRTABLE_TOKEN?.trim()||process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN?.trim()||""}
function headers(){const value=token();if(!value)throw new Error("AIRTABLE_TOKEN is not configured.");return {Authorization:`Bearer ${value}`,"Content-Type":"application/json"}}
async function airtable(path:string,init?:RequestInit){
  const method=(init?.method||"GET").toUpperCase();
  const requestPath=method==="GET"?`${path}${path.includes("?")?"&":"?"}returnFieldsByFieldId=true`:path;
  const response=await fetch(`https://api.airtable.com/v0/${BASE_ID}/${requestPath}`,{...init,headers:{...headers(),...(init?.headers||{})},cache:"no-store"});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data?.error?.message||data?.error?.type||"Airtable request failed.");
  return data;
}
async function airtableAll(path:string){
  const records:any[]=[];
  let offset="";
  do{
    const join=path.includes("?")?"&":"?";
    const page=await airtable(offset?`${path}${join}offset=${encodeURIComponent(offset)}`:path);
    records.push(...(page.records||[]));
    offset=page.offset||"";
  }while(offset);
  return {records};
}
function links(value:any){return Array.isArray(value)?value.map((v:any)=>typeof v==="string"?v:v?.id).filter(Boolean):[]}
function selectName(value:any,fallback=""){return typeof value==="string"?value:(value?.name||fallback)}
function val(record:any,id:string,fallback:any=""){return record?.fields?.[id]??fallback}
function now(){return new Date().toISOString()}

export type LabJourney={id:string;name:string;description:string;order:number;active:boolean;group:string;archived:boolean;template:boolean};
export type LabLibraryCard={
  id:string;name:string;category:string;tool:string;use:string;action:string;automated:string;automationTool:string;
  assignedPerson:string;campaignName:string;subject:string;templateName:string;messagePurpose:string;timing:string;
  leadStatus:string;workshopStatus:string;notes:string;active:boolean;global:boolean;
  suggestedNextIds:string[];suggestedParentIds:string[];applicableJourneyIds:string[];
};
export type LabCard={id:string;title:string;notes:string;comments:string;order:number;x:number;y:number;journeyIds:string[];libraryId:string};
export type LabConnection={id:string;name:string;fromId:string;toId:string;journeyIds:string[];label:string;order:number;active:boolean};

export async function getJourneyLabData(){
  if(!token())return {configured:false,journeys:[],library:[],cards:[],connections:[]};
  const [j,c,l,x]=await Promise.all([
    airtableAll(`${JOURNEYS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Order&sort%5B0%5D%5Bdirection%5D=asc`),
    airtableAll(`${CARDS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Sort%20Order&sort%5B0%5D%5Bdirection%5D=asc`),
    airtableAll(`${LIBRARY_TABLE}?pageSize=100`),
    airtableAll(`${CONNECTIONS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Order&sort%5B0%5D%5Bdirection%5D=asc`)
  ]);
  const journeys:LabJourney[]=j.records.map((r:any)=>({
    id:r.id,name:val(r,JF.name,"Untitled journey"),description:val(r,JF.description),order:Number(val(r,JF.order,0)),
    active:val(r,JF.active,true)!==false,group:selectName(val(r,JF.group),"Other")||"Other",
    archived:Boolean(val(r,JF.archived,false)),template:Boolean(val(r,JF.template,false))
  }));
  const library:LabLibraryCard[]=l.records.map((r:any)=>({
    id:r.id,name:val(r,LF.name,"Untitled card"),category:selectName(val(r,LF.category),"Action"),tool:selectName(val(r,LF.tool),"None"),
    use:val(r,LF.use),action:val(r,LF.action),automated:selectName(val(r,LF.automated),"No"),automationTool:selectName(val(r,LF.automationTool),"None"),
    assignedPerson:val(r,LF.assignedPerson),campaignName:val(r,LF.campaignName),subject:val(r,LF.subject),templateName:val(r,LF.templateName),
    messagePurpose:val(r,LF.messagePurpose),timing:val(r,LF.timing),leadStatus:selectName(val(r,LF.leadStatus),"Not Applicable"),
    workshopStatus:selectName(val(r,LF.workshopStatus),"Draft"),notes:val(r,LF.notes),active:val(r,LF.active,true)!==false,
    global:Boolean(val(r,LF.global,false)),suggestedNextIds:links(val(r,LF.suggestedNext,[])),suggestedParentIds:links(val(r,LF.suggestedParent,[])),
    applicableJourneyIds:links(val(r,LF.applicableJourneys,[]))
  }));
  const cards:LabCard[]=c.records.map((r:any)=>({
    id:r.id,title:val(r,CF.title,"Untitled card"),notes:val(r,CF.notes),comments:val(r,CF.comments),
    order:Number(val(r,CF.order,0)),x:Number(val(r,CF.x,100)),y:Number(val(r,CF.y,100)),
    journeyIds:links(val(r,CF.journey,[])),libraryId:links(val(r,CF.library,[]))[0]||""
  }));
  const connections:LabConnection[]=x.records.map((r:any)=>({
    id:r.id,name:val(r,XF.name,"Connection"),fromId:links(val(r,XF.from,[]))[0]||"",toId:links(val(r,XF.to,[]))[0]||"",
    journeyIds:links(val(r,XF.journey,[])),label:val(r,XF.label),order:Number(val(r,XF.order,0)),active:val(r,XF.active,true)!==false
  }));
  return {configured:true,journeys,library,cards,connections};
}

export async function createJourney(input:any){
  const fields:any={
    [JF.name]:String(input.name||"New Journey").trim()||"New Journey",[JF.description]:input.description||"",
    [JF.order]:Number(input.order||Date.now()),[JF.active]:true,[JF.group]:input.group||"Other",
    [JF.archived]:false,[JF.template]:Boolean(input.template)
  };
  return airtable(JOURNEYS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
export async function updateJourney(id:string,input:any){
  const fields:any={};
  if(input.name!==undefined)fields[JF.name]=input.name;
  if(input.description!==undefined)fields[JF.description]=input.description;
  if(input.order!==undefined)fields[JF.order]=Number(input.order);
  if(input.active!==undefined)fields[JF.active]=Boolean(input.active);
  if(input.group!==undefined)fields[JF.group]=input.group;
  if(input.archived!==undefined)fields[JF.archived]=Boolean(input.archived);
  if(input.template!==undefined)fields[JF.template]=Boolean(input.template);
  return airtable(JOURNEYS_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}
export async function deleteJourney(id:string){
  const data=await getJourneyLabData();
  for(const connection of data.connections.filter((c:any)=>c.journeyIds.includes(id))){
    const remaining=connection.journeyIds.filter((journeyId:string)=>journeyId!==id);
    if(remaining.length)await updateConnection(connection.id,{journeyIds:remaining});else await deleteConnection(connection.id);
  }
  for(const card of data.cards.filter((c:any)=>c.journeyIds.includes(id))){
    const remaining=card.journeyIds.filter((journeyId:string)=>journeyId!==id);
    if(remaining.length)await updateJourneyCard(card.id,{journeyIds:remaining});else await deleteJourneyCard(card.id);
  }
  for(const definition of data.library.filter((card:any)=>card.applicableJourneyIds.includes(id))){
    await updateLibraryCard(definition.id,{applicableJourneyIds:definition.applicableJourneyIds.filter((journeyId:string)=>journeyId!==id)});
  }
  return airtable(`${JOURNEYS_TABLE}/${id}`,{method:"DELETE"});
}

function libraryFields(input:any){
  const fields:any={};const map:any={
    name:LF.name,category:LF.category,tool:LF.tool,use:LF.use,action:LF.action,automated:LF.automated,
    automationTool:LF.automationTool,assignedPerson:LF.assignedPerson,campaignName:LF.campaignName,subject:LF.subject,
    templateName:LF.templateName,messagePurpose:LF.messagePurpose,timing:LF.timing,leadStatus:LF.leadStatus,
    workshopStatus:LF.workshopStatus,notes:LF.notes,active:LF.active,global:LF.global,
    suggestedNextIds:LF.suggestedNext,suggestedParentIds:LF.suggestedParent,applicableJourneyIds:LF.applicableJourneys
  };
  for(const [key,id] of Object.entries(map))if(input[key]!==undefined)fields[id as string]=input[key];
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
export async function syncGlobalCard(libraryId:string){
  const data=await getJourneyLabData();
  const definition=data.library.find((d:any)=>d.id===libraryId);
  if(!definition)return;
  const allJourneyIds=data.journeys.filter((j:any)=>j.active&&!j.archived&&!j.template).map((j:any)=>j.id);
  if(definition.global){
    await updateLibraryCard(libraryId,{applicableJourneyIds:allJourneyIds});
    for(const card of data.cards.filter((c:any)=>c.libraryId===libraryId)){
      await updateJourneyCard(card.id,{journeyIds:allJourneyIds});
    }
  }
}
export async function applyGlobalCardsToJourney(journeyId:string){
  const data=await getJourneyLabData();
  for(const definition of data.library.filter((d:any)=>d.global)){
    const applicable=Array.from(new Set([...definition.applicableJourneyIds,journeyId]));
    await updateLibraryCard(definition.id,{applicableJourneyIds:applicable});
    for(const card of data.cards.filter((c:any)=>c.libraryId===definition.id)){
      await updateJourneyCard(card.id,{journeyIds:Array.from(new Set([...card.journeyIds,journeyId]))});
    }
  }
}

export async function createJourneyCard(input:any){
  const fields:any={
    [CF.title]:String(input.title||"New Card").trim()||"New Card",
    [CF.notes]:input.notes||"",
    [CF.comments]:input.comments||"",
    [CF.order]:Number(input.order||Date.now()),
    [CF.x]:Number(input.x??100),
    [CF.y]:Number(input.y??100),
    [CF.journey]:Array.isArray(input.journeyIds)?input.journeyIds:[],
    [CF.library]:input.libraryId?[input.libraryId]:[]
  };
  return airtable(CARDS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
export async function updateJourneyCard(id:string,input:any){
  const fields:any={};
  if(input.title!==undefined)fields[CF.title]=input.title;
  if(input.notes!==undefined)fields[CF.notes]=input.notes;
  if(input.comments!==undefined)fields[CF.comments]=input.comments;
  if(input.order!==undefined)fields[CF.order]=Number(input.order);
  if(input.x!==undefined)fields[CF.x]=Number(input.x);
  if(input.y!==undefined)fields[CF.y]=Number(input.y);
  if(input.journeyIds!==undefined)fields[CF.journey]=input.journeyIds;
  if(input.libraryId!==undefined)fields[CF.library]=input.libraryId?[input.libraryId]:[];
  return airtable(CARDS_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}
export async function bulkMoveCards(items:any[]){
  const records=items.map(item=>({id:String(item.id),fields:{[CF.x]:Number(item.x),[CF.y]:Number(item.y)}}));
  if(!records.length)return {records:[]};
  const updated:any[]=[];
  for(let i=0;i<records.length;i+=10){
    const batch=records.slice(i,i+10);
    const result=await airtable(CARDS_TABLE,{method:"PATCH",body:JSON.stringify({records:batch,typecast:true})});
    updated.push(...(result.records||[]));
  }
  return {records:updated};
}
export async function bulkAssignCards(ids:string[],journeyId:string){
  const data=await getJourneyLabData();
  for(const card of data.cards.filter((c:any)=>ids.includes(c.id))){
    await updateJourneyCard(card.id,{journeyIds:Array.from(new Set([...card.journeyIds,journeyId]))});
  }
}
export async function bulkDeleteCards(ids:string[]){
  const data=await getJourneyLabData();
  for(const connection of data.connections.filter((c:any)=>ids.includes(c.fromId)||ids.includes(c.toId)))await deleteConnection(connection.id);
  for(const id of ids)await deleteJourneyCard(id);
}
export async function deleteJourneyCard(id:string){return airtable(`${CARDS_TABLE}/${id}`,{method:"DELETE"});}

export async function createConnection(input:any){
  const fields:any={
    [XF.name]:input.name||"Connection",[XF.from]:input.fromId?[input.fromId]:[],[XF.to]:input.toId?[input.toId]:[],
    [XF.journey]:Array.isArray(input.journeyIds)?input.journeyIds:[],[XF.label]:input.label||"",
    [XF.order]:Number(input.order||Date.now()),[XF.active]:true
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

export async function mergeIntoExistingJourney(sourceCardId:string,targetCardId:string,currentJourneyId:string,targetJourneyId:string){
  const data=await getJourneyLabData();
  const target=data.cards.find((c:any)=>c.id===targetCardId);
  const source=data.cards.find((c:any)=>c.id===sourceCardId);
  if(!target||!source)throw new Error("Unable to find merge cards.");
  await updateJourneyCard(target.id,{journeyIds:Array.from(new Set([...target.journeyIds,currentJourneyId,targetJourneyId]))});
  await createConnection({name:`${source.title} → ${target.title}`,fromId:source.id,toId:target.id,journeyIds:[currentJourneyId],label:"Merge"});
}

export async function duplicateJourney(sourceId:string,name?:string,group?:string){
  const data=await getJourneyLabData();
  const source=data.journeys.find((j:any)=>j.id===sourceId);
  if(!source)throw new Error("Journey not found.");
  const created=await createJourney({name:name||`${source.name} Copy`,description:source.description,group:group||source.group,template:false});
  const newJourneyId=created.records?.[0]?.id;
  if(!newJourneyId)throw new Error("Unable to create duplicate journey.");
  const sourceCards=data.cards.filter((c:any)=>c.journeyIds.includes(sourceId));
  const map=new Map<string,string>();
  for(const card of sourceCards){
    const def=data.library.find((d:any)=>d.id===card.libraryId);
    if(def?.global){
      await updateJourneyCard(card.id,{journeyIds:Array.from(new Set([...card.journeyIds,newJourneyId]))});
      map.set(card.id,card.id);
      continue;
    }
    const made=await createJourneyCard({...card,journeyIds:[newJourneyId],order:card.order,comments:card.comments});
    const id=made.records?.[0]?.id;
    if(id)map.set(card.id,id);
    if(def&&!def.applicableJourneyIds.includes(newJourneyId)){
      await updateLibraryCard(def.id,{applicableJourneyIds:[...def.applicableJourneyIds,newJourneyId]});
    }
  }
  for(const connection of data.connections.filter((c:any)=>c.journeyIds.includes(sourceId))){
    const fromId=map.get(connection.fromId),toId=map.get(connection.toId);
    if(!fromId||!toId)continue;
    await createConnection({...connection,fromId,toId,journeyIds:[newJourneyId]});
  }
  await applyGlobalCardsToJourney(newJourneyId);
  return newJourneyId;
}

export async function listSnapshots(){
  const d=await airtable(`${SNAPSHOTS_TABLE}?pageSize=50&sort%5B0%5D%5Bfield%5D=Created%20At&sort%5B0%5D%5Bdirection%5D=desc`);
  return d.records.map((r:any)=>({
    id:r.id,name:val(r,SF.name,"Snapshot"),journeyIds:links(val(r,SF.journey,[])),
    createdAt:val(r,SF.createdAt),createdBy:val(r,SF.createdBy),json:val(r,SF.json,"")
  }));
}
export async function createSnapshot(input:any){
  const fields:any={
    [SF.name]:input.name||`Snapshot ${now()}`,
    [SF.journey]:input.journeyId?[input.journeyId]:[],
    [SF.createdAt]:now(),
    [SF.createdBy]:input.createdBy||"Shared user",
    [SF.json]:JSON.stringify(input.snapshot||{})
  };
  return airtable(SNAPSHOTS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
export async function deleteSnapshot(id:string){return airtable(`${SNAPSHOTS_TABLE}/${id}`,{method:"DELETE"});}
export async function restoreSnapshotLayout(id:string){
  const snapshots=await listSnapshots();
  const snapshot=snapshots.find((s:any)=>s.id===id);
  if(!snapshot)throw new Error("Snapshot not found.");
  const data=JSON.parse(snapshot.json||"{}");
  const current=await getJourneyLabData();
  const currentIds=new Set(current.cards.map((c:any)=>c.id));
  const moves=(data.cards||[]).filter((c:any)=>currentIds.has(c.id)).map((c:any)=>({id:c.id,x:c.x,y:c.y}));
  if(moves.length)await bulkMoveCards(moves);
  return snapshot;
}

export async function listChangeLog(){
  const d=await airtable(`${CHANGE_LOG_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Changed%20At&sort%5B0%5D%5Bdirection%5D=desc`);
  return d.records.map((r:any)=>({
    id:r.id,event:val(r,GF.event),action:val(r,GF.action),itemType:val(r,GF.itemType),
    itemName:val(r,GF.itemName),journeyIds:links(val(r,GF.journey,[])),changedAt:val(r,GF.changedAt),
    changedBy:val(r,GF.changedBy),details:val(r,GF.details)
  }));
}
export async function logChange(input:any){
  const fields:any={
    [GF.event]:input.event||`${input.action||"Changed"} ${input.itemType||"item"}`,
    [GF.action]:input.action||"Changed",[GF.itemType]:input.itemType||"Item",[GF.itemName]:input.itemName||"",
    [GF.journey]:input.journeyIds||[],[GF.changedAt]:now(),[GF.changedBy]:input.changedBy||"Shared user",[GF.details]:input.details||""
  };
  return airtable(CHANGE_LOG_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}
