# Hygraph side-by-side preview & `/api/draft`

## FAQ (or any model) showed a blank iframe

Hygraph often builds preview URLs like:

- `slug={{entry.id}}` → browser requests `/cmxxxx…`, which **is not a Next.js route**, or  
- `publication={{modelApiId}}&slug=…` → `/api/draft` used to redirect to `/FaqPage/faq`, which **does not exist**.

The draft handler now:

1. **Maps model names** (`FaqPage`, `FaqPages`, `LandingPage`, …) to real paths (`/faq`, `/pages/…`, …).  
2. If `slug` looks like a **Hygraph entry id** (`cm…`), runs a **DRAFT** GraphQL resolve to detect `faqPage`, `landingPage`, etc. and redirects to the correct URL.  
3. Supports **`model`** / **`__typename`** query params if your preview URL template can send them.  
4. Supports **`locale=de`** (or `de_AT`) to open **`/de/faq`** etc.

## Environment

- **`HYGRAPH_PREVIEW_SECRET`** — optional; if set, append `?secret=…` to the draft URL.  
- **`HYGRAPH_PREVIEW_TOKEN`** — **required** for id-based `slug` resolution (DRAFT stage queries).  
- **`HYGRAPH_ENDPOINT`** — Content API URL (same as production fetch).

## Suggested Hygraph preview URL

Point “Click to edit” / preview to your site, e.g.:

```text
https://<your-domain>/api/draft?secret=<HYGRAPH_PREVIEW_SECRET>&slug={{entry.slug}}&locale={{locale}}
```

For models without a public slug segment (e.g. singleton FAQ page), either:

- use **`slug={{entry.slug}}`** (e.g. `faq`), or  
- use **`slug={{entry.id}}`** (requires **`HYGRAPH_PREVIEW_TOKEN`**), or  
- add **`&model=FaqPage`**.

After deploying, open the FAQ entry in Studio and use **View logs** on the preview request if anything still fails (401 = secret; 500 = check server logs).
