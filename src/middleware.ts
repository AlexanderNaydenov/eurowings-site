import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Hygraph preview URL templates like `/faq/{{slug}}` with slug `faq` produce `/faq/faq`,
 * which 404s. Redirect to the real FAQ route; query string (e.g. ?preview=true) is preserved.
 * Localised: `/de/faq/faq` → `/de/faq`.
 */
const DOUBLE_FAQ_REDIRECTS: Record<string, string> = {
  "/faq/faq": "/faq",
  "/de/faq/faq": "/de/faq",
  "/en/faq/faq": "/en/faq",
};

export default function middleware(request: NextRequest) {
  const target = DOUBLE_FAQ_REDIRECTS[request.nextUrl.pathname];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url);
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(de|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
