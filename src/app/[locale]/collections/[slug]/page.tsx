import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_TOP_BANNER_COLLECTION, GET_ALL_TOP_BANNER_SLUGS } from "@/lib/queries";
import type { TopBanner, DestinationPage } from "@/lib/types";
import DestinationCard from "@/components/DestinationCard";
import PreviewBanner from "@/components/PreviewBanner";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const data = await hygraphFetch<{ topBanners: { slug: string }[] }>(
      GET_ALL_TOP_BANNER_SLUGS,
      undefined,
      false
    );
    const slugs = (data.topBanners || []).map((b) => b.slug).filter(Boolean);
    const locales = ["en", "de"] as const;
    return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
  } catch {
    return [];
  }
}

async function getCollection(slug: string, isDraft: boolean, locale: string) {
  const stage = isDraft ? "DRAFT" : "PUBLISHED";
  const locales = hygraphLocales(locale);
  const data = await hygraphFetch<{ topBanner: TopBanner | null }>(
    GET_TOP_BANNER_COLLECTION,
    { slug, stage, locales },
    isDraft
  );
  return data.topBanner;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const page = await getCollection(slug, false, locale);
  if (!page?.title) {
    return { title: t("collectionFallbackTitle") };
  }
  return {
    title: page.title,
    description: t("collectionDescription", { title: page.title }),
  };
}

export default async function DestinationCollectionPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("collection");

  const { isEnabled: isDraft } = draftMode();
  const banner = await getCollection(slug, isDraft, locale);

  if (!banner) {
    notFound();
  }

  const destinations: DestinationPage[] = banner.featuredDestinations || [];

  return (
    <>
      {isDraft && <PreviewBanner />}

      <section className="bg-gradient-to-br from-ew-primary-dark to-ew-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white md:text-4xl">{banner.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">{t("intro")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {destinations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-ew-grey">{t("empty")}</p>
          </div>
        )}
      </section>
    </>
  );
}
