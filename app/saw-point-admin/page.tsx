import type { Metadata } from "next";
import SawPointPublisher from "./publisher";

export const metadata:Metadata={
  title:"Saw Point Publisher",
  robots:{index:false,follow:false,nocache:true}
};

export default function SawPointAdminPage(){
  return <main style={{minHeight:"100vh",background:"#F4F7F4"}}><SawPointPublisher/></main>;
}
