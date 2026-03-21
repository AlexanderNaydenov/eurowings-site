"use client";

import { useTranslations } from "next-intl";

export default function NewsTicker() {
  const t = useTranslations("newsTicker");
  const keys = ["t1", "t2", "t3", "t4", "t5"] as const;
  const tickerItems = keys.map((k) => t(k));
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="relative z-40 overflow-hidden bg-ew-primary text-white">
      <div className="group flex items-center">
        <div className="flex shrink-0 animate-ticker items-center gap-12 py-2.5 pr-12 group-hover:[animation-play-state:paused]">
          {items.map((text, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap"
            >
              <svg
                className="h-3.5 w-3.5 shrink-0 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4z" />
              </svg>
              {text}
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 animate-ticker items-center gap-12 py-2.5 pr-12 group-hover:[animation-play-state:paused]"
        >
          {items.map((text, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap"
            >
              <svg
                className="h-3.5 w-3.5 shrink-0 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4z" />
              </svg>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
