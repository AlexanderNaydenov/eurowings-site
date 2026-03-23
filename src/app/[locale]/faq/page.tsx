import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_FAQ_PAGE } from "@/lib/queries";
import type { FaqPageData, FaqCategory } from "@/lib/types";
import { groupFaqItemsByCategory } from "@/lib/faq-group";
import FaqAccordion from "@/components/FaqAccordion";
import PreviewBanner from "@/components/PreviewBanner";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("faqTitle"),
    description: t("faqDescription"),
  };
}

async function getFaqData(isDraft: boolean, locale: string) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const locales = hygraphLocales(locale);
    const data = await hygraphFetch<{ faqPages: FaqPageData[] }>(
      GET_FAQ_PAGE,
      { stage, locales },
      isDraft
    );
    const page = data.faqPages?.[0] || null;
    const categories = groupFaqItemsByCategory(page?.faqItems || []);
    return { page, categories };
  } catch {
    return { page: null, categories: [] };
  }
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const { isEnabled: isDraft } = draftMode();
  const { page, categories } = await getFaqData(isDraft, locale);

  return (
    <>
      {isDraft && <PreviewBanner />}

      <section className="bg-gradient-to-br from-ew-primary-dark to-ew-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-extrabold text-white md:text-5xl"
            {...(page?.id && {
              "data-hygraph-entry-id": page.id,
              "data-hygraph-field-api-id": "title",
            })}
          >
            {page?.title || t("fallbackTitle")}
          </h1>
          <p
            className="mt-4 max-w-xl text-lg text-white/80"
            {...(page?.id && {
              "data-hygraph-entry-id": page.id,
              "data-hygraph-field-api-id": "description",
            })}
          >
            {page?.description || t("fallbackDescription")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {categories.length > 0 ? (
          <FaqAccordion categories={categories} />
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ew-primary/10">
              <svg className="h-8 w-8 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-ew-grey">{t("empty")}</p>
          </div>
        )}
      </section>
    </>
  );
}
