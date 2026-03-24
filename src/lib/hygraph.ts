import { HYGRAPH_CACHE_TAG } from "./cache-tags";

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT || "";
const PRODUCTION_TOKEN = process.env.HYGRAPH_PRODUCTION_TOKEN || "";
const PREVIEW_TOKEN = process.env.HYGRAPH_PREVIEW_TOKEN || "";

export async function hygraphFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  isDraft = false
): Promise<T> {
  if (!HYGRAPH_ENDPOINT) {
    console.warn("HYGRAPH_ENDPOINT not set – returning empty data");
    return {} as T;
  }

  const token = isDraft ? PREVIEW_TOKEN : PRODUCTION_TOKEN;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (isDraft) {
    headers["Cache-Control"] = "no-cache";
    headers.Pragma = "no-cache";
  }

  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(isDraft
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60, tags: [HYGRAPH_CACHE_TAG] } }),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Hygraph HTTP error:", res.status, JSON.stringify(json, null, 2));
    throw new Error(`Hygraph request failed (${res.status})`);
  }

  // GraphQL can return both `errors` (e.g. per-field) and partial `data`. Only fail
  // when there is no usable payload — otherwise promos/relations can disappear in preview.
  if (json.errors?.length) {
    console.error("Hygraph error:", JSON.stringify(json.errors, null, 2));
  }
  if (json.data == null) {
    throw new Error(json.errors?.[0]?.message || "Hygraph query failed");
  }

  return json.data;
}
