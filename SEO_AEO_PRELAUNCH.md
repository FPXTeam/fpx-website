# FPX SEO + AEO Pre-launch Checklist

## Already implemented in the repo

- Static generation for public pages
- Unique page titles and meta descriptions
- Self-referencing canonical URLs for indexable pages
- Open Graph and Twitter metadata
- Organization and WebSite JSON-LD on the homepage
- WebPage, AboutPage, ContactPage, Article and BreadcrumbList JSON-LD where relevant
- Visible breadcrumbs on deeper pages
- `robots.txt` generation allowing Googlebot, Bingbot and OAI-SearchBot
- XML sitemap generation
- Permanent `/faq` redirect to `/frequently-asked-questions`
- Semantic headings and descriptive internal links
- More explicit entity, audience, service and geography wording
- Direct answer blocks on timber product-group pages
- Meaningful image alt text on content imagery
- Product and customer imagery converted to WebP for lighter page loads
- Focus-visible states, labels and improved form accessibility
- Security response headers
- Responsive mobile layouts
- No FAQPage schema dependency
- No llms.txt dependency

## External tasks before or immediately after launch

1. Confirm the production domain resolves to the Vercel project and every indexable URL returns HTTP 200.
2. Verify `https://fpx.nz/robots.txt` and `https://fpx.nz/sitemap.xml` publicly.
3. Add the sitemap to Google Search Console.
4. Add the site and sitemap to Bing Webmaster Tools.
5. Configure IndexNow after a Bing/IndexNow key is available.
6. Verify GA4 and conversion events for contact clicks, email clicks, sourcing CTAs and other important actions.
7. Create an analytics segment for `utm_source=chatgpt.com` referrals.
8. Confirm Vercel or any firewall does not block Googlebot, Bingbot or OAI-SearchBot.
9. Reconnect and test the Saw Point subscription form with the existing Make workflow.
10. Replace the temporary concise FPX Insight article bodies with the complete original article copy once the source text/export is supplied.
11. Test Core Web Vitals on production, especially LCP, INP and CLS.
12. Validate structured data against the production URLs.
13. Check all social share previews after DNS and production deployment.
14. Confirm all legal copy with FPX before launch. The repo preserves the supplied wording, with the requested correction from heading 44 to 41 for No contractual privity.
