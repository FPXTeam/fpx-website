import { NextResponse } from "next/server";
import { hasLabAccess } from "../../../../lib/lead-journey-lab-auth";
import {
  createJourneyCard,createJourneyStage,deleteJourneyCard,getJourneyBoard,
  updateJourneyCard,updateJourneyStage
} from "../../../../lib/lead-journey-lab-airtable";

async function guard(){
  return await hasLabAccess();
}

export async function GET(){
  if(!(await guard()))return NextResponse.json({error:"Unauthorized"},{status:401});
  try{return NextResponse.json(await getJourneyBoard())}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to load board."},{status:500})}
}

export async function POST(request:Request){
  if(!(await guard()))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    if(body.kind==="stage")await createJourneyStage(body);
    else await createJourneyCard(body);
    return NextResponse.json(await getJourneyBoard());
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to create item."},{status:500})}
}

export async function PATCH(request:Request){
  if(!(await guard()))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    if(body.kind==="stage")await updateJourneyStage(String(body.id),body);
    else await updateJourneyCard(String(body.id),body);
    return NextResponse.json(await getJourneyBoard());
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to update item."},{status:500})}
}

export async function DELETE(request:Request){
  if(!(await guard()))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    if(body.kind!=="card")return NextResponse.json({error:"Only cards can be deleted in this first version."},{status:400});
    await deleteJourneyCard(String(body.id));
    return NextResponse.json(await getJourneyBoard());
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to delete card."},{status:500})}
}
