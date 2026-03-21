import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const p = params ? await params : {};
  const loc = p.locale && routing.locales.includes(p.locale as "en" | "de") ? p.locale : routing.defaultLocale;
  setRequestLocale(loc);
  const t = await getTranslations({ locale: loc, namespace: "nav" });

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-6xl font-extrabold text-ew-primary">404</h1>
      <p className="mt-4 text-lg text-ew-grey">Page not found</p>
      <Link href="/" className="mt-8 font-semibold text-ew-primary hover:underline">
        {t("home")}
      </Link>
    </div>
  );
}
