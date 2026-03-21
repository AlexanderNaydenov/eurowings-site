import type { AppLocale } from "@/i18n/routing";

/** Hygraph locale fallback: German prefers de then en; English uses en only. */
export function hygraphLocales(locale: string): ("en" | "de")[] {
  return (locale as AppLocale) === "de" ? ["de", "en"] : ["en"];
}
