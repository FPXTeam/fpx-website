// @ts-nocheck
const BASE_ID="app46QGfgQet1CPIu";
const JOURNEYS_TABLE="tbl8GQR6NDrgqjtF2";
const CARDS_TABLE="tblCvEEGIiT0AL3R1";
const LIBRARY_TABLE="tblRQEzsSkgvc4Fra";
const CONNECTIONS_TABLE="tblzBBKa4YFA3QoHh";
const SNAPSHOTS_TABLE="tblKeb91K0Hx4FUjs";
const CHANGE_LOG_TABLE="tblt6YPVAye7Ji2HB";
const PRESENCE_TABLE="tblxisRPy6D7ovq16";
const VERSIONS_TABLE="tblFEIR5UCWzLbBxq";

const JF={
  name:"fldR1mvKg5WmaHtxl",description:"fldAYmPtMLBa2ngkD",order:"fldqQz8GHBBjgntY4",
  active:"fld0vfdZCB4Eox35r",group:"fldi5SapPGOcYaMLR",archived:"fldbpdvPFJm8fST39",template:"fldWhznnQsmF5otee"
} as const;
const CF={
  title:"fldTZw5ZxJwTLSUsZ",notes:"fldyoNMq2nfoRtYpj",comments:"fldN01OoPVu6wLB2O",
  order:"fldUbg7Zc8a8rL2W8",x:"fldHOK01a4GClLdDy",y:"fldd51zLuP0kpLM81",
  journey:"fld7D6MCcepbVccze",library:"fldNKY9rbfF0ksfJT",
  sequenceId:"fldaEGh2HyVhrP4PM",sequenceName:"fldIZIdOYNPSEGvNT",sequenceStep:"fldRMAzyfFwzkGdBT"
} as const;
const LF={
  name:"fldsIQpP0q8B0ovAc",category:"fldk8rrrD2GBU8MiC",tool:"fldk8HqwHGVix9W8N",
  use:"fldjJma8AnOWORKJ4",action:"fld6tGJOJq6bACvc0",automated:"fldNXm2lkBUm4637T",
  automationTool:"fldtj3DqwwQzdSaZt",execution:"fldoUMvXmzWh9k4Mj",assignedPerson:"fldekExx7LZuhfnoQ",campaignName:"fldbGbTqoGkNvZTzN",
  subject:"fldHHAvFN2lpvRt7K",templateName:"fld0Py25FHr00nQWH",messagePurpose:"fld7i7fhPftgjQXnJ",
  timing:"fldB1f036jAgXMt5c",leadStatus:"fldNWEf7sSt4ChpIi",workshopStatus:"fld134QjRkl0fF6iQ",
  workshopAnswer:"fld8Eto4esvZ0y8Vw",notes:"flduBE9ecTbGhwxYJ",active:"fldVkdrb1OjCC16VH",global:"fldxsxqYkRpa9NhTo",journeyLocal:"fldPaa9HLd065kLHu",
  suggestedNext:"fldObxiWfVZnqtj0F",suggestedParent:"fld2u1vmpFdO87LVD",applicableJourneys:"fldyuRZmv4uDz2MxI"
} as const;
const XF={
  name:"fldT88PLhxFPLYwuM",from:"fld8tQx20OGXVsbKb",to:"flddUhwF3te7HbuJv",
  journey:"fldvgjq2BEcPzWrr8",label:"fldrvSdOTRBb1f6yi",order:"fldlk5mXijEwEqYc9",active:"fldaINUQmCwevzvdZ"
} as const;
const SF={name:"fldSdlemWaw8XgzZ5",journey:"fldcRZ4N9cgMcqLQO",createdAt:"fldL3PiCzd4fWSOLJ",createdBy:"fldLUsfY4316Fai8v",json:"fld6VvuOdiyRtCwRr"} as const;
const GF={event:"fldciLs2nCvg36DaW",action:"fldgEDhvqhYxrdOC9",itemType:"fldBARvD5dnrsvMN3",itemName:"fldiuhJaaKoMdKsYm",journey:"fldYTs9jFFvzZ6O6c",changedAt:"fldQlsRbRRYYgqFKb",changedBy:"fld6KEtFxjEPIZxgs",details:"fldM4aOFt1fIoNtYa"} as const;
const PF={person:"fldrf6abISjrfJMfg",journey:"fldnXC2VwZnYD43wD",view:"fldnTZDsrGC6Yujcc",focus:"fldMQhiBofsYyrz5B",mode:"fld0478yhVusa500h",card:"fld2PBtOpvyKzsvzv",lastSeen:"fldjYuGolbyCsWs3q",session:"fldr00MCCNh9pIO72"} as const;
const VF={label:"fldvfYLJHumrDdbOQ",journey:"fldtdtfmhbKT122dR",number:"fldlaHTTCSvezapFW",createdAt:"fldqNRajyIh2S2GkJ",createdBy:"fld4UtNQUOPydXMGb",reason:"fldYLxWjHPfHtzssw",base:"fld2xFkmYX8yTpFjL",summary:"fld2WA8jt5cobtXXX",source:"fldHpk6Gqst6PJOCH"} as const;

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
  id:string;name:string;category:string;tool:string;use:string;action:string;automated:string;automationTool:string;execution:string;
  assignedPerson:string;campaignName:string;subject:string;templateName:string;messagePurpose:string;timing:string;
  leadStatus:string;workshopStatus:string;workshopAnswer:string;notes:string;active:boolean;global:boolean;journeyLocal:boolean;
  suggestedNextIds:string[];suggestedParentIds:string[];applicableJourneyIds:string[];
};
export type LabCard={id:string;title:string;notes:string;comments:string;order:number;x:number;y:number;journeyIds:string[];libraryId:string;sequenceId:string;sequenceName:string;sequenceStep:number};
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
    execution:selectName(val(r,LF.execution),"Manual"),assignedPerson:val(r,LF.assignedPerson),campaignName:val(r,LF.campaignName),subject:val(r,LF.subject),templateName:val(r,LF.templateName),
    messagePurpose:val(r,LF.messagePurpose),timing:val(r,LF.timing),leadStatus:selectName(val(r,LF.leadStatus),"Not Applicable"),
    workshopStatus:selectName(val(r,LF.workshopStatus),"Draft"),workshopAnswer:val(r,LF.workshopAnswer),notes:val(r,LF.notes),active:val(r,LF.active,true)!==false,
    global:Boolean(val(r,LF.global,false)),journeyLocal:Boolean(val(r,LF.journeyLocal,false)),suggestedNextIds:links(val(r,LF.suggestedNext,[])),suggestedParentIds:links(val(r,LF.suggestedParent,[])),
    applicableJourneyIds:links(val(r,LF.applicableJourneys,[]))
  }));
  const cards:LabCard[]=c.records.map((r:any)=>({
    id:r.id,title:val(r,CF.title,"Untitled card"),notes:val(r,CF.notes),comments:val(r,CF.comments),
    order:Number(val(r,CF.order,0)),x:Number(val(r,CF.x,100)),y:Number(val(r,CF.y,100)),
    journeyIds:links(val(r,CF.journey,[])),libraryId:links(val(r,CF.library,[]))[0]||"",
    sequenceId:val(r,CF.sequenceId),sequenceName:val(r,CF.sequenceName),sequenceStep:Number(val(r,CF.sequenceStep,0))
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
    automationTool:LF.automationTool,execution:LF.execution,assignedPerson:LF.assignedPerson,campaignName:LF.campaignName,subject:LF.subject,
    templateName:LF.templateName,messagePurpose:LF.messagePurpose,timing:LF.timing,leadStatus:LF.leadStatus,
    workshopStatus:LF.workshopStatus,workshopAnswer:LF.workshopAnswer,notes:LF.notes,active:LF.active,global:LF.global,journeyLocal:LF.journeyLocal,
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
    [CF.library]:input.libraryId?[input.libraryId]:[],
    [CF.sequenceId]:input.sequenceId||"",
    [CF.sequenceName]:input.sequenceName||"",
    [CF.sequenceStep]:Number(input.sequenceStep||0)
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
  if(input.sequenceId!==undefined)fields[CF.sequenceId]=input.sequenceId||"";
  if(input.sequenceName!==undefined)fields[CF.sequenceName]=input.sequenceName||"";
  if(input.sequenceStep!==undefined)fields[CF.sequenceStep]=Number(input.sequenceStep||0);
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


const JOURNEY_SOURCE_SCHEMA="fpx-journey-v1";
const SOURCE_CATEGORIES=["Source","Capture","Communication","CRM","Decision","Nurture","Wait","Action","Outcome","Customer Handoff"];
const SOURCE_EXECUTION=["Automated","Can be automated","Manual"];
const SOURCE_WORKSHOP=["Draft","Needs Discussion","Agreed"];
const SOURCE_TOP_KEYS=new Set(["schema","journey","cards","connections","removeCards","removeConnections"]);
const SOURCE_JOURNEY_KEYS=new Set(["id","name"]);
const SOURCE_CARD_KEYS=new Set(["id","title","type","execution","owner","tool","use","action","timing","leadStatus","workshopStatus","workshopAnswer","notes","sequence"]);
const SOURCE_SEQUENCE_KEYS=new Set(["id","name","step"]);
const SOURCE_CONNECTION_KEYS=new Set(["id","from","to","label"]);

function sourceHash(value:any){
  const normalized=JSON.stringify({
    ...value,
    cards:[...(value?.cards||[])].sort((a:any,b:any)=>String(a.id).localeCompare(String(b.id))),
    connections:[...(value?.connections||[])].sort((a:any,b:any)=>String(a.id).localeCompare(String(b.id))),
    removeCards:[...(value?.removeCards||[])].sort(),
    removeConnections:[...(value?.removeConnections||[])].sort()
  });
  let h=2166136261;
  for(let i=0;i<normalized.length;i++){h^=normalized.charCodeAt(i);h=Math.imul(h,16777619)}
  return "fpx-"+(h>>>0).toString(16).padStart(8,"0");
}
function onlyKeys(obj:any,allowed:Set<string>,label:string){
  if(!obj||typeof obj!=="object"||Array.isArray(obj))throw new Error(label+" must be an object.");
  const extras=Object.keys(obj).filter(k=>!allowed.has(k));
  if(extras.length)throw new Error(label+" contains unsupported field(s): "+extras.join(", ")+".");
}
function plain(value:any,max=4000){return typeof value==="string"?value.slice(0,max):""}
function makeLocalLibraryFromSource(card:any,journeyId:string,current?:any){
  const existing=current||{};
  let execution=SOURCE_EXECUTION.includes(card.execution)?card.execution:(existing.execution||"Can be automated");
  if((!current||existing.execution!=="Automated")&&execution==="Automated")execution="Can be automated";
  let workshop=SOURCE_WORKSHOP.includes(card.workshopStatus)?card.workshopStatus:(existing.workshopStatus||"Draft");
  if((!current||existing.workshopStatus!=="Agreed")&&workshop==="Agreed")workshop=current?.workshopStatus||"Draft";
  return {
    name:plain(card.title,255)||"Untitled card",category:SOURCE_CATEGORIES.includes(card.type)?card.type:(existing.category||"Action"),
    tool:plain(card.tool,100)||existing.tool||"None",use:plain(card.use)||existing.use||"",action:plain(card.action,255)||existing.action||"",
    execution,automated:execution==="Automated"?"Yes":execution==="Can be automated"?"To Decide":"No",
    automationTool:"None",assignedPerson:plain(card.owner,255)||existing.assignedPerson||"",campaignName:existing.campaignName||"",
    subject:existing.subject||"",templateName:existing.templateName||"",messagePurpose:existing.messagePurpose||"",
    timing:plain(card.timing,255)||existing.timing||"",leadStatus:plain(card.leadStatus,100)||existing.leadStatus||"Not Applicable",
    workshopStatus:workshop,workshopAnswer:plain(card.workshopAnswer)||existing.workshopAnswer||"",notes:plain(card.notes)||existing.notes||"",
    active:true,global:false,journeyLocal:true,suggestedNextIds:[],suggestedParentIds:[],applicableJourneyIds:[journeyId]
  };
}
function sourceCardFromData(card:any,def:any){
  return {
    id:card.id,title:card.title,type:def?.category||"Action",execution:def?.execution||"Manual",
    owner:def?.assignedPerson||"",tool:def?.tool||"None",use:def?.use||"",action:def?.action||"",timing:def?.timing||"",
    leadStatus:def?.leadStatus||"Not Applicable",workshopStatus:def?.workshopStatus||"Draft",workshopAnswer:def?.workshopAnswer||"",
    notes:def?.notes||card.notes||"",
    ...(card.sequenceId?{sequence:{id:card.sequenceId,name:card.sequenceName||"Sequence",step:Number(card.sequenceStep||0)}}:{})
  };
}
export function buildJourneySource(data:any,journeyId:string){
  const journey=data.journeys.find((j:any)=>j.id===journeyId);
  if(!journey)throw new Error("Journey not found.");
  const cards=data.cards.filter((c:any)=>c.journeyIds.includes(journeyId)).sort((a:any,b:any)=>a.order-b.order);
  const ids=new Set(cards.map((c:any)=>c.id));
  const connections=data.connections.filter((c:any)=>c.active&&c.journeyIds.includes(journeyId)&&ids.has(c.fromId)&&ids.has(c.toId)).sort((a:any,b:any)=>a.order-b.order);
  const defs=new Map(data.library.map((d:any)=>[d.id,d]));
  return {
    schema:JOURNEY_SOURCE_SCHEMA,
    journey:{id:journey.id,name:journey.name},
    cards:cards.map((card:any)=>sourceCardFromData(card,defs.get(card.libraryId))),
    connections:connections.map((c:any)=>({id:c.id,from:c.fromId,to:c.toId,label:c.label||""})),
    removeCards:[],removeConnections:[]
  };
}
export function validateJourneySource(input:any,current:any,{replace=false}:any={}){
  onlyKeys(input,SOURCE_TOP_KEYS,"Journey Source");
  if(input.schema!==JOURNEY_SOURCE_SCHEMA)throw new Error('Journey Source schema must be "'+JOURNEY_SOURCE_SCHEMA+'".');
  if(!input.journey||typeof input.journey!=="object")throw new Error("Journey Source is missing journey metadata.");
  onlyKeys(input.journey,SOURCE_JOURNEY_KEYS,"Journey metadata");
  if(current?.journey?.id&&input.journey.id!==current.journey.id)throw new Error("This Journey Source belongs to a different FPX journey. Open the correct journey and copy it again.");
  if(!Array.isArray(input.cards)||!Array.isArray(input.connections))throw new Error("Journey Source must contain complete cards and connections arrays.");
  if(input.cards.length>350||input.connections.length>800)throw new Error("Journey Source is too large for a safe import.");
  const currentCards=new Map((current?.cards||[]).map((c:any)=>[c.id,c]));
  const cards=input.cards.map((raw:any,index:number)=>{
    onlyKeys(raw,SOURCE_CARD_KEYS,"Card "+(index+1));
    const id=plain(raw.id,100),title=plain(raw.title,255);
    if(!id||!title)throw new Error("Every card needs an id and title.");
    if(raw.sequence){onlyKeys(raw.sequence,SOURCE_SEQUENCE_KEYS,"Sequence on "+title)}
    const previous=currentCards.get(id);
    let execution=SOURCE_EXECUTION.includes(raw.execution)?raw.execution:"Can be automated";
    if((!previous||previous.execution!=="Automated")&&execution==="Automated")execution="Can be automated";
    let workshopStatus=SOURCE_WORKSHOP.includes(raw.workshopStatus)?raw.workshopStatus:"Draft";
    if((!previous||previous.workshopStatus!=="Agreed")&&workshopStatus==="Agreed")workshopStatus=previous?.workshopStatus||"Draft";
    return {...raw,id,title,type:SOURCE_CATEGORIES.includes(raw.type)?raw.type:"Action",execution,workshopStatus};
  });
  const cardIds=new Set<string>();
  for(const card of cards){if(cardIds.has(card.id))throw new Error("Duplicate card id: "+card.id);cardIds.add(card.id)}
  const connections=input.connections.map((raw:any,index:number)=>{
    onlyKeys(raw,SOURCE_CONNECTION_KEYS,"Connection "+(index+1));
    const id=plain(raw.id,100),from=plain(raw.from,100),to=plain(raw.to,100);
    if(!id||!from||!to)throw new Error("Every connection needs id, from and to.");
    if(!cardIds.has(from)||!cardIds.has(to))throw new Error("Connection "+id+" points to a card missing from the complete Journey Source.");
    return {...raw,id,from,to,label:plain(raw.label,255)};
  });
  const removeCards=Array.isArray(input.removeCards)?input.removeCards.map((x:any)=>plain(x,100)).filter(Boolean):[];
  const removeConnections=Array.isArray(input.removeConnections)?input.removeConnections.map((x:any)=>plain(x,100)).filter(Boolean):[];
  if(current&&!replace){
    const returned=new Set(cards.map((c:any)=>c.id)),removed=new Set(removeCards);
    const missing=(current.cards||[]).map((c:any)=>c.id).filter((id:string)=>!returned.has(id)&&!removed.has(id));
    const returnedX=new Set(connections.map((c:any)=>c.id)),removedX=new Set(removeConnections);
    const missingX=(current.connections||[]).map((c:any)=>c.id).filter((id:string)=>!returnedX.has(id)&&!removedX.has(id));
    if(missing.length||missingX.length){
      const count=missing.length+missingX.length;
      throw new Error("This appears to be a partial AI response. "+count+" existing journey item"+(count===1?" is":"s are")+" missing and no removal was requested. Please ask AI to give you a full rewrite of the complete FPX Journey Source, not snippets of changes.");
    }
  }
  return {...input,cards,connections,removeCards,removeConnections};
}
function sourceComparable(card:any){const x={...card};delete x.id;return JSON.stringify(x)}
function summarizeSourceDiff(current:any,next:any){
  const cm=new Map((current.cards||[]).map((x:any)=>[x.id,x])),nm=new Map((next.cards||[]).map((x:any)=>[x.id,x]));
  const cx=new Map((current.connections||[]).map((x:any)=>[x.id,x])),nx=new Map((next.connections||[]).map((x:any)=>[x.id,x]));
  const added=[...nm.keys()].filter(id=>!cm.has(id)),changed=[...nm.keys()].filter(id=>cm.has(id)&&sourceComparable(cm.get(id))!==sourceComparable(nm.get(id)));
  const addedX=[...nx.keys()].filter(id=>!cx.has(id)),changedX=[...nx.keys()].filter(id=>cx.has(id)&&sourceComparable(cx.get(id))!==sourceComparable(nx.get(id)));
  const removed=Array.from(new Set([...(next.removeCards||[]),...[...cm.keys()].filter(id=>!nm.has(id)&&!(next.cards||[]).some((c:any)=>c.id===id))]));
  const removedX=Array.from(new Set([...(next.removeConnections||[]),...[...cx.keys()].filter(id=>!nx.has(id)&&!(next.connections||[]).some((c:any)=>c.id===id))]));
  return {cardsAdded:added.length,cardsChanged:changed.length,cardsRemoved:removed.length,connectionsAdded:addedX.length,connectionsChanged:changedX.length,connectionsRemoved:removedX.length,
    addedCards:added.map(id=>nm.get(id)?.title||id),changedCards:changed.map(id=>nm.get(id)?.title||id)};
}

export async function getJourneySource(journeyId:string){
  const data=await getJourneyLabData();
  const source=buildJourneySource(data,journeyId);
  const versions=await listJourneyVersions(journeyId);
  return {source,revision:sourceHash(source),latestVersion:versions[0]?.versionNumber||0,versions};
}
export async function listJourneyVersions(journeyId:string){
  const d=await airtableAll(`${VERSIONS_TABLE}?pageSize=100`);
  return d.records.map((r:any)=>({
    id:r.id,label:val(r,VF.label,"Version"),journeyIds:links(val(r,VF.journey,[])),versionNumber:Number(val(r,VF.number,0)),
    createdAt:val(r,VF.createdAt),createdBy:val(r,VF.createdBy),reason:selectName(val(r,VF.reason),"Manual Structural Edit"),
    baseVersion:Number(val(r,VF.base,0)),summary:val(r,VF.summary),sourceJson:val(r,VF.source,"")
  })).filter((v:any)=>v.journeyIds.includes(journeyId)).sort((a:any,b:any)=>b.versionNumber-a.versionNumber);
}
export async function createJourneyVersion(input:any){
  const versions=await listJourneyVersions(input.journeyId);
  const versionNumber=Number(input.versionNumber||((versions[0]?.versionNumber||0)+1));
  const fields:any={
    [VF.label]:input.label||`v${versionNumber} · ${input.reason||"Saved"}`,[VF.journey]:[input.journeyId],[VF.number]:versionNumber,
    [VF.createdAt]:now(),[VF.createdBy]:input.createdBy||"Shared user",[VF.reason]:input.reason||"Manual Structural Edit",
    [VF.base]:Number(input.baseVersion||0),[VF.summary]:input.summary||"",[VF.source]:JSON.stringify(input.source||{})
  };
  const made=await airtable(VERSIONS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
  return {id:made.records?.[0]?.id,versionNumber};
}
async function ensureBaselineVersion(journeyId:string,createdBy:string,currentSource:any){
  const versions=await listJourneyVersions(journeyId);
  if(versions.length)return versions[0].versionNumber;
  const made=await createJourneyVersion({journeyId,createdBy,reason:"Baseline",baseVersion:0,summary:"Baseline before the first saved Journey Source change.",source:currentSource,versionNumber:1,label:"v1 · Baseline"});
  return made.versionNumber;
}
async function unlinkCardFromJourney(card:any,journeyId:string){
  await updateJourneyCard(card.id,{journeyIds:card.journeyIds.filter((id:string)=>id!==journeyId)});
}
async function unlinkConnectionFromJourney(connection:any,journeyId:string){
  await updateConnection(connection.id,{journeyIds:connection.journeyIds.filter((id:string)=>id!==journeyId)});
}
export async function previewJourneySource(journeyId:string,input:any){
  const data=await getJourneyLabData(),current=buildJourneySource(data,journeyId);
  const normalized=validateJourneySource(input,current);
  return {normalized,diff:summarizeSourceDiff(current,normalized),revision:sourceHash(current),current};
}
export async function applyJourneySource(input:any){
  const journeyId=String(input.journeyId||""),createdBy=input.createdBy||"Shared user";
  const beforeData=await getJourneyLabData(),current=buildJourneySource(beforeData,journeyId);
  const currentRevision=sourceHash(current);
  if(!input.force&&input.baseRevision&&input.baseRevision!==currentRevision){
    const versions=await listJourneyVersions(journeyId);
    const error:any=new Error("This journey changed while you were editing it. Reload the current journey before saving your AI update.");
    error.code="JOURNEY_CONFLICT";error.currentRevision=currentRevision;error.latestVersion=versions[0]||null;throw error;
  }
  const normalized=validateJourneySource(input.source,current,{replace:Boolean(input.replace)});
  const diff=summarizeSourceDiff(current,normalized);
  const baselineVersion=await ensureBaselineVersion(journeyId,createdBy,current);
  const oldCards=new Map(beforeData.cards.map((c:any)=>[c.id,c])),oldConnections=new Map(beforeData.connections.map((c:any)=>[c.id,c])),oldDefs=new Map(beforeData.library.map((d:any)=>[d.id,d]));
  const createdCards:string[]=[],createdConnections:string[]=[],createdLibraries:string[]=[],updatedCards:any[]=[],updatedConnections:any[]=[];
  const idMap=new Map<string,string>();
  const cardInputMap=new Map(normalized.cards.map((c:any)=>[c.id,c]));
  const currentCardMap=new Map(current.cards.map((c:any)=>[c.id,c]));
  let maxX=Math.max(100,...beforeData.cards.filter((c:any)=>c.journeyIds.includes(journeyId)).map((c:any)=>c.x||100));
  let maxY=Math.max(100,...beforeData.cards.filter((c:any)=>c.journeyIds.includes(journeyId)).map((c:any)=>c.y||100));
  async function localDef(cardSource:any,currentDef:any){
    const made=await createLibraryCard(makeLocalLibraryFromSource(cardSource,journeyId,currentDef));
    const id=made.records?.[0]?.id;if(!id)throw new Error("Unable to create journey-local card definition.");
    createdLibraries.push(id);return id;
  }
  try{
    for(let i=0;i<normalized.cards.length;i++){
      const src=normalized.cards[i],existing=oldCards.get(src.id),existingDef=existing?oldDefs.get(existing.libraryId):null;
      const currentExport=currentCardMap.get(src.id);
      if(existing&&existing.journeyIds.includes(journeyId)&&currentExport&&sourceComparable(currentExport)===sourceComparable(src)){
        idMap.set(src.id,existing.id);continue;
      }
      if(existing&&existing.journeyIds.includes(journeyId)){
        const libraryId=await localDef(src,existingDef);
        if(existing.journeyIds.length>1){
          const made=await createJourneyCard({title:src.title,notes:existing.notes||"",comments:existing.comments||"",order:existing.order,
            x:existing.x,y:existing.y,journeyIds:[journeyId],libraryId,sequenceId:src.sequence?.id||"",sequenceName:src.sequence?.name||"",sequenceStep:Number(src.sequence?.step||0)});
          const newId=made.records?.[0]?.id;if(!newId)throw new Error("Unable to isolate shared card.");
          createdCards.push(newId);updatedCards.push(existing);await unlinkCardFromJourney(existing,journeyId);idMap.set(src.id,newId);
        }else{
          updatedCards.push(existing);
          await updateJourneyCard(existing.id,{title:src.title,libraryId,sequenceId:src.sequence?.id||"",sequenceName:src.sequence?.name||"",sequenceStep:Number(src.sequence?.step||0)});
          idMap.set(src.id,existing.id);
        }
      }else if(existing&&!existing.journeyIds.includes(journeyId)){
        const libraryId=await localDef(src,existingDef);
        const made=await createJourneyCard({title:src.title,notes:"",comments:"",order:Date.now()+i,x:existing.x||maxX+320,y:existing.y||maxY,
          journeyIds:[journeyId],libraryId,sequenceId:src.sequence?.id||"",sequenceName:src.sequence?.name||"",sequenceStep:Number(src.sequence?.step||0)});
        const newId=made.records?.[0]?.id;if(!newId)throw new Error("Unable to restore journey card.");
        createdCards.push(newId);idMap.set(src.id,newId);
      }else{
        const safeSrc={...src,execution:src.execution==="Automated"?"Can be automated":src.execution,workshopStatus:src.workshopStatus==="Agreed"?"Draft":src.workshopStatus};
        const libraryId=await localDef(safeSrc,null);
        maxX+=320;if(maxX>2600){maxX=120;maxY+=210}
        const made=await createJourneyCard({title:safeSrc.title,notes:"",comments:"",order:Date.now()+i,x:maxX,y:maxY,journeyIds:[journeyId],libraryId,
          sequenceId:safeSrc.sequence?.id||"",sequenceName:safeSrc.sequence?.name||"",sequenceStep:Number(safeSrc.sequence?.step||0)});
        const newId=made.records?.[0]?.id;if(!newId)throw new Error("Unable to create new journey card.");
        createdCards.push(newId);idMap.set(src.id,newId);
      }
    }
    const explicitRemove=new Set(normalized.removeCards||[]);
    if(input.replace)for(const card of current.cards)if(!cardInputMap.has(card.id))explicitRemove.add(card.id);
    for(const id of explicitRemove){
      const card=oldCards.get(id);if(card?.journeyIds.includes(journeyId)){updatedCards.push(card);await unlinkCardFromJourney(card,journeyId)}
    }
    const currentConnectionMap=new Map(current.connections.map((c:any)=>[c.id,c]));
    const desiredConnectionIds=new Set<string>();
    for(let i=0;i<normalized.connections.length;i++){
      const src=normalized.connections[i],fromId=idMap.get(src.from)||src.from,toId=idMap.get(src.to)||src.to;
      const existing=oldConnections.get(src.id),currentExport=currentConnectionMap.get(src.id);
      desiredConnectionIds.add(src.id);
      const same=existing&&existing.journeyIds.includes(journeyId)&&currentExport&&currentExport.from===src.from&&currentExport.to===src.to&&(currentExport.label||"")===(src.label||"")&&fromId===existing.fromId&&toId===existing.toId;
      if(same)continue;
      if(existing&&existing.journeyIds.includes(journeyId)){
        if(existing.journeyIds.length>1){
          const made=await createConnection({name:src.id,fromId,toId,journeyIds:[journeyId],label:src.label||"",order:existing.order});
          const newId=made.records?.[0]?.id;if(newId)createdConnections.push(newId);
          updatedConnections.push(existing);await unlinkConnectionFromJourney(existing,journeyId);
        }else{
          updatedConnections.push(existing);await updateConnection(existing.id,{fromId,toId,label:src.label||"",journeyIds:[journeyId]});
        }
      }else{
        const made=await createConnection({name:src.id,fromId,toId,journeyIds:[journeyId],label:src.label||"",order:Date.now()+i});
        const newId=made.records?.[0]?.id;if(newId)createdConnections.push(newId);
      }
    }
    const explicitRemoveX=new Set(normalized.removeConnections||[]);
    if(input.replace)for(const connection of current.connections)if(!desiredConnectionIds.has(connection.id))explicitRemoveX.add(connection.id);
    for(const id of explicitRemoveX){
      const connection=oldConnections.get(id);if(connection?.journeyIds.includes(journeyId)){updatedConnections.push(connection);await unlinkConnectionFromJourney(connection,journeyId)}
    }
    // Any connection still using an isolated old card is rewritten to the new journey-specific card.
    const midData=await getJourneyLabData();
    for(const connection of midData.connections.filter((c:any)=>c.active&&c.journeyIds.includes(journeyId))){
      const sourceConn=normalized.connections.find((x:any)=>x.id===connection.id);
      if(!sourceConn)continue;
      const desiredFrom=idMap.get(sourceConn.from)||sourceConn.from,desiredTo=idMap.get(sourceConn.to)||sourceConn.to;
      if(connection.fromId!==desiredFrom||connection.toId!==desiredTo)await updateConnection(connection.id,{fromId:desiredFrom,toId:desiredTo});
    }
    const afterData=await getJourneyLabData(),afterSource=buildJourneySource(afterData,journeyId);
    const titles=new Set(afterSource.cards.map((c:any)=>c.title));
    for(const src of normalized.cards)if(!titles.has(src.title))throw new Error("Verification failed after saving card: "+src.title);
    const summary=`+${diff.cardsAdded} cards, ~${diff.cardsChanged} cards, -${diff.cardsRemoved} cards; +${diff.connectionsAdded} connections, ~${diff.connectionsChanged} connections, -${diff.connectionsRemoved} connections.`;
    const madeVersion=await createJourneyVersion({journeyId,createdBy,reason:input.reason||"AI Import",baseVersion:Number(input.baseVersion||baselineVersion),summary,source:afterSource});
    await logChange({action:"Saved",itemType:"Journey Version",itemName:afterData.journeys.find((j:any)=>j.id===journeyId)?.name||"Journey",journeyIds:[journeyId],changedBy:createdBy,details:summary});
    return {data:afterData,source:afterSource,revision:sourceHash(afterSource),versionNumber:madeVersion.versionNumber,diff,summary};
  }catch(error){
    // Best-effort rollback. Imports never physically delete pre-existing cards/connections.
    for(const original of [...updatedConnections].reverse()){
      try{await updateConnection(original.id,{name:original.name,fromId:original.fromId,toId:original.toId,journeyIds:original.journeyIds,label:original.label,order:original.order,active:original.active})}catch{}
    }
    for(const original of [...updatedCards].reverse()){
      try{await updateJourneyCard(original.id,{title:original.title,notes:original.notes,comments:original.comments,order:original.order,x:original.x,y:original.y,journeyIds:original.journeyIds,libraryId:original.libraryId,sequenceId:original.sequenceId,sequenceName:original.sequenceName,sequenceStep:original.sequenceStep})}catch{}
    }
    for(const id of createdConnections.reverse())try{await airtable(`${CONNECTIONS_TABLE}/${id}`,{method:"DELETE"})}catch{}
    for(const id of createdCards.reverse())try{await airtable(`${CARDS_TABLE}/${id}`,{method:"DELETE"})}catch{}
    for(const id of createdLibraries.reverse())try{await airtable(`${LIBRARY_TABLE}/${id}`,{method:"DELETE"})}catch{}
    try{
      const rolledData=await getJourneyLabData();
      const rolledSource=buildJourneySource(rolledData,journeyId);
      if(sourceHash(rolledSource)!==currentRevision){
        await logChange({action:"Rollback warning",itemType:"Journey Source",itemName:beforeData.journeys.find((j:any)=>j.id===journeyId)?.name||"Journey",journeyIds:[journeyId],changedBy:createdBy,details:"AI import failed and the automatic rollback could not be fully verified."}).catch(()=>{});
        throw new Error("The AI import failed and FPX could not fully verify the automatic rollback. Do not continue editing this journey until the previous saved version has been restored.");
      }
    }catch(rollbackError){
      if(rollbackError instanceof Error&&rollbackError.message.includes("could not fully verify"))throw rollbackError;
    }
    throw error;
  }
}
export async function restoreJourneyVersion(input:any){
  const versions=await listJourneyVersions(input.journeyId);
  const version=versions.find((v:any)=>v.id===input.versionId);
  if(!version)throw new Error("Saved version not found.");
  const source=JSON.parse(version.sourceJson||"{}");
  const current=(await getJourneySource(input.journeyId));
  return applyJourneySource({journeyId:input.journeyId,source,replace:true,force:true,baseRevision:current.revision,baseVersion:current.latestVersion,createdBy:input.createdBy||"Shared user",reason:"Restore"});
}
export async function listPresence(){
  const d=await airtableAll(`${PRESENCE_TABLE}?pageSize=100`);
  return d.records.map((r:any)=>({
    id:r.id,person:val(r,PF.person),journeyIds:links(val(r,PF.journey,[])),viewName:val(r,PF.view),sourceFocus:val(r,PF.focus),
    detailMode:selectName(val(r,PF.mode),"Simple"),selectedCard:val(r,PF.card),lastSeen:val(r,PF.lastSeen),sessionId:val(r,PF.session)
  })).filter((x:any)=>x.person);
}
export async function heartbeatPresence(input:any){
  const allowed=["Gabriel","Gabriela","George"];
  const person=allowed.find(x=>x.toLowerCase()===String(input.person||"").trim().toLowerCase())||plain(input.person,80)||"Shared user";
  const presence=await listPresence(),existing=presence.find((x:any)=>x.person.toLowerCase()===person.toLowerCase());
  const fields:any={
    [PF.person]:person,[PF.journey]:input.journeyId?[input.journeyId]:[],[PF.view]:plain(input.viewName,255),[PF.focus]:plain(input.sourceFocus,100),
    [PF.mode]:input.detailMode==="In-Depth"?"In-Depth":"Simple",[PF.card]:plain(input.selectedCard,255),[PF.lastSeen]:now(),[PF.session]:plain(input.sessionId,255)
  };
  if(existing)await airtable(PRESENCE_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id:existing.id,fields}],typecast:true})});
  else await airtable(PRESENCE_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
  return listPresence();
}
