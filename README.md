# Eurowings Site

A modern airline website built with [Next.js](https://nextjs.org/) and [Hygraph](https://hygraph.com/) CMS, inspired by the Eurowings brand.

## Getting Started

### Prerequisites

- Node.js 18+
- A Hygraph project with the Eurowings schema

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and add your Hygraph Content API endpoint:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and set `HYGRAPH_ENDPOINT` to your Hygraph Content API URL (found in Hygraph Studio > Project Settings > API Access).

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Hygraph side-by-side preview

Studio’s preview iframe talks to the site via the Preview SDK. **`sync.fieldUpdate`** must be **`true`** (set in `PreviewWrapper.tsx`) so Hygraph advertises `fieldUpdateSync` and pushes **field-update** messages while you edit; otherwise the iframe only updates after a full navigation or new tab.

After **Save**, `router.refresh()` runs so server components refetch draft content. Published-only changes still follow your [on-demand revalidation](./docs/on-demand-revalidation.md) flow in a normal browser tab.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, promotions, and featured destinations |
| `/destinations` | All destinations listing |
| `/destinations/[slug]` | Individual destination page |
| `/faq` | FAQ page with accordion categories |
| `/pages/[slug]` | Flexible landing pages |
| `/collections/[slug]` | Curated destination list (from Top Banner in Hygraph) |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **CMS**: Hygraph (GraphQL)
- **Language**: TypeScript
- **Deployment**: Vercel

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set the `HYGRAPH_ENDPOINT` (and optional Hygraph tokens) in Vercel **Project → Settings → Environment Variables**.

### Fresh content after publish (Hygraph webhooks)

**Recommended — on-demand revalidation (seconds):** Hygraph webhook → `POST /api/revalidate` with a **shared secret key**; set the same value as **`REVALIDATE_SECRET`** in Vercel (signed `gcms-signature`).  
Details: **[docs/on-demand-revalidation.md](./docs/on-demand-revalidation.md)** · webhook checklist: **[docs/hygraph-webhook-mcp.md](./docs/hygraph-webhook-mcp.md)**.

**Optional — full Vercel rebuild (minutes):** use a **Deploy Hook** instead of or in addition to the route above.  
See **[docs/hygraph-vercel-webhook.md](./docs/hygraph-vercel-webhook.md)** and [Hygraph’s guide](https://hygraph.com/docs/developer-guides/webhooks/trigger-static-build).

Published Hygraph fetches use tag **`hygraph`** with **~60s** time-based revalidation (`src/lib/hygraph.ts`); `/api/revalidate` clears that cache immediately.
