// @ts-nocheck
"use client";

import { useMemo,useRef,useState } from "react";
import {
  ArrowRight,BookOpen,Edit3,GripVertical,Layers,Link2,Lock,LogOut,Maximize2,
  Minus,Plus,RefreshCw,RotateCcw,Search,Trash2,Unlink,WandSparkles,X
} from "lucide-react";

type Journey={id:string;name:string;description:string;order:number;active:boolean};
type LibraryCard={
  id:string;name:string;category:string;tool:string;use:string;action:string;automated:string;automationTool:string;
  assignedPerson:string;campaignName:string;subject:string;templateName:string;messagePurpose:string;timing:string;
  leadStatus:string;workshopStatus:string;notes:string;active:boolean;suggestedNextIds:string[];suggestedParentIds:string[];
  applicableJourneyIds:string[];
};
type Card={id:string;title:string;notes:string;order:number;x:number;y:number;journeyIds:string[];libraryId:string};
type Connection={id:string;name:string;fromId:string;toId:string;journeyIds:string[];label:string;order:number;active:boolean};
type Board={configured:boolean;journeys:Journey[];library:LibraryCard[];cards:Card[];connections:Connection[]};

const LOCAL_KEY="fpx-lead-journey-lab-v4";
const nodeW=250,nodeH=128;

function emptyLibrary(id:string,name:string):LibraryCard{
  return {id,name,category:"Action",tool:"None",use:"",action:"",automated:"No",automationTool:"None",assignedPerson:"",
    campaignName:"",subject:"",templateName:"",messagePurpose:"",timing:"",leadStatus:"Not Applicable",workshopStatus:"Draft",
    notes:"",active:true,suggestedNextIds:[],suggestedParentIds:[],applicableJourneyIds:[]};
}
function fallbackBoard():Board{
  const journeys:Journey[]=[
    {id:"j-web",name:"Website Lead",description:"",order:1,active:true},
    {id:"j-social",name:"Social Media Lead",description:"",order:2,active:true},
    {id:"j-personal",name:"Personal Lead",description:"",order:3,active:true},
    {id:"j-referral",name:"Referral Lead",description:"",order:4,active:true},
  ];
  const lead={...emptyLibrary("l-lead","Lead"),category:"Source",workshopStatus:"Agreed"};
  const capture={...emptyLibrary("l-capture","Lead Capture"),category:"Capture",leadStatus:"New Lead",workshopStatus:"Agreed"};
  lead.suggestedNextIds=["l-capture"]; capture.suggestedParentIds=["l-lead"];
  const all=journeys.map(j=>j.id);
  return {
    configured:false,journeys,library:[lead,capture],
    cards:[
      {id:"c-lead",title:"Lead",notes:"",order:1,x:520,y:80,journeyIds:all,libraryId:"l-lead"},
      {id:"c-capture",title:"Lead Capture",notes:"",order:2,x:520,y:300,journeyIds:all,libraryId:"l-capture"},
    ],
    connections:[{id:"x-lead-capture",name:"Lead → Lead Capture",fromId:"c-lead",toId:"c-capture",journeyIds:all,label:"",order:1,active:true}]
  };
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
  const dragRef=useRef<{id:string;dx:number;dy:number;moved:boolean}|null>(null);

  const journeys=useMemo(()=>board.journeys.filter(j=>j.active).sort((a,b)=>a.order-b.order),[board.journeys]);
  const libById=useMemo(()=>new Map(board.library.map(x=>[x.id,x] as const)),[board.library]);
  const cardById=useMemo(()=>new Map(board.cards.map(x=>[x.id,x] as const)),[board.cards]);

  const visibleCards=useMemo(()=>board.cards.filter(card=>
    activeJourneyId==="all"||card.journeyIds.includes(activeJourneyId)
  ),[board.cards,activeJourneyId]);
  const visibleCardIds=useMemo(()=>new Set(visibleCards.map(c=>c.id)),[visibleCards]);
  const visibleConnections=useMemo(()=>board.connections.filter(c=>c.active&&visibleCardIds.has(c.fromId)&&visibleCardIds.has(c.toId)&&(
    activeJourneyId==="all"||c.journeyIds.includes(activeJourneyId)
  )),[board.connections,visibleCardIds,activeJourneyId]);

  const selectedCard=selectedCardId?cardById.get(selectedCardId)||null:null;
  const selectedConnection=selectedConnectionId?board.connections.find(c=>c.id===selectedConnectionId)||null:null;
  const selectedDef=selectedCard?libById.get(selectedCard.libraryId)||null:null;
  const width=Math.max(1300,...visibleCards.map(c=>c.x+420));
  const height=Math.max(950,...visibleCards.map(c=>c.y+360));

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
      method,headers:{"Content-Type":"application/json","X-Lead-Journey-Password":password},
      body:body?JSON.stringify(body):undefined
    });
    const data=await response.json().catch(()=>({}));
    if(response.status===401){setUnlocked(false);throw new Error("Incorrect password.")}
    if(!response.ok)throw new Error(data.error||"Request failed.");
    const next:Board=data.configured===false?loadLocal():data;
    setBoard(next);
    return next;
  }

  async function unlock(e:React.FormEvent){
    e.preventDefault();setAuthError("");setLoading(true);
    try{
      const response=await fetch("/api/internal/lead-journey-lab",{headers:{"X-Lead-Journey-Password":password}});
      const data=await response.json().catch(()=>({}));
      if(!response.ok){setAuthError(data.error||"Incorrect password.");return}
      setBoard(data.configured===false?loadLocal():data);
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
    const journeyIds=activeJourneyId==="all"
      ? Array.from(new Set(from.journeyIds.filter(id=>to.journeyIds.includes(id))))
      : [activeJourneyId];
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

  async function createJourney(name:string,description:string){
    setSaving(true);setError("");
    try{
      if(!board.configured){
        const id="j-"+Date.now();
        mutateLocal(d=>({...d,journeys:[...d.journeys,{id,name,description,order:Date.now(),active:true}]}));
        setActiveJourneyId(id);
      }else{
        const before=new Set(board.journeys.map(j=>j.id));
        const next=await request("POST",{action:"createJourney",name,description,order:Date.now()});
        const id=next.journeys.find((j:Journey)=>!before.has(j.id))?.id;
        if(id)setActiveJourneyId(id);
      }
      setAddingJourney(false);
    }catch(e){setError(e instanceof Error?e.message:"Unable to create journey.")}
    finally{setSaving(false)}
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
    dragRef.current={id:card.id,dx:(e.clientX-rect.left)/zoom-card.x,dy:(e.clientY-rect.top)/zoom-card.y,moved:false};
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function dragMove(e:React.PointerEvent){
    const drag=dragRef.current,rect=canvasRef.current?.getBoundingClientRect();if(!drag||!rect)return;
    const x=Math.max(20,Math.round((e.clientX-rect.left)/zoom-drag.dx));
    const y=Math.max(20,Math.round((e.clientY-rect.top)/zoom-drag.dy));
    const current=board.cards.find(c=>c.id===drag.id);
    if(current&&(Math.abs(current.x-x)>2||Math.abs(current.y-y)>2))drag.moved=true;
    setBoard(prev=>({...prev,cards:prev.cards.map(c=>c.id===drag.id?{...c,x,y}:c)}));
  }
  async function endDrag(){
    const drag=dragRef.current;dragRef.current=null;if(!drag?.moved)return;
    const card=board.cards.find(c=>c.id===drag.id);if(!card)return;
    if(!board.configured){localSave(board);return}
    try{await request("PATCH",{action:"updateCard",id:card.id,x:card.x,y:card.y})}catch(e){setError(e instanceof Error?e.message:"Unable to save card position.")}
  }

  async function autoAlign(){
    const cards=visibleCards,connections=visibleConnections;
    if(!cards.length)return;
    const ids=new Set(cards.map(c=>c.id));
    const incoming=new Map(cards.map(c=>[c.id,0] as const));
    const children=new Map<string,string[]>();
    for(const c of connections){
      if(!ids.has(c.fromId)||!ids.has(c.toId))continue;
      incoming.set(c.toId,(incoming.get(c.toId)||0)+1);
      children.set(c.fromId,[...(children.get(c.fromId)||[]),c.toId]);
    }
    const depth=new Map<string,number>();
    const queue=cards.filter(c=>(incoming.get(c.id)||0)===0).map(c=>c.id);
    if(!queue.length&&cards[0])queue.push(cards[0].id);
    queue.forEach(id=>depth.set(id,0));
    let guard=0;
    while(queue.length&&guard++<Math.max(20,cards.length*cards.length*2)){
      const id=queue.shift()!,d=depth.get(id)||0;
      for(const child of children.get(id)||[]){
        const next=Math.max(depth.get(child)||0,d+1);
        if(next!==(depth.get(child)||0)||!depth.has(child)){depth.set(child,next);queue.push(child)}
      }
    }
    cards.forEach(c=>{if(!depth.has(c.id))depth.set(c.id,0)});
    const groups=new Map<number,Card[]>();
    for(const card of cards){const d=depth.get(card.id)||0;groups.set(d,[...(groups.get(d)||[]),card])}
    const maxCount=Math.max(...Array.from(groups.values()).map(g=>g.length),1);
    const gap=70,center=Math.max(650,(maxCount*(nodeW+gap))/2+100);
    const moved:Card[]=[];
    Array.from(groups.entries()).sort((a,b)=>a[0]-b[0]).forEach(([d,row])=>{
      row.sort((a,b)=>a.title.localeCompare(b.title));
      const rowWidth=row.length*nodeW+(row.length-1)*gap;
      const start=center-rowWidth/2;
      row.forEach((card,i)=>moved.push({...card,x:Math.round(start+i*(nodeW+gap)),y:70+d*220}));
    });
    const map=new Map(moved.map(c=>[c.id,c] as const));
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
    const next=Math.max(.4,Math.min(1.35,availableW/(maxX-minX),availableH/(maxY-minY)));
    setZoom(Math.round(next*100)/100);
    requestAnimationFrame(()=>{wrap.scrollTo({left:Math.max(0,minX*next-40),top:Math.max(0,minY*next-40),behavior:"smooth"})});
  }

  function canvasContext(e:React.MouseEvent){
    if((e.target as HTMLElement).closest(".ljl-node"))return;
    e.preventDefault();
    const rect=canvasRef.current?.getBoundingClientRect();if(!rect)return;
    setContextMenu({x:e.clientX,y:e.clientY,canvasX:(e.clientX-rect.left)/zoom,canvasY:(e.clientY-rect.top)/zoom});
  }
  function cardContext(e:React.MouseEvent,card:Card){
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
    <form onSubmit={unlock}><label>Password<input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/></label>
      {authError&&<small className="ljl-error">{authError}</small>}
      <button disabled={loading}>{loading?"Checking…":<>Open <ArrowRight size={16}/></>}</button></form>
  </div></main>;

  return <main className="ljl" onClick={()=>setContextMenu(null)}>
    <header className="ljl-topbar">
      <div className="ljl-top-left"><div className="ljl-mark">FPX <span>INTERNAL</span></div><strong>Lead Journey Lab</strong></div>
      <div className="ljl-view-switcher">
        <button className={activeJourneyId==="all"?"active":""} onClick={()=>{setActiveJourneyId("all");setSelectedCardId(null);setSelectedConnectionId(null)}}><Layers size={14}/> Main View</button>
        <select value={activeJourneyId==="all"?"":activeJourneyId} onChange={e=>{setActiveJourneyId(e.target.value||"all");setSelectedCardId(null);setSelectedConnectionId(null)}}>
          <option value="">Choose Sub View</option>{journeys.map(j=><option key={j.id} value={j.id}>{j.name}</option>)}
        </select>
      </div>
      <div className="ljl-top-actions">
        <button onClick={()=>setLibraryOpen(true)}><BookOpen size={14}/> Card Library</button>
        <button onClick={()=>setAddingJourney(true)}><Plus size={14}/> Journey</button>
        <button onClick={()=>setAdding({x:520,y:180})}><Plus size={14}/> Add Card</button>
        <button onClick={autoAlign}><WandSparkles size={14}/> Auto Align</button>
        <button onClick={fitView}><Maximize2 size={14}/> Fit</button>
        <button onClick={refresh} disabled={loading}><RefreshCw size={14}/></button>
        <button onClick={lock}><LogOut size={14}/></button>
      </div>
    </header>

    {!board.configured&&<div className="ljl-storage-note">Preview storage only. Connect the Airtable token in Vercel before the three-person shared workshop.</div>}
    {error&&<div className="ljl-banner ljl-error">{error}</div>}
    {connectingFromId&&<div className="ljl-connect-mode">Connecting from <strong>{cardById.get(connectingFromId)?.title}</strong>. Click the top connector on the destination card. <button onClick={()=>setConnectingFromId(null)}>Cancel</button></div>}

    <section className="ljl-workspace">
      <div ref={wrapRef} className="ljl-canvas-wrap" onContextMenu={canvasContext}>
        <div className="ljl-zoom-controls" onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setZoom(z=>Math.max(.4,Math.round((z-.1)*100)/100))}><Minus size={15}/></button>
          <span>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(1.5,Math.round((z+.1)*100)/100))}><Plus size={15}/></button>
          <button onClick={()=>setZoom(.8)} title="Reset zoom"><RotateCcw size={14}/></button>
        </div>

        <div className="ljl-canvas-scale" style={{width:width*zoom,height:height*zoom}}>
          <div ref={canvasRef} className="ljl-canvas" style={{width,height,transform:`scale(${zoom})`}}
            onPointerMove={dragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
            <svg className="ljl-lines" width={width} height={height}>
              <defs><marker id="lab-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>
              {visibleConnections.map(connection=>{
                const from=cardById.get(connection.fromId),to=cardById.get(connection.toId);if(!from||!to)return null;
                const x1=from.x+nodeW/2,y1=from.y+nodeH,x2=to.x+nodeW/2,y2=to.y;
                const bend=Math.max(55,(y2-y1)/2);
                const d=`M ${x1} ${y1} C ${x1} ${y1+bend}, ${x2} ${y2-bend}, ${x2} ${y2}`;
                const mx=(x1+x2)/2,my=(y1+y2)/2;
                return <g key={connection.id} className={selectedConnectionId===connection.id?"is-selected":""}>
                  <path className="ljl-line-hit" d={d} onClick={e=>{e.stopPropagation();setSelectedConnectionId(connection.id);setSelectedCardId(null)}}/>
                  <path className="ljl-line" d={d} markerEnd="url(#lab-arrow)"/>
                  {connection.label&&<text x={mx} y={my-7}>{connection.label}</text>}
                </g>;
              })}
            </svg>

            {visibleCards.map(card=>{
              const def=libById.get(card.libraryId);
              return <article key={card.id} className={"ljl-node "+(selectedCardId===card.id?"is-selected":"")}
                style={{left:card.x,top:card.y}} onPointerDown={e=>startDrag(e,card)} onContextMenu={e=>cardContext(e,card)}>
                <button className="ljl-handle input" title="Connect to this card" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();connectHandle(card.id)}}/>
                <div className="ljl-node-top"><span>{def?.category||"Card"}</span><GripVertical size={15}/></div>
                <h2>{card.title}</h2>
                <div className="ljl-node-meta">
                  {def?.tool&&def.tool!=="None"&&<span>{def.tool}</span>}
                  {def?.automated&&<span>Automated: {def.automated}</span>}
                  {def?.timing&&<span>{def.timing}</span>}
                </div>
                {def?.use&&<p>{def.use}</p>}
                <div className="ljl-node-actions">
                  <button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setAdding({x:card.x,y:card.y+220,parentId:card.id})}}><Plus size={13}/> Next</button>
                  <button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setSelectedCardId(card.id);setSelectedConnectionId(null)}}><Edit3 size={13}/></button>
                </div>
                <button className={"ljl-handle output "+(connectingFromId===card.id?"active":"")} title="Start connection"
                  onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setConnectingFromId(connectingFromId===card.id?null:card.id)}}/>
              </article>;
            })}
          </div>
        </div>
      </div>

      <aside className="ljl-inspector">
        {selectedConnection?<ConnectionInspector key={selectedConnection.id} connection={selectedConnection} cards={visibleCards}
          onSave={updateConnection} onDisconnect={()=>deleteConnection(selectedConnection.id)}/>:
        selectedCard&&selectedDef?<CardInspector card={selectedCard} def={selectedDef} incoming={incoming} outgoing={outgoing}
          cardById={cardById} suggestedParents={suggestedParents} suggestedNext={suggestedNext}
          onEditAll={()=>setEditingLibraryId(selectedDef.id)} onDisconnect={deleteConnection}
          onConnectParent={(parent)=>createConnection(parent.id,selectedCard.id)} onAddSuggestion={addSuggested}
          onDelete={()=>removeCard(selectedCard)}/>:
        <div className="ljl-empty"><Link2 size={19}/><strong>Select a card or connection</strong><p>Card details, suggestions and connection controls will appear here.</p></div>}
      </aside>
    </section>

    {contextMenu&&<ContextMenu menu={contextMenu} card={contextMenu.cardId?cardById.get(contextMenu.cardId)||null:null}
      onClose={()=>setContextMenu(null)}
      onAdd={()=>{const parent=contextMenu.cardId;setAdding({x:parent?(cardById.get(parent)?.x||contextMenu.canvasX):contextMenu.canvasX,y:parent?(cardById.get(parent)?.y||contextMenu.canvasY)+220:contextMenu.canvasY,parentId:parent});setContextMenu(null)}}
      onEdit={()=>{const c=contextMenu.cardId?cardById.get(contextMenu.cardId):null;if(c?.libraryId)setEditingLibraryId(c.libraryId);setContextMenu(null)}}
      onAutoAlign={()=>{setContextMenu(null);autoAlign()}} onFit={()=>{setContextMenu(null);fitView()}}/>}

    {addingJourney&&<JourneyModal saving={saving} onClose={()=>setAddingJourney(false)} onSave={createJourney}/>}
    {adding&&<AddCardModal board={board} activeJourneyId={activeJourneyId} initial={adding} onClose={()=>setAdding(null)}
      onUseLibrary={async(libId,title,journeyIds)=>{setSaving(true);try{const id=await createCardFromLibrary(libId,title,journeyIds,adding.x,adding.y,adding.parentId);if(id)setSelectedCardId(id);setAdding(null)}finally{setSaving(false)}}}
      onCreate={async(def,title,journeyIds)=>{setSaving(true);try{const id=await createNewCard(def,title,journeyIds,adding.x,adding.y,adding.parentId);if(id)setSelectedCardId(id);setAdding(null)}finally{setSaving(false)}}}
      saving={saving}/>}

    {libraryOpen&&<LibraryModal board={board} onClose={()=>setLibraryOpen(false)} onEdit={id=>setEditingLibraryId(id)}/>}
    {editingLibraryId&&<LibraryEditor key={editingLibraryId} def={libById.get(editingLibraryId)||null} board={board} saving={saving}
      onClose={()=>setEditingLibraryId(null)} onSave={saveLibrary}/>}
  </main>;
}

function CardInspector({card,def,incoming,outgoing,cardById,suggestedParents,suggestedNext,onEditAll,onDisconnect,onConnectParent,onAddSuggestion,onDelete}:any){
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
    {(def.campaignName||def.subject||def.templateName||def.messagePurpose)&&<section><h3>Communication</h3>
      <div className="ljl-detail-list"><p><b>Campaign:</b> {def.campaignName||"—"}</p><p><b>Subject:</b> {def.subject||"—"}</p><p><b>Template:</b> {def.templateName||"—"}</p><p><b>Purpose:</b> {def.messagePurpose||"—"}</p></div>
    </section>}
    <section className="ljl-inspector-actions"><button onClick={onEditAll}><Edit3 size={13}/> Edit master card</button><button className="danger" onClick={onDelete}><Trash2 size={13}/> Delete from map</button></section>
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

function ContextMenu({menu,card,onClose,onAdd,onEdit,onAutoAlign,onFit}:any){
  return <div className="ljl-context" style={{left:menu.x,top:menu.y}} onClick={e=>e.stopPropagation()}>
    <button onClick={onAdd}><Plus size={14}/>{card?"Add next card":"Add card here"}</button>
    {card&&<button onClick={onEdit}><Edit3 size={14}/> Edit master card</button>}
    <hr/><button onClick={onAutoAlign}><WandSparkles size={14}/> Auto Align</button><button onClick={onFit}><Maximize2 size={14}/> Fit to screen</button>
    <button onClick={onClose}><X size={14}/> Close</button>
  </div>;
}

function JourneyModal({saving,onClose,onSave}:{saving:boolean;onClose:()=>void;onSave:(name:string,description:string)=>void}){
  const [name,setName]=useState(""),[description,setDescription]=useState("");
  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ljl-modal">
    <header><div><span>NEW JOURNEY</span><h2>Add journey</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-form"><label>Journey name<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Customer Journey"/></label><label>Description<textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)}/></label></div>
    <footer><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving||!name.trim()} onClick={()=>onSave(name.trim(),description.trim())}>{saving?"Saving…":"Add journey"}</button></footer>
  </div></div>;
}

function AddCardModal({board,activeJourneyId,initial,onClose,onUseLibrary,onCreate,saving}:any){
  const [mode,setMode]=useState<"library"|"new">("library");
  const [libraryId,setLibraryId]=useState(board.library[0]?.id||"");
  const [title,setTitle]=useState(board.library[0]?.name||"");
  const defaultJourneyIds:string[]=activeJourneyId==="all"?(board.journeys[0]?.id?[board.journeys[0].id]:[]):[activeJourneyId];
  const [journeyIds,setJourneyIds]=useState<string[]>(defaultJourneyIds);
  const [name,setName]=useState(""),[category,setCategory]=useState("Action"),[tool,setTool]=useState("None"),[use,setUse]=useState(""),[action,setAction]=useState("");
  function toggleJourney(id:string){setJourneyIds(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}
  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ljl-modal">
    <header><div><span>ADD CARD</span><h2>{initial.parentId?"Add next card":"Add card"}</h2></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-mode-tabs"><button className={mode==="library"?"active":""} onClick={()=>setMode("library")}>From Card Library</button><button className={mode==="new"?"active":""} onClick={()=>setMode("new")}>New master card</button></div>
    <div className="ljl-form">
      {mode==="library"?<>
        <label>Card Library<select value={libraryId} onChange={e=>{setLibraryId(e.target.value);setTitle(board.library.find((x:any)=>x.id===e.target.value)?.name||"")}}>{board.library.filter((x:any)=>x.active).sort((a:any,b:any)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name)).map((x:any)=><option key={x.id} value={x.id}>{x.category} · {x.name}{x.tool!=="None"?" · "+x.tool:""}</option>)}</select></label>
        <label>Card title<input value={title} onChange={e=>setTitle(e.target.value)}/></label>
      </>:<>
        <label>Master card name<input value={name} onChange={e=>{setName(e.target.value);setTitle(e.target.value)}} placeholder="e.g. Follow-up call"/></label>
        <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{["Source","Capture","Communication","CRM","Decision","Nurture","Action","Outcome","Customer Handoff"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Tool<select value={tool} onChange={e=>setTool(e.target.value)}>{["None","FPX App","Website Form","Airtable","Brevo","Call","Text","Outlook","LinkedIn","Facebook","Instagram","Make"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Use / Purpose<input value={use} onChange={e=>setUse(e.target.value)}/></label>
        <label>Tool Action<input value={action} onChange={e=>setAction(e.target.value)}/></label>
      </>}
      <div className="ljl-journey-checks"><span>Journey</span><div>{board.journeys.filter((j:any)=>j.active).map((j:any)=><label key={j.id}><input type="checkbox" checked={journeyIds.includes(j.id)} onChange={()=>toggleJourney(j.id)}/>{j.name}</label>)}</div></div>
    </div>
    <footer><button className="secondary" onClick={onClose}>Cancel</button>{mode==="library"?<button className="primary" disabled={saving||!libraryId||!title||!journeyIds.length} onClick={()=>onUseLibrary(libraryId,title,journeyIds)}>{saving?"Saving…":"Add card"}</button>:<button className="primary" disabled={saving||!name||!journeyIds.length} onClick={()=>onCreate({name,category,tool,use,action,automated:"No",automationTool:"None",assignedPerson:"",campaignName:"",subject:"",templateName:"",messagePurpose:"",timing:"",leadStatus:"Not Applicable",workshopStatus:"Draft",notes:"",active:true,suggestedNextIds:[],suggestedParentIds:[],applicableJourneyIds:journeyIds},title||name,journeyIds)}>{saving?"Saving…":"Create & add"}</button>}</footer>
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
  if(!def)return null;
  const set=(key:keyof LibraryCard,value:any)=>setDraft(d=>({...d,[key]:value}));
  const toggle=(key:"applicableJourneyIds"|"suggestedNextIds"|"suggestedParentIds",id:string)=>set(key,draft[key].includes(id)?draft[key].filter(x=>x!==id):[...draft[key],id]);
  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ljl-editor-modal">
    <header><div><span>MASTER CARD</span><h2>{draft.name}</h2><p>Changes here update every journey using this card.</p></div><button onClick={onClose}><X/></button></header>
    <div className="ljl-editor-grid">
      <label>Card Name<input value={draft.name} onChange={e=>set("name",e.target.value)}/></label>
      <label>Category<select value={draft.category} onChange={e=>set("category",e.target.value)}>{["Source","Capture","Communication","CRM","Decision","Nurture","Action","Outcome","Customer Handoff"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Tool<select value={draft.tool} onChange={e=>set("tool",e.target.value)}>{["None","FPX App","Website Form","Airtable","Brevo","Call","Text","Outlook","LinkedIn","Facebook","Instagram","Make"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Use / Purpose<input value={draft.use} onChange={e=>set("use",e.target.value)}/></label>
      <label>Tool Action<input value={draft.action} onChange={e=>set("action",e.target.value)}/></label>
      <label>Automated?<select value={draft.automated} onChange={e=>set("automated",e.target.value)}>{["Yes","No","To Decide"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Automation Tool<select value={draft.automationTool} onChange={e=>set("automationTool",e.target.value)}>{["None","Make","Brevo","To Decide"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Assigned Person<input value={draft.assignedPerson} onChange={e=>set("assignedPerson",e.target.value)}/></label>
      <label>Timing<input value={draft.timing} onChange={e=>set("timing",e.target.value)} placeholder="e.g. Wait 3 days"/></label>
      <label>Lead Status<select value={draft.leadStatus} onChange={e=>set("leadStatus",e.target.value)}>{["Converted","Pending Activation","Invited","Pending Invite","New Lead","Pending Contact Details","DNC","Not Applicable"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Workshop Status<select value={draft.workshopStatus} onChange={e=>set("workshopStatus",e.target.value)}>{["Draft","Needs Discussion","Agreed"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Campaign Name<input value={draft.campaignName} onChange={e=>set("campaignName",e.target.value)}/></label>
      <label>Subject<input value={draft.subject} onChange={e=>set("subject",e.target.value)}/></label>
      <label>Template Name<input value={draft.templateName} onChange={e=>set("templateName",e.target.value)}/></label>
      <label className="wide">Message Purpose<textarea rows={3} value={draft.messagePurpose} onChange={e=>set("messagePurpose",e.target.value)}/></label>
      <label className="wide">Notes<textarea rows={3} value={draft.notes} onChange={e=>set("notes",e.target.value)}/></label>
      <div className="wide ljl-editor-multis"><span>Applicable Journeys</span><div>{board.journeys.filter(j=>j.active).map(j=><label key={j.id}><input type="checkbox" checked={draft.applicableJourneyIds.includes(j.id)} onChange={()=>toggle("applicableJourneyIds",j.id)}/>{j.name}</label>)}</div></div>
      <label className="wide">Suggested Next<select multiple value={draft.suggestedNextIds} onChange={e=>set("suggestedNextIds",Array.from(e.currentTarget.selectedOptions).map(o=>o.value))}>{board.library.filter(x=>x.id!==draft.id).map(x=><option value={x.id} key={x.id}>{x.category} · {x.name}</option>)}</select></label>
      <label className="wide">Suggested Parent<select multiple value={draft.suggestedParentIds} onChange={e=>set("suggestedParentIds",Array.from(e.currentTarget.selectedOptions).map(o=>o.value))}>{board.library.filter(x=>x.id!==draft.id).map(x=><option value={x.id} key={x.id}>{x.category} · {x.name}</option>)}</select></label>
    </div>
    <footer><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving||!draft.name.trim()} onClick={()=>onSave(draft)}>{saving?"Saving…":"Save master card"}</button></footer>
  </div></div>;
}
