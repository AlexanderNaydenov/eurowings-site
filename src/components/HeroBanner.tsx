import type { HeroSection } from "@/lib/types";
import { Link } from "@/i18n/navigation";

interface Props {
  hero: HeroSection;
  compact?: boolean;
}

export default function HeroBanner({ hero, compact }: Props) {
  const bgUrl = hero.backgroundImage?.url;
  const height = compact ? "h-72 md:h-80" : "h-[28rem] md:h-[34rem]";
  const eid = hero.id;

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
          >
            {hero.heading}
          </h1>
          {hero.subheading && (
            <p
              className="mt-4 text-lg text-white/80 md:text-xl"
              data-hygraph-entry-id={eid}
              data-hygraph-field-api-id="subheading"
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
