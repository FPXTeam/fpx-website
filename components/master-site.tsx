"use client";
import { Shell } from "./site-shell";
import { useParallax } from "./master-shared";
export { MasterHome } from "./master-home";
import { SourceTimberPage, HowPage } from "./master-sourcing";
import { ProductsPage, ProductGroupPage, hasProductGroup } from "./master-products";
import { CustomersPage, AboutPage, ContactPage } from "./master-company";
import { SawPointPage, ResourcesPage, FAQPage, LegalPage, InsightArticlePage } from "./master-content";

export function MasterInnerPage({slug}:{slug:string}){
  useParallax();
  let body:React.ReactNode;
  if(slug==="products")body=<ProductsPage/>;
  else if(hasProductGroup(slug))body=<ProductGroupPage slug={slug}/>;
  else if(slug==="source-timber")body=<SourceTimberPage/>;
  else if(slug==="how-fpx-works")body=<HowPage/>;
  else if(slug==="our-customers")body=<CustomersPage/>;
  else if(slug==="saw-point")body=<SawPointPage/>;
  else if(slug==="industry-resources")body=<ResourcesPage/>;
  else if(slug==="faq"||slug==="frequently-asked-questions")body=<FAQPage/>;
  else if(slug==="about-us")body=<AboutPage/>;
  else if(slug==="contact-us")body=<ContactPage/>;
  else if(slug==="timber-growth-rings"||slug==="the-science-of-kiln-drying")body=<InsightArticlePage slug={slug}/>;
  else body=<LegalPage slug={slug}/>;
  return <Shell><main className="master-site m-inner-site">{body}</main></Shell>;
}
