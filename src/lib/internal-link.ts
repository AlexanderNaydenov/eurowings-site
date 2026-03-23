/** CMS paths like `pages/foo` or `/pages/foo` → href for next-intl `Link` */
export function normalizeInternalHref(url: string): string {
  const t = url.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return t.startsWith("/") ? t : `/${t}`;
}
