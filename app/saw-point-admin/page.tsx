import type { Metadata } from "next";
import { isSawPointAdmin } from "../../lib/saw-point-admin-auth";
import SawPointPublisher from "./publisher";

export const metadata:Metadata={
  title:"Saw Point Publisher",
  robots:{index:false,follow:false,nocache:true}
};

export default async function SawPointAdminPage({
  searchParams
}:{searchParams:Promise<{error?:string}>}){
  const authed=await isSawPointAdmin();
  const params=await searchParams;

  if(!authed){
    return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:"24px",background:"#F4F7F4"}}>
      <form action="/api/saw-point-admin/login" method="post" style={{width:"min(420px,100%)",background:"#fff",border:"1px solid #DFE6E1",padding:"30px"}}>
        <div style={{fontSize:"10px",fontWeight:700,letterSpacing:".16em",color:"#40973C",marginBottom:"10px"}}>PRIVATE FPX TOOL</div>
        <h1 style={{margin:"0 0 10px",fontSize:"38px",letterSpacing:"-.04em"}}>Saw Point Publisher</h1>
        <p style={{margin:"0 0 24px",color:"#64736C",lineHeight:1.6}}>Enter the publishing password to continue.</p>
        <label style={{display:"block",fontSize:"10px",fontWeight:700,letterSpacing:".1em",color:"#758956",marginBottom:"8px"}}>PASSWORD</label>
        <input type="password" name="password" autoComplete="current-password" required style={{width:"100%",height:"48px",border:"1px solid #DDE4DF",padding:"0 13px",marginBottom:"14px"}}/>
        <button type="submit" style={{width:"100%",height:"48px",border:0,background:"#40973C",color:"#fff",fontWeight:700,cursor:"pointer"}}>Open publisher</button>
        {params.error&&<p style={{margin:"13px 0 0",color:"#8A3026",fontSize:"12px"}}>Incorrect password.</p>}
      </form>
    </main>;
  }

  return <main style={{minHeight:"100vh",background:"#F4F7F4"}}><SawPointPublisher/></main>;
}
