"use client";

import { useEffect,useMemo,useState } from "react";
import {
  ArrowRight,Check,ChevronRight,GripVertical,Lightbulb,Lock,LogOut,
  MessageSquarePlus,Plus,RefreshCw,Trash2,X
} from "lucide-react";

type Stage={id:string;name:string;order:number;type:"Journey"|"Outcome";description:string;active:boolean};
type Card={id:string;title:string;stageId:string;type:string;notes:string;priority:string;status:string;owner:string;channels:string[];order:number;createdBy:string};
type BoardData={configured:boolean;stages:Stage[];cards:Card[]};

const cardTypes=["Touchpoint","Message","Friction","Question","Idea","Automation","Metric","Decision"];
const priorities=["Now","Next","Later"];
const statuses=["Open","Agreed","Parked"];
const channels=["Website","Explore FPX","Contact Form","Email","LinkedIn","Sales","Referral","Other"];

export function LeadJourneyLab({initiallyUnlocked,passwordConfigured}:{initiallyUnlocked:boolean,passwordConfigured:boolean}){
  const [unlocked,setUnlocked]=useState(initiallyUnlocked);
  const [password,setPassword]=useState("");
  const [authError,setAuthError]=useState("");
  const [board,setBoard]=useState<BoardData>({configured:true,stages:[],cards:[]});
  const [loading,setLoading]=useState(initiallyUnlocked);
  const [error,setError]=useState("");
  const [dragCard,setDragCard]=useState<Card|null>(null);
  const [editing,setEditing]=useState<Card|null>(null);
  const [addingTo,setAddingTo]=useState<Stage|null>(null);
  const [filter,setFilter]=useState("All");
  const [saving,setSaving]=useState(false);

  async function api(method:string,body?:any){
    const response=await fetch("/api/internal/lead-journey-lab",{
      method,headers:{"Content-Type":"application/json"},
      body:body?JSON.stringify(body):undefined,
    });
    const data=await response.json().catch(()=>({}));
    if(response.status===401){setUnlocked(false);throw new Error("Session expired. Please unlock the Lab again.")}
    if(!response.ok)throw new Error(data.error||"Request failed.");
    setBoard(data);
    return data;
  }

  async function load(){
    setLoading(true);setError("");
    try{await api("GET")}catch(e){setError(e instanceof Error?e.message:"Unable to load board.")}
    finally{setLoading(false)}
  }

  useEffect(()=>{if(unlocked)load()},[unlocked]);

  async function unlock(e:React.FormEvent){
    e.preventDefault();setAuthError("");
    const response=await fetch("/api/internal/lead-journey-lab/auth",{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok){setAuthError(data.error||"Unable to unlock.");return}
    setPassword("");setUnlocked(true);
  }

  async function logout(){
    await fetch("/api/internal/lead-journey-lab/auth",{method:"DELETE"});
    setUnlocked(false);setBoard({configured:true,stages:[],cards:[]});
  }

  const stages=useMemo(()=>board.stages.filter(s=>s.active).sort((a,b)=>a.order-b.order),[board.stages]);
  const visibleCards=useMemo(()=>filter==="All"?board.cards:board.cards.filter(c=>c.type===filter),[board.cards,filter]);

  async function moveCard(stageId:string){
    if(!dragCard||dragCard.stageId===stageId)return;
    const snapshot=board;
    setBoard(prev=>({...prev,cards:prev.cards.map(c=>c.id===dragCard.id?{...c,stageId,order:Date.now()}:c)}));
    setDragCard(null);
    try{await api("PATCH",{kind:"card",id:dragCard.id,stageId,order:Date.now()})}
    catch(e){setBoard(snapshot);setError(e instanceof Error?e.message:"Unable to move card.")}
  }

  async function saveCard(values:Partial<Card>&{title:string,stageId:string}){
    setSaving(true);setError("");
    try{
      if(editing)await api("PATCH",{kind:"card",id:editing.id,...values});
      else await api("POST",{kind:"card",...values,order:Date.now()});
      setEditing(null);setAddingTo(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to save card.")}
    finally{setSaving(false)}
  }

  async function removeCard(card:Card){
    if(!confirm(`Delete “${card.title}”?`))return;
    try{await api("DELETE",{kind:"card",id:card.id});setEditing(null)}
    catch(e){setError(e instanceof Error?e.message:"Unable to delete card.")}
  }

  if(!unlocked){
    return <main className="ljl-lock">
      <div className="ljl-lock-card">
        <div className="ljl-mark">FPX <span>INTERNAL</span></div>
        <div className="ljl-lock-icon"><Lock size={22}/></div>
        <p className="ljl-kicker">PRIVATE WORKSPACE</p>
        <h1>Lead Journey Lab</h1>
        <p>Internal FPX workspace for mapping, challenging and improving the lead journey.</p>
        {!passwordConfigured?<div className="ljl-config-warning"><strong>Password not configured.</strong><span>Add <code>LEAD_JOURNEY_LAB_PASSWORD</code> to the Vercel Preview environment for this branch.</span></div>:
        <form onSubmit={unlock}>
          <label>Workspace password<input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/></label>
          {authError&&<small className="ljl-error">{authError}</small>}
          <button type="submit">Unlock Lab <ArrowRight size={16}/></button>
        </form>}
        <small>Private · Noindex · FPX internal use only</small>
      </div>
    </main>;
  }

  return <main className="ljl">
    <header className="ljl-topbar">
      <div><div className="ljl-mark">FPX <span>INTERNAL</span></div><span className="ljl-private"><Lock size={12}/> PRIVATE</span></div>
      <div className="ljl-top-actions">
        <button onClick={load} disabled={loading}><RefreshCw size={14}/> Refresh</button>
        <button onClick={logout}><LogOut size={14}/> Lock</button>
      </div>
    </header>

    <section className="ljl-intro">
      <div>
        <p className="ljl-kicker">LEAD JOURNEY BRAINSTORM</p>
        <h1>From first signal<br/>to outcome.</h1>
      </div>
      <div className="ljl-intro-copy">
        <p>Drag cards between stages. Click any card to edit the thinking behind it. The goal is not to make this pretty — it is to expose gaps, friction, ownership and the next best action.</p>
        <div className="ljl-legend"><span><i className="journey"/>Journey stage</span><span><i className="outcome"/>Outcome</span></div>
      </div>
    </section>

    <section className="ljl-toolbar">
      <div className="ljl-filter">
        {["All",...cardTypes].map(t=><button key={t} onClick={()=>setFilter(t)} className={filter===t?"active":""}>{t}</button>)}
      </div>
      <button className="ljl-add-stage" onClick={()=>alert("Stage creation UI is next. The first six stages are already editable in Airtable.")}><Plus size={14}/> Add stage</button>
    </section>

    {error&&<div className="ljl-banner ljl-error">{error}</div>}
    {!board.configured&&<div className="ljl-banner"><strong>Airtable connection required.</strong> Add <code>AIRTABLE_TOKEN</code> to the Vercel Preview environment so the shared board can load and save.</div>}
    {loading?<div className="ljl-loading">Loading shared board…</div>:
    <section className="ljl-board">
      {stages.map((stage,index)=>{
        const cards=visibleCards.filter(c=>c.stageId===stage.id).sort((a,b)=>a.order-b.order);
        return <div className={"ljl-lane "+(stage.type==="Outcome"?"is-outcome":"")} key={stage.id}
          onDragOver={e=>e.preventDefault()} onDrop={()=>moveCard(stage.id)}>
          <header>
            <div className="ljl-stage-number">{String(index+1).padStart(2,"0")}</div>
            <div><span>{stage.type}</span><h2>{stage.name}</h2><p>{stage.description}</p></div>
          </header>
          <div className="ljl-card-stack">
            {cards.map(card=><article key={card.id} draggable
              onDragStart={()=>setDragCard(card)} onDragEnd={()=>setDragCard(null)}
              onClick={()=>setEditing(card)} className={"ljl-card "+(dragCard?.id===card.id?"is-dragging":"")}>
              <div className="ljl-card-top"><span className={"type type-"+card.type.toLowerCase()}>{card.type}</span><GripVertical size={15}/></div>
              <h3>{card.title}</h3>
              {card.notes&&<p>{card.notes}</p>}
              <footer>
                <span className={"priority p-"+card.priority.toLowerCase()}>{card.priority}</span>
                {card.owner&&<span>{card.owner}</span>}
                {card.status==="Agreed"&&<span className="agreed"><Check size={12}/> Agreed</span>}
              </footer>
            </article>)}
            <button className="ljl-add-card" onClick={()=>setAddingTo(stage)}><MessageSquarePlus size={15}/> Add idea</button>
          </div>
          {stage.type==="Journey"&&index<stages.length-2&&<ChevronRight className="ljl-flow-arrow" size={22}/>}
        </div>
      })}
    </section>}

    <aside className="ljl-notes">
      <Lightbulb size={18}/>
      <div><strong>Questions to keep asking</strong><p>What does the lead know here? What do we know? What should happen next? Who owns it? What can be automated? What makes a good lead leave?</p></div>
    </aside>

    {(editing||addingTo)&&<CardModal card={editing} stage={addingTo||stages.find(s=>s.id===editing?.stageId)||stages[0]}
      stages={stages} saving={saving} onClose={()=>{setEditing(null);setAddingTo(null)}} onSave={saveCard} onDelete={editing?()=>removeCard(editing):undefined}/>}
  </main>;
}

function CardModal({card,stage,stages,saving,onClose,onSave,onDelete}:{card:Card|null;stage:Stage;stages:Stage[];saving:boolean;onClose:()=>void;onSave:(v:any)=>void;onDelete?:()=>void}){
  const [title,setTitle]=useState(card?.title||"");
  const [stageId,setStageId]=useState(card?.stageId||stage.id);
  const [type,setType]=useState(card?.type||"Idea");
  const [notes,setNotes]=useState(card?.notes||"");
  const [priority,setPriority]=useState(card?.priority||"Next");
  const [status,setStatus]=useState(card?.status||"Open");
  const [owner,setOwner]=useState(card?.owner||"");
  const [selectedChannels,setChannels]=useState<string[]>(card?.channels||[]);

  function toggleChannel(channel:string){setChannels(v=>v.includes(channel)?v.filter(x=>x!==channel):[...v,channel])}

  return <div className="ljl-modal-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}>
    <div className="ljl-modal">
      <header><div><span>{card?"EDIT CARD":"NEW IDEA"}</span><h2>{card?"Shape the thinking.":"Add something worth discussing."}</h2></div><button onClick={onClose}><X/></button></header>
      <div className="ljl-form-grid">
        <label className="wide">Title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What are we trying to solve?"/></label>
        <label>Stage<select value={stageId} onChange={e=>setStageId(e.target.value)}>{stages.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label>Type<select value={type} onChange={e=>setType(e.target.value)}>{cardTypes.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}>{priorities.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="wide">Owner<input value={owner} onChange={e=>setOwner(e.target.value)} placeholder="Gabriel, George, Gabriela…"/></label>
        <label className="wide">Notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={5} placeholder="Context, friction, hypothesis, next action…"/></label>
        <div className="wide ljl-channel-field"><span>Channels</span><div>{channels.map(ch=><button type="button" key={ch} onClick={()=>toggleChannel(ch)} className={selectedChannels.includes(ch)?"active":""}>{ch}</button>)}</div></div>
      </div>
      <footer>
        {onDelete?<button className="danger" onClick={onDelete}><Trash2 size={15}/> Delete</button>:<span/>}
        <div><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving||!title.trim()} onClick={()=>onSave({title:title.trim(),stageId,type,notes,priority,status,owner,channels:selectedChannels})}>{saving?"Saving…":"Save card"}</button></div>
      </footer>
    </div>
  </div>;
}
