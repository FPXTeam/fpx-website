# Cleanup notes

The visual implementation was intentionally preserved.

Unchanged design-critical files:
- `components/master-site.tsx`
- `components/master-site.css`
- `components/site-shell.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- all files under `public/images/`

Removed legacy/non-production scaffolding:
- ChatGPT Sites / `.openai` hosting config
- Vinext/Vite/Cloudflare Worker setup
- Wrangler scripts
- D1/Drizzle examples and database scaffolding
- generic unused UI component library
- concept/demo routes (`/concept-1` through `/concept-5` and their duplicate pages)
- legacy unused page implementation

Routing now exposes only the real FPX pages.

Build scripts are standard Next.js commands for Vercel:
- `npm run dev`
- `npm run build`
- `npm start`

Note: dependency installation could not be completed in the current execution environment before its command timeout, so the final production build still needs to be verified after install or on Vercel. `package-lock.json` was intentionally omitted so the next install resolves a clean lockfile from the simplified dependency set.
