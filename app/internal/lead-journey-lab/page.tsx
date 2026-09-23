import type { Metadata } from "next";
import { LeadJourneyLab } from "../../../components/lead-journey-lab";
import "./lead-journey-lab.css";

export const metadata:Metadata={
  title:"FPX Lead Journey Lab",
  description:"Private internal FPX lead journey brainstorming workspace.",
  robots:{index:false,follow:false,nocache:true,googleBot:{index:false,follow:false,noimageindex:true}},
};

export default function LeadJourneyLabPage(){
  return <LeadJourneyLab/>;
}
