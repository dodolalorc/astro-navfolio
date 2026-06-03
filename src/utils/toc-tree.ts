import { normalizeHash } from './toc-hash';

export interface TocItem {
  href: string;
  label: string;
  depth: number;
  children: TocItem[];
}

export function buildTocTree(headings: { depth: number; slug: string; text: string }[]): TocItem[] {
  const roots: TocItem[] = [];
  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 4);

  for (const h of filtered) {
    const normalizedHref = normalizeHash(`#${h.slug}`);
    const item: TocItem = { href: normalizedHref, label: h.text, depth: h.depth, children: [] };

    if (h.depth === 2) {
      roots.push(item);
    } else {
      let parent = roots[roots.length - 1];
      if (!parent) {
        roots.push(item);
        continue;
      }

      while (parent.children.length > 0) {
        const last = parent.children[parent.children.length - 1];
        if (last.depth < h.depth) {
          parent = last;
        } else {
          break;
        }
      }
      parent.children.push(item);
    }
  }

  return roots;
}
