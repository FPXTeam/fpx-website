import { randomBytes } from "node:crypto";

/**
 * Server-only Airtable-compatible transport for the private FPX Journey Lab.
 * It lets the existing validated journey/version workflow use Supabase as the
 * primary store without rewriting every caller at once.
 * Never expose SUPABASE_SERVICE_ROLE_KEY to client components or GitHub.
 */
export type LabTableSpec = {
  table: string;
  fields: Record<string, string>;
  sort?: Record<string, string>;
};
export type LabTableSpecs = Record<string, LabTableSpec>;

function config() {
  const url = (process.env.SUPABASE_URL || "https://myinbqrflocarwzsqfef.supabase.co").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!key) throw new Error("FPX Lead Journey Lab Supabase service key is missing. Shared editing is unavailable.");
  if (new URL(url).hostname !== "myinbqrflocarwzsqfef.supabase.co") {
    throw new Error("FPX Lead Journey Lab is configured with an unexpected Supabase project. Refusing to access it.");
  }
  return { url, key };
}
function makeId() {
  return "rec" + randomBytes(7).toString("hex");
}
function decodeError(value: any, fallback: string) {
  return typeof value?.message === "string" ? value.message : fallback;
}
async function rest(method: string, table: string, params = "", body?: unknown) {
  const {url,key} = config();
  const endpoint = url + "/rest/v1/" + table + (params ? "?" + params : "");
  const headers: Record<string,string> = {
    "apikey": key,
    "Authorization": "Bearer " + key,
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
  // GET and PATCH are safe to retry. Do not automatically replay POST writes.
  const attempts = method === "GET" || method === "PATCH" ? 3 : 1;
  for (let attempt=0; attempt<attempts; attempt++) {
    let response: Response;
    try {
      response = await fetch(endpoint,{
        method, headers, body: body===undefined ? undefined : JSON.stringify(body), cache: "no-store",
        signal: AbortSignal.timeout(12000)
      });
    } catch(error) {
      if(attempt+1<attempts) {
        await new Promise(resolve=>setTimeout(resolve,250*Math.pow(2,attempt)));
        continue;
      }
      throw new Error("FPX Supabase is temporarily unreachable. No changes were confirmed.");
    }
    const data = await response.json().catch(()=>null);
    if(response.ok) return Array.isArray(data)?data:(data?[data]:[]);
    if(attempt+1<attempts && [429,502,503,504].includes(response.status)) {
      await new Promise(resolve=>setTimeout(resolve,350*Math.pow(2,attempt)));
      continue;
    }
    // Never silently fall back to browser storage or write to outdated Airtable records.
    throw new Error("FPX Supabase request failed ("+response.status+"): "+
      decodeError(data,response.status===401?"Check the server-only service key.":"Please retry shortly."));
  }
  throw new Error("FPX Supabase did not respond.");
}

export async function supabaseAirtable(path:string,init:RequestInit|undefined,specs:LabTableSpecs) {
  const [tablePath,query=""] = path.split("?");
  const [tableId,rowId] = tablePath.split("/");
  const spec = specs[tableId];
  if(!spec) throw new Error("Unsupported Lead Journey Lab table.");
  const method=(init?.method||"GET").toUpperCase();
  const fieldToColumn = spec.fields;
  const columnToField = Object.fromEntries(Object.entries(fieldToColumn).map(([k,v])=>[v,k]));
  const mapRecord=(row:Record<string,any>)=>{
    const fields:Record<string,any>={};
    for(const [col,field] of Object.entries(columnToField)) {
      if(row[col]!==undefined && row[col]!==null)fields[field]=row[col];
    }
    return {id: row.id, fields};
  };
  const toColumns=(fields:Record<string,any>)=>{
    const data:Record<string,any>={};
    for(const [field,value] of Object.entries(fields||{})) {
      const col=fieldToColumn[field];
      if(col)data[col]=value;
    }
    return data;
  };
  if(method==="GET"){
    const supplied=new URLSearchParams(query);
    if(rowId){
      const rows=await rest("GET",spec.table,
        new URLSearchParams({id:"eq."+rowId,limit:"1"}).toString());
      if(!rows.length)throw new Error("Lead Journey Lab record not found.");
      return mapRecord(rows[0]);
    }
    const limit=Math.max(1,Math.min(250,Number(supplied.get("pageSize")||100)));
    const offset=Math.max(0,Number(supplied.get("offset")||0));
    const params=new URLSearchParams({limit:String(limit),offset:String(offset)});
    const name=supplied.get("sort[0][field]")||"";
    const col=spec.sort?.[name];
    if(col)params.set("order",col+"."+(supplied.get("sort[0][direction]")==="desc"?"desc":"asc"));
    const rows=await rest("GET",spec.table,params.toString());
    return {records:rows.map(mapRecord),...(rows.length===limit?{offset:String(offset+limit)}:{})};
  }
  const payload=init?.body?JSON.parse(String(init.body)):{};
  if(method==="POST"){
    const records=(payload.records||[]).map((item:any)=>{
      const record=toColumns(item.fields);
      if(!record.id)record.id=makeId();
      return record;
    });
    if(!records.length)return {records:[]};
    const result=await rest("POST",spec.table,"",records);
    return {records:result.map(mapRecord)};
  }
  if(method==="PATCH"){
    const updated:any[]=[];
    for(const item of payload.records||[]){
      const columns=toColumns(item.fields);
      if(!item.id)throw new Error("Cannot update a record without an ID.");
      const result=await rest("PATCH",spec.table,
        new URLSearchParams({id:"eq."+item.id}).toString(),columns);
      if(result.length!==1)throw new Error("The FPX record changed or no longer exists.");
      updated.push(mapRecord(result[0]));
    }
    return {records:updated};
  }
  if(method==="DELETE"){
    if(!rowId)throw new Error("Cannot delete a table through the Lead Journey Lab.");
    const result=await rest("DELETE",spec.table,
      new URLSearchParams({id:"eq."+rowId}).toString());
    return result[0]?{id:result[0].id,deleted:true}:{id:rowId,deleted:true};
  }
  throw new Error("Unsupported Lead Journey Lab operation.");
}
