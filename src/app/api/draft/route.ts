import { draftMode, cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  resolvePreviewPathname,
  pathFromPublicationAndSlug,
  withLocalePrefix,
} from "@/lib/resolve-preview-path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publication = searchParams.get("publication") || "";
  const slug = searchParams.get("slug") || "";
  /** Hygraph App / preview URL can send model apiId separately from publication */
  const model = searchParams.get("model") || searchParams.get("__typename") || "";
  const locale = searchParams.get("locale");
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.HYGRAPH_PREVIEW_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return new Response("Invalid preview token", { status: 401 });
  }

  draftMode().enable();

  // Workaround: set sameSite=none so the cookie works inside Hygraph's iframe
  // See https://github.com/vercel/next.js/issues/49927
  const cookieStore = cookies();
  const cookie = cookieStore.get("__prerender_bypass");
  if (cookie) {
    cookies().set({
      name: "__prerender_bypass",
      value: cookie.value,
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
    });
  }

  let path: string;

  const fromModel = model ? pathFromPublicationAndSlug(model, slug) : null;
  if (fromModel) {
    path = fromModel;
  } else {
    path = await resolvePreviewPathname(publication, slug);
  }

  path = withLocalePrefix(path, locale);

  redirect(`${path}?preview=true`);
}
