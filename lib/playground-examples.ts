// The playground's example catalogue is derived at build time from the
// `olum-starter` repo (compact branch): every
// `src/(examples)/<group>/<item>/page.html` becomes one dropdown entry. The
// folder names carry an ordering prefix (`00-introduction`, `00-hello-world`,
// `20-7guis`) that the starter's own router strips — along with the
// `(examples)` route group — to form the public route (`/introduction/hello-world`).
// We mirror that rule here so the slug, the StackBlitz `?file` path and the
// previewed app's URL all line up. Add an example by creating its folder in the
// starter repo; the dropdown, the /playground/<group>/<item> routes and the
// sitemap all pick it up automatically.

export type PlaygroundExample = {
  /** Public slug: "introduction/hello-world" (group/item, prefixes stripped). */
  slug: string;
  /** Group slug, e.g. "introduction". */
  group: string;
  /** Item slug, e.g. "hello-world". */
  item: string;
  /** Human title for the dropdown, e.g. "Hello world". */
  title: string;
  /** File to open in StackBlitz, e.g. src/(examples)/00-introduction/00-hello-world/page.html */
  filePath: string;
};

export type PlaygroundGroup = { slug: string; label: string; items: PlaygroundExample[] };

// Kept in sync with lib/playground-examples.server.ts, which does the fetching.
// This module stays free of Node built-ins so the client bundle can import the
// pure helpers below.
export const REPO = "olumjs/olum-starter";
export const BRANCH = "compact";
export const EXAMPLES_ROOT = "src/(examples)";

/**
 * The GitHub repo StackBlitz imports and runs live — `owner/repo/tree/branch`,
 * i.e. https://github.com/olumjs/olum-starter/tree/compact. Not a StackBlitz-
 * hosted project; the embed clones this repo into WebContainers.
 */
export const STARTER_REPO_SLUG = `${REPO}/tree/${BRANCH}`;

/** Strip the leading ordering prefix a folder carries: `00-`, `20-7`, `20190420-`. */
const stripPrefix = (name: string) => name.replace(/^[0-9-]+/, "");

/** "hello-world" → "Hello world"; "special-elements" → "Special elements". */
const humanize = (slug: string) => {
  const words = slug.replace(/-/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** Route the previewed OlumJS app should navigate to, e.g. /introduction/hello-world */
export const examplePreviewPath = (slug: string) => `/${slug}`;

/** Flat list of every example, in dropdown order. */
export function flattenExamples(groups: PlaygroundGroup[]): PlaygroundExample[] {
  return groups.flatMap((g) => g.items);
}

export function findExample(
  groups: PlaygroundGroup[],
  slug: string | undefined,
): PlaygroundExample | undefined {
  if (!slug) return undefined;
  return flattenExamples(groups).find((e) => e.slug === slug);
}

/** The example shown when visiting /playground with no slug (the first one). */
export function defaultExample(groups: PlaygroundGroup[]): PlaygroundExample | undefined {
  return groups[0]?.items[0];
}

/* ─── Manual examples ───────────────────────────────────────────── */

/**
 * Extra examples that live OUTSIDE src/(examples)/ and are wired up by hand.
 * Each value is a path to a `page.html` in the starter repo; its slug/route is
 * derived like the auto-discovered examples (strip `src/`, `(examples)/`,
 * numeric prefixes and `/page.html`). They share one dropdown group, shown last.
 */
export const MANUAL_GROUP_LABEL = "Examples";
export const MANUAL_PATHS: string[] = [
  "src/todo-app/page.html",
];

/** Derive a public slug from a full repo path — e.g. "src/todo-app/page.html" → "todo-app". */
function slugFromPath(path: string): string {
  return path
    .replace(/^src\//, "")
    .replace(/^\(examples\)\//, "")
    .replace(/\/page\.html$/, "")
    .split("/")
    .map(stripPrefix)
    .filter(Boolean)
    .join("/");
}

/** The single group holding the hand-wired MANUAL_PATHS (empty if there are none). */
export function manualGroups(): PlaygroundGroup[] {
  if (MANUAL_PATHS.length === 0) return [];
  const items = MANUAL_PATHS.map((filePath): PlaygroundExample => {
    const slug = slugFromPath(filePath);
    const item = slug.split("/").pop() ?? slug;
    const group = slug.includes("/") ? slug.split("/")[0] : MANUAL_GROUP_LABEL.toLowerCase();
    return { slug, group, item, title: humanize(item), filePath };
  });
  return [{ slug: "manual", label: MANUAL_GROUP_LABEL, items }];
}

/* ─── Catalogue builder ─────────────────────────────────────────── */

export type GitTreeEntry = { path: string; type: string };

/** Turn a recursive git tree into ordered groups of examples. */
export function buildGroups(tree: GitTreeEntry[]): PlaygroundGroup[] {
  const prefix = `${EXAMPLES_ROOT}/`;
  // GitHub returns the tree path-sorted, so the numeric prefixes already yield
  // the intended order; sort defensively in case that ever changes.
  const pages = tree
    .filter((e) => e.type === "blob" && e.path.startsWith(prefix) && e.path.endsWith("/page.html"))
    .map((e) => e.path)
    .sort();

  const groups = new Map<string, PlaygroundGroup>();

  for (const path of pages) {
    // "00-introduction/00-hello-world/page.html"
    const parts = path.slice(prefix.length).split("/");
    if (parts.length !== 3) continue; // exactly <group>/<item>/page.html

    const [groupDir, itemDir] = parts;
    const groupSlug = stripPrefix(groupDir);
    const itemSlug = stripPrefix(itemDir);
    if (!groupSlug || !itemSlug) continue;

    let group = groups.get(groupSlug);
    if (!group) {
      group = { slug: groupSlug, label: humanize(groupSlug), items: [] };
      groups.set(groupSlug, group);
    }
    group.items.push({
      slug: `${groupSlug}/${itemSlug}`,
      group: groupSlug,
      item: itemSlug,
      title: humanize(itemSlug),
      filePath: path,
    });
  }

  // Auto-discovered tutorial groups first, then the hand-wired examples.
  return [...groups.values(), ...manualGroups()];
}

/** Build groups from a bare list of `page.html` paths (used by the snapshot fallback). */
export function buildGroupsFromPaths(paths: string[]): PlaygroundGroup[] {
  return buildGroups(paths.map((path) => ({ path, type: "blob" })));
}
