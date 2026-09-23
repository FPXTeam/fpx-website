const BASE_ID="app46QGfgQet1CPIu";
const CARDS_TABLE="tblCvEEGIiT0AL3R1";

const CARD_FIELDS={
  title:"Card Title",
  type:"Card Type",
  notes:"Notes",
  priority:"Priority",
  status:"Status",
  owner:"Owner",
  channel:"Channel",
  order:"Sort Order",
  createdBy:"Created By",
  connectFrom:"Connect From",
  x:"Canvas X",
  y:"Canvas Y",
} as const;

function token(){
  return process.env.AIRTABLE_TOKEN?.trim() || process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN?.trim() || "";
}

function headers(){
  const value=token();
  if(!value)throw new Error("AIRTABLE_TOKEN is not configured.");
  return {Authorization:`Bearer ${value}`,"Content-Type":"application/json"};
}

async function airtable(path:string,init?:RequestInit){
  const response=await fetch(`https://api.airtable.com/v0/${BASE_ID}/${path}`,{
    ...init,
    headers:{...headers(),...(init?.headers||{})},
    cache:"no-store",
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data?.error?.message||data?.error?.type||"Airtable request failed.");
  return data;
}

export type JourneyCard={
  id:string;
  title:string;
  type:string;
  notes:string;
  priority:string;
  status:string;
  owner:string;
  channels:string[];
  order:number;
  createdBy:string;
  connectFrom:string[];
  x:number;
  y:number;
};

export async function getJourneyBoard(){
  if(!token())return {configured:false,cards:[] as JourneyCard[]};

  const cardData=await airtable(`${CARDS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Sort%20Order&sort%5B0%5D%5Bdirection%5D=asc`);
  const cards:JourneyCard[]=cardData.records.map((record:any)=>({
    id:record.id,
    title:record.fields[CARD_FIELDS.title]||"Untitled card",
    type:record.fields[CARD_FIELDS.type]||"Idea",
    notes:record.fields[CARD_FIELDS.notes]||"",
    priority:record.fields[CARD_FIELDS.priority]||"Next",
    status:record.fields[CARD_FIELDS.status]||"Open",
    owner:record.fields[CARD_FIELDS.owner]||"",
    channels:Array.isArray(record.fields[CARD_FIELDS.channel])?record.fields[CARD_FIELDS.channel]:[],
    order:Number(record.fields[CARD_FIELDS.order]||0),
    createdBy:record.fields[CARD_FIELDS.createdBy]||"",
    connectFrom:Array.isArray(record.fields[CARD_FIELDS.connectFrom])?record.fields[CARD_FIELDS.connectFrom]:[],
    x:Number(record.fields[CARD_FIELDS.x]||80),
    y:Number(record.fields[CARD_FIELDS.y]||120),
  }));

  return {configured:true,cards};
}

export async function createJourneyCard(input:any){
  const fields:any={
    [CARD_FIELDS.title]:String(input.title||"New card").trim()||"New card",
    [CARD_FIELDS.type]:input.type||"Idea",
    [CARD_FIELDS.notes]:input.notes||"",
    [CARD_FIELDS.priority]:input.priority||"Next",
    [CARD_FIELDS.status]:input.status||"Open",
    [CARD_FIELDS.owner]:input.owner||"",
    [CARD_FIELDS.channel]:Array.isArray(input.channels)?input.channels:[],
    [CARD_FIELDS.order]:Number(input.order||Date.now()),
    [CARD_FIELDS.createdBy]:input.createdBy||"",
    [CARD_FIELDS.connectFrom]:Array.isArray(input.connectFrom)?input.connectFrom.filter(Boolean):[],
    [CARD_FIELDS.x]:Number(input.x??100),
    [CARD_FIELDS.y]:Number(input.y??120),
  };
  return airtable(CARDS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}

export async function updateJourneyCard(id:string,input:any){
  const fields:any={};
  if(input.title!==undefined)fields[CARD_FIELDS.title]=input.title;
  if(input.type!==undefined)fields[CARD_FIELDS.type]=input.type;
  if(input.notes!==undefined)fields[CARD_FIELDS.notes]=input.notes;
  if(input.priority!==undefined)fields[CARD_FIELDS.priority]=input.priority;
  if(input.status!==undefined)fields[CARD_FIELDS.status]=input.status;
  if(input.owner!==undefined)fields[CARD_FIELDS.owner]=input.owner;
  if(input.channels!==undefined)fields[CARD_FIELDS.channel]=input.channels;
  if(input.order!==undefined)fields[CARD_FIELDS.order]=Number(input.order);
  if(input.connectFrom!==undefined)fields[CARD_FIELDS.connectFrom]=input.connectFrom;
  if(input.x!==undefined)fields[CARD_FIELDS.x]=Number(input.x);
  if(input.y!==undefined)fields[CARD_FIELDS.y]=Number(input.y);
  return airtable(CARDS_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}

export async function deleteJourneyCard(id:string){
  return airtable(`${CARDS_TABLE}/${id}`,{method:"DELETE"});
}
