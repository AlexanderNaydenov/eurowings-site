import type { HeroSection } from "@/lib/types";
import { hygraphSingleComponentChain } from "@/lib/hygraph-visual";
import { Link } from "@/i18n/navigation";

interface Props {
  hero: HeroSection;
  compact?: boolean;
  /**
   * When the hero is **HeroSectionBlock** embedded on Homepage/Landing, pass the parent
   * entry id and field api id so Visual Editor can resolve “Click to edit” (component chain).
   * Omit when the hero is the legacy **HeroSection** relation (top-level entry id = hero.id).
   */
  parentEntryId?: string;
  parentHeroFieldApiId?: "heroBannerComponent";
}

export default function HeroBanner({ hero, compact, parentEntryId, parentHeroFieldApiId }: Props) {
  const bgUrl = hero.backgroundImage?.url;
  const height = compact ? "h-72 md:h-80" : "h-[28rem] md:h-[34rem]";
  const embedded =
    parentEntryId && parentHeroFieldApiId
      ? {
          entryId: parentEntryId,
          chain: hygraphSingleComponentChain(parentHeroFieldApiId, hero.id),
        }
      : null;
  const eid = embedded?.entryId ?? hero.id;
  const chain = embedded?.chain;

  const ctaClass =
    "mt-8 inline-block rounded-full bg-ew-accent px-8 py-3.5 text-base font-bold text-ew-dark shadow-lg transition-transform hover:scale-105";

  return (
    <section className={`relative flex items-center ${height} overflow-hidden bg-ew-dark`}>
      {bgUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgUrl})` }}
          data-hygraph-entry-id={eid}
          data-hygraph-field-api-id="backgroundImage"
          {...(chain ? { "data-hygraph-component-chain": chain } : {})}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ew-dark/80 via-ew-dark/50 to-transparent" />
        </div>
      )}
      {!bgUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-ew-primary-dark via-ew-primary to-ew-primary-light" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1
            className={`font-extrabold leading-tight text-white ${
              compact ? "text-3xl md:text-4xl" : "text-4xl md:text-6xl"
            }`}
            data-hygraph-entry-id={eid}
            data-hygraph-field-api-id="heading"
            {...(chain ? { "data-hygraph-component-chain": chain } : {})}
          >
            {hero.heading}
          </h1>
          {hero.subheading && (
            <p
              className="mt-4 text-lg text-white/80 md:text-xl"
              data-hygraph-entry-id={eid}
              data-hygraph-field-api-id="subheading"
              {...(chain ? { "data-hygraph-component-chain": chain } : {})}
            >
              {hero.subheading}
            </p>
          )}
          {hero.cta?.url &&
            (/^https?:\/\//i.test(hero.cta.url) ? (
              <a
                href={hero.cta.url}
                target={hero.cta.openInNewTab ? "_blank" : undefined}
                rel={hero.cta.openInNewTab ? "noopener noreferrer" : undefined}
                className={ctaClass}
                data-hygraph-entry-id={hero.cta.id}
                data-hygraph-field-api-id="label"
              >
                {hero.cta.label}
              </a>
            ) : (
              <Link
                href={hero.cta.url}
                className={ctaClass}
                data-hygraph-entry-id={hero.cta.id}
                data-hygraph-field-api-id="label"
              >
                {hero.cta.label}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
