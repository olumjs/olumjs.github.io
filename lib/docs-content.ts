import { cache } from "react";

// ── Config ──────────────────────────────────────────────────────────────────
// Docs are fetched from each repo's `docs/*.md` on its DEFAULT branch, then
// CACHED. The cache auto-revalidates weekly, and GET /api/clear-cache refetches
// on demand via revalidateTag(DOCS_TAG). Requires a server runtime (not static
// export / GitHub Pages).
// The sidebar renders one section per repo, in THIS order. Reorder to reorder
// the menu. `olum` → "core"; `olum-x` → "x" (see repoLabel).
export const DOC_REPOS = ["olumjs/olum", "olumjs/olum-router"];

// Cache tag shared by every GitHub fetch below; /api/clear-cache invalidates it.
export const DOCS_TAG = "docs";
// How long a cached fetch stays fresh before Next revalidates it (1 week).
const DOCS_REVALIDATE = 60 * 60 * 24 * 7;

// Sidebar section label for a repo: `olumjs/olum` → "core"; `olumjs/olum-x` → "x".
function repoLabel(repo: string): string {
  const short = repo.split("/")[1] ?? repo;
  if (short === "olum") return "core";
  return short.startsWith("olum-") ? short.slice("olum-".length) : short;
}

// ── Types ───────────────────────────────────────────────────────────────────
export interface Doc {
  slug: string;
  repo: string; // "olumjs/olum"
  title: string;
  group: string;
  order: number;
  body: string; // markdown, frontmatter stripped
  editUrl: string; // GitHub blob URL for the source file
}

export type SidebarItem = { label: string; href: string };
export type SidebarGroup = { label: string; items: SidebarItem[] };

interface GhContentItem {
  name: string;
  type: string;
  download_url: string | null;
  html_url: string;
}

// ── Static (non-repo) docs ──────────────────────────────────────────────────
// Rendered like fetched docs but hardcoded here and pinned in the sidebar
// (alongside the Introduction). `get-started` lives here since create-olum
// isn't a fetched repo. An empty `editUrl` hides the "Edit on GitHub" link.
export const STATIC_DOCS: Doc[] = [
  {
    slug: "get-started",
    repo: "",
    title: "Get Started",
    group: "Getting Started",
    order: 0,
    editUrl: "",
    body: [
      "Scaffold a new OlumJS project with the official CLI — TypeScript, routing, and a dev server ready out of the box:",
      "",
      '```bash title="Terminal"',
      "npx create-olum@latest my-app",
      "```",
      "",
      ":::tip",
      "This scaffolds a full project with TypeScript, file-based routing, and a configured dev server in one command.",
      ":::",
      "",
    ].join("\n"),
  },
];

// ── GitHub fetch ────────────────────────────────────────────────────────────
// A token (GITHUB_TOKEN) lifts the 60 req/hr unauthenticated limit but is optional —
// we make only ~1 API call per repo (the directory listing); file bodies come from
// the raw CDN via download_url, which isn't rate-limited. Set it in CI, where
// runners share IPs, to stay safely under the limit.
function ghHeaders(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json" };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function fetchDocsDir(repo: string): Promise<GhContentItem[]> {
  // No `ref` → GitHub serves the repo's default branch automatically.
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/docs`, {
    headers: ghHeaders(),
    next: { revalidate: DOCS_REVALIDATE, tags: [DOCS_TAG] },
  });
  if (!res.ok) {
    throw new Error(`Failed to list ${repo}/docs: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// The branch the contents API served (the repo's default branch, since we pass
// no `ref`) is encoded in the raw download URL: .../{owner}/{repo}/{branch}/...
function branchFromDownloadUrl(url: string, repo: string): string {
  const path = new URL(url).pathname; // /owner/repo/<branch>/docs/file.md
  const rest = path.startsWith(`/${repo}/`) ? path.slice(repo.length + 2) : path.replace(/^\//, "");
  return rest.split("/")[0] || "unknown";
}

// ── Frontmatter ─────────────────────────────────────────────────────────────
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = val;
  }
  return { data, body: raw.slice(m[0].length) };
}

// ── Loaders (cached per build/request) ──────────────────────────────────────
export const getAllDocs = cache(async (): Promise<Doc[]> => {
  const perRepo = await Promise.all(
    DOC_REPOS.map(async (repo) => {
      const items = await fetchDocsDir(repo);
      const mdFiles = items.filter(
        (it) => it.type === "file" && it.name.endsWith(".md") && it.name.toLowerCase() !== "readme.md"
      );
      const branch = mdFiles[0]?.download_url
        ? branchFromDownloadUrl(mdFiles[0].download_url, repo)
        : "unknown";
      console.log(`[docs] ${repo} @ ${branch} — ${mdFiles.length} file(s)`);
      return Promise.all(
        mdFiles.map(async (file): Promise<Doc> => {
          const raw = await fetch(file.download_url!, {
            next: { revalidate: DOCS_REVALIDATE, tags: [DOCS_TAG] },
          }).then((r) => {
            if (!r.ok) throw new Error(`Failed to fetch ${repo}/docs/${file.name}: ${r.status}`);
            return r.text();
          });
          const { data, body } = parseFrontmatter(raw);
          const slug = file.name.replace(/\.md$/, "");
          return {
            slug,
            repo,
            title: data.title || slug,
            group: data.group || "Docs",
            order: Number(data.order) || 0,
            body,
            editUrl: file.html_url,
          };
        })
      );
    })
  );

  const docs = perRepo.flat();
  // Guard against slug collisions across repos.
  const seen = new Set<string>();
  for (const d of docs) {
    if (seen.has(d.slug)) throw new Error(`Duplicate doc slug "${d.slug}" (from ${d.repo})`);
    seen.add(d.slug);
  }
  return docs.sort((a, b) => a.order - b.order);
});

export async function getDoc(slug: string): Promise<Doc | null> {
  const staticDoc = STATIC_DOCS.find((d) => d.slug === slug);
  if (staticDoc) return staticDoc;
  const docs = await getAllDocs();
  return docs.find((d) => d.slug === slug) ?? null;
}

// Sidebar: one section per repo (in DOC_REPOS order), each listing that repo's
// docs sorted by their frontmatter `order`. The hand-authored Introduction
// (/docs) is pinned to the top of the first section.
export const getDocsNav = cache(async (): Promise<SidebarGroup[]> => {
  const docs = await getAllDocs();
  const byRepo = new Map<string, Doc[]>();
  for (const d of docs) {
    const arr = byRepo.get(d.repo);
    if (arr) arr.push(d);
    else byRepo.set(d.repo, [d]);
  }

  const groups: SidebarGroup[] = DOC_REPOS.filter((repo) => byRepo.has(repo)).map((repo) => ({
    label: repoLabel(repo),
    items: byRepo
      .get(repo)!
      .sort((a, b) => a.order - b.order)
      .map((d) => ({ label: d.title, href: `/docs/${d.slug}` })),
  }));

  // Fixed items pinned to the top of the first section: Introduction (/docs)
  // and the hardcoded static docs (Get Started).
  const pinned: SidebarItem[] = [
    { label: "Introduction", href: "/docs" },
    ...STATIC_DOCS.map((d) => ({ label: d.title, href: `/docs/${d.slug}` })),
  ];
  if (groups.length) groups[0].items.unshift(...pinned);
  else groups.push({ label: "core", items: pinned });

  return groups;
});

// Ordered list of doc hrefs for prev/next — derived from the sidebar so paging
// follows the exact menu order.
export async function getDocOrder(): Promise<string[]> {
  const groups = await getDocsNav();
  return groups.flatMap((g) => g.items.map((i) => i.href));
}
