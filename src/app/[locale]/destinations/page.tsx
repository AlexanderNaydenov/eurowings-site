import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_ALL_DESTINATIONS } from "@/lib/queries";
import type { DestinationPage } from "@/lib/types";
import DestinationCard from "@/components/DestinationCard";
import PreviewBanner from "@/components/PreviewBanner";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("destinationsTitle"),
    description: t("destinationsDescription"),
  };
}

async function getDestinations(isDraft: boolean, locale: string) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const locales = hygraphLocales(locale);
    const data = await hygraphFetch<{ destinationPages: DestinationPage[] }>(
      GET_ALL_DESTINATIONS,
      { stage, locales },
      isDraft
    );
    return data.destinationPages || [];
  } catch {
    return [];
  }
}

export default async function DestinationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("destinations");

  const { isEnabled: isDraft } = draftMode();
  const destinations = await getDestinations(isDraft, locale);

  return (
    <>
      {isDraft && <PreviewBanner />}

      <section className="bg-gradient-to-br from-ew-primary-dark to-ew-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{t("heroSubtitle")}</p>
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
          <div className="py-20 text-center">
            <p className="text-lg text-ew-grey">{t("empty")}</p>
          </div>
        )}
      </section>
    </>
  );
}
