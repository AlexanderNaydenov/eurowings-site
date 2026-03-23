import { draftMode } from "next/headers";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_ACTIVE_TOP_BANNER } from "@/lib/queries";
import type { TopBanner } from "@/lib/types";
import { Link } from "@/i18n/navigation";

type Props = { locale: string };

export default async function SiteTopBanner({ locale }: Props) {
  const { isEnabled: isDraft } = draftMode();
  const stage = isDraft ? "DRAFT" : "PUBLISHED";
  const locales = hygraphLocales(locale);

  let banner: TopBanner | null = null;
  try {
    const data = await hygraphFetch<{ topBanners: TopBanner[] }>(
      GET_ACTIVE_TOP_BANNER,
      { stage, locales },
      isDraft
    );
    banner = data.topBanners?.[0] ?? null;
  } catch {
    return null;
  }

  if (!banner?.slug || !banner.title) {
    return null;
  }

  const cta = banner.ctaLabel?.trim() || "View destinations";

  return (
    <div className="relative z-[60] border-b border-white/10 bg-gradient-to-r from-ew-primary-dark via-ew-primary to-ew-primary-light">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-2.5 text-center sm:flex-row sm:gap-4 sm:px-6 sm:justify-between lg:px-8">
        <p className="text-sm font-semibold text-white sm:text-base">{banner.title}</p>
        <Link
          href={`/collections/${banner.slug}`}
          className="shrink-0 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/30 transition hover:bg-white/25 sm:text-sm"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
