import { unstable_noStore as noStore } from "next/cache";
import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_HOMEPAGE } from "@/lib/queries";
import type { HomeBelowSearchBlock, Homepage } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import FlightSearchPanel from "@/components/FlightSearchPanel";
import ContentBlockBanner from "@/components/ContentBlockBanner";
import PromoCard from "@/components/PromoCard";
import ServiceCard from "@/components/ServiceCard";
import DestinationCard from "@/components/DestinationCard";
import ContentSection from "@/components/ContentSection";
import PreviewBanner from "@/components/PreviewBanner";

/** Avoid serving a static RSC tree that ignores draft / Hygraph DRAFT after Save & Preview. */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

type BelowSearchChunk =
  | {
      kind: "banner";
      block: HomeBelowSearchBlock & { __typename: "ContentBlock" | "SplitBannerBlock" };
    }
  | {
      kind: "services";
      items: (HomeBelowSearchBlock & { __typename: "Service" | "ServiceTile" })[];
    };

function isSplitBannerBlock(
  b: HomeBelowSearchBlock
): b is HomeBelowSearchBlock & { __typename: "ContentBlock" | "SplitBannerBlock" } {
  return b.__typename === "ContentBlock" || b.__typename === "SplitBannerBlock";
}

function isServiceBelowBlock(
  b: HomeBelowSearchBlock
): b is HomeBelowSearchBlock & { __typename: "Service" | "ServiceTile" } {
  return b.__typename === "Service" || b.__typename === "ServiceTile";
}

function chunkBelowSearchBlocks(blocks: HomeBelowSearchBlock[]): BelowSearchChunk[] {
  const chunks: BelowSearchChunk[] = [];
  let serviceBuf: (HomeBelowSearchBlock & { __typename: "Service" | "ServiceTile" })[] = [];

  const flushServices = () => {
    if (serviceBuf.length > 0) {
      chunks.push({ kind: "services", items: [...serviceBuf] });
      serviceBuf = [];
    }
  };

  for (const b of blocks) {
    if (isSplitBannerBlock(b)) {
      flushServices();
      chunks.push({ kind: "banner", block: b });
    } else if (isServiceBelowBlock(b)) {
      serviceBuf.push(b);
    }
  }
  flushServices();
  return chunks;
}

async function getHomepage(isDraft: boolean, locale: string) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const locales = hygraphLocales(locale);
    const data = await hygraphFetch<{ homepages: Homepage[] }>(
      GET_HOMEPAGE,
      { stage, locales },
      isDraft
    );
    return data.homepages?.[0] || null;
  } catch {
    return null;
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const { isEnabled: isDraft } = draftMode();
  if (isDraft) {
    noStore();
  }
  const page = await getHomepage(isDraft, locale);
  const hero = page?.heroBannerComponent ?? page?.heroBanner;
  const belowBlocks =
    page?.belowSearchComposition && page.belowSearchComposition.length > 0
      ? page.belowSearchComposition
      : page?.belowSearchBlocks;

  return (
    <>
      {isDraft && <PreviewBanner />}

      {hero ? (
        <HeroBanner hero={hero} />
      ) : (
        <section className="relative flex h-[34rem] items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ew-primary-dark via-ew-primary to-ew-primary-light" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-extrabold leading-tight text-white md:text-6xl">
                {t("fallbackTitle")}
              </h1>
              <p className="mt-4 text-lg text-white/80 md:text-xl">{t("fallbackSubtitle")}</p>
              <div className="mt-8 inline-block rounded-full bg-ew-accent px-8 py-3.5 text-base font-bold text-ew-dark shadow-lg">
                {t("searchFlights")}
              </div>
            </div>
          </div>
        </section>
      )}

      <FlightSearchPanel />

      {belowBlocks && belowBlocks.length > 0 && (
        <>
          {chunkBelowSearchBlocks(belowBlocks).map((chunk) =>
            chunk.kind === "banner" ? (
              <div key={chunk.block.id} className="space-y-0">
                <ContentBlockBanner block={chunk.block} />
              </div>
            ) : (
              <section
                key={`services-${chunk.items.map((s) => s.id).join("-")}`}
                className="border-y border-gray-100 bg-white py-12"
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <h2 className="mb-8 text-3xl font-bold text-ew-dark">{t("servicesHeading")}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {chunk.items.map((svc) => (
                      <ServiceCard key={svc.id} service={svc} />
                    ))}
                  </div>
                </div>
              </section>
            )
          )}
        </>
      )}

      {page?.promoCards && page.promoCards.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-ew-dark">{t("dealsHeading")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.promoCards.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        </section>
      )}

      {page?.featuredDestinations && page.featuredDestinations.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-ew-dark">{t("popularHeading")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.featuredDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        </section>
      )}

      {page?.contentSections && page.contentSections.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {page.contentSections.map((section, idx) => (
              <ContentSection key={section.id || idx} section={section} entryId={page.id} />
            ))}
          </div>
        </section>
      )}

      {!page && (
        <>
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-ew-dark">{t("whyHeading")}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { title: t("featureLowPricesTitle"), desc: t("featureLowPricesDesc") },
                { title: t("featureSelectionTitle"), desc: t("featureSelectionDesc") },
                { title: t("featureSecureTitle"), desc: t("featureSecureDesc") },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ew-primary/10">
                    <svg className="h-7 w-7 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-ew-dark">{item.title}</h3>
                  <p className="mt-2 text-sm text-ew-grey">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-ew-dark">{t("readyHeading")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-ew-grey">{t("readyCms")}</p>
            </div>
          </section>
        </>
      )}

      {page?.legalNotes && page.legalNotes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="space-y-2 text-xs text-ew-grey">
            {page.legalNotes.map((note) => (
              <div key={note.id} className="flex gap-1">
                {note.identifier && <sup>{note.identifier}</sup>}
                {note.content?.html && (
                  <div
                    dangerouslySetInnerHTML={{ __html: note.content.html }}
                    data-hygraph-entry-id={note.id}
                    data-hygraph-field-api-id="content"
                    data-hygraph-rich-text-format="html"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
