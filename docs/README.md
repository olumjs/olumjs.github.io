# Maintaining the `/docs` system

This is a guide for **maintainers of this website** (olumjs.github.io) — not for writing OlumJS docs. It explains how the `/docs` section works and how to change it.

> The actual doc content is **not** in this repo. It's fetched from the `docs/*.md` folders of external repos (olum, olum-router, …) at request time and cached. To edit doc *content*, edit those repos.

---

## How it works (30-second version)

1. At request time, the site fetches each configured repo's `docs/*.md` from GitHub (the newest version branch).
2. Markdown is parsed (frontmatter + body) and rendered through a custom pipeline into the styled doc pages.
3. Results are **cached** (weekly, plus on-demand clear). Each repo section has a **version dropdown** (branches) so users can read older versions.

Hosting note: this uses ISR / `revalidateTag`, so it **requires a server runtime** (Vercel, Netlify, `next start`). It will **not** work as a static export on GitHub Pages.

---

## File map

| File | Responsibility |
|------|----------------|
| `lib/docs-content.ts` | **The core.** Config, GitHub fetching, caching, versioning, frontmatter parsing, sidebar/nav building. Start here. |
| `components/Markdown.tsx` | Renders markdown → React via `react-markdown` + remark plugins, mapping to the components below. |
| `lib/markdown-plugins.ts` | remark plugins: carries code-fence `title=` onto the `<code>`, and turns `:::` directives into callouts. |
| `components/Callout.tsx` | The colored callout boxes (tip/warn/danger/note). |
| `components/CodeBlock.tsx` + `lib/highlight.tsx` | Code block chrome + the custom syntax highlighter (JS/TS, HTML, CSS). |
| `components/DocsSidebar.tsx` | The sidebar: per-repo sections + version dropdown + file list. Client component. |
| `app/docs/[slug]/page.tsx` | Renders one doc page. Reads `?repo&ref` for versioned views. |
| `app/docs/page.tsx` | The hand-authored `/docs` Introduction index. |
| `app/api/docs/files/route.ts` | Returns a branch's file list (the sidebar calls this when you switch versions). |
| `app/api/clear-cache/route.ts` | `GET /api/clear-cache` → invalidates the docs cache on demand. |
| `components/Navbar.tsx` | The ⌘K search — its index is built from `getDocsNav()`, so it tracks the docs automatically. |

---

## Configuration knobs (all in `lib/docs-content.ts`)

```ts
// Which repos to pull docs from, in sidebar order. `minVer` hides branches
// older than that version from the dropdown (and blocks fetching them).
export const DOC_REPOS = [
  { repo: "olumjs/olum",        minVer: "v0.5.5" },
  { repo: "olumjs/olum-router", minVer: "v0.3.1" },
];

export const DOCS_TAG = "docs";                 // cache tag for all fetches
const DOCS_REVALIDATE = 60 * 60 * 24 * 7;       // weekly background refresh
```

- **`repoLabel(repo)`** — section header text (`olum` → "core", `olum-x` → "x").
- **`STATIC_DOCS`** — hand-authored, non-repo pages (e.g. Get Started). Pinned to the top of the first section.

---

## How to…

### Add a repo
1. Add `{ repo: "olumjs/<name>", minVer: "<vX.Y.Z or "">" }` to `DOC_REPOS`.
2. Make sure that repo has a `docs/` folder with `*.md` files following the [authoring convention](#doc-authoring-convention).
3. That's it — the section, dropdown, pages, prev/next, sitemap, OG images, and search all pick it up automatically.

### Add a hardcoded page (no repo)
Append to `STATIC_DOCS` (see `get-started`). It renders through the normal pipeline, prerenders, and pins itself in the sidebar.

### Change which versions appear
Adjust each repo's `minVer`. Set it to `""` to show all branches. Lower it (e.g. `"v0.5.0"`) to expose a range in the dropdown.

### Change cache freshness
Edit `DOCS_REVALIDATE`. To refresh immediately, hit **`GET /api/clear-cache`** (optionally protect it by setting a `REVALIDATE_SECRET` env var → then requires `?secret=…`).

### Avoid GitHub rate limits
Set a `GITHUB_TOKEN` env var (a token with no scopes works for public repos). Unauthenticated is 60 req/hr **per IP**, shared across builds/CI; a token lifts it to 5,000/hr.

---

## Doc authoring convention

Each `docs/<slug>.md` in a source repo:

```md
---
title: State & Reactivity     # page <h1> + sidebar label
group: Reactivity             # (currently only used for the page badge)
order: 30                     # sort order within the repo section
---

Body markdown…
```

- **Code blocks:** ` ```html title="Counter.html" ` → filename shown in the chrome; `.html` gets the HTML highlighter.
- **Callouts:** container directives map to boxes:
  `:::tip` (💡), `:::warn` (⚠️), `:::danger` (🚨), `:::note` (neutral).
  Optional title/icon: `:::tip[The design principle]`, `:::danger{icon="🔒"}`.
- `README.md` in a repo's `docs/` folder is **ignored** (reserved for the convention spec).

---

## Versioning (branches = versions)

- Every branch of a repo is a selectable "version" in the dropdown.
- **`compareVersions`** sorts them numerically (`v0.5.10` > `v0.5.9`).
- The **default** selection is the newest branch that actually **has a `docs/` folder** (`getRepoMeta`), so a bleeding-edge branch without docs is skipped.
- `minVer` per repo filters the list and blocks fetching older refs (dropdown, files API, and `?ref=` URLs are all gated by `isVersionAllowed`).

---

## Caching model

| Dimension | Behavior |
|-----------|----------|
| Storage | **Per URL → effectively per branch** (each branch/file is its own cache entry). |
| Refresh | Each entry revalidates weekly, independently. |
| Invalidation | One shared tag `"docs"` → `GET /api/clear-cache` clears **all** repos/branches at once. |

To support per-repo/per-branch clearing, tag fetches hierarchically (e.g. `["docs", "docs:olumjs/olum", "docs:olumjs/olum@v0.5.5"]`) and accept `?repo&ref` on the clear-cache route.

---

## Gotchas

- **Default branches are non-standard** (`v0.5.5`, `v0.3.1`). Never hardcode `main`/`master`; the code resolves branches dynamically.
- **Old branches predate the frontmatter convention** — their docs render with filename-derived titles and no callouts. Expected.
- **Reading `?repo&ref`** makes doc pages dynamic (server-rendered per request); the underlying fetches stay cached.
- **Slugs must be unique across repos** — `getAllDocs` throws on a collision.

---

## Ideas for future improvement

- Branch-aware prev/next and search (carry the active `?ref`).
- Per-branch cache invalidation (hierarchical tags, above).
- A scheduled job / webhook that pings `/api/clear-cache` when a source repo publishes docs.
- Full-text search (index doc bodies, not just titles).
- Restore frontmatter `group` as a secondary sub-grouping within a repo section.
