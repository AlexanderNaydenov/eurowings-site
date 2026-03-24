"use client";

import { ContentUpdater } from "@hygraph/preview-sdk";
import type { FieldUpdate } from "@hygraph/preview-sdk";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";

const HygraphPreview = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({
      default: mod.HygraphPreview,
    })),
  { ssr: false }
);

/**
 * Relation / union / list updates change tree order or linked entries. The SDK's
 * ContentUpdater only patches text/media on existing nodes and cannot reorder
 * blocks, so we re-fetch the RSC tree (draft + no-store Hygraph) instead.
 */
function fieldUpdateNeedsFullReload(update: FieldUpdate): boolean {
  const ft = String(update.fieldType);
  if (ft === "RELATION") return true;
  if (ft.includes("UNION")) return true;
  if (
    update.fieldApiId === "belowSearchBlocks" ||
    update.fieldApiId === "belowSearchComposition" ||
    update.fieldApiId === "heroBannerComponent" ||
    update.fieldApiId === "contentBlocks"
  ) {
    return true;
  }
  return false;
}

function reloadPreviewAfterHygraphPersist() {
  window.location.reload();
}

export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
  const updaterRef = useRef<ContentUpdater | null>(null);

  useEffect(() => {
    if (!endpoint) return;
    updaterRef.current = new ContentUpdater({
      endpoint,
      updateDelay: 50,
    });
    return () => {
      updaterRef.current?.destroy();
      updaterRef.current = null;
    };
  }, [endpoint]);

  const onFieldUpdate = useCallback((update: FieldUpdate) => {
    if (fieldUpdateNeedsFullReload(update)) {
      // router.refresh() often reuses a stale RSC payload in the preview iframe;
      // a real navigation reload sends cookies and bypasses client flight cache.
      window.setTimeout(() => reloadPreviewAfterHygraphPersist(), 350);
      return;
    }
    void updaterRef.current
      ?.updateField(update)
      .catch((err) => console.error("[Hygraph preview] field update failed:", err));
  }, []);

  if (!endpoint) return <>{children}</>;

  return (
    <HygraphPreview
      endpoint={endpoint}
      studioUrl={process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL}
      debug={false}
      mode="auto"
      onFieldUpdate={onFieldUpdate}
      onSave={async () => {
        // Save & Preview: wait for Hygraph to persist draft, then hard-reload so the
        // server runs with draft cookies and no stale RSC cache (see onFieldUpdate).
        await new Promise((r) => setTimeout(r, 450));
        reloadPreviewAfterHygraphPersist();
      }}
      overlay={{
        style: { borderColor: "#A1045A", borderWidth: "2px" },
        button: { backgroundColor: "#A1045A", color: "white" },
      }}
      // fieldUpdate must be true so Studio sends "field-update" messages and the
      // preview iframe reflects edits side-by-side (see Preview SDK capabilities / fieldUpdateSync).
      sync={{ fieldFocus: true, fieldUpdate: true }}
    >
      {children}
    </HygraphPreview>
  );
}
