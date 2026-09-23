import { NextResponse } from "next/server";
import { passwordMatches } from "../../../../lib/lead-journey-lab-auth";
import {
  applyGlobalCardsToJourney,bulkAssignCards,bulkDeleteCards,bulkMoveCards,createConnection,createJourney,createJourneyCard,
  createLibraryCard,createSnapshot,deleteConnection,deleteJourney,deleteJourneyCard,deleteSnapshot,duplicateJourney,
  getJourneyLabData,listChangeLog,listSnapshots,logChange,mergeIntoExistingJourney,restoreSnapshotLayout,syncGlobalCard,
  updateConnection,updateJourney,updateJourneyCard,updateLibraryCard
} from "../../../../lib/lead-journey-lab-airtable";

function guard(request:Request){return passwordMatches(request.headers.get("x-lead-journey-password")||"")}
function user(request:Request){return request.headers.get("x-lead-journey-user")||"Shared user"}
function fail(error:unknown,message:string){return NextResponse.json({error:error instanceof Error?error.message:message},{status:500})}
async function log(request:Request,body:any,defaults:any){
  try{await logChange({changedBy:user(request),...defaults,journeyIds:body.journeyIds||defaults.journeyIds||[]})}catch{}
}

export async function GET(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const url=new URL(request.url);
  const section=url.searchParams.get("section");
  try{
    if(section==="snapshots")return NextResponse.json({snapshots:await listSnapshots()});
    if(section==="changes")return NextResponse.json({changes:await listChangeLog()});
    return NextResponse.json(await getJourneyLabData());
  }catch(error){return fail(error,"Unable to load Lead Journey Lab.")}
}

export async function POST(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    switch(body.action){
      case "createJourney":{
        const made=await createJourney(body);
        const id=made.records?.[0]?.id;
        if(id)await applyGlobalCardsToJourney(id);
        await log(request,body,{action:"Created",itemType:"Journey",itemName:body.name});
        break;
      }
      case "duplicateJourney":{
        await duplicateJourney(String(body.sourceId),body.name,body.group);
        await log(request,body,{action:"Duplicated",itemType:"Journey",itemName:body.name});
        break;
      }
      case "createLibraryCard":{
        await createLibraryCard(body);
        await log(request,body,{action:"Created",itemType:"Master Card",itemName:body.name});
        break;
      }
      case "createCardFromLibrary":{
        await createJourneyCard(body);
        await log(request,body,{action:"Added",itemType:"Card",itemName:body.title});
        break;
      }
      case "createNewCard":{
        const created=await createLibraryCard(body.library||body);
        const libraryId=created.records?.[0]?.id;
        await createJourneyCard({...body,libraryId,title:body.title||body.library?.name});
        await log(request,body,{action:"Created",itemType:"Card",itemName:body.title||body.library?.name});
        break;
      }
      case "createConnection":{
        await createConnection(body);
        await log(request,body,{action:"Connected",itemType:"Connection",itemName:body.name});
        break;
      }
      case "mergeJourney":{
        await mergeIntoExistingJourney(String(body.sourceCardId),String(body.targetCardId),String(body.currentJourneyId),String(body.targetJourneyId));
        await log(request,body,{action:"Merged",itemType:"Journey",itemName:body.itemName||"Journey merge"});
        break;
      }
      case "createSnapshot":{
        await createSnapshot({...body,createdBy:user(request)});
        await log(request,body,{action:"Saved",itemType:"Snapshot",itemName:body.name});
        break;
      }
      default:return NextResponse.json({error:"Unknown create action."},{status:400});
    }
    return NextResponse.json(await getJourneyLabData());
  }catch(error){return fail(error,"Unable to create item.")}
}

export async function PATCH(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    switch(body.action){
      case "updateJourney":
        await updateJourney(String(body.id),body);
        await log(request,body,{action:"Updated",itemType:"Journey",itemName:body.name||""});
        break;
      case "updateLibraryCard":
        await updateLibraryCard(String(body.id),body);
        if(body.global!==undefined)await syncGlobalCard(String(body.id));
        await log(request,body,{action:"Updated",itemType:"Master Card",itemName:body.name||""});
        break;
      case "updateCard":
        await updateJourneyCard(String(body.id),body);
        if(body.comments!==undefined||body.title!==undefined)await log(request,body,{action:"Updated",itemType:"Card",itemName:body.title||""});
        break;
      case "bulkMove":
        await bulkMoveCards(Array.isArray(body.cards)?body.cards:[]);
        break;
      case "bulkAssign":
        await bulkAssignCards(Array.isArray(body.ids)?body.ids:[],String(body.journeyId));
        await log(request,body,{action:"Assigned",itemType:"Cards",itemName:`${body.ids?.length||0} cards`,journeyIds:[body.journeyId]});
        break;
      case "updateConnection":
        await updateConnection(String(body.id),body);
        await log(request,body,{action:"Updated",itemType:"Connection",itemName:body.name||""});
        break;
      case "restoreSnapshot":
        await restoreSnapshotLayout(String(body.id));
        await log(request,body,{action:"Restored layout",itemType:"Snapshot",itemName:body.name||""});
        break;
      default:return NextResponse.json({error:"Unknown update action."},{status:400});
    }
    return NextResponse.json(await getJourneyLabData());
  }catch(error){return fail(error,"Unable to update item.")}
}

export async function DELETE(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    if(body.action==="deleteConnection"){
      await deleteConnection(String(body.id));
      await log(request,body,{action:"Disconnected",itemType:"Connection",itemName:body.itemName||""});
    }else if(body.action==="deleteCard"){
      await deleteJourneyCard(String(body.id));
      await log(request,body,{action:"Deleted",itemType:"Card",itemName:body.itemName||""});
    }else if(body.action==="deleteCards"){
      await bulkDeleteCards(body.ids||[]);
      await log(request,body,{action:"Deleted",itemType:"Cards",itemName:`${body.ids?.length||0} cards`});
    }else if(body.action==="deleteJourney"){
      await deleteJourney(String(body.id));
      await log(request,body,{action:"Deleted",itemType:"Journey",itemName:body.itemName||""});
    }else if(body.action==="deleteSnapshot"){
      await deleteSnapshot(String(body.id));
      await log(request,body,{action:"Deleted",itemType:"Snapshot",itemName:body.itemName||""});
    }else{
      return NextResponse.json({error:"Unknown delete action."},{status:400});
    }
    return NextResponse.json(await getJourneyLabData());
  }catch(error){return fail(error,"Unable to delete item.")}
}
