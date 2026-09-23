"use client";

import { useMemo,useRef,useState } from "react";
import {
  ArrowRight,Edit3,GripVertical,Link2,Lock,LogOut,Plus,RefreshCw,Trash2,X
} from "lucide-react";

type Card={
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

type BoardData={configured:boolean;cards:Card[]};
type Suggestion={title:string;type:string};

const cardTypes=["Touchpoint","Question","Idea","Automation","Decision","Friction","Message","Metric"];
const sourceNames=["Website","LinkedIn","Personal","Referral","Email"];
const LOCAL_KEY="fpx-lead-journey-lab-local-v2";

const fallbackCards:Card[]=[
  {id:"local-lead",title:"Lead",type:"Touchpoint",notes:"",priority:"Now",status:"Open",owner:"",channels:[],order:1,createdBy:"",connectFrom:[],x:80,y:160},
  {id:"local-capture",title:"Lead Capture",type:"Touchpoint",notes:"Where did the lead come from? Website, LinkedIn, personal, referral, email or another source.",priority:"Now",status:"Open",owner:"",channels:[],order:2,createdBy:"",connectFrom:["local-lead"],x:370,y:160},
];

function norm(value:string){return value.trim().toLowerCase()}

function suggestedParent(card:Card,cards:Card[]){
  if(card.connectFrom.length)return null;
  const title=norm(card.title);
  const exact=(name:string)=>cards.find(c=>norm(c.title)===norm(name));
  if(title==="lead capture")return exact("Lead")||null;
  if(sourceNames.map(norm).includes(title))return exact("Lead Capture")||null;
  if(title==="what happens next?")return [...cards].filter(c=>c.id!==card.id&&c.x<card.x).sort((a,b)=>b.x-a.x)[0]||null;
  return [...cards].filter(c=>c.id!==card.id&&c.x<card.x).sort((a,b)=>b.x-a.x)[0]||null;
}

function nextSuggestions(card:Card):Suggestion[]{
  const title=norm(card.title);
  if(title==="lead")return [{title:"Lead Capture",type:"Touchpoint"}];
  if(title==="lead capture")return sourceNames.map(title=>({title,type:"Touchpoint"}));
  if(sourceNames.map(norm).includes(title))return [{title:"What happens next?",type:"Question"}];
  if(title.includes("what happens next"))return [
    {title:"Qualify lead",type:"Decision"},
    {title:"Contact lead",type:"Touchpoint"},
    {title:"Send relevant information",type:"Message"},
  ];
  if(title.includes("qualif"))return [{title:"Engage lead",type:"Touchpoint"}];
  if(title.includes("contact")||title.includes("engage")||title.includes("send relevant"))return [{title:"Opportunity",type:"Decision"}];
  if(title.includes("opportunity"))return [
    {title:"Converted",type:"Decision"},
    {title:"Lead Lost",type:"Decision"},
  ];
  if(title.includes("converted")||title.includes("lead lost"))return [];
  return [{title:"What happens next?",type:"Question"}];
}

export function LeadJourneyLab(){
  const [unlocked,setUnlocked]=useState(false);
  const [password,setPassword]=useState("");
  const [authError,setAuthError]=useState("");
  const [board,setBoard]=useState<BoardData>({configured:true,cards:[]});
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [editing,setEditing]=useState<Card|null>(null);
  const [addingFrom,setAddingFrom]=useState<Card|null>(null);
  const [saving,setSaving]=useState(false);
  const canvasRef=useRef<HTMLDivElement|null>(null);
  const dragRef=useRef<{id:string;dx:number;dy:number;moved:boolean}|null>(null);

  const cards=board.cards;
  const selected=cards.find(c=>c.id===selectedId)||null;
  const width=Math.max(1400,...cards.map(c=>c.x+560));
  const height=Math.max(720,...cards.map(c=>c.y+320));

  function persistLocal(next:Card[]){
    setBoard({configured:false,cards:next});
    try{localStorage.setItem(LOCAL_KEY,JSON.stringify(next))}catch{}
  }

  function localCards(){
    try{
      const saved=localStorage.getItem(LOCAL_KEY);
      if(saved){
        const parsed=JSON.parse(saved);
        if(Array.isArray(parsed)&&parsed.length)return parsed as Card[];
      }
    }catch{}
    return fallbackCards;
  }

  async function api(method:string,body?:any){
    const response=await fetch("/api/internal/lead-journey-lab",{
      method,
      headers:{"Content-Type":"application/json","X-Lead-Journey-Password":password},
      body:body?JSON.stringify(body):undefined,
    });
    const data=await response.json().catch(()=>({}));
    if(response.status===401){setUnlocked(false);throw new Error("Incorrect password.")}
    if(!response.ok)throw new Error(data.error||"Request failed.");
    const next:BoardData=data.configured===false?{configured:false,cards:localCards()}:data;
    setBoard(next);
    return next;
  }

  async function unlock(e:React.FormEvent){
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try{
      const response=await fetch("/api/internal/lead-journey-lab",{
        method:"GET",
        headers:{"X-Lead-Journey-Password":password}
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok){setAuthError(data.error||"Incorrect password.");return}
      setBoard(data.configured===false?{configured:false,cards:localCards()}:data);
      setUnlocked(true);
    }finally{setLoading(false)}
  }

  async function reload(){
    setLoading(true);setError("");
    try{await api("GET")}catch(e){setError(e instanceof Error?e.message:"Unable to load board.")}
    finally{setLoading(false)}
  }

  function lock(){
    setPassword("");
    setUnlocked(false);
    setSelectedId(null);
    setBoard({configured:true,cards:[]});
  }

  async function updateCard(card:Card,changes:Partial<Card>){
    const nextCard={...card,...changes};
    if(!board.configured){
      persistLocal(cards.map(c=>c.id===card.id?nextCard:c));
      return nextCard;
    }
    const data=await api("PATCH",{id:card.id,...changes});
    return data.cards.find((c:Card)=>c.id===card.id)||nextCard;
  }

  async function createCard(input:Partial<Card>&{title:string}){
    const parent=input.connectFrom?.[0]?cards.find(c=>c.id===input.connectFrom![0]):null;
    const newCard:Card={
      id:`local-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      title:input.title,
      type:input.type||"Idea",
      notes:input.notes||"",
      priority:"Next",
      status:"Open",
      owner:"",
      channels:[],
      order:Date.now(),
      createdBy:"",
      connectFrom:input.connectFrom||[],
      x:input.x??Math.max(40,(parent?.x??80)+300),
      y:input.y??Math.max(40,parent?.y??260),
    };

    if(!board.configured){
      persistLocal([...cards,newCard]);
      return newCard;
    }

    const before=new Set(cards.map(c=>c.id));
    const data=await api("POST",newCard);
    return data.cards.find((c:Card)=>!before.has(c.id))||data.cards.find((c:Card)=>c.title===newCard.title)||newCard;
  }

  async function deleteCard(card:Card){
    if(!confirm(`Delete “${card.title}”?`))return;
    setError("");
    try{
      if(!board.configured){
        const next=cards
          .filter(c=>c.id!==card.id)
          .map(c=>({...c,connectFrom:c.connectFrom.filter(id=>id!==card.id)}));
        persistLocal(next);
      }else{
        await api("DELETE",{id:card.id});
      }
      if(selectedId===card.id)setSelectedId(null);
      setEditing(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to delete card.")}
  }

  async function connect(card:Card,parent:Card){
    setError("");
    try{
      const connectFrom=Array.from(new Set([...card.connectFrom,parent.id]));
      await updateCard(card,{connectFrom});
    }catch(e){setError(e instanceof Error?e.message:"Unable to connect cards.")}
  }

  async function addSuggestion(suggestion:Suggestion,index:number){
    if(!selected)return;
    setSaving(true);setError("");
    try{
      const existing=cards.find(c=>norm(c.title)===norm(suggestion.title));
      if(existing){
        const updated=await updateCard(existing,{connectFrom:Array.from(new Set([...existing.connectFrom,selected.id]))});
        setSelectedId(updated.id);
      }else{
        const branchCount=nextSuggestions(selected).length;
        const offset=(index-(branchCount-1)/2)*145;
        const card=await createCard({
          title:suggestion.title,
          type:suggestion.type,
          connectFrom:[selected.id],
          x:selected.x+310,
          y:Math.max(40,selected.y+offset),
        });
        setSelectedId(card.id);
      }
    }catch(e){setError(e instanceof Error?e.message:"Unable to add suggestion.")}
    finally{setSaving(false)}
  }

  async function saveModal(values:{title:string;type:string;notes:string;parentId:string}){
    setSaving(true);setError("");
    try{
      if(editing){
        const updated=await updateCard(editing,{
          title:values.title,
          type:values.type,
          notes:values.notes,
          connectFrom:values.parentId?[values.parentId]:[],
        });
        setSelectedId(updated.id);
      }else{
        const parent=values.parentId?cards.find(c=>c.id===values.parentId):null;
        const created=await createCard({
          title:values.title,
          type:values.type,
          notes:values.notes,
          connectFrom:values.parentId?[values.parentId]:[],
          x:parent?parent.x+310:100,
          y:parent?parent.y:320,
        });
        setSelectedId(created.id);
      }
      setEditing(null);setAddingFrom(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to save card.")}
    finally{setSaving(false)}
  }

  function startDrag(e:React.PointerEvent,card:Card){
    if((e.target as HTMLElement).closest("button"))return;
    const rect=canvasRef.current?.getBoundingClientRect();
    if(!rect)return;
    setSelectedId(card.id);
    dragRef.current={id:card.id,dx:e.clientX-rect.left-card.x,dy:e.clientY-rect.top-card.y,moved:false};
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function dragMove(e:React.PointerEvent){
    const drag=dragRef.current;
    const rect=canvasRef.current?.getBoundingClientRect();
    if(!drag||!rect)return;
    const x=Math.max(20,Math.round(e.clientX-rect.left-drag.dx));
    const y=Math.max(20,Math.round(e.clientY-rect.top-drag.dy));
    if(Math.abs(x-(cards.find(c=>c.id===drag.id)?.x||0))>2||Math.abs(y-(cards.find(c=>c.id===drag.id)?.y||0))>2)drag.moved=true;
    setBoard(prev=>({...prev,cards:prev.cards.map(c=>c.id===drag.id?{...c,x,y}:c)}));
  }

  async function endDrag(){
    const drag=dragRef.current;
    dragRef.current=null;
    if(!drag?.moved)return;
    const card=board.cards.find(c=>c.id===drag.id);
    if(!card)return;
    try{
      if(!board.configured){
        try{localStorage.setItem(LOCAL_KEY,JSON.stringify(board.cards))}catch{}
      }else{
        await api("PATCH",{id:card.id,x:card.x,y:card.y});
      }
    }catch(e){setError(e instanceof Error?e.message:"Unable to save card position.")}
  }

  const parentSuggestion=selected?suggestedParent(selected,cards):null;
  const suggestions=selected?nextSuggestions(selected):[];

  if(!unlocked){
    return <main className="ljl-lock">
      <div className="ljl-lock-card">
        <div className="ljl-mark">FPX <span>INTERNAL</span></div>
        <div className="ljl-lock-icon"><Lock size={22}/></div>
        <h1>Lead Journey Lab</h1>
        <form onSubmit={unlock}>
          <label>Password<input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/></label>
          {authError&&<small className="ljl-error">{authError}</small>}
          <button type="submit" disabled={loading}>{loading?"Checking…":<>Open <ArrowRight size={16}/></>}</button>
        </form>
      </div>
    </main>;
  }

  return <main className="ljl">
    <header className="ljl-topbar">
      <div><div className="ljl-mark">FPX <span>INTERNAL</span></div><strong>Lead Journey Lab</strong></div>
      <div className="ljl-top-actions">
        <button onClick={()=>{setAddingFrom(selected);setEditing(null)}}><Plus size={14}/> Add card</button>
        <button onClick={reload} disabled={loading}><RefreshCw size={14}/> Refresh</button>
        <button onClick={lock}><LogOut size={14}/> Lock</button>
      </div>
    </header>

    <section className="ljl-head">
      <div><h1>Lead journey</h1><p>Start with the lead. Map where it was captured, then define what happens next.</p></div>
      {!board.configured&&<small>Preview mode: changes are saved in this browser until shared storage is connected.</small>}
    </section>

    {error&&<div className="ljl-banner ljl-error">{error}</div>}

    <section className="ljl-workspace">
      <div className="ljl-canvas-wrap">
        <div ref={canvasRef} className="ljl-canvas" style={{width,height}} onPointerMove={dragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <svg className="ljl-lines" width={width} height={height} aria-hidden="true">
            <defs><marker id="lab-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>
            {cards.flatMap(card=>card.connectFrom.map(parentId=>{
              const parent=cards.find(c=>c.id===parentId);
              if(!parent)return null;
              const x1=parent.x+250,y1=parent.y+64,x2=card.x,y2=card.y+64;
              const bend=Math.max(70,(x2-x1)/2);
              return <path key={parentId+"-"+card.id} d={`M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}`} markerEnd="url(#lab-arrow)"/>;
            }))}
          </svg>

          {cards.map(card=><article key={card.id}
            className={"ljl-node "+(selectedId===card.id?"is-selected":"")}
            style={{left:card.x,top:card.y}}
            onPointerDown={e=>startDrag(e,card)}>
            <div className="ljl-node-top"><span>{card.type}</span><GripVertical size={15}/></div>
            <h2>{card.title}</h2>
            {card.notes&&<p>{card.notes}</p>}
            <div className="ljl-node-actions">
              <button onPointerDown={e=>e.stopPropagation()} onClick={()=>{setAddingFrom(card);setEditing(null)}}><Plus size={13}/> Next</button>
              <button aria-label={"Edit "+card.title} onPointerDown={e=>e.stopPropagation()} onClick={()=>setEditing(card)}><Edit3 size={13}/></button>
            </div>
          </article>)}
        </div>
      </div>

      <aside className="ljl-suggestions">
        {!selected?<div className="ljl-empty"><Link2 size={18}/><strong>Select a card</strong><p>Suggestions will appear here.</p></div>:
        <>
          <div className="ljl-selected-title"><span>SELECTED</span><h2>{selected.title}</h2></div>

          <section>
            <h3>Connection</h3>
            {selected.connectFrom.length>0?
              <p>Connected from <strong>{selected.connectFrom.map(id=>cards.find(c=>c.id===id)?.title).filter(Boolean).join(", ")}</strong>.</p>:
              parentSuggestion?
                <div className="ljl-suggestion-row"><div><span>Suggested</span><strong>Connect from {parentSuggestion.title}</strong></div><button onClick={()=>connect(selected,parentSuggestion)}>Connect</button></div>:
                <p>No connection suggested.</p>}
          </section>

          <section>
            <h3>What happens next?</h3>
            {suggestions.length===0?<p>No next step suggested for this outcome.</p>:
              <div className="ljl-suggestion-list">{suggestions.map((s,i)=>{
                const existing=cards.find(c=>norm(c.title)===norm(s.title));
                return <div className="ljl-suggestion-row" key={s.title}>
                  <div><span>{existing?"Existing card":"Suggested card"}</span><strong>{s.title}</strong><small>Connect from {selected.title}</small></div>
                  <button disabled={saving} onClick={()=>addSuggestion(s,i)}>{existing?"Connect":"Add"}</button>
                </div>;
              })}</div>}
          </section>

          <section className="ljl-selected-actions">
            <button onClick={()=>setEditing(selected)}><Edit3 size={13}/> Edit card</button>
            <button className="danger" onClick={()=>deleteCard(selected)}><Trash2 size={13}/> Delete</button>
          </section>
        </>}
      </aside>
    </section>

    {(editing||addingFrom!==null)&&<CardModal
      card={editing}
      parent={editing?cards.find(c=>c.id===editing.connectFrom[0])||null:addingFrom}
      cards={cards}
      saving={saving}
      onClose={()=>{setEditing(null);setAddingFrom(null)}}
      onSave={saveModal}
    />}
  </main>;
}

function CardModal({card,parent,cards,saving,onClose,onSave}:{card:Card|null;parent:Card|null;cards:Card[];saving:boolean;onClose:()=>void;onSave:(values:{title:string;type:string;notes:string;parentId:string})=>void}){
  const [title,setTitle]=useState(card?.title||"");
  const [type,setType]=useState(card?.type||"Idea");
  const [notes,setNotes]=useState(card?.notes||"");
  const [parentId,setParentId]=useState(card?.connectFrom[0]||parent?.id||"");

  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}>
    <div className="ljl-modal">
      <header><div><span>{card?"EDIT CARD":"ADD CARD"}</span><h2>{card?card.title:"New card"}</h2></div><button onClick={onClose}><X/></button></header>
      <div className="ljl-form">
        <label>Card title<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Website form submitted"/></label>
        <label>Connect from<select value={parentId} onChange={e=>setParentId(e.target.value)}><option value="">No connection</option>{cards.filter(c=>c.id!==card?.id).map(c=><option value={c.id} key={c.id}>{c.title}</option>)}</select></label>
        <label>Type<select value={type} onChange={e=>setType(e.target.value)}>{cardTypes.map(t=><option key={t}>{t}</option>)}</select></label>
        <label>Notes<textarea rows={4} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional"/></label>
      </div>
      <footer><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving||!title.trim()} onClick={()=>onSave({title:title.trim(),type,notes,parentId})}>{saving?"Saving…":"Save"}</button></footer>
    </div>
  </div>;
}
