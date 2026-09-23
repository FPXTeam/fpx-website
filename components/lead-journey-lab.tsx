// @ts-nocheck
"use client";

import { useMemo,useRef,useState } from "react";
import {
  Archive,ArrowRight,BookOpen,Boxes,CheckSquare,Copy,Download,Edit3,Eye,EyeOff,FileDown,Filter,
  GitMerge,GripVertical,History,Layers,Link2,Lock,LogOut,Maximize2,MessageSquare,Minus,Plus,
  Presentation,Redo2,RefreshCw,RotateCcw,Save,Search,Trash2,Undo2,Unlink,Users,WandSparkles,X
} from "lucide-react";

type Journey={id:string;name:string;description:string;order:number;active:boolean;group?:string;archived?:boolean;template?:boolean};
type LibraryCard={
  id:string;name:string;category:string;tool:string;use:string;action:string;automated:string;automationTool:string;
  assignedPerson:string;campaignName:string;subject:string;templateName:string;messagePurpose:string;timing:string;
  leadStatus:string;workshopStatus:string;workshopAnswer:string;notes:string;active:boolean;suggestedNextIds:string[];suggestedParentIds:string[];
  applicableJourneyIds:string[];global?:boolean;
};
type Card={id:string;title:string;notes:string;comments?:string;order:number;x:number;y:number;journeyIds:string[];libraryId:string};
type Connection={id:string;name:string;fromId:string;toId:string;journeyIds:string[];label:string;order:number;active:boolean};
type Board={configured:boolean;journeys:Journey[];library:LibraryCard[];cards:Card[];connections:Connection[]};

const LOCAL_KEY="fpx-lead-journey-lab-v4";
const nodeW=250,nodeH=128;

function emptyLibrary(id:string,name:string):LibraryCard{
  return {id,name,category:"Action",tool:"None",use:"",action:"",automated:"No",automationTool:"None",assignedPerson:"",
    campaignName:"",subject:"",templateName:"",messagePurpose:"",timing:"",leadStatus:"Not Applicable",workshopStatus:"Draft",
    workshopAnswer:"",notes:"",active:true,global:false,suggestedNextIds:[],suggestedParentIds:[],applicableJourneyIds:[]};
}
function fallbackBoard():Board{
  const journeys:Journey[]=[
    {id:"j-web",name:"Website Lead",description:"Direct sign-up, website enquiry form or direct email.",order:1,active:true},
    {id:"j-social",name:"Social Media Lead",description:"LinkedIn, Instagram or Facebook.",order:2,active:true},
    {id:"j-personal",name:"Personal Lead",description:"Lead from George or Gabriela's personal network.",order:3,active:true},
    {id:"j-referral",name:"Referral Lead",description:"Lead introduced or referred to FPX.",order:4,active:true},
  ];
  const all=journeys.map(j=>j.id);
  const mk=(id:string,name:string,category:string,tool="None",extra:any={})=>({
    ...emptyLibrary(id,name),category,tool,...extra,applicableJourneyIds:extra.applicableJourneyIds||all
  });
  const library:LibraryCard[]=[
    mk("l-lead","Lead","Source","None",{workshopStatus:"Agreed",suggestedNextIds:["l-capture"]}),
    mk("l-capture","Lead Capture","Capture","None",{leadStatus:"New Lead",workshopStatus:"Agreed",
      suggestedNextIds:["l-signup","l-form","l-email","l-linkedin","l-instagram","l-facebook","l-personal","l-referral"],suggestedParentIds:["l-lead"]}),
    mk("l-signup","Direct Sign-up","Capture","FPX App",{use:"Lead creates an FPX account directly.",action:"Create account",leadStatus:"Pending Activation",workshopStatus:"Needs Discussion",applicableJourneyIds:["j-web"],suggestedNextIds:["l-activated"]}),
    mk("l-form","Website Enquiry Form","Capture","Website Form",{use:"Capture a website enquiry.",action:"Submit lead capture form",leadStatus:"New Lead",workshopStatus:"Agreed",applicableJourneyIds:["j-web"],suggestedNextIds:["l-airtable-auto"]}),
    mk("l-email","Direct Email","Capture","Outlook",{use:"Lead emails FPX directly.",action:"Receive inbound email",assignedPerson:"George / Gabriela",leadStatus:"New Lead",workshopStatus:"Agreed",applicableJourneyIds:["j-web"],suggestedNextIds:["l-airtable-manual"]}),
    mk("l-linkedin","LinkedIn Lead","Capture","LinkedIn",{use:"Lead enters through LinkedIn.",action:"Capture lead",assignedPerson:"George / Gabriela",leadStatus:"New Lead",workshopStatus:"Agreed",applicableJourneyIds:["j-social"],suggestedNextIds:["l-airtable-manual"]}),
    mk("l-instagram","Instagram Lead","Capture","Instagram",{use:"Lead enters through Instagram.",action:"Capture lead",assignedPerson:"George / Gabriela",leadStatus:"New Lead",workshopStatus:"Agreed",applicableJourneyIds:["j-social"],suggestedNextIds:["l-airtable-manual"]}),
    mk("l-facebook","Facebook Lead","Capture","Facebook",{use:"Lead enters through Facebook.",action:"Capture lead",assignedPerson:"George / Gabriela",leadStatus:"New Lead",workshopStatus:"Agreed",applicableJourneyIds:["j-social"],suggestedNextIds:["l-airtable-manual"]}),
    mk("l-personal","Personal Lead","Source","None",{use:"Lead from George or Gabriela's personal network.",assignedPerson:"George / Gabriela",leadStatus:"New Lead",workshopStatus:"Agreed",applicableJourneyIds:["j-personal"],suggestedNextIds:["l-call","l-text","l-outlook","l-airtable-manual"]}),
    mk("l-referral","Referral Lead","Source","None",{use:"Lead introduced or referred to FPX.",assignedPerson:"George / Gabriela",leadStatus:"New Lead",workshopStatus:"Agreed",applicableJourneyIds:["j-referral"],suggestedNextIds:["l-call","l-text","l-outlook","l-airtable-manual"]}),
    mk("l-call","Call Lead","Communication","Call",{use:"Manual lead contact by phone.",action:"Make call",assignedPerson:"George / Gabriela",workshopStatus:"Draft"}),
    mk("l-text","Text Lead","Communication","Text",{use:"Manual lead contact by text.",action:"Send text",assignedPerson:"George / Gabriela",workshopStatus:"Draft"}),
    mk("l-outlook","Outlook Manual Email","Communication","Outlook",{use:"Manual one-to-one lead email.",action:"Send email",assignedPerson:"George / Gabriela",workshopStatus:"Draft"}),
    mk("l-airtable-auto","Airtable - Add Lead (Automated)","CRM","Airtable",{use:"Create CRM lead from a digital capture.",action:"Add lead",automated:"Yes",automationTool:"Make",assignedPerson:"System",timing:"Immediately",leadStatus:"New Lead",workshopStatus:"Needs Discussion",suggestedNextIds:["l-invite"]}),
    mk("l-airtable-manual","Airtable - Add Lead (Manual)","CRM","Airtable",{use:"Create CRM lead from a manual capture.",action:"Add lead",automated:"No",assignedPerson:"George / Gabriela",leadStatus:"New Lead",workshopStatus:"Agreed",suggestedNextIds:["l-invite"]}),
    mk("l-invite","FPX Invitation","Nurture","Brevo",{use:"Initial FPX account invitation nurture email.",action:"Send nurture email",automated:"Yes",automationTool:"Make",assignedPerson:"System",campaignName:"FPX Invitation",timing:"Initial invitation",leadStatus:"Invited",workshopStatus:"Needs Discussion",suggestedNextIds:["l-follow","l-converted"]}),
    mk("l-follow","FPX Invitation Follow-Up","Nurture","Brevo",{use:"Follow up if the lead has not replied or activated.",action:"Send nurture follow-up",automated:"Yes",automationTool:"Make",assignedPerson:"System",campaignName:"FPX Invitation Follow-Up",timing:"Wait 3 days",leadStatus:"Invited",workshopStatus:"Needs Discussion",suggestedNextIds:["l-one-month","l-converted"]}),
    mk("l-one-month","FPX Invitation - 1 Month","Nurture","Brevo",{use:"One-month nurture. Perk/incentive to be agreed.",action:"Send nurture email",automated:"Yes",automationTool:"Make",assignedPerson:"System",campaignName:"FPX Invitation 1 Month",timing:"Wait 1 month",leadStatus:"Invited",workshopStatus:"Needs Discussion",notes:"Perk / incentive to decide.",suggestedNextIds:["l-three-month","l-converted"]}),
    mk("l-three-month","FPX Invitation - 3 Months","Nurture","Brevo",{use:"Final planned nurture before no-response Lead Lost.",action:"Send nurture email",automated:"Yes",automationTool:"Make",assignedPerson:"System",campaignName:"FPX Invitation 3 Months",timing:"Wait 3 months",leadStatus:"Invited",workshopStatus:"Needs Discussion",notes:"Perk / incentive to decide. No reply after this routes to Lead Lost.",suggestedNextIds:["l-lost","l-converted"]}),
    mk("l-activated","Account Activated?","Decision","None",{use:"Check whether the FPX account has been activated.",action:"Review activation",automated:"To Decide",automationTool:"To Decide",leadStatus:"Pending Activation",workshopStatus:"Needs Discussion",applicableJourneyIds:["j-web"],suggestedNextIds:["l-converted","l-invite"]}),
    mk("l-converted","Converted","Outcome","Airtable",{use:"Lead conversion point: FPX account activated.",action:"Set lead to Converted",automated:"To Decide",automationTool:"To Decide",leadStatus:"Converted",workshopStatus:"Agreed"}),
    mk("l-lost","Lead Lost","Outcome","Airtable",{use:"Final lead outcome after the full nurture sequence has no reply, or the lead explicitly declines further contact.",action:"Close lead",automated:"To Decide",automationTool:"To Decide",leadStatus:"Not Applicable",workshopStatus:"Needs Discussion",notes:"Exact CRM handling for no-response Lead Lost to decide. Explicit DNC remains DNC."})
  ];
  const cards:Card[]=[
    {id:"c-lead",title:"Lead",notes:"",order:1,x:1250,y:60,journeyIds:all,libraryId:"l-lead"},
    {id:"c-capture",title:"Lead Capture",notes:"",order:2,x:1250,y:260,journeyIds:all,libraryId:"l-capture"},
    {id:"c-signup",title:"Direct Sign-up",notes:"",order:10,x:250,y:520,journeyIds:["j-web"],libraryId:"l-signup"},
    {id:"c-form",title:"Website Enquiry Form",notes:"",order:11,x:550,y:520,journeyIds:["j-web"],libraryId:"l-form"},
    {id:"c-email",title:"Direct Email",notes:"",order:12,x:850,y:520,journeyIds:["j-web"],libraryId:"l-email"},
    {id:"c-linkedin",title:"LinkedIn Lead",notes:"",order:20,x:1150,y:520,journeyIds:["j-social"],libraryId:"l-linkedin"},
    {id:"c-instagram",title:"Instagram Lead",notes:"",order:21,x:1450,y:520,journeyIds:["j-social"],libraryId:"l-instagram"},
    {id:"c-facebook",title:"Facebook Lead",notes:"",order:22,x:1750,y:520,journeyIds:["j-social"],libraryId:"l-facebook"},
    {id:"c-personal",title:"Personal Lead",notes:"",order:30,x:2050,y:520,journeyIds:["j-personal"],libraryId:"l-personal"},
    {id:"c-referral",title:"Referral Lead",notes:"",order:40,x:2350,y:520,journeyIds:["j-referral"],libraryId:"l-referral"},
    {id:"c-web-next",title:"What happens next? - Website",notes:"",order:50,x:650,y:760,journeyIds:["j-web"],libraryId:"l-airtable-manual"},
    {id:"c-social-next",title:"What happens next? - Social",notes:"",order:51,x:1450,y:760,journeyIds:["j-social"],libraryId:"l-airtable-manual"},
    {id:"c-personal-next",title:"What happens next? - Personal",notes:"",order:52,x:2050,y:760,journeyIds:["j-personal"],libraryId:"l-airtable-manual"},
    {id:"c-referral-next",title:"What happens next? - Referral",notes:"",order:53,x:2350,y:760,journeyIds:["j-referral"],libraryId:"l-airtable-manual"},
    {id:"c-activated",title:"Account Activated?",notes:"",order:54,x:250,y:760,journeyIds:["j-web"],libraryId:"l-activated"},
    {id:"c-invite",title:"FPX Invitation",notes:"",order:60,x:1250,y:1020,journeyIds:all,libraryId:"l-invite"},
    {id:"c-follow",title:"FPX Invitation Follow-Up",notes:"",order:61,x:1250,y:1240,journeyIds:all,libraryId:"l-follow"},
    {id:"c-one-month",title:"FPX Invitation - 1 Month",notes:"",order:62,x:1250,y:1460,journeyIds:all,libraryId:"l-one-month"},
    {id:"c-three-month",title:"FPX Invitation - 3 Months",notes:"",order:63,x:1250,y:1680,journeyIds:all,libraryId:"l-three-month"},
    {id:"c-converted",title:"Converted",notes:"",order:90,x:1040,y:1910,journeyIds:all,libraryId:"l-converted"},
    {id:"c-lost",title:"Lead Lost",notes:"",order:91,x:1460,y:1910,journeyIds:all,libraryId:"l-lost"}
  ];
  const x=(id:string,fromId:string,toId:string,journeyIds:string[],label=""):Connection=>({id,name:id,fromId,toId,journeyIds,label,order:Date.now(),active:true});
  const connections:Connection[]=[
    x("Lead → Capture","c-lead","c-capture",all),
    x("Capture → Sign-up","c-capture","c-signup",["j-web"]),
    x("Capture → Form","c-capture","c-form",["j-web"]),
    x("Capture → Email","c-capture","c-email",["j-web"]),
    x("Capture → LinkedIn","c-capture","c-linkedin",["j-social"]),
    x("Capture → Instagram","c-capture","c-instagram",["j-social"]),
    x("Capture → Facebook","c-capture","c-facebook",["j-social"]),
    x("Capture → Personal","c-capture","c-personal",["j-personal"]),
    x("Capture → Referral","c-capture","c-referral",["j-referral"]),
    x("Sign-up → Activated?","c-signup","c-activated",["j-web"]),
    x("Activated → Converted","c-activated","c-converted",["j-web"],"Yes"),
    x("Activated → Invitation","c-activated","c-invite",["j-web"],"No"),
    x("Form → Web next","c-form","c-web-next",["j-web"]),
    x("Email → Web next","c-email","c-web-next",["j-web"]),
    x("Web next → Invite","c-web-next","c-invite",["j-web"]),
    x("LinkedIn → Social next","c-linkedin","c-social-next",["j-social"]),
    x("Instagram → Social next","c-instagram","c-social-next",["j-social"]),
    x("Facebook → Social next","c-facebook","c-social-next",["j-social"]),
    x("Social next → Invite","c-social-next","c-invite",["j-social"]),
    x("Personal → Personal next","c-personal","c-personal-next",["j-personal"]),
    x("Personal next → Invite","c-personal-next","c-invite",["j-personal"]),
    x("Referral → Referral next","c-referral","c-referral-next",["j-referral"]),
    x("Referral next → Invite","c-referral-next","c-invite",["j-referral"]),
    x("Invite → Follow-Up","c-invite","c-follow",all),
    x("Follow-Up → 1 Month","c-follow","c-one-month",all),
    x("1 Month → 3 Months","c-one-month","c-three-month",all),
    x("3 Months → Converted","c-three-month","c-converted",all,"Activated"),
    x("3 Months → Lost","c-three-month","c-lost",all,"No reply")
  ];
  return {configured:false,journeys,library,cards,connections};
}
function norm(v:string){return v.trim().toLowerCase()}

export function LeadJourneyLab(){
  const [unlocked,setUnlocked]=useState(false);
  const [password,setPassword]=useState("");
  const [authError,setAuthError]=useState("");
  const [board,setBoard]=useState<Board>(fallbackBoard());
  const [activeJourneyId,setActiveJourneyId]=useState("all");
  const [selectedCardId,setSelectedCardId]=useState<string|null>(null);
  const [selectedConnectionId,setSelectedConnectionId]=useState<string|null>(null);
  const [connectingFromId,setConnectingFromId]=useState<string|null>(null);
  const [libraryOpen,setLibraryOpen]=useState(false);
  const [editingLibraryId,setEditingLibraryId]=useState<string|null>(null);
  const [adding,setAdding]=useState<{x:number;y:number;parentId?:string}|null>(null);
  const [addingJourney,setAddingJourney]=useState(false);
  const [contextMenu,setContextMenu]=useState<{x:number;y:number;canvasX:number;canvasY:number;cardId?:string}|null>(null);
  const [zoom,setZoom]=useState(.8);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const wrapRef=useRef<HTMLDivElement|null>(null);
  const canvasRef=useRef<HTMLDivElement|null>(null);
  const dragRef=useRef<{id:string;dx:number;dy:number;moved:boolean;before?:any[];group?:{id:string;x:number;y:number}[];startX?:number;startY?:number}|null>(null);
  const panRef=useRef<{startX:number;startY:number;scrollLeft:number;scrollTop:number}|null>(null);
  const selectRef=useRef<{startX:number;startY:number;additive:boolean}|null>(null);
  const [panning,setPanning]=useState(false);
  const [selectionBox,setSelectionBox]=useState<{x:number;y:number;w:number;h:number}|null>(null);
  const [selectMode,setSelectMode]=useState(false);
  const [layoutDirection,setLayoutDirection]=useState<"horizontal"|"vertical">("horizontal");
  const [displayName,setDisplayName]=useState("");
  const [journeyManagerOpen,setJourneyManagerOpen]=useState(false);
  const [toolsOpen,setToolsOpen]=useState(false);
  const [historyOpen,setHistoryOpen]=useState(false);
  const [changeLogOpen,setChangeLogOpen]=useState(false);
  const [mergeCardId,setMergeCardId]=useState<string|null>(null);
  const [presentationMode,setPresentationMode]=useState(false);
  const [miniMap,setMiniMap]=useState(true);
  const [hideAgreed,setHideAgreed]=useState(false);
  const [toolFilter,setToolFilter]=useState("All");
  const [assignedFilter,setAssignedFilter]=useState("All");
  const [statusFilter,setStatusFilter]=useState("All");
  const [bulkMode,setBulkMode]=useState(false);
  const [selectedCardIds,setSelectedCardIds]=useState<string[]>([]);
  const [snapshots,setSnapshots]=useState<any[]>([]);
  const [changeLog,setChangeLog]=useState<any[]>([]);
  const [layoutUndo,setLayoutUndo]=useState<any[][]>([]);
  const [layoutRedo,setLayoutRedo]=useState<any[][]>([]);

  const journeys=useMemo(()=>board.journeys.filter(j=>j.active&&!j.archived&&!j.template).sort((a,b)=>a.order-b.order),[board.journeys]);
  const mainJourney=useMemo(()=>journeys.find(j=>j.name==="FPX Sourcing - Main Lead Journey")||null,[journeys]);
  const mainJourneyId=mainJourney?.id||"";
  const subJourneys=useMemo(()=>journeys.filter(j=>j.id!==mainJourneyId),[journeys,mainJourneyId]);
  const journeyGroups=useMemo(()=>Array.from(new Set(subJourneys.map(j=>j.group||"Other"))).sort(),[subJourneys]);
  const libById=useMemo(()=>new Map(board.library.map(x=>[x.id,x] as const)),[board.library]);
  const cardById=useMemo(()=>new Map(board.cards.map(x=>[x.id,x] as const)),[board.cards]);
  const isMainView=activeJourneyId==="all";
  const currentJourneyId=isMainView?mainJourneyId:activeJourneyId;

  const baseVisibleCards=useMemo(()=>board.cards.filter(card=>
    currentJourneyId?card.journeyIds.includes(currentJourneyId):(activeJourneyId==="all"||card.journeyIds.includes(activeJourneyId))
  ),[board.cards,activeJourneyId,currentJourneyId]);
  const visibleCards=useMemo(()=>baseVisibleCards.filter(card=>{
    const def=libById.get(card.libraryId);
    if(hideAgreed&&def?.workshopStatus==="Agreed")return false;
    if(toolFilter!=="All"&&(def?.tool||"None")!==toolFilter)return false;
    if(assignedFilter!=="All"&&(def?.assignedPerson||"Unassigned")!==assignedFilter)return false;
    if(statusFilter!=="All"&&(def?.workshopStatus||"Draft")!==statusFilter)return false;
    return true;
  }),[baseVisibleCards,libById,hideAgreed,toolFilter,assignedFilter,statusFilter]);
  const visibleCardIds=useMemo(()=>new Set(visibleCards.map(c=>c.id)),[visibleCards]);
  const completion=useMemo(()=>{
    const total=baseVisibleCards.length;
    const agreed=baseVisibleCards.filter(card=>libById.get(card.libraryId)?.workshopStatus==="Agreed").length;
    const questions=baseVisibleCards.filter(card=>libById.get(card.libraryId)?.workshopStatus==="Needs Discussion").length;
    return {agreed,total,questions};
  },[baseVisibleCards,libById]);
  const visibleConnections=useMemo(()=>board.connections.filter(c=>c.active&&visibleCardIds.has(c.fromId)&&visibleCardIds.has(c.toId)&&(
    currentJourneyId?c.journeyIds.includes(currentJourneyId):(activeJourneyId==="all"||c.journeyIds.includes(activeJourneyId))
  )),[board.connections,visibleCardIds,activeJourneyId,currentJourneyId]);
  const outgoingMap=useMemo(()=>{
    const map=new Map<string,Connection[]>();
    visibleConnections.forEach(c=>map.set(c.fromId,[...(map.get(c.fromId)||[]),c]));
    map.forEach(list=>list.sort((a,b)=>a.order-b.order));
    return map;
  },[visibleConnections]);
  const incomingMap=useMemo(()=>{
    const map=new Map<string,Connection[]>();
    visibleConnections.forEach(c=>map.set(c.toId,[...(map.get(c.toId)||[]),c]));
    map.forEach(list=>list.sort((a,b)=>a.order-b.order));
    return map;
  },[visibleConnections]);

  const selectedCard=selectedCardId?cardById.get(selectedCardId)||null:null;
  const selectedConnection=selectedConnectionId?board.connections.find(c=>c.id===selectedConnectionId)||null:null;
  const selectedDef=selectedCard?libById.get(selectedCard.libraryId)||null:null;
  const width=Math.max(1300,...visibleCards.map(c=>c.x+420));
  const height=Math.max(950,...visibleCards.map(c=>c.y+360));

  function routedConnection(connection:Connection,index:number){
    const from=cardById.get(connection.fromId),to=cardById.get(connection.toId);
    if(!from||!to)return null;
    const outs=outgoingMap.get(from.id)||[connection],ins=incomingMap.get(to.id)||[connection];
    const oi=Math.max(0,outs.findIndex(c=>c.id===connection.id)),ii=Math.max(0,ins.findIndex(c=>c.id===connection.id));
    const obstacles=visibleCards.filter(c=>c.id!==from.id&&c.id!==to.id);
    const hitsH=(y:number,a:number,b:number)=>{const lo=Math.min(a,b),hi=Math.max(a,b);return obstacles.some(c=>y>c.y-14&&y<c.y+nodeH+14&&hi>c.x-14&&lo<c.x+nodeW+14)};
    const hitsV=(x:number,a:number,b:number)=>{const lo=Math.min(a,b),hi=Math.max(a,b);return obstacles.some(c=>x>c.x-14&&x<c.x+nodeW+14&&hi>c.y-14&&lo<c.y+nodeH+14)};
    if(layoutDirection==="horizontal"){
      const forward=to.x>=from.x;
      const x1=forward?from.x+nodeW:from.x,x2=forward?to.x:to.x+nodeW;
      const y1=from.y+nodeH*((oi+1)/(outs.length+1)),y2=to.y+nodeH*((ii+1)/(ins.length+1));
      const adjacent=forward&&(to.x-from.x)<=440;
      if(adjacent){
        const lane=(x1+x2)/2+(oi-(outs.length-1)/2)*10;
        if(!hitsH(y1,x1,lane)&&!hitsV(lane,y1,y2)&&!hitsH(y2,lane,x2)){
          const d="M "+x1+" "+y1+" L "+lane+" "+y1+" L "+lane+" "+y2+" L "+x2+" "+y2;
          return {d,mx:lane,my:(y1+y2)/2};
        }
      }
      const laneY=Math.max(...visibleCards.map(c=>c.y+nodeH))+70+(index%14)*16;
      const sx=x1+(forward?36:-36),tx=x2+(forward?-36:36);
      const d="M "+x1+" "+y1+" L "+sx+" "+y1+" L "+sx+" "+laneY+" L "+tx+" "+laneY+" L "+tx+" "+y2+" L "+x2+" "+y2;
      return {d,mx:(sx+tx)/2,my:laneY};
    }
    const forward=to.y>=from.y;
    const y1=forward?from.y+nodeH:from.y,y2=forward?to.y:to.y+nodeH;
    const x1=from.x+nodeW*((oi+1)/(outs.length+1)),x2=to.x+nodeW*((ii+1)/(ins.length+1));
    const adjacent=forward&&(to.y-from.y)<=310;
    if(adjacent){
      const lane=(y1+y2)/2+(oi-(outs.length-1)/2)*9;
      if(!hitsV(x1,y1,lane)&&!hitsH(lane,x1,x2)&&!hitsV(x2,lane,y2)){
        const d="M "+x1+" "+y1+" L "+x1+" "+lane+" L "+x2+" "+lane+" L "+x2+" "+y2;
        return {d,mx:(x1+x2)/2,my:lane};
      }
    }
    const laneX=Math.max(...visibleCards.map(c=>c.x+nodeW))+70+(index%14)*16;
    const sy=y1+(forward?34:-34),ty=y2+(forward?-34:34);
    const d="M "+x1+" "+y1+" L "+x1+" "+sy+" L "+laneX+" "+sy+" L "+laneX+" "+ty+" L "+x2+" "+ty+" L "+x2+" "+y2;
    return {d,mx:laneX,my:(sy+ty)/2};
  }

  function localSave(next:Board){
    setBoard(next);
    try{localStorage.setItem(LOCAL_KEY,JSON.stringify(next))}catch{}
  }
  function loadLocal(){
    try{
      const raw=localStorage.getItem(LOCAL_KEY);
      if(raw){
        const parsed=JSON.parse(raw);
        if(parsed?.cards&&parsed?.journeys&&parsed?.connections&&parsed?.library)return parsed as Board;
      }
    }catch{}
    return fallbackBoard();
  }

  async function request(method:string,body?:any){
    const response=await fetch("/api/internal/lead-journey-lab",{
      method,headers:{"Content-Type":"application/json","X-Lead-Journey-Password":password,"X-Lead-Journey-User":displayName||"Shared user"},
      body:body?JSON.stringify(body):undefined
    });
    const data=await response.json().catch(()=>({}));
    if(response.status===401){setUnlocked(false);throw new Error("Incorrect password.")}
    if(!response.ok)throw new Error(data.error||"Request failed.");
    const next:Board=data.configured===false?loadLocal():data;
    setBoard(next);
    return next;
  }

  async function rawRequest(path:string,method="GET",body?:any){
    const response=await fetch("/api/internal/lead-journey-lab"+path,{
      method,headers:{"Content-Type":"application/json","X-Lead-Journey-Password":password,"X-Lead-Journey-User":displayName||"Shared user"},
      body:body?JSON.stringify(body):undefined
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||"Request failed.");
    return data;
  }

  function currentLayout(cards=baseVisibleCards){
    return cards.map(card=>({id:card.id,x:card.x,y:card.y}));
  }
  async function applyLayout(layout:any[],pushRedo=false){
    const map=new Map(layout.map(item=>[item.id,item] as const));
    const previous=currentLayout(board.cards.filter(card=>map.has(card.id)));
    setBoard(prev=>({...prev,cards:prev.cards.map(card=>map.has(card.id)?{...card,x:map.get(card.id)!.x,y:map.get(card.id)!.y}:card)}));
    if(board.configured)await request("PATCH",{action:"bulkMove",cards:layout});
    if(pushRedo)setLayoutRedo(stack=>[...stack,previous]);
  }
  async function undoLayout(){
    const previous=layoutUndo.at(-1);if(!previous)return;
    setLayoutUndo(stack=>stack.slice(0,-1));
    await applyLayout(previous,true);
  }
  async function redoLayout(){
    const next=layoutRedo.at(-1);if(!next)return;
    const current=currentLayout(board.cards.filter(card=>next.some((x:any)=>x.id===card.id)));
    setLayoutRedo(stack=>stack.slice(0,-1));setLayoutUndo(stack=>[...stack,current]);
    await applyLayout(next,false);
  }

  async function unlock(e:React.FormEvent){
    e.preventDefault();setAuthError("");setLoading(true);
    try{
      const response=await fetch("/api/internal/lead-journey-lab",{headers:{"X-Lead-Journey-Password":password,"X-Lead-Journey-User":displayName||"Shared user"}});
      const data=await response.json().catch(()=>({}));
      if(!response.ok){setAuthError(data.error||"Incorrect password.");return}
      setBoard(data.configured===false?loadLocal():data);
      try{localStorage.setItem("fpx-ljl-user",displayName||"Shared user")}catch{}
      setUnlocked(true);
    }finally{setLoading(false)}
  }
  async function refresh(){
    setLoading(true);setError("");
    try{await request("GET")}catch(e){setError(e instanceof Error?e.message:"Unable to refresh.")}
    finally{setLoading(false)}
  }
  function lock(){
    setUnlocked(false);setPassword("");setSelectedCardId(null);setSelectedConnectionId(null);setConnectingFromId(null);
  }

  function mutateLocal(mutator:(draft:Board)=>Board){
    localSave(mutator(structuredClone(board)));
  }

  async function updateCard(id:string,changes:Partial<Card>){
    if(!board.configured){
      mutateLocal(d=>({...d,cards:d.cards.map(c=>c.id===id?{...c,...changes}:c)}));return;
    }
    await request("PATCH",{action:"updateCard",id,...changes});
  }
  async function updateConnection(id:string,changes:Partial<Connection>){
    if(!board.configured){
      mutateLocal(d=>({...d,connections:d.connections.map(c=>c.id===id?{...c,...changes}:c)}));return;
    }
    await request("PATCH",{action:"updateConnection",id,...changes});
  }
  async function deleteConnection(id:string){
    if(!board.configured){
      mutateLocal(d=>({...d,connections:d.connections.filter(c=>c.id!==id)}));
    }else await request("DELETE",{action:"deleteConnection",id});
    if(selectedConnectionId===id)setSelectedConnectionId(null);
  }
  async function createConnection(fromId:string,toId:string,label=""){
    if(fromId===toId)return;
    const exists=board.connections.some(c=>c.active&&c.fromId===fromId&&c.toId===toId&&(activeJourneyId==="all"||c.journeyIds.includes(activeJourneyId)));
    if(exists)return;
    const from=cardById.get(fromId),to=cardById.get(toId);
    if(!from||!to)return;
    const journeyIds=currentJourneyId
      ? [currentJourneyId]
      : Array.from(new Set(from.journeyIds.filter(id=>to.journeyIds.includes(id))));
    const finalJourneys=journeyIds.length?journeyIds:(activeJourneyId==="all"?journeys.map(j=>j.id):[activeJourneyId]);
    if(!board.configured){
      const id="x-"+Date.now();
      mutateLocal(d=>({...d,connections:[...d.connections,{id,name:`${from.title} → ${to.title}`,fromId,toId,journeyIds:finalJourneys,label,order:Date.now(),active:true}]}));
    }else await request("POST",{action:"createConnection",name:`${from.title} → ${to.title}`,fromId,toId,journeyIds:finalJourneys,label});
  }

  async function createCardFromLibrary(libraryId:string,title:string,journeyIds:string[],x:number,y:number,parentId?:string){
    const before=new Set(board.cards.map(c=>c.id));
    if(!board.configured){
      const newId="c-"+Date.now();
      const parent=parentId?board.cards.find(c=>c.id===parentId):null;
      mutateLocal(d=>{
        const nextCards=[...d.cards,{id:newId,title,notes:"",order:Date.now(),x,y,journeyIds,libraryId}];
        const nextConnections=parentId?[...d.connections,{id:"x-"+Date.now(),name:`${parent?.title||"Card"} → ${title}`,fromId:parentId,toId:newId,journeyIds,label:"",order:Date.now(),active:true}]:d.connections;
        return {...d,cards:nextCards,connections:nextConnections};
      });
      return newId;
    }
    const next=await request("POST",{action:"createCardFromLibrary",libraryId,title,journeyIds,x,y,order:Date.now()});
    const newId=next.cards.find((card:Card)=>!before.has(card.id))?.id||"";
    if(parentId&&newId){
      const parent=next.cards.find((card:Card)=>card.id===parentId);
      await request("POST",{action:"createConnection",name:`${parent?.title||"Card"} → ${title}`,fromId:parentId,toId:newId,journeyIds,label:""});
    }
    return newId;
  }

  async function createNewCard(library:Partial<LibraryCard>&{name:string},title:string,journeyIds:string[],x:number,y:number,parentId?:string){
    if(!board.configured){
      const stamp=Date.now(),libId="l-"+stamp,cardId="c-"+stamp;
      const def={...emptyLibrary(libId,library.name),...library,id:libId} as LibraryCard;
      const parent=parentId?board.cards.find(c=>c.id===parentId):null;
      mutateLocal(d=>({...d,library:[...d.library,def],cards:[...d.cards,{id:cardId,title,notes:"",order:stamp,x,y,journeyIds,libraryId:libId}],
        connections:parentId?[...d.connections,{id:"x-"+stamp,name:`${parent?.title||"Card"} → ${title}`,fromId:parentId,toId:cardId,journeyIds,label:"",order:stamp,active:true}]:d.connections}));
      return cardId;
    }
    const before=new Set(board.cards.map(c=>c.id));
    const next=await request("POST",{action:"createNewCard",title,journeyIds,x,y,order:Date.now(),library});
    const cardId=next.cards.find((card:Card)=>!before.has(card.id))?.id||"";
    if(parentId&&cardId){
      const parent=next.cards.find((card:Card)=>card.id===parentId);
      await request("POST",{action:"createConnection",name:`${parent?.title||"Card"} → ${title}`,fromId:parentId,toId:cardId,journeyIds,label:""});
    }
    return cardId;
  }

  async function deleteJourney(journey:Journey){
    if(!confirm(`Delete “${journey.name}”? This removes that journey's map cards and connections, but keeps Master Cards in the Card Library.`))return;
    setSaving(true);setError("");
    try{
      if(!board.configured){
        const id=journey.id;
        mutateLocal(d=>({
          ...d,
          journeys:d.journeys.filter(j=>j.id!==id),
          cards:d.cards.flatMap(card=>{
            if(!card.journeyIds.includes(id))return [card];
            const remaining=card.journeyIds.filter(journeyId=>journeyId!==id);
            return remaining.length?[{...card,journeyIds:remaining}]:[];
          }),
          connections:d.connections.flatMap(connection=>{
            if(!connection.journeyIds.includes(id))return [connection];
            const remaining=connection.journeyIds.filter(journeyId=>journeyId!==id);
            return remaining.length?[{...connection,journeyIds:remaining}]:[];
          }),
          library:d.library.map(card=>({...card,applicableJourneyIds:card.applicableJourneyIds.filter(journeyId=>journeyId!==id)}))
        }));
      }else{
        await request("DELETE",{action:"deleteJourney",id:journey.id,itemName:journey.name});
      }
      if(activeJourneyId===journey.id)setActiveJourneyId("all");
      setSelectedCardId(null);setSelectedConnectionId(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to delete journey.")}
    finally{setSaving(false)}
  }
  async function deleteActiveJourney(){
    const journey=board.journeys.find(j=>j.id===activeJourneyId);if(journey)await deleteJourney(journey);
  }

  async function createJourney(name:string,description:string,group="Other",templateSourceId=""){
    setSaving(true);setError("");
    try{
      if(templateSourceId&&board.configured){
        const before=new Set(board.journeys.map(j=>j.id));
        const next=await request("POST",{action:"duplicateJourney",sourceId:templateSourceId,name,group});
        const id=next.journeys.find((j:Journey)=>!before.has(j.id))?.id;
        if(id)setActiveJourneyId(id);
      }else if(!board.configured){
        const id="j-"+Date.now();
        mutateLocal(d=>({...d,journeys:[...d.journeys,{id,name,description,order:Date.now(),active:true,group,archived:false,template:false}]}));
        setActiveJourneyId(id);
      }else{
        const before=new Set(board.journeys.map(j=>j.id));
        const next=await request("POST",{action:"createJourney",name,description,group,order:Date.now()});
        const id=next.journeys.find((j:Journey)=>!before.has(j.id))?.id;
        if(id)setActiveJourneyId(id);
      }
      setAddingJourney(false);
    }catch(e){setError(e instanceof Error?e.message:"Unable to create journey.")}
    finally{setSaving(false)}
  }

  async function duplicateJourney(journey:Journey){
    const name=prompt("Duplicate journey as:",journey.name+" Copy");if(!name)return;
    setSaving(true);setError("");
    try{await request("POST",{action:"duplicateJourney",sourceId:journey.id,name,group:journey.group||"Other"});setJourneyManagerOpen(false)}
    catch(e){setError(e instanceof Error?e.message:"Unable to duplicate journey.")}
    finally{setSaving(false)}
  }
  async function setJourneyArchived(journey:Journey,archived:boolean){
    try{await request("PATCH",{action:"updateJourney",id:journey.id,name:journey.name,archived})}
    catch(e){setError(e instanceof Error?e.message:"Unable to archive journey.")}
  }
  async function setJourneyTemplate(journey:Journey,template:boolean){
    try{await request("PATCH",{action:"updateJourney",id:journey.id,name:journey.name,template})}
    catch(e){setError(e instanceof Error?e.message:"Unable to update journey template.")}
  }

  async function saveLibrary(def:LibraryCard){
    setSaving(true);setError("");
    try{
      if(!board.configured){
        mutateLocal(d=>({...d,library:d.library.map(x=>x.id===def.id?def:x)}));
      }else await request("PATCH",{action:"updateLibraryCard",...def});
      setEditingLibraryId(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to update card library.")}
    finally{setSaving(false)}
  }

  async function duplicateCard(card:Card){
    setSaving(true);setError("");
    try{
      const id=await createCardFromLibrary(
        card.libraryId,
        card.title,
        [...card.journeyIds],
        card.x+40,
        card.y+40
      );
      if(id)setSelectedCardId(id);
    }catch(e){setError(e instanceof Error?e.message:"Unable to duplicate card.")}
    finally{setSaving(false)}
  }

  async function saveCardComments(card:Card,comments:string){
    try{await updateCard(card.id,{comments})}catch(e){setError(e instanceof Error?e.message:"Unable to save comments.")}
  }

  async function mergeToJourney(sourceCard:Card,targetJourneyId:string,targetCardId:string){
    if(activeJourneyId==="all")return;
    setSaving(true);setError("");
    try{
      await request("POST",{action:"mergeJourney",sourceCardId:sourceCard.id,targetCardId,currentJourneyId:activeJourneyId,targetJourneyId,itemName:sourceCard.title});
      setMergeCardId(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to connect journeys.")}
    finally{setSaving(false)}
  }

  async function bulkAssign(journeyId:string){
    if(!selectedCardIds.length||!journeyId)return;
    try{await request("PATCH",{action:"bulkAssign",ids:selectedCardIds,journeyId});setSelectedCardIds([])}
    catch(e){setError(e instanceof Error?e.message:"Unable to assign cards.")}
  }
  async function bulkDelete(){
    if(!selectedCardIds.length||!confirm(`Delete ${selectedCardIds.length} selected cards?`))return;
    try{await request("DELETE",{action:"deleteCards",ids:selectedCardIds});setSelectedCardIds([])}
    catch(e){setError(e instanceof Error?e.message:"Unable to delete selected cards.")}
  }

  async function loadSnapshots(){
    try{const data=await rawRequest("?section=snapshots");setSnapshots(data.snapshots||[]);setHistoryOpen(true)}
    catch(e){setError(e instanceof Error?e.message:"Unable to load snapshots.")}
  }
  async function saveSnapshot(){
    const name=prompt("Snapshot name:",activeJourneyId==="all"?"Main View Snapshot":(board.journeys.find(j=>j.id===activeJourneyId)?.name||"Journey")+" Snapshot");
    if(!name)return;
    const snapshot={journeyId:currentJourneyId,cards:baseVisibleCards.map(c=>({id:c.id,x:c.x,y:c.y})),connections:visibleConnections.map(c=>({id:c.id,fromId:c.fromId,toId:c.toId,label:c.label}))};
    try{await request("POST",{action:"createSnapshot",name,journeyId:currentJourneyId,snapshot});await loadSnapshots()}
    catch(e){setError(e instanceof Error?e.message:"Unable to save snapshot.")}
  }
  async function restoreSnapshot(snapshot:any){
    if(!confirm("Restore this snapshot's card layout?"))return;
    try{await request("PATCH",{action:"restoreSnapshot",id:snapshot.id,name:snapshot.name});setHistoryOpen(false)}
    catch(e){setError(e instanceof Error?e.message:"Unable to restore snapshot.")}
  }
  async function removeSnapshot(snapshot:any){
    if(!confirm(`Delete snapshot “${snapshot.name}”?`))return;
    try{await request("DELETE",{action:"deleteSnapshot",id:snapshot.id,itemName:snapshot.name});await loadSnapshots()}
    catch(e){setError(e instanceof Error?e.message:"Unable to delete snapshot.")}
  }
  async function loadChangeLog(){
    try{const data=await rawRequest("?section=changes");setChangeLog(data.changes||[]);setChangeLogOpen(true)}
    catch(e){setError(e instanceof Error?e.message:"Unable to load change log.")}
  }

  function fitSelected(){
    const ids=selectedCardIds.length?selectedCardIds:(selectedCardId?[selectedCardId]:[]);
    const cards=visibleCards.filter(c=>ids.includes(c.id));if(!cards.length){fitView();return}
    const wrap=wrapRef.current;if(!wrap)return;
    const minX=Math.min(...cards.map(c=>c.x)),minY=Math.min(...cards.map(c=>c.y));
    const maxX=Math.max(...cards.map(c=>c.x+nodeW)),maxY=Math.max(...cards.map(c=>c.y+nodeH));
    const next=Math.max(.5,Math.min(1.4,(wrap.clientWidth-100)/(maxX-minX+100),(wrap.clientHeight-100)/(maxY-minY+100)));
    setZoom(next);requestAnimationFrame(()=>wrap.scrollTo({left:Math.max(0,minX*next-50),top:Math.max(0,minY*next-50),behavior:"smooth"}));
  }

  function exportSvg(){
    const cards=visibleCards;if(!cards.length)return;
    const maxX=Math.max(...cards.map(c=>c.x+nodeW))+60,maxY=Math.max(...cards.map(c=>c.y+nodeH))+60;
    const esc=(s:string)=>s.replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]||m));
    const lines=visibleConnections.map(conn=>{
      const a=cardById.get(conn.fromId),b=cardById.get(conn.toId);if(!a||!b)return "";
      return `<line x1="${a.x+nodeW/2}" y1="${a.y+nodeH}" x2="${b.x+nodeW/2}" y2="${b.y}" stroke="#8fa096" stroke-width="2"/>`;
    }).join("");
    const nodes=cards.map(card=>`<g><rect x="${card.x}" y="${card.y}" width="${nodeW}" height="${nodeH}" rx="10" fill="white" stroke="#cfd8d2"/><text x="${card.x+14}" y="${card.y+35}" font-family="Arial" font-size="16" fill="#040E0E">${esc(card.title)}</text></g>`).join("");
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${maxX}" height="${maxY}" viewBox="0 0 ${maxX} ${maxY}"><rect width="100%" height="100%" fill="#f8faf8"/>${lines}${nodes}</svg>`;
    const url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));const a=document.createElement("a");a.href=url;a.download="fpx-lead-journey.svg";a.click();URL.revokeObjectURL(url);
  }

  async function removeCard(card:Card){
    if(!confirm(`Delete “${card.title}” from the journey map?`))return;
    const related=board.connections.filter(c=>c.fromId===card.id||c.toId===card.id);
    if(!board.configured){
      mutateLocal(d=>({...d,cards:d.cards.filter(c=>c.id!==card.id),connections:d.connections.filter(c=>c.fromId!==card.id&&c.toId!==card.id)}));
    }else{
      for(const c of related)await request("DELETE",{action:"deleteConnection",id:c.id});
      await request("DELETE",{action:"deleteCard",id:card.id});
    }
    setSelectedCardId(null);
  }

  function startDrag(e:React.PointerEvent,card:Card){
    if((e.target as HTMLElement).closest("button"))return;
    const rect=canvasRef.current?.getBoundingClientRect(); if(!rect)return;
    setSelectedCardId(card.id);setSelectedConnectionId(null);setContextMenu(null);
    if(presentationMode)return;
    if(selectMode){
      setSelectedCardIds(ids=>ids.includes(card.id)?ids.filter(id=>id!==card.id):[...ids,card.id]);
      setBulkMode(true);return;
    }
    if(bulkMode){
      if(!selectedCardIds.includes(card.id)){setSelectedCardIds(ids=>[...ids,card.id]);return}
      const group=board.cards.filter(c=>selectedCardIds.includes(c.id)).map(c=>({id:c.id,x:c.x,y:c.y}));
      dragRef.current={id:card.id,dx:0,dy:0,moved:false,before:currentLayout(board.cards.filter(c=>selectedCardIds.includes(c.id))),group,startX:e.clientX,startY:e.clientY};
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);return;
    }
    if(e.shiftKey){setSelectedCardIds(ids=>ids.includes(card.id)?ids.filter(id=>id!==card.id):[...ids,card.id]);return}
    dragRef.current={id:card.id,dx:(e.clientX-rect.left)/zoom-card.x,dy:(e.clientY-rect.top)/zoom-card.y,moved:false,before:currentLayout([card])};
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function dragMove(e:React.PointerEvent){
    const drag=dragRef.current,rect=canvasRef.current?.getBoundingClientRect();if(!drag||!rect)return;
    if(drag.group?.length){
      const dx=(e.clientX-(drag.startX||e.clientX))/zoom,dy=(e.clientY-(drag.startY||e.clientY))/zoom;
      if(Math.abs(dx)>2||Math.abs(dy)>2)drag.moved=true;
      const map=new Map(drag.group.map(g=>[g.id,{x:Math.max(20,Math.round(g.x+dx)),y:Math.max(20,Math.round(g.y+dy))}] as const));
      setBoard(prev=>({...prev,cards:prev.cards.map(card=>map.has(card.id)?{...card,...map.get(card.id)!}:card)}));return;
    }
    const x=Math.max(20,Math.round((e.clientX-rect.left)/zoom-drag.dx));
    const y=Math.max(20,Math.round((e.clientY-rect.top)/zoom-drag.dy));
    const current=board.cards.find(c=>c.id===drag.id);
    if(current&&(Math.abs(current.x-x)>2||Math.abs(current.y-y)>2))drag.moved=true;
    setBoard(prev=>({...prev,cards:prev.cards.map(c=>c.id===drag.id?{...c,x,y}:c)}));
  }
  async function endDrag(){
    const drag=dragRef.current;dragRef.current=null;if(!drag?.moved)return;
    const card=board.cards.find(c=>c.id===drag.id);if(!card)return;
    if(drag.before?.length){setLayoutUndo(stack=>[...stack,drag.before!]);setLayoutRedo([])}
    if(!board.configured){localSave(board);return}
    try{
      if(drag.group?.length){
        const ids=new Set(drag.group.map(g=>g.id));
        await request("PATCH",{action:"bulkMove",cards:board.cards.filter(c=>ids.has(c.id)).map(c=>({id:c.id,x:c.x,y:c.y}))});
      }else await request("PATCH",{action:"updateCard",id:card.id,x:card.x,y:card.y});
    }catch(e){setError(e instanceof Error?e.message:"Unable to save card position.")}
  }

  function startPan(e:React.PointerEvent<HTMLDivElement>){
    if(e.button!==0)return;
    const target=e.target as HTMLElement;
    if(target.closest(".ljl-node,.ljl-zoom-controls,.ljl-line-hit,button,select,input,textarea"))return;
    const wrap=wrapRef.current,canvas=canvasRef.current;if(!wrap||!canvas)return;
    e.preventDefault();setContextMenu(null);
    if(selectMode||e.shiftKey){
      const rect=canvas.getBoundingClientRect();
      const x=Math.max(0,(e.clientX-rect.left)/zoom),y=Math.max(0,(e.clientY-rect.top)/zoom);
      selectRef.current={startX:x,startY:y,additive:e.shiftKey};
      if(!e.shiftKey)setSelectedCardIds([]);
      setSelectionBox({x,y,w:0,h:0});
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    panRef.current={startX:e.clientX,startY:e.clientY,scrollLeft:wrap.scrollLeft,scrollTop:wrap.scrollTop};
    setPanning(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function movePan(e:React.PointerEvent<HTMLDivElement>){
    const canvas=canvasRef.current;
    if(selectRef.current&&canvas){
      const rect=canvas.getBoundingClientRect();
      const x=(e.clientX-rect.left)/zoom,y=(e.clientY-rect.top)/zoom;
      const sx=selectRef.current.startX,sy=selectRef.current.startY;
      const box={x:Math.min(sx,x),y:Math.min(sy,y),w:Math.abs(x-sx),h:Math.abs(y-sy)};
      setSelectionBox(box);
      const hit=visibleCards.filter(card=>card.x<box.x+box.w&&card.x+nodeW>box.x&&card.y<box.y+box.h&&card.y+nodeH>box.y).map(card=>card.id);
      setSelectedCardIds(prev=>selectRef.current?.additive?Array.from(new Set([...prev,...hit])):hit);
      if(hit.length)setBulkMode(true);
      return;
    }
    const pan=panRef.current,wrap=wrapRef.current;if(!pan||!wrap)return;
    wrap.scrollLeft=pan.scrollLeft-(e.clientX-pan.startX);
    wrap.scrollTop=pan.scrollTop-(e.clientY-pan.startY);
  }
  function endPan(e:React.PointerEvent<HTMLDivElement>){
    if(selectRef.current){
      selectRef.current=null;setSelectionBox(null);
      if(selectedCardIds.length)setBulkMode(true);
      try{e.currentTarget.releasePointerCapture(e.pointerId)}catch{}
      return;
    }
    if(!panRef.current)return;
    panRef.current=null;setPanning(false);
    try{e.currentTarget.releasePointerCapture(e.pointerId)}catch{}
  }
  function wheelZoom(e:React.WheelEvent<HTMLDivElement>){
    e.preventDefault();
    const wrap=wrapRef.current;if(!wrap)return;
    const rect=wrap.getBoundingClientRect();
    const pointerX=e.clientX-rect.left;
    const pointerY=e.clientY-rect.top;
    const worldX=(wrap.scrollLeft+pointerX)/zoom;
    const worldY=(wrap.scrollTop+pointerY)/zoom;
    const direction=e.deltaY>0?-1:1;
    const next=Math.max(.25,Math.min(1.5,Math.round((zoom+direction*.1)*100)/100));
    if(next===zoom)return;
    setZoom(next);
    requestAnimationFrame(()=>{
      wrap.scrollLeft=Math.max(0,worldX*next-pointerX);
      wrap.scrollTop=Math.max(0,worldY*next-pointerY);
    });
  }

  async function autoAlign(cardsOverride?:Card[],direction:"horizontal"|"vertical"=layoutDirection){
    const cards=cardsOverride?.length?cardsOverride:visibleCards;
    const before=currentLayout(cards);
    const chosenIds=new Set(cards.map(c=>c.id));
    const connections=visibleConnections.filter(c=>chosenIds.has(c.fromId)&&chosenIds.has(c.toId));
    if(!cards.length)return;
    const ids=new Set(cards.map(c=>c.id));
    const rawChildren=new Map<string,string[]>();
    for(const c of connections){
      if(!ids.has(c.fromId)||!ids.has(c.toId))continue;
      rawChildren.set(c.fromId,[...(rawChildren.get(c.fromId)||[]),c.toId]);
    }
    const visiting=new Set<string>(),visited=new Set<string>(),backEdges=new Set<string>();
    const edgeKey=(a:string,b:string)=>a+"|"+b;
    function walk(id:string){
      visiting.add(id);visited.add(id);
      for(const child of rawChildren.get(id)||[]){
        if(visiting.has(child)){backEdges.add(edgeKey(id,child));continue}
        if(!visited.has(child))walk(child);
      }
      visiting.delete(id);
    }
    cards.forEach(c=>{if(!visited.has(c.id))walk(c.id)});
    const incoming=new Map(cards.map(c=>[c.id,0] as const));
    const children=new Map<string,string[]>();
    for(const c of connections){
      if(!ids.has(c.fromId)||!ids.has(c.toId)||backEdges.has(edgeKey(c.fromId,c.toId)))continue;
      incoming.set(c.toId,(incoming.get(c.toId)||0)+1);
      children.set(c.fromId,[...(children.get(c.fromId)||[]),c.toId]);
    }
    const depth=new Map<string,number>();
    const queue=cards.filter(c=>(incoming.get(c.id)||0)===0).map(c=>c.id);
    queue.forEach(id=>depth.set(id,0));
    let guard=0;
    while(queue.length&&guard++<Math.max(20,cards.length*4)){
      const id=queue.shift()!,d=depth.get(id)||0;
      for(const child of children.get(id)||[]){
        depth.set(child,Math.max(depth.get(child)||0,d+1));
        incoming.set(child,(incoming.get(child)||1)-1);
        if((incoming.get(child)||0)===0)queue.push(child);
      }
    }
    cards.forEach(c=>{if(!depth.has(c.id))depth.set(c.id,0)});
    const groups=new Map<number,Card[]>();
    for(const card of cards){const d=depth.get(card.id)||0;groups.set(d,[...(groups.get(d)||[]),card])}
    const maxCount=Math.max(...Array.from(groups.values()).map(g=>g.length),1);
    const moved:Card[]=[];
    if(direction==="horizontal"){
      const centerY=Math.max(430,(maxCount*(nodeH+58))/2+70);
      Array.from(groups.entries()).sort((a,b)=>a[0]-b[0]).forEach(([d,column])=>{
        column.sort((a,b)=>a.y-b.y||a.title.localeCompare(b.title));
        const colHeight=column.length*nodeH+(column.length-1)*58;
        const startY=Math.max(55,centerY-colHeight/2);
        column.forEach((card,i)=>moved.push({...card,x:70+d*330,y:Math.round(startY+i*(nodeH+58))}));
      });
    }else{
      const gap=72,centerX=Math.max(700,(maxCount*(nodeW+gap))/2+100);
      Array.from(groups.entries()).sort((a,b)=>a[0]-b[0]).forEach(([d,row])=>{
        row.sort((a,b)=>a.x-b.x||a.title.localeCompare(b.title));
        const rowWidth=row.length*nodeW+(row.length-1)*gap;
        const startX=Math.max(55,centerX-rowWidth/2);
        row.forEach((card,i)=>moved.push({...card,x:Math.round(startX+i*(nodeW+gap)),y:70+d*220}));
      });
    }
    const map=new Map(moved.map(c=>[c.id,c] as const));
    setLayoutUndo(stack=>[...stack,before]);setLayoutRedo([]);
    setBoard(prev=>({...prev,cards:prev.cards.map(c=>map.get(c.id)||c)}));
    if(!board.configured){
      const next={...board,cards:board.cards.map(c=>map.get(c.id)||c)};localSave(next);
    }else{
      try{await request("PATCH",{action:"bulkMove",cards:moved.map(c=>({id:c.id,x:c.x,y:c.y}))})}
      catch(e){setError(e instanceof Error?e.message:"Unable to save alignment.")}
    }
  }

  function fitView(){
    const wrap=wrapRef.current;if(!wrap||!visibleCards.length)return;
    const minX=Math.min(...visibleCards.map(c=>c.x)),minY=Math.min(...visibleCards.map(c=>c.y));
    const maxX=Math.max(...visibleCards.map(c=>c.x+nodeW)),maxY=Math.max(...visibleCards.map(c=>c.y+nodeH));
    const availableW=Math.max(320,wrap.clientWidth-80),availableH=Math.max(320,wrap.clientHeight-80);
    const next=Math.max(.25,Math.min(1.35,availableW/(maxX-minX),availableH/(maxY-minY)));
    setZoom(Math.round(next*100)/100);
    requestAnimationFrame(()=>{wrap.scrollTo({left:Math.max(0,minX*next-40),top:Math.max(0,minY*next-40),behavior:"smooth"})});
  }

  function canvasContext(e:React.MouseEvent){
    if(presentationMode)return;
    if((e.target as HTMLElement).closest(".ljl-node"))return;
    e.preventDefault();
    const rect=canvasRef.current?.getBoundingClientRect();if(!rect)return;
    setContextMenu({x:e.clientX,y:e.clientY,canvasX:(e.clientX-rect.left)/zoom,canvasY:(e.clientY-rect.top)/zoom});
  }
  function cardContext(e:React.MouseEvent,card:Card){
    if(presentationMode)return;
    e.preventDefault();e.stopPropagation();setSelectedCardId(card.id);setSelectedConnectionId(null);
    setContextMenu({x:e.clientX,y:e.clientY,canvasX:card.x,canvasY:card.y,cardId:card.id});
  }

  async function connectHandle(targetId:string){
    if(!connectingFromId||connectingFromId===targetId){setConnectingFromId(null);return}
    try{await createConnection(connectingFromId,targetId)}catch(e){setError(e instanceof Error?e.message:"Unable to connect cards.")}
    finally{setConnectingFromId(null)}
  }

  async function addSuggested(def:LibraryCard,index:number){
    if(!selectedCard)return;
    const applicable=activeJourneyId==="all"?selectedCard.journeyIds:[activeJourneyId];
    const existing=visibleCards.find(c=>c.libraryId===def.id);
    try{
      if(existing){await createConnection(selectedCard.id,existing.id);setSelectedCardId(existing.id);return}
      const siblings=(selectedDef?.suggestedNextIds||[]).filter(id=>{
        const d=libById.get(id);return d&&(activeJourneyId==="all"||!d.applicableJourneyIds.length||d.applicableJourneyIds.includes(activeJourneyId));
      });
      const offset=(index-(siblings.length-1)/2)*300;
      const id=await createCardFromLibrary(def.id,def.name,applicable,Math.max(30,selectedCard.x+offset),selectedCard.y+220,selectedCard.id);
      if(id)setSelectedCardId(id);
    }catch(e){setError(e instanceof Error?e.message:"Unable to add suggestion.")}
  }

  const incoming=selectedCard?visibleConnections.filter(c=>c.toId===selectedCard.id):[];
  const outgoing=selectedCard?visibleConnections.filter(c=>c.fromId===selectedCard.id):[];
  const suggestedNext=selectedDef?(selectedDef.suggestedNextIds||[]).map(id=>libById.get(id)).filter((d):d is LibraryCard=>Boolean(d)&&(
    activeJourneyId==="all"||!d.applicableJourneyIds.length||d.applicableJourneyIds.includes(activeJourneyId)
  )):[];
  const suggestedParents=selectedDef?(selectedDef.suggestedParentIds||[]).flatMap(id=>visibleCards.filter(c=>c.libraryId===id)):[];

  if(!unlocked)return <main className="ljl-lock"><div className="ljl-lock-card">
    <div className="ljl-mark">FPX <span>INTERNAL</span></div><div className="ljl-lock-icon"><Lock size={22}/></div>
    <h1>Lead Journey Lab</h1>
    <form onSubmit={unlock}>
      <label>Your name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Gabriel / George / Gabriela"/></label>
      <label>Password<input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/></label>
      {authError&&<small className="ljl-error">{authError}</small>}
      <button disabled={loading}>{loading?"Checking…":<>Open <ArrowRight size={16}/></>}</button></form>
  </div></main>;

  return <main className={"ljl "+(presentationMode?"is-presentation":"")} onClick={()=>setContextMenu(null)}>
    <header className="ljl-topbar">
      <div className="ljl-top-left"><div className="ljl-mark">FPX <span>INTERNAL</span></div><strong>Lead Journey Lab</strong></div>
      <div className="ljl-view-switcher">
        <button className={activeJourneyId==="all"?"active":""} onClick={()=>{setActiveJourneyId("all");setSelectedCardId(null);setSelectedConnectionId(null)}}><Layers size={14}/> Main View</button>
        <select value={activeJourneyId==="all"?"":activeJourneyId} onChange={e=>{setActiveJourneyId(e.target.value||"all");setSelectedCardId(null);setSelectedConnectionId(null)}}>
          <option value="">Choose Sub View</option>
          {journeyGroups.map(group=><optgroup key={group} label={group}>{subJourneys.filter(j=>(j.group||"Other")===group).map(j=><option key={j.id} value={j.id}>{j.name}</option>)}</optgroup>)}
        </select>
        <span className="ljl-progress">{completion.agreed}/{completion.total} agreed{completion.questions?" · "+completion.questions+" questions":""}</span>
      </div>
      <div className="ljl-top-actions">
        {presentationMode?<>
          <button onClick={()=>setPresentationMode(false)}><EyeOff size={14}/> Exit Presentation</button>
          <button onClick={fitView}><Maximize2 size={14}/> Fit</button>
        </>:<>
          <button onClick={()=>setLibraryOpen(true)}><BookOpen size={14}/> Card Library</button>
          <button onClick={()=>setJourneyManagerOpen(true)}><Users size={14}/> Journeys</button>
          <button onClick={()=>setAddingJourney(true)}><Plus size={14}/> Journey</button>
          <button onClick={()=>setAdding({x:520,y:180})}><Plus size={14}/> Add Card</button>
          <button className={layoutDirection==="horizontal"?"active":""} onClick={()=>{setLayoutDirection("horizontal");autoAlign(undefined,"horizontal")}} title="Arrange the current journey left to right">Horizontal</button>
          <button className={layoutDirection==="vertical"?"active":""} onClick={()=>{setLayoutDirection("vertical");autoAlign(undefined,"vertical")}} title="Arrange the current journey top to bottom">Vertical</button>
          <button className={selectMode?"active":""} onClick={()=>setSelectMode(v=>!v)} title="Box Select: drag across cards. Shift + drag also selects without changing modes."><CheckSquare size={14}/> Select</button>
          <button disabled={!layoutUndo.length} onClick={undoLayout} title="Undo last layout move"><Undo2 size={14}/></button>
          <button disabled={!layoutRedo.length} onClick={redoLayout} title="Redo layout move"><Redo2 size={14}/></button>
          <button onClick={()=>setToolsOpen(true)}><Filter size={14}/> Tools</button>
          <button onClick={loadSnapshots}><History size={14}/> History</button>
          <button onClick={()=>setPresentationMode(true)}><Presentation size={14}/> Present</button>
          <button onClick={refresh} disabled={loading}><RefreshCw size={14}/></button>
          <button onClick={lock}><LogOut size={14}/></button>
        </>}
      </div>
    </header>

    {bulkMode&&!presentationMode&&<BulkBar count={selectedCardIds.length} journeys={journeys}
      onAssign={bulkAssign} onDelete={bulkDelete}
      onAlign={()=>autoAlign(visibleCards.filter(card=>selectedCardIds.includes(card.id)))}
      onFit={fitSelected} onClear={()=>setSelectedCardIds([])} onExit={()=>{setBulkMode(false);setSelectedCardIds([])}}/>}
    {!board.configured&&<div className="ljl-storage-note">Preview storage only. Connect the Airtable token in Vercel before the three-person shared workshop.</div>}
    {error&&<div className="ljl-banner ljl-error">{error}</div>}
    {connectingFromId&&<div className="ljl-connect-mode">Connecting from <strong>{cardById.get(connectingFromId)?.title}</strong>. Click the top connector on the destination card. <button onClick={()=>setConnectingFromId(null)}>Cancel</button></div>}
    {selectMode&&!presentationMode&&<div className="ljl-select-hint"><strong>Box Select:</strong> drag across cards. Click Select again to return to normal pan. You can also hold Shift + drag at any time.</div>}

    <section className="ljl-workspace">
      <div ref={wrapRef} className={"ljl-canvas-wrap "+(panning?"is-panning ":"")+(selectMode?"is-selecting":"")}
        onContextMenu={canvasContext} onPointerDown={startPan} onPointerMove={movePan}
        onPointerUp={endPan} onPointerCancel={endPan} onWheel={wheelZoom}>
        <div className="ljl-zoom-controls" onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setZoom(z=>Math.max(.25,Math.round((z-.1)*100)/100))}><Minus size={15}/></button>
          <span>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(1.5,Math.round((z+.1)*100)/100))}><Plus size={15}/></button>
          <button onClick={()=>setZoom(.8)} title="Reset zoom"><RotateCcw size={14}/></button>
        </div>

        <div className="ljl-canvas-scale" style={{width:width*zoom,height:height*zoom}}>
          <div ref={canvasRef} className="ljl-canvas" style={{width,height,transform:`scale(${zoom})`}}
            onPointerMove={dragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
            <svg className="ljl-lines" width={width} height={height}>
              <defs><marker id="lab-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>
              {visibleConnections.map((connection,index)=>{
                const route=routedConnection(connection,index);if(!route)return null;
                return <g key={connection.id} className={selectedConnectionId===connection.id?"is-selected":""}>
                  <path className="ljl-line-hit" d={route.d} onClick={e=>{e.stopPropagation();setSelectedConnectionId(connection.id);setSelectedCardId(null)}}/>
                  <path className="ljl-line-shadow" d={route.d}/>
                  <path className="ljl-line" d={route.d} markerEnd="url(#lab-arrow)"/>
                  {connection.label&&<text x={route.mx} y={route.my-7}>{connection.label}</text>}
                </g>;
              })}
            </svg>
            {selectionBox&&<div className="ljl-selection-box" style={{left:selectionBox.x,top:selectionBox.y,width:selectionBox.w,height:selectionBox.h}}/>}

            {visibleCards.map(card=>{
              const def=libById.get(card.libraryId);
              return <article key={card.id} className={"ljl-node "+(def?.category==="Wait"?"is-wait ":"")+(def?.workshopStatus==="Needs Discussion"?"needs-discussion ":"")+(selectedCardId===card.id?"is-selected ":"")+(selectedCardIds.includes(card.id)?"is-bulk-selected":"")}
                style={{left:card.x,top:card.y}} onPointerDown={e=>startDrag(e,card)}
                onPointerMove={dragMove} onPointerUp={endDrag} onPointerCancel={endDrag}
                onContextMenu={e=>cardContext(e,card)}>
                {!presentationMode&&<button className="ljl-handle input" title="Connect to this card" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();connectHandle(card.id)}}/>}
                <div className="ljl-node-top"><span>{def?.category||"Card"}</span>{bulkMode?<CheckSquare size={15}/>:<GripVertical size={15}/>}</div>
                <h2>{card.title}</h2>
                <div className="ljl-node-meta">
                  {def?.tool&&def.tool!=="None"&&<span>{def.tool}</span>}
                  {def?.assignedPerson&&<span>{def.assignedPerson}</span>}
                  {def?.workshopStatus&&<span>{def.workshopStatus}</span>}
                </div>
                {!presentationMode&&!bulkMode&&<div className="ljl-node-actions">
                  <button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setAdding({x:card.x,y:card.y+220,parentId:card.id})}}><Plus size={13}/> Next</button>
                  <button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setSelectedCardId(card.id);setSelectedConnectionId(null)}}><Edit3 size={13}/></button>
                </div>}
                {!presentationMode&&<button className={"ljl-handle output "+(connectingFromId===card.id?"active":"")} title="Start connection"
                  onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setConnectingFromId(connectingFromId===card.id?null:card.id)}}/>}
              </article>;
            })}
          </div>
        </div>
        {miniMap&&<MiniMap cards={visibleCards} width={width} height={height}/>}
      </div>

      {!presentationMode&&<aside className="ljl-inspector">
        {selectedConnection?<ConnectionInspector key={selectedConnection.id} connection={selectedConnection} cards={visibleCards}
          onSave={updateConnection} onDisconnect={()=>deleteConnection(selectedConnection.id)}/>:
        selectedCard&&selectedDef?<CardInspector card={selectedCard} def={selectedDef} incoming={incoming} outgoing={outgoing}
          cardById={cardById} suggestedParents={suggestedParents} suggestedNext={suggestedNext}
          onEditAll={()=>setEditingLibraryId(selectedDef.id)} onDisconnect={deleteConnection}
          onConnectParent={(parent)=>createConnection(parent.id,selectedCard.id)} onAddSuggestion={addSuggested}
          onComments={(comments:string)=>saveCardComments(selectedCard,comments)}
          onResolve={(answer:string)=>saveLibrary({...selectedDef,workshopAnswer:answer.trim(),workshopStatus:"Agreed"})}
          onMerge={()=>activeJourneyId!=="all"&&setMergeCardId(selectedCard.id)}
          canMerge={activeJourneyId!=="all"} onDuplicate={()=>duplicateCard(selectedCard)} onDelete={()=>removeCard(selectedCard)}/>:
        <div className="ljl-empty"><Link2 size={19}/><strong>Select a card or connection</strong><p>Card details, suggestions and connection controls will appear here.</p></div>}
      </aside>}
    </section>

    {contextMenu&&<ContextMenu menu={contextMenu} card={contextMenu.cardId?cardById.get(contextMenu.cardId)||null:null}
      onClose={()=>setContextMenu(null)}
      onAdd={()=>{const parent=contextMenu.cardId;setAdding({x:parent?(cardById.get(parent)?.x||contextMenu.canvasX):contextMenu.canvasX,y:parent?(cardById.get(parent)?.y||contextMenu.canvasY)+220:contextMenu.canvasY,parentId:parent});setContextMenu(null)}}
      onEdit={()=>{const c=contextMenu.cardId?cardById.get(contextMenu.cardId):null;if(c?.libraryId)setEditingLibraryId(c.libraryId);setContextMenu(null)}}
      onDuplicate={()=>{const c=contextMenu.cardId?cardById.get(contextMenu.cardId):null;if(c)duplicateCard(c);setContextMenu(null)}}
      onAutoAlign={()=>{setContextMenu(null);autoAlign()}} onFit={()=>{setContextMenu(null);fitView()}}/>}

    {addingJourney&&<JourneyModal saving={saving} board={board} onClose={()=>setAddingJourney(false)} onSave={createJourney}/>}
    {journeyManagerOpen&&<JourneyManagerModal board={board} activeJourneyId={activeJourneyId}
      onOpen={id=>{setActiveJourneyId(id);setJourneyManagerOpen(false)}}
      onDuplicate={duplicateJourney} onArchive={setJourneyArchived} onTemplate={setJourneyTemplate}
      onDelete={async(journey)=>{setJourneyManagerOpen(false);await deleteJourney(journey)}} onClose={()=>setJourneyManagerOpen(false)}/>}
    {toolsOpen&&<WorkspaceToolsModal board={board} miniMap={miniMap} setMiniMap={setMiniMap}
      hideAgreed={hideAgreed} setHideAgreed={setHideAgreed} toolFilter={toolFilter} setToolFilter={setToolFilter}
      assignedFilter={assignedFilter} setAssignedFilter={setAssignedFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      bulkMode={bulkMode} setBulkMode={setBulkMode} onFit={fitView} onFitSelected={fitSelected}
      onExportSvg={exportSvg} onPrint={()=>window.print()} onChangeLog={loadChangeLog}
      onPresentation={()=>{setToolsOpen(false);setPresentationMode(true)}} onClose={()=>setToolsOpen(false)}/>}
    {historyOpen&&<VersionHistoryModal snapshots={snapshots} onSave={saveSnapshot} onRestore={restoreSnapshot}
      onDelete={removeSnapshot} onClose={()=>setHistoryOpen(false)}/>}
    {changeLogOpen&&<ChangeLogModal changes={changeLog} onClose={()=>setChangeLogOpen(false)}/>}
    {mergeCardId&&<MergeJourneyModal board={board} sourceCardId={mergeCardId} currentJourneyId={activeJourneyId}
      onMerge={(targetJourneyId,targetCardId)=>{const source=cardById.get(mergeCardId);if(source)mergeToJourney(source,targetJourneyId,targetCardId)}}
      onClose={()=>setMergeCardId(null)} saving={saving}/>}

    {adding&&<AddCardModal board={board} activeJourneyId={activeJourneyId} mainJourneyId={mainJourneyId} initial={adding} onClose={()=>setAdding(null)}
      onUseLibrary={async(libId,title,journeyIds)=>{setSaving(true);try{const id=await createCardFromLibrary(libId,title,journeyIds,adding.x,adding.y,adding.parentId);if(id)setSelectedCardId(id);setAdding(null)}finally{setSaving(false)}}}
      onCreate={async(def,title,journeyIds)=>{setSaving(true);try{const id=await createNewCard(def,title,journeyIds,adding.x,adding.y,adding.parentId);if(id)setSelectedCardId(id);setAdding(null)}finally{setSaving(false)}}}
      saving={saving}/>}

    {libraryOpen&&<LibraryModal board={board} onClose={()=>setLibraryOpen(false)} onEdit={id=>setEditingLibraryId(id)}/>}
    {editingLibraryId&&<LibraryEditor key={editingLibraryId} def={libById.get(editingLibraryId)||null} board={board} saving={saving}
      onClose={()=>setEditingLibraryId(null)} onSave={saveLibrary}/>}
  </main>;
}

function CardInspector({card,def,incoming,outgoing,cardById,suggestedParents,suggestedNext,onEditAll,onDisconnect,onConnectParent,onAddSuggestion,onComments,onResolve,onMerge,canMerge,onDuplicate,onDelete}:any){
  const [comments,setComments]=useState(card.comments||"");
  const [answer,setAnswer]=useState(def.workshopAnswer||"");
  return <div className="ljl-inspector-inner">
    <div className="ljl-inspector-title"><span>{def.category}</span><h2>{card.title}</h2><small>{def.tool!=="None"?def.tool:"No tool"}</small></div>
    <section className="ljl-detail-grid">
      <div><span>Use</span><strong>{def.use||"—"}</strong></div><div><span>Action</span><strong>{def.action||"—"}</strong></div>
      <div><span>Automated?</span><strong>{def.automated||"—"}</strong></div><div><span>Automation tool</span><strong>{def.automationTool||"—"}</strong></div>
      <div><span>Assigned person</span><strong>{def.assignedPerson||"—"}</strong></div><div><span>Timing</span><strong>{def.timing||"—"}</strong></div>
      <div><span>Lead status</span><strong>{def.leadStatus||"—"}</strong></div><div><span>Workshop status</span><strong>{def.workshopStatus||"—"}</strong></div>
    </section>
    <section><div className="ljl-section-head"><h3>Connections</h3></div>
      {!incoming.length&&!outgoing.length&&<p className="muted">No connections.</p>}
      {[...incoming,...outgoing].map((c:any)=>{
        const other=c.fromId===card.id?cardById.get(c.toId):cardById.get(c.fromId);
        return <div className="ljl-connection-row" key={c.id}><span>{c.fromId===card.id?"To":"From"}</span><strong>{other?.title||"Card"}</strong><button onClick={()=>onDisconnect(c.id)}><Unlink size={13}/></button></div>
      })}
      {!incoming.length&&suggestedParents.map((parent:any)=><div className="ljl-suggestion-row" key={parent.id}><div><span>Suggested connection</span><strong>Connect from {parent.title}</strong></div><button onClick={()=>onConnectParent(parent)}>Connect</button></div>)}
    </section>
    <section><h3>What happens next?</h3><div className="ljl-suggestion-list">
      {suggestedNext.length?suggestedNext.map((d:any,i:number)=><div className="ljl-suggestion-row" key={d.id}><div><span>Suggested card</span><strong>{d.name}</strong><small>{d.tool!=="None"?d.tool:""}</small></div><button onClick={()=>onAddSuggestion(d,i)}>Add</button></div>):<p className="muted">No suggestions set for this card.</p>}
    </div></section>
    {(def.notes||card.notes)&&<section className="ljl-card-notes"><h3>{def.workshopStatus==="Needs Discussion"?"Workshop question / note":"Notes"}</h3>{def.notes&&<p>{def.notes}</p>}{card.notes&&<p>{card.notes}</p>}</section>}
    {(def.workshopStatus==="Needs Discussion"||def.workshopAnswer)&&<section className="ljl-resolution"><h3>Agreed answer / decision</h3><textarea className="ljl-comments" rows={4} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Enter the final agreed answer here…"/><button className="ljl-resolve-button" disabled={!answer.trim()} onClick={()=>onResolve(answer)}><Save size={12}/> {def.workshopStatus==="Needs Discussion"?"Save answer & mark Agreed":"Update agreed answer"}</button><p className="muted">Use Workshop Comments for discussion. Put the final decision here.</p></section>}
    <section><h3>Workshop comments</h3><textarea className="ljl-comments" rows={4} value={comments} onChange={e=>setComments(e.target.value)} placeholder="Notes, decisions, questions…"/><button className="ljl-small-save" onClick={()=>onComments(comments)}><Save size={12}/> Save comments</button></section>
    {(def.campaignName||def.subject||def.templateName||def.messagePurpose)&&<section><h3>Communication</h3>
      <div className="ljl-detail-list"><p><b>Campaign:</b> {def.campaignName||"—"}</p><p><b>Subject:</b> {def.subject||"—"}</p><p><b>Template:</b> {def.templateName||"—"}</p><p><b>Purpose:</b> {def.messagePurpose||"—"}</p></div>
    </section>}
    <section className="ljl-inspector-actions">{canMerge&&<button onClick={onMerge}><GitMerge size={13}/> Connect to journey</button>}<button onClick={onDuplicate}><Copy size={13}/> Duplicate card</button><button onClick={onEditAll}><Edit3 size={13}/> Edit master card</button><button className="danger" onClick={onDelete}><Trash2 size={13}/> Delete from map</button></section>
  </div>;
}

function ConnectionInspector({connection,cards,onSave,onDisconnect}:any){
  const [fromId,setFromId]=useState(connection.fromId),[toId,setToId]=useState(connection.toId),[label,setLabel]=useState(connection.label||"");
  return <div className="ljl-inspector-inner"><div className="ljl-inspector-title"><span>CONNECTION</span><h2>{connection.name}</h2></div>
    <section className="ljl-connection-editor">
      <label>From<select value={fromId} onChange={e=>setFromId(e.target.value)}>{cards.map((c:any)=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label>To<select value={toId} onChange={e=>setToId(e.target.value)}>{cards.map((c:any)=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label>Connection label<input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Optional: Yes, No, No response…"/></label>
      <button className="primary" onClick={()=>onSave(connection.id,{fromId,toId,label,name:connection.name})}>Save connection</button>
      <button className="danger" onClick={onDisconnect}><Unlink size={13}/> Disconnect</button>
    </section>
  </div>;
}

function ContextMenu({menu,card,onClose,onAdd,onEdit,onDuplicate,onAutoAlign,onFit}:any){
  return <div className="ljl-context" style={{left:menu.x,top:menu.y}} onClick={e=>e.stopPropagation()}>
    <button onClick={onAdd}><Plus size={14}/>{card?"Add next card":"Add card here"}</button>
    {card&&<button onClick={onDuplicate}><Copy size={14}/> Duplicate card</button>}
    {card&&<button onClick={onEdit}><Edit3 size={14}/> Edit master card</button>}
    <hr/><button onClick={onAutoAlign}><WandSparkles size={14}/> Auto Align</button><button onClick={onFit}><Maximize2 size={14}/> Fit to screen</button>
    <button onClick={onClose}><X size={14}/> Close</button>
  </div>;
}

function JourneyModal({saving,board,onClose,onSave}:any){
  const [name,setName]=useState(""),[description,setDescription]=useState(""),[group,setGroup]=useState("Lead"),[templateId,setTemplateId]=useState("");
  const templates=board.journeys.filter((j:any)=>j.template&&!j.archived);
  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ljl-modal">
    <header><div><span>NEW JOURNEY</span><h2>Add journey</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-form">
      <label>Journey name<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Customer Journey"/></label>
      <label>Group<select value={group} onChange={e=>setGroup(e.target.value)}>{["Lead","Customer","Reactivation","Supplier","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Start from template<select value={templateId} onChange={e=>setTemplateId(e.target.value)}><option value="">Blank journey</option>{templates.map((j:any)=><option key={j.id} value={j.id}>{j.name}</option>)}</select></label>
      <label>Description<textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)}/></label>
    </div>
    <footer><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving||!name.trim()} onClick={()=>onSave(name.trim(),description.trim(),group,templateId)}>{saving?"Saving…":"Add journey"}</button></footer>
  </div></div>;
}

function AddCardModal({board,activeJourneyId,mainJourneyId,initial,onClose,onUseLibrary,onCreate,saving}:any){
  const availableJourneys=board.journeys.filter((j:any)=>j.active&&!j.archived&&!j.template);
  const [mode,setMode]=useState<"library"|"new">("library");
  const [libraryId,setLibraryId]=useState(board.library[0]?.id||"");
  const [title,setTitle]=useState(board.library[0]?.name||"");
  const defaultJourneyIds:string[]=activeJourneyId==="all"?(mainJourneyId?[mainJourneyId]:(availableJourneys[0]?.id?[availableJourneys[0].id]:[])):[activeJourneyId];
  const [journeyIds,setJourneyIds]=useState<string[]>(defaultJourneyIds);
  const [journeyQuery,setJourneyQuery]=useState("");
  const [global,setGlobal]=useState(false);
  const [name,setName]=useState(""),[category,setCategory]=useState("Action"),[tool,setTool]=useState("None"),[use,setUse]=useState(""),[action,setAction]=useState("");
  const filteredJourneys=availableJourneys.filter((j:any)=>!journeyQuery||(`${j.name} ${j.group||""}`).toLowerCase().includes(journeyQuery.toLowerCase()));
  function toggleJourney(id:string){setJourneyIds(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}
  function chooseLibrary(id:string){
    setLibraryId(id);const def=board.library.find((x:any)=>x.id===id);setTitle(def?.name||"");
    if(def?.global)setJourneyIds(availableJourneys.map((j:any)=>j.id));
  }
  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ljl-modal">
    <header><div><span>ADD CARD</span><h2>{initial.parentId?"Add next card":"Add card"}</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-mode-tabs"><button className={mode==="library"?"active":""} onClick={()=>setMode("library")}>From Card Library</button><button className={mode==="new"?"active":""} onClick={()=>setMode("new")}>New master card</button></div>
    <div className="ljl-form">
      {mode==="library"?<>
        <label>Card Library<select value={libraryId} onChange={e=>chooseLibrary(e.target.value)}>{board.library.filter((x:any)=>x.active).sort((a:any,b:any)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name)).map((x:any)=><option key={x.id} value={x.id}>{x.category} · {x.name}{x.tool!=="None"?" · "+x.tool:""}{x.global?" · GLOBAL":""}</option>)}</select></label>
        <label>Card title<input value={title} onChange={e=>setTitle(e.target.value)}/></label>
      </>:<>
        <label>Master card name<input value={name} onChange={e=>{setName(e.target.value);setTitle(e.target.value)}} placeholder="e.g. Follow-up call"/></label>
        <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{["Source","Capture","Communication","CRM","Decision","Nurture","Wait","Action","Outcome","Customer Handoff"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Tool<select value={tool} onChange={e=>setTool(e.target.value)}>{["None","FPX App","Website Form","Airtable","Brevo","Call","Text","Outlook","LinkedIn","Facebook","Instagram","Make"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Use / Purpose<input value={use} onChange={e=>setUse(e.target.value)}/></label>
        <label>Tool Action<input value={action} onChange={e=>setAction(e.target.value)}/></label>
        <label className="ljl-checkline"><input type="checkbox" checked={global} onChange={e=>{setGlobal(e.target.checked);if(e.target.checked)setJourneyIds(availableJourneys.map((j:any)=>j.id))}}/> Global card — all current and future journeys</label>
      </>}
      <div className="ljl-journey-picker">
        <div className="ljl-picker-head"><span>Journeys</span><div><button type="button" onClick={()=>setJourneyIds(availableJourneys.map((j:any)=>j.id))}>Select All</button><button type="button" onClick={()=>setJourneyIds([])}>Clear All</button></div></div>
        <input value={journeyQuery} onChange={e=>setJourneyQuery(e.target.value)} placeholder="Search journeys…"/>
        <div className="ljl-journey-checks">{filteredJourneys.map((j:any)=><label key={j.id}><input type="checkbox" checked={journeyIds.includes(j.id)} disabled={global} onChange={()=>toggleJourney(j.id)}/><span>{j.name}<small>{j.group||"Other"}</small></span></label>)}</div>
      </div>
    </div>
    <footer><button className="secondary" onClick={onClose}>Cancel</button>{mode==="library"
      ?<button className="primary" disabled={saving||!libraryId||!title||!journeyIds.length} onClick={()=>onUseLibrary(libraryId,title,journeyIds)}>{saving?"Saving…":"Add card"}</button>
      :<button className="primary" disabled={saving||!name||!journeyIds.length} onClick={()=>onCreate({name,category,tool,use,action,automated:"No",automationTool:"None",assignedPerson:"",campaignName:"",subject:"",templateName:"",messagePurpose:"",timing:"",leadStatus:"Not Applicable",workshopStatus:"Draft",workshopAnswer:"",notes:"",active:true,global,suggestedNextIds:[],suggestedParentIds:[],applicableJourneyIds:journeyIds},title||name,journeyIds)}>{saving?"Saving…":"Create & add"}</button>}
    </footer>
  </div></div>;
}

function LibraryModal({board,onClose,onEdit}:any){
  const [query,setQuery]=useState(""),[category,setCategory]=useState("All");
  const cats=["All",...Array.from(new Set(board.library.map((x:any)=>x.category))).sort()] as string[];
  const filtered=board.library.filter((x:any)=>(category==="All"||x.category===category)&&(!query||(`${x.name} ${x.tool} ${x.action}`).toLowerCase().includes(query.toLowerCase())));
  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ljl-library-modal">
    <header><div><span>CARD LIBRARY</span><h2>Edit all master cards</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-library-tools"><label><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search cards or tools"/></label><select value={category} onChange={e=>setCategory(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
    <div className="ljl-library-groups">{cats.filter(c=>c!=="All"&&(category==="All"||category===c)).map(cat=>{
      const items=filtered.filter((x:any)=>x.category===cat);if(!items.length)return null;
      return <section key={cat}><h3>{cat}<span>{items.length}</span></h3><div>{items.map((x:any)=><button className="ljl-library-card" key={x.id} onClick={()=>onEdit(x.id)}><div><strong>{x.name}</strong><span>{x.tool!=="None"?x.tool:"No tool"} · {x.automated==="Yes"?"Automated via "+x.automationTool:"Manual / "+x.automated}</span></div><Edit3 size={14}/></button>)}</div></section>;
    })}</div>
  </div></div>;
}

function LibraryEditor({def,board,saving,onClose,onSave}:{def:LibraryCard|null;board:Board;saving:boolean;onClose:()=>void;onSave:(d:LibraryCard)=>void}){
  const [draft,setDraft]=useState<LibraryCard>(def||emptyLibrary("",""));
  const [journeyQuery,setJourneyQuery]=useState("");
  if(!def)return null;
  const availableJourneys=board.journeys.filter(j=>j.active&&!j.archived&&!j.template);
  const filteredJourneys=availableJourneys.filter(j=>!journeyQuery||(`${j.name} ${j.group||""}`).toLowerCase().includes(journeyQuery.toLowerCase()));
  const set=(key:keyof LibraryCard,value:any)=>setDraft(d=>({...d,[key]:value}));
  const toggle=(key:"applicableJourneyIds"|"suggestedNextIds"|"suggestedParentIds",id:string)=>set(key,draft[key].includes(id)?draft[key].filter(x=>x!==id):[...draft[key],id]);
  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ljl-editor-modal">
    <header><div><span>MASTER CARD</span><h2>{draft.name}</h2><p>Changes here update every journey using this card.</p></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-editor-grid">
      <label>Card Name<input value={draft.name} onChange={e=>set("name",e.target.value)}/></label>
      <label>Category<select value={draft.category} onChange={e=>set("category",e.target.value)}>{["Source","Capture","Communication","CRM","Decision","Nurture","Wait","Action","Outcome","Customer Handoff"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Tool<select value={draft.tool} onChange={e=>set("tool",e.target.value)}>{["None","FPX App","Website Form","Airtable","Brevo","Call","Text","Outlook","LinkedIn","Facebook","Instagram","Make"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Use / Purpose<input value={draft.use} onChange={e=>set("use",e.target.value)}/></label>
      <label>Tool Action<input value={draft.action} onChange={e=>set("action",e.target.value)}/></label>
      <label>Automated?<select value={draft.automated} onChange={e=>set("automated",e.target.value)}>{["Yes","No","To Decide"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Automation Tool<select value={draft.automationTool} onChange={e=>set("automationTool",e.target.value)}>{["None","Make","Brevo","To Decide"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Assigned Person<input value={draft.assignedPerson} onChange={e=>set("assignedPerson",e.target.value)}/></label>
      <label>Timing<input value={draft.timing} onChange={e=>set("timing",e.target.value)} placeholder="e.g. Wait 3 days"/></label>
      <label>Lead Status<select value={draft.leadStatus} onChange={e=>set("leadStatus",e.target.value)}>{["Converted","Pending Activation","Invited","Pending Invite","New Lead","Pending Contact Details","DNC","Not Applicable"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Workshop Status<select value={draft.workshopStatus} onChange={e=>set("workshopStatus",e.target.value)}>{["Draft","Needs Discussion","Agreed"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="wide">Workshop Answer / Final Decision<textarea rows={3} value={draft.workshopAnswer||""} onChange={e=>set("workshopAnswer",e.target.value)} placeholder="Final agreed answer. Use comments for discussion."/></label>
      <label>Campaign Name<input value={draft.campaignName} onChange={e=>set("campaignName",e.target.value)}/></label>
      <label>Subject<input value={draft.subject} onChange={e=>set("subject",e.target.value)}/></label>
      <label>Template Name<input value={draft.templateName} onChange={e=>set("templateName",e.target.value)}/></label>
      <label className="wide">Message Purpose<textarea rows={3} value={draft.messagePurpose} onChange={e=>set("messagePurpose",e.target.value)}/></label>
      <label className="wide">Notes<textarea rows={3} value={draft.notes} onChange={e=>set("notes",e.target.value)}/></label>
      <label className="wide ljl-checkline"><input type="checkbox" checked={Boolean(draft.global)} onChange={e=>{set("global",e.target.checked);if(e.target.checked)set("applicableJourneyIds",availableJourneys.map(j=>j.id))}}/> Global card — apply to all current and future journeys</label>
      <div className="wide ljl-journey-picker">
        <div className="ljl-picker-head"><span>Applicable Journeys</span><div><button type="button" onClick={()=>set("applicableJourneyIds",availableJourneys.map(j=>j.id))}>Select All</button><button type="button" onClick={()=>set("applicableJourneyIds",[])}>Clear All</button></div></div>
        <input value={journeyQuery} onChange={e=>setJourneyQuery(e.target.value)} placeholder="Search journeys…"/>
        <div className="ljl-journey-checks">{filteredJourneys.map(j=><label key={j.id}><input type="checkbox" disabled={Boolean(draft.global)} checked={draft.applicableJourneyIds.includes(j.id)} onChange={()=>toggle("applicableJourneyIds",j.id)}/><span>{j.name}<small>{j.group||"Other"}</small></span></label>)}</div>
      </div>
      <label className="wide">Suggested Next<select multiple value={draft.suggestedNextIds} onChange={e=>set("suggestedNextIds",Array.from(e.currentTarget.selectedOptions).map(o=>o.value))}>{board.library.filter(x=>x.id!==draft.id).map(x=><option value={x.id} key={x.id}>{x.category} · {x.name}</option>)}</select></label>
      <label className="wide">Suggested Parent<select multiple value={draft.suggestedParentIds} onChange={e=>set("suggestedParentIds",Array.from(e.currentTarget.selectedOptions).map(o=>o.value))}>{board.library.filter(x=>x.id!==draft.id).map(x=><option value={x.id} key={x.id}>{x.category} · {x.name}</option>)}</select></label>
    </div>
    <footer><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving||!draft.name.trim()} onClick={()=>onSave(draft)}>{saving?"Saving…":"Save master card"}</button></footer>
  </div></div>;
}

function BulkBar({count,journeys,onAssign,onDelete,onAlign,onFit,onClear,onExit}:any){
  const [journeyId,setJourneyId]=useState("");
  return <div className="ljl-bulkbar"><strong>{count} selected</strong><select value={journeyId} onChange={e=>setJourneyId(e.target.value)}><option value="">Assign to journey…</option>{journeys.map((j:any)=><option key={j.id} value={j.id}>{j.name}</option>)}</select><button disabled={!count||!journeyId} onClick={()=>onAssign(journeyId)}>Assign</button><button disabled={!count} onClick={onAlign}><WandSparkles size={13}/> Align</button><button disabled={!count} onClick={onFit}><Maximize2 size={13}/> Fit</button><button disabled={!count} className="danger" onClick={onDelete}><Trash2 size={13}/> Delete</button><button onClick={onClear}>Clear</button><button onClick={onExit}><X size={13}/> Exit</button></div>;
}

function MiniMap({cards,width,height}:any){
  if(!cards.length)return null;
  const scale=Math.min(180/Math.max(width,1),120/Math.max(height,1));
  return <div className="ljl-minimap" aria-label="Journey mini-map"><svg width={190} height={130} viewBox="0 0 190 130"><rect x="0" y="0" width="190" height="130" rx="8" fill="white"/>{cards.map((card:any)=><rect key={card.id} x={card.x*scale+5} y={card.y*scale+5} width={Math.max(8,nodeW*scale)} height={Math.max(5,nodeH*scale)} rx="2" fill="#b8c7bd" stroke="#758956"/>)}</svg></div>;
}

function JourneyManagerModal({board,activeJourneyId,onOpen,onDuplicate,onArchive,onTemplate,onDelete,onClose}:any){
  const [query,setQuery]=useState(""),[group,setGroup]=useState("All"),[showArchived,setShowArchived]=useState(false);
  const groups=["All",...Array.from(new Set(board.journeys.map((j:any)=>j.group||"Other"))).sort()] as string[];
  const items=board.journeys.filter((j:any)=>(showArchived||!j.archived)&&(group==="All"||(j.group||"Other")===group)&&(!query||(`${j.name} ${j.description} ${j.group||""}`).toLowerCase().includes(query.toLowerCase())));
  return <div className="ljl-modal-backdrop"><div className="ljl-library-modal">
    <header><div><span>JOURNEYS</span><h2>Journey Manager</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-library-tools"><label><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search journeys"/></label><select value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(g=><option key={g}>{g}</option>)}</select></div>
    <div className="ljl-manager-options"><label><input type="checkbox" checked={showArchived} onChange={e=>setShowArchived(e.target.checked)}/> Show archived</label></div>
    <div className="ljl-journey-list">{items.map((j:any)=><article key={j.id} className={j.id===activeJourneyId?"active":""}><div><span>{j.group||"Other"}{j.template?" · TEMPLATE":""}{j.archived?" · ARCHIVED":""}</span><strong>{j.name}</strong><p>{j.description||"No description"}</p></div><div className="ljl-row-actions"><button onClick={()=>onOpen(j.id)}>Open</button><button onClick={()=>onDuplicate(j)}><Copy size={12}/> Duplicate</button><button onClick={()=>onArchive(j,!j.archived)}><Archive size={12}/> {j.archived?"Restore":"Archive"}</button><button onClick={()=>onTemplate(j,!j.template)}><Boxes size={12}/> {j.template?"Remove Template":"Make Template"}</button><button className="danger" onClick={()=>onDelete(j)}><Trash2 size={12}/> Delete</button></div></article>)}</div>
  </div></div>;
}

function WorkspaceToolsModal({board,miniMap,setMiniMap,hideAgreed,setHideAgreed,toolFilter,setToolFilter,assignedFilter,setAssignedFilter,statusFilter,setStatusFilter,bulkMode,setBulkMode,onFit,onFitSelected,onExportSvg,onPrint,onChangeLog,onPresentation,onClose}:any){
  const tools=["All",...Array.from(new Set(board.library.map((d:any)=>d.tool||"None"))).sort()] as string[];
  const people=["All",...Array.from(new Set(board.library.map((d:any)=>d.assignedPerson||"Unassigned"))).sort()] as string[];
  return <div className="ljl-modal-backdrop"><div className="ljl-modal">
    <header><div><span>WORKSPACE</span><h2>Tools & View</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-form">
      <label>Tool filter<select value={toolFilter} onChange={e=>setToolFilter(e.target.value)}>{tools.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Assigned person<select value={assignedFilter} onChange={e=>setAssignedFilter(e.target.value)}>{people.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Workshop status<select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>{["All","Draft","Needs Discussion","Agreed"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="ljl-checkline"><input type="checkbox" checked={hideAgreed} onChange={e=>setHideAgreed(e.target.checked)}/> Hide Agreed cards</label>
      <label className="ljl-checkline"><input type="checkbox" checked={miniMap} onChange={e=>setMiniMap(e.target.checked)}/> Show mini-map</label>
      <label className="ljl-checkline"><input type="checkbox" checked={bulkMode} onChange={e=>setBulkMode(e.target.checked)}/> Multi-select cards</label>
      <div className="ljl-tool-grid"><button onClick={onFit}><Maximize2 size={13}/> Fit All</button><button onClick={onFitSelected}><Maximize2 size={13}/> Fit Selected</button><button onClick={onExportSvg}><Download size={13}/> Export SVG</button><button onClick={onPrint}><FileDown size={13}/> Print / PDF</button><button onClick={onChangeLog}><History size={13}/> Change Log</button><button onClick={onPresentation}><Presentation size={13}/> Presentation Mode</button></div>
    </div>
  </div></div>;
}

function VersionHistoryModal({snapshots,onSave,onRestore,onDelete,onClose}:any){
  return <div className="ljl-modal-backdrop"><div className="ljl-library-modal">
    <header><div><span>VERSION HISTORY</span><h2>Snapshots</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-history-head"><button className="primary" onClick={onSave}><Save size={13}/> Save snapshot</button><p>Snapshots preserve the current card layout. Restore safely re-applies positions to cards that still exist.</p></div>
    <div className="ljl-history-list">{snapshots.length?snapshots.map((s:any)=><article key={s.id}><div><strong>{s.name}</strong><span>{s.createdAt?new Date(s.createdAt).toLocaleString():""} · {s.createdBy||"Shared user"}</span></div><div><button onClick={()=>onRestore(s)}>Restore layout</button><button className="danger" onClick={()=>onDelete(s)}><Trash2 size={12}/></button></div></article>):<p className="muted">No snapshots yet.</p>}</div>
  </div></div>;
}

function ChangeLogModal({changes,onClose}:any){
  return <div className="ljl-modal-backdrop"><div className="ljl-library-modal">
    <header><div><span>CHANGE LOG</span><h2>Recent changes</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-change-list">{changes.length?changes.map((x:any)=><article key={x.id}><div><strong>{x.action} {x.itemType}</strong><span>{x.itemName}</span></div><div><span>{x.changedBy||"Shared user"}</span><small>{x.changedAt?new Date(x.changedAt).toLocaleString():""}</small></div></article>):<p className="muted">No logged changes yet.</p>}</div>
  </div></div>;
}

function MergeJourneyModal({board,sourceCardId,currentJourneyId,onMerge,onClose,saving}:any){
  const [targetJourneyId,setTargetJourneyId]=useState("");
  const [targetCardId,setTargetCardId]=useState("");
  const [query,setQuery]=useState("");
  const journeys=board.journeys.filter((j:any)=>j.active&&!j.archived&&!j.template&&j.id!==currentJourneyId&&(!query||j.name.toLowerCase().includes(query.toLowerCase())));
  const cards=targetJourneyId?board.cards.filter((c:any)=>c.journeyIds.includes(targetJourneyId)):[];
  return <div className="ljl-modal-backdrop"><div className="ljl-modal">
    <header><div><span>MERGE JOURNEY</span><h2>Connect to existing journey</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-form"><label>Find journey<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search journey"/></label><label>Target journey<select value={targetJourneyId} onChange={e=>{setTargetJourneyId(e.target.value);setTargetCardId("")}}><option value="">Choose journey…</option>{journeys.map((j:any)=><option key={j.id} value={j.id}>{j.name}</option>)}</select></label><label>Connect into card<select value={targetCardId} onChange={e=>setTargetCardId(e.target.value)}><option value="">Choose card…</option>{cards.map((card:any)=><option key={card.id} value={card.id}>{card.title}</option>)}</select></label><p className="muted">The selected existing card becomes the merge point. Its master definition is not duplicated.</p></div>
    <footer><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving||!targetJourneyId||!targetCardId} onClick={()=>onMerge(targetJourneyId,targetCardId)}>{saving?"Connecting…":"Connect journeys"}</button></footer>
  </div></div>;
}
