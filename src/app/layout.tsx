import type { ReactNode } from "react";

/** Root layout — real UI lives in `[locale]/layout.tsx` (next-intl). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
