import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  const groups = [
    {
      titleKey: "booking" as const,
      links: [
        { labelKey: "flightSearch" as const, href: "/" },
        { labelKey: "dealsOffers" as const, href: "/" },
        { labelKey: "lowFareCalendar" as const, href: "/" },
      ],
    },
    {
      titleKey: "information" as const,
      links: [
        { labelKey: "baggage" as const, href: "/faq" },
        { labelKey: "checkIn" as const, href: "/faq" },
        { labelKey: "atAirport" as const, href: "/faq" },
      ],
    },
    {
      titleKey: "company" as const,
      links: [
        { labelKey: "about" as const, href: "/" },
        { labelKey: "careers" as const, href: "/" },
        { labelKey: "press" as const, href: "/" },
      ],
    },
  ];

  const legal = [
    { key: "privacy" as const, href: "/" },
    { key: "legal" as const, href: "/" },
    { key: "cookies" as const, href: "/" },
  ];

  return (
    <footer className="bg-ew-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Image
                src="/eurowings-logo.svg"
                alt="Eurowings"
                width={130}
                height={32}
                className="brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{t("tagline")}</p>
          </div>

          {groups.map((group) => (
            <div key={group.titleKey}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                {t(group.titleKey)}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">{t("copyright", { year })}</p>
          <div className="flex gap-6">
            {legal.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
