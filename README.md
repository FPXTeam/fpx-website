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

- `/products` - Product Groups + End Uses / Applications
- `/manufacturing`
- `/building-construction`
- `/outdoor-landscaping`
- `/dunnage`

Product-group pages intentionally stop before individual grades, sizes and specifications. Current products, stock and specifications remain in FPX.

## Added brand and imagery assets

New imagery generated in this chat is stored under:

- `public/images/product-groups/manufacturing/`
- `public/images/product-groups/building-construction/`
- `public/images/product-groups/outdoor-landscaping/`
- `public/images/product-groups/dunnage/`

Brand assets for website use are stored under:

- `public/images/brand-assets/`

The live page references were updated so the product-group cards, product-group pages and selected end-use sections now use the new timber imagery.
