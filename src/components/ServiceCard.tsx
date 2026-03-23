"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { normalizeInternalHref } from "@/lib/internal-link";
import type { Service } from "@/lib/types";

const ICON_PATHS: Record<string, string> = {
  baggage: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  checkin: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  status: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  manage: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  extras: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
};

const DEFAULT_PATH =
  "M12 19l9 2-9-18-9 18 9-2zm0 0v-8";

function ServiceIcon({ iconKey }: { iconKey?: string }) {
  const key = (iconKey || "").toLowerCase().replace(/[^a-z]/g, "");
  const d = ICON_PATHS[key] || DEFAULT_PATH;

  return (
    <svg className="h-7 w-7 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
    </svg>
  );
}

function CardInner({ service }: { service: Service }) {
  const eid = service.id;

  return (
    <>
      <div
        className="relative flex h-36 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-ew-light to-white"
        data-hygraph-entry-id={eid}
        data-hygraph-field-api-id="image"
      >
        {service.image?.url ? (
          <Image src={service.image.url} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 200px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" data-hygraph-entry-id={eid} data-hygraph-field-api-id="iconKey">
            <ServiceIcon iconKey={service.iconKey} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="text-base font-bold text-ew-dark group-hover:text-ew-primary"
          data-hygraph-entry-id={eid}
          data-hygraph-field-api-id="title"
        >
          {service.title}
        </h3>
        {service.teaser && (
          <p
            className="mt-1 line-clamp-2 text-sm text-ew-grey"
            data-hygraph-entry-id={eid}
            data-hygraph-field-api-id="teaser"
          >
            {service.teaser}
          </p>
        )}
        {service.linkLabel && (
          <span
            className="mt-auto pt-3 text-sm font-semibold text-ew-primary"
            data-hygraph-entry-id={eid}
            data-hygraph-field-api-id="linkLabel"
          >
            {service.linkLabel} &rarr;
          </span>
        )}
      </div>
    </>
  );
}

export default function ServiceCard({ service }: { service: Service }) {
  const className =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:border-ew-primary/20 hover:shadow-md";

  if (!service.linkUrl) {
    return (
      <div className={className}>
        <CardInner service={service} />
      </div>
    );
  }

  if (/^https?:\/\//i.test(service.linkUrl)) {
    return (
      <a href={service.linkUrl} className={className} rel="noopener noreferrer" target="_blank">
        <CardInner service={service} />
      </a>
    );
  }

  return (
    <Link href={normalizeInternalHref(service.linkUrl)} className={className}>
      <CardInner service={service} />
    </Link>
  );
}
