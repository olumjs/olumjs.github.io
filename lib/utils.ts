import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge conditional class names, de-duplicating conflicting Tailwind utilities.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Turn a heading's text into a URL-safe anchor id (e.g. "The one rule" -> "the-one-rule").
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TocItem {
  id: string;
  title: string;
}

// Pull every level-2 heading ("## …") out of a markdown string for an
// "On this page" table of contents, skipping fenced code blocks. Inline
// markdown (links, code, emphasis) is reduced to its text so each id matches
// the slug the renderer assigns the heading.
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const title = match[1]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_]/g, "")
      .trim();
    items.push({ id: slugify(title), title });
  }
  return items;
}
