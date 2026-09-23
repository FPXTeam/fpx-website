const BASE_ID="app46QGfgQet1CPIu";
const STAGES_TABLE="tbl5TrM0BObv2uksC";
const CARDS_TABLE="tblCvEEGIiT0AL3R1";

const STAGE_FIELDS={
  name:"Stage Name",
  order:"Order",
  type:"Stage Type",
  description:"Description",
  active:"Active",
} as const;

const CARD_FIELDS={
  title:"Card Title",
  stage:"Stage",
  type:"Card Type",
  notes:"Notes",
  priority:"Priority",
  status:"Status",
  owner:"Owner",
  channel:"Channel",
  order:"Sort Order",
  createdBy:"Created By",
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

export type JourneyStage={
  id:string;
  name:string;
  order:number;
  type:"Journey"|"Outcome";
  description:string;
  active:boolean;
};

export type JourneyCard={
  id:string;
  title:string;
  stageId:string;
  type:string;
  notes:string;
  priority:string;
  status:string;
  owner:string;
  channels:string[];
  order:number;
  createdBy:string;
};

export async function getJourneyBoard(){
  if(!token())return {configured:false,stages:[] as JourneyStage[],cards:[] as JourneyCard[]};

  const [stageData,cardData]=await Promise.all([
    airtable(`${STAGES_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Order&sort%5B0%5D%5Bdirection%5D=asc`),
    airtable(`${CARDS_TABLE}?pageSize=100&sort%5B0%5D%5Bfield%5D=Sort%20Order&sort%5B0%5D%5Bdirection%5D=asc`)
  ]);

  const stages:JourneyStage[]=stageData.records.map((record:any)=>({
    id:record.id,
    name:record.fields[STAGE_FIELDS.name]||"Untitled stage",
    order:Number(record.fields[STAGE_FIELDS.order]||0),
    type:record.fields[STAGE_FIELDS.type]==="Outcome"?"Outcome":"Journey",
    description:record.fields[STAGE_FIELDS.description]||"",
    active:record.fields[STAGE_FIELDS.active]!==false,
  }));

  const cards:JourneyCard[]=cardData.records.map((record:any)=>({
    id:record.id,
    title:record.fields[CARD_FIELDS.title]||"Untitled card",
    stageId:Array.isArray(record.fields[CARD_FIELDS.stage])?record.fields[CARD_FIELDS.stage][0]||"": "",
    type:record.fields[CARD_FIELDS.type]||"Idea",
    notes:record.fields[CARD_FIELDS.notes]||"",
    priority:record.fields[CARD_FIELDS.priority]||"Next",
    status:record.fields[CARD_FIELDS.status]||"Open",
    owner:record.fields[CARD_FIELDS.owner]||"",
    channels:Array.isArray(record.fields[CARD_FIELDS.channel])?record.fields[CARD_FIELDS.channel]:[],
    order:Number(record.fields[CARD_FIELDS.order]||0),
    createdBy:record.fields[CARD_FIELDS.createdBy]||"",
  }));

  return {configured:true,stages,cards};
}

export async function createJourneyCard(input:any){
  const fields:any={
    [CARD_FIELDS.title]:String(input.title||"New idea").trim()||"New idea",
    [CARD_FIELDS.stage]:[String(input.stageId)],
    [CARD_FIELDS.type]:input.type||"Idea",
    [CARD_FIELDS.notes]:input.notes||"",
    [CARD_FIELDS.priority]:input.priority||"Next",
    [CARD_FIELDS.status]:input.status||"Open",
    [CARD_FIELDS.owner]:input.owner||"",
    [CARD_FIELDS.channel]:Array.isArray(input.channels)?input.channels:[],
    [CARD_FIELDS.order]:Number(input.order||Date.now()),
    [CARD_FIELDS.createdBy]:input.createdBy||"",
  };
  return airtable(CARDS_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}

export async function updateJourneyCard(id:string,input:any){
  const fields:any={};
  if(input.title!==undefined)fields[CARD_FIELDS.title]=input.title;
  if(input.stageId!==undefined)fields[CARD_FIELDS.stage]=[input.stageId];
  if(input.type!==undefined)fields[CARD_FIELDS.type]=input.type;
  if(input.notes!==undefined)fields[CARD_FIELDS.notes]=input.notes;
  if(input.priority!==undefined)fields[CARD_FIELDS.priority]=input.priority;
  if(input.status!==undefined)fields[CARD_FIELDS.status]=input.status;
  if(input.owner!==undefined)fields[CARD_FIELDS.owner]=input.owner;
  if(input.channels!==undefined)fields[CARD_FIELDS.channel]=input.channels;
  if(input.order!==undefined)fields[CARD_FIELDS.order]=Number(input.order);
  return airtable(CARDS_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}

export async function deleteJourneyCard(id:string){
  return airtable(`${CARDS_TABLE}/${id}`,{method:"DELETE"});
}

export async function createJourneyStage(input:any){
  const fields:any={
    [STAGE_FIELDS.name]:String(input.name||"New stage").trim()||"New stage",
    [STAGE_FIELDS.order]:Number(input.order||Date.now()),
    [STAGE_FIELDS.type]:input.type==="Outcome"?"Outcome":"Journey",
    [STAGE_FIELDS.description]:input.description||"",
    [STAGE_FIELDS.active]:true,
  };
  return airtable(STAGES_TABLE,{method:"POST",body:JSON.stringify({records:[{fields}],typecast:true})});
}

export async function updateJourneyStage(id:string,input:any){
  const fields:any={};
  if(input.name!==undefined)fields[STAGE_FIELDS.name]=input.name;
  if(input.order!==undefined)fields[STAGE_FIELDS.order]=Number(input.order);
  if(input.type!==undefined)fields[STAGE_FIELDS.type]=input.type;
  if(input.description!==undefined)fields[STAGE_FIELDS.description]=input.description;
  if(input.active!==undefined)fields[STAGE_FIELDS.active]=Boolean(input.active);
  return airtable(STAGES_TABLE,{method:"PATCH",body:JSON.stringify({records:[{id,fields}],typecast:true})});
}
