import type { FaqCategory, FaqItem } from "@/lib/types";

export type FaqItemWithCategory = FaqItem & {
  category?: Pick<FaqCategory, "id" | "title" | "slug" | "description" | "icon"> | null;
};

/**
 * Groups FAQ items from FaqPage.faqItems by their existing FaqCategory (for accordion UI).
 * Items are ordered by sortOrder within each category; category order follows first appearance.
 */
export function groupFaqItemsByCategory(items: FaqItemWithCategory[]): FaqCategory[] {
  const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const categoryOrder: string[] = [];
  const byId = new Map<
    string,
    { meta: Pick<FaqCategory, "id" | "title" | "slug" | "description" | "icon">; items: FaqItem[] }
  >();

  for (const item of sorted) {
    const cat = item.category;
    if (!cat?.id) {
      continue;
    }

    if (!byId.has(cat.id)) {
      byId.set(cat.id, {
        meta: {
          id: cat.id,
          title: cat.title,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
        },
        items: [],
      });
      categoryOrder.push(cat.id);
    }

    const { category: _omit, ...itemFields } = item;
    byId.get(cat.id)!.items.push(itemFields);
  }

  return categoryOrder.map((id) => {
    const { meta, items: faqItems } = byId.get(id)!;
    return {
      ...meta,
      faqItems,
    };
  });
}
