import { NextResponse } from "next/server";
import { passwordMatches } from "../../../../lib/lead-journey-lab-auth";
import {
  bulkMoveCards,createConnection,createJourney,createJourneyCard,createLibraryCard,deleteConnection,deleteJourney,deleteJourneyCard,
  getJourneyLabData,updateConnection,updateJourney,updateJourneyCard,updateLibraryCard
} from "../../../../lib/lead-journey-lab-airtable";

function guard(request:Request){
  return passwordMatches(request.headers.get("x-lead-journey-password")||"");
}
function fail(error:unknown,message:string){
  return NextResponse.json({error:error instanceof Error?error.message:message},{status:500});
}

export async function GET(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  try{return NextResponse.json(await getJourneyLabData())}catch(error){return fail(error,"Unable to load board.")}
}

export async function POST(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    switch(body.action){
      case "createJourney":
        await createJourney(body);
        break;
      case "createLibraryCard":
        await createLibraryCard(body);
        break;
      case "createCardFromLibrary":
        await createJourneyCard(body);
        break;
      case "createNewCard":{
        const created=await createLibraryCard(body.library||body);
        const libraryId=created.records?.[0]?.id;
        await createJourneyCard({...body,libraryId,title:body.title||body.library?.name});
        break;
      }
      case "createConnection":
        await createConnection(body);
        break;
      default:
        return NextResponse.json({error:"Unknown create action."},{status:400});
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
        break;
      case "updateLibraryCard":
        await updateLibraryCard(String(body.id),body);
        break;
      case "updateCard":
        await updateJourneyCard(String(body.id),body);
        break;
      case "bulkMove":
        await bulkMoveCards(Array.isArray(body.cards)?body.cards:[]);
        break;
      case "updateConnection":
        await updateConnection(String(body.id),body);
        break;
      default:
        return NextResponse.json({error:"Unknown update action."},{status:400});
    }
    return NextResponse.json(await getJourneyLabData());
  }catch(error){return fail(error,"Unable to update item.")}
}

export async function DELETE(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    if(body.action==="deleteConnection")await deleteConnection(String(body.id));
    else if(body.action==="deleteCard")await deleteJourneyCard(String(body.id));
    else if(body.action==="deleteJourney")await deleteJourney(String(body.id));
    else return NextResponse.json({error:"Unknown delete action."},{status:400});
    return NextResponse.json(await getJourneyLabData());
  }catch(error){return fail(error,"Unable to delete item.")}
}
