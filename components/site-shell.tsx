import Image from "next/image";
import Link from "next/link";
import { CookieConsent } from "./cookie-consent";
import { FooterSubscribe } from "./footer-subscribe";
import { LinkedInIcon, InstagramIcon, FacebookIcon } from "./social-icons";

function ChevronDownIcon(){return <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>}
function ArrowUpRightIcon(){return <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>}
function MenuIcon(){return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>}
function CloseIcon(){return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>}

export function Header(){
  return <header className="site-header">
    <div className="nav-wrap">
      <Link href="/" className="brand" aria-label="FPX home"><Image src="/images/fpx-logo-horizontal-original.png" alt="" width={160} height={72} sizes="(max-width: 900px) 104px, 116px" quality={80}/></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/fpx-sourcing">FPX Sourcing</Link>
        <Link href="/timber">Timber Range</Link>
        <Link href="/our-customers">Our Customers</Link>
        <div className="drop"><button type="button" aria-haspopup="true">Resources <ChevronDownIcon/></button><div className="drop-menu"><Link href="/saw-point"><b>Saw Point</b><span>Straight talk on NZ timber.</span></Link><Link href="/industry-insights"><b>FPX Insights</b><span>Guides and practical timber knowledge.</span></Link><Link href="/frequently-asked-questions"><b>FAQ</b><span>Answers about sourcing through FPX.</span></Link></div></div>
        <Link href="/about-us">About Us</Link>
        <Link href="/contact-us">Contact</Link>
      </nav>
      <div className="nav-actions"><a href="https://app.fpx.nz">Login</a><a className="nav-cta" href="https://app.fpx.nz/stock">Browse Timber <ArrowUpRightIcon/></a></div>
      <details className="mobile-nav-details">
        <summary aria-label="Toggle navigation"><span className="mobile-menu-open"><MenuIcon/></span><span className="mobile-menu-close"><CloseIcon/></span></summary>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link href="/fpx-sourcing">FPX Sourcing</Link>
          <Link href="/timber">Timber Range</Link>
          <Link href="/our-customers">Our Customers</Link>
          <span>Resources</span>
          <Link href="/saw-point">Saw Point</Link>
          <Link href="/industry-insights">FPX Insights</Link>
          <Link href="/frequently-asked-questions">FAQ</Link>
          <Link href="/about-us">About Us</Link>
          <Link href="/contact-us">Contact</Link>
          <div className="mobile-nav-actions"><a href="https://app.fpx.nz" className="mobile-nav-login">Login</a><a href="https://app.fpx.nz/stock" className="mobile-nav-cta">Browse Timber <ArrowUpRightIcon/></a></div>
        </nav>
      </details>
    </div>
  </header>;
}

export function Footer(){
  return <footer>
    <div className="footer-grid">
      <div className="footer-brand-column">
        <div className="footer-brand-mark"><Image src="/images/brand-assets/fpx-logo-x-eggshell-white.png" alt="FPX" width={96} height={96} sizes="(max-width: 700px) 42px, 48px" quality={80}/></div>
        <p>A clearer, supported way to source New Zealand timber.</p>
        <nav className="footer-social" aria-label="FPX social profiles"><a href="https://www.linkedin.com/company/forest-products-exchange" target="_blank" rel="noreferrer" aria-label="FPX on LinkedIn"><LinkedInIcon/></a><a href="https://www.instagram.com/fpx.nz/" target="_blank" rel="noreferrer" aria-label="FPX on Instagram"><InstagramIcon/></a><a href="https://www.facebook.com/people/Forest-Products-Exchange/61583101360304/" target="_blank" rel="noreferrer" aria-label="FPX on Facebook"><FacebookIcon/></a></nav>
      </div>
      <div><p className="footer-heading">SOURCING</p><Link href="/fpx-sourcing">FPX Sourcing</Link><Link href="/timber">Timber Range</Link><a href="https://app.fpx.nz/offers">View Offers</a><a href="https://app.fpx.nz/request-cart">Create a Request</a></div>
      <div><p className="footer-heading">INSIGHTS</p><Link href="/saw-point">Saw Point</Link><Link href="/industry-insights">FPX Insights</Link><Link href="/frequently-asked-questions">FAQ</Link><Link href="/our-customers">Our Customers</Link></div>
      <div><p className="footer-heading">COMPANY</p><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact</Link></div>
    </div>
    <FooterSubscribe/>
    <div className="footer-bottom"><span>© 2026 Forest Products Exchange Limited</span><nav aria-label="Legal links"><Link href="/terms-and-conditions">Terms &amp; Conditions</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/cookie-policy">Cookie Policy</Link><Link href="/cookie-settings">Cookie Settings</Link></nav></div>
  </footer>;
}

export function Shell({children}:{children:React.ReactNode}){return <><Header/>{children}<Footer/><CookieConsent/></>}
