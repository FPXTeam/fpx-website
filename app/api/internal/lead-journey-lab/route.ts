import { NextResponse } from "next/server";
import { passwordMatches } from "../../../../lib/lead-journey-lab-auth";
import { createJourneyCard,deleteJourneyCard,getJourneyBoard,updateJourneyCard } from "../../../../lib/lead-journey-lab-airtable";

function guard(request:Request){
  return passwordMatches(request.headers.get("x-lead-journey-password")||"");
}

export async function GET(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  try{return NextResponse.json(await getJourneyBoard())}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to load board."},{status:500})}
}

export async function POST(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    await createJourneyCard(body);
    return NextResponse.json(await getJourneyBoard());
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to create card."},{status:500})}
}

export async function PATCH(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    await updateJourneyCard(String(body.id),body);
    return NextResponse.json(await getJourneyBoard());
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to update card."},{status:500})}
}

export async function DELETE(request:Request){
  if(!guard(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  try{
    await deleteJourneyCard(String(body.id));
    return NextResponse.json(await getJourneyBoard());
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to delete card."},{status:500})}
}
