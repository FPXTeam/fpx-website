# FPX Website

Production-ready FPX public website source.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS / project CSS

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

The repository is configured as a standard Next.js project for Vercel. Legacy ChatGPT Sites/Vinext/Cloudflare scaffolding and concept/demo routes have been removed; the current FPX design and production page implementation are preserved.

## Timber range routes

The website taxonomy now follows the approved Product Group structure:

- `/products` — Product Groups + End Uses / Applications
- `/manufacturing`
- `/building-construction`
- `/outdoor-landscaping`
- `/dunnage`

Product-group pages intentionally stop before individual grades, sizes and specifications. Current products, stock and specifications remain in FPX.
