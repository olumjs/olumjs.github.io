import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge conditional class names, de-duplicating conflicting Tailwind utilities.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Compact a view count for display (e.g. 1250 -> "1.3k", 1000 -> "1k").
export function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
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

// Reduce a markdown string to a plain-text, single-line excerpt suitable for a
// meta description / OG description. Strips frontmatter, fenced code, headings,
// links, images, and inline formatting, then truncates on a word boundary.
export function plainExcerpt(markdown: string, max = 155): string {
  const text = markdown
    .replace(/^---\n[\s\S]*?\n---\n/, "") // frontmatter
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/^:{2,}\s*\w*(\[[^\]]*\])?(\{[^}]*\})?\s*$/gm, " ") // directive fences (:::warn / :::)
    .replace(/:{1,3}(\w+)(\[[^\]]*\])?(\{[^}]*\})?/g, "$2") // inline/leaf directives -> label
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/^#{1,6}\s+/gm, "") // heading markers
    .replace(/^\s*[-*+]\s+/gm, "") // list bullets
    .replace(/[*_>#]/g, "") // stray emphasis/blockquote/hash
    .replace(/[[\]]/g, "") // leftover directive-label brackets
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
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
