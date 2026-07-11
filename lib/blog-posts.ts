import blogStore from "@/data/blog.json";

// ── Types ─────────────────────────────────────────────────────────────────────
// The blog is stored as plain JSON in data/blog.json and edited through the
// dev-only editor at /blog/editor (see app/api/*-post routes). Display pages
// import the JSON module below, so new/edited posts are picked up on the next
// request (dev) or at build time (production).

export interface BlogSection {
  heading: string;
  body: string;
  code?: string;
  codeLanguage?: string;
}

export interface Author {
  name: string;
  avatar: string;
  color: string;
  role: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO yyyy-mm-dd
  readingTime: string; // e.g. "5 min read"
  featured?: boolean;
  tags: string[];
  author: Author;
  sections: BlogSection[];
}

export const posts: Post[] = blogStore as Post[];

// The featured post drives the big hero card on /blog. Falls back to the first
// post if none is explicitly flagged.
export function getFeatured(): Post | null {
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}

export function getAllTags(): string[] {
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
