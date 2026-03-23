import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import SiteTopBanner from "@/components/SiteTopBanner";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { PreviewWrapper } from "@/components/PreviewWrapper";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: {
      default: t("siteName"),
      template: "%s | Eurowings",
    },
    description: t("siteDescription"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "de")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-ew-light`}>
        <NextIntlClientProvider messages={messages}>
          <PreviewWrapper>
            <SiteTopBanner locale={locale} />
            <Header />
            <NewsTicker />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PreviewWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
