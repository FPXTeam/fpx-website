import Image from "next/image";
import Link from "next/link";
import { CookieConsent } from "./cookie-consent";
import { FooterSubscribe } from "./footer-subscribe";
import "./george-site-shell.css";

const resourceLinks = [
  { href: "/industry-insights", label: "FPX Insights", description: "Timber guides and product information." },
  { href: "/saw-point", label: "Saw Point", description: "New Zealand timber industry updates." },
  { href: "/frequently-asked-questions", label: "FAQ", description: "Answers about using FPX." },
];

export function Header(){
  return <header className="george-header">
    <div className="george-wrap george-nav">
      <a className="george-brand" href="/" aria-label="FPX home">
        <Image src="/images/fpx-logo-horizontal-original.png" alt="FPX" width={160} height={72} sizes="(max-width: 600px) 96px, 109px"/>
      </a>
      <nav className="george-links" aria-label="Primary navigation">
        <Link href="/fpx-sourcing">FPX Sourcing</Link>
        <Link href="/timber">Timber Range</Link>
        <Link href="/our-customers">Our Customers</Link>
        <Link href="/fpx-intelligence">FPX Intelligence</Link>
        <div className="george-resources">
          <button type="button" aria-haspopup="true">Resources <span aria-hidden="true">⌄</span></button>
          <div className="george-resources-menu">
            {resourceLinks.map(item=><Link href={item.href} key={item.href}><b>{item.label}</b><small>{item.description}</small></Link>)}
          </div>
        </div>
        <Link href="/about-us">About Us</Link>
        <Link href="/contact-us">Contact</Link>
      </nav>
      <div className="george-nav-actions">
        <a className="george-login" href="https://app.fpx.nz/">Login ↗</a>
        <a className="george-access" href="https://app.fpx.nz/sourcing-sign-up">Get FPX Access</a>
      </div>
      <details className="george-mobile-menu">
        <summary aria-label="Open navigation"><span className="george-hamburger"><i/><i/><i/></span></summary>
        <div className="george-mobile-panel">
          <nav aria-label="Mobile navigation">
            <Link href="/fpx-sourcing">FPX Sourcing</Link>
            <Link href="/timber">Timber Range</Link>
            <Link href="/our-customers">Our Customers</Link>
            <Link href="/fpx-intelligence">FPX Intelligence</Link>
            {resourceLinks.map(item=><Link href={item.href} key={item.href}>{item.label}</Link>)}
            <Link href="/about-us">About Us</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
          <div className="george-mobile-actions">
            <a href="https://app.fpx.nz/">Login</a>
            <a href="https://app.fpx.nz/sourcing-sign-up">Get FPX Access</a>
          </div>
        </div>
      </details>
    </div>
  </header>;
}

export function Footer(){
  return <footer className="george-footer">
    <div className="george-wrap">
      <div className="george-footer-grid">
        <div className="george-footer-brand">
          <Image src="/images/brand-assets/fpx-logo-x-eggshell-white.png" alt="FPX" width={96} height={96} sizes="52px"/>
          <p>Browse timber, submit requirements and manage your FPX account.</p>
        </div>
        <div className="george-footer-col"><h2>FPX</h2><Link href="/fpx-sourcing">FPX Sourcing</Link><a href="https://app.fpx.nz/explore-fpx-sourcing">Browse Timber</a><a href="https://app.fpx.nz/explore-fpx-sourcing?request=1">Submit a Timber Request</a><Link href="/timber">Timber Range</Link></div>
        <div className="george-footer-col"><h2>RESOURCES</h2><Link href="/saw-point">Saw Point</Link><Link href="/industry-insights">FPX Insights</Link><Link href="/frequently-asked-questions">FAQ</Link><Link href="/our-customers">Our Customers</Link></div>
        <div className="george-footer-col"><h2>COMPANY</h2><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact</Link><a href="https://app.fpx.nz/sourcing-sign-up">Get FPX Access</a><a href="https://app.fpx.nz/">Login</a></div>
      </div>
      <FooterSubscribe/>
      <div className="george-footer-bottom"><span>© 2026 Forest Products Exchange Limited</span><nav aria-label="Legal links"><Link href="/terms-and-conditions">Terms &amp; Conditions</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/cookie-policy">Cookie Policy</Link><Link href="/cookie-settings">Cookie Settings</Link></nav></div>
    </div>
  </footer>;
}

export function Shell({children}:{children:React.ReactNode}){return <><a className="skip-link" href="#main-content">Skip to main content</a><Header/>{children}<Footer/><CookieConsent/></>}
