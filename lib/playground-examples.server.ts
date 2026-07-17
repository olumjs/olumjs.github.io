// Server-only: resolves the playground catalogue, layering caches so a build or
// dev session hits GitHub's (unauthenticated, 60/hr) API at most once and keeps
// working through rate limits and offline builds:
//
//   1. in-memory promise  — one fetch per process
//   2. on-disk JSON cache — survives dev restarts / separate build passes
//   3. live GitHub fetch  — refreshes the disk cache
//   4. stale disk cache   — used if the live fetch fails (e.g. 403 rate limit)
//   5. committed snapshot  — lib/playground-examples.snapshot.json, last resort
//
// Set GITHUB_TOKEN to lift the rate limit entirely. Without it a CI build shares
// its IP's 60/hr budget and routinely lands on the snapshot, so the snapshot must
// list EVERY file under src/(examples)/ — not just the page.html entries, or
// examples silently lose their sibling files' StackBlitz tabs. Refresh it with:
//   npm run snapshot:playground
//
// The disk cache is keyed to the snapshot's contents (see SNAPSHOT_HASH): tier 4
// exists to ride out a transient fetch failure, not to outlive the catalogue it
// describes. Committing a new snapshot is the signal that the old tree is gone,
// so any cache written against the previous snapshot is discarded rather than
// allowed to shadow tier 5 — which is what kept CI builds serving dead example
// slugs after an upstream rename.
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import {
  type PlaygroundGroup,
  type GitTreeEntry,
  REPO,
  BRANCH,
  buildGroups,
  buildGroupsFromPaths,
} from "./playground-examples";
import snapshotPaths from "./playground-examples.snapshot.json";

const CACHE_DIR = path.join(process.cwd(), "node_modules", ".cache", "olum");
const CACHE_FILE = path.join(CACHE_DIR, "playground-tree.json");
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h — examples change rarely

/** Next fetch-cache tag; revalidate it to force a refetch from GitHub. */
export const PLAYGROUND_TAG = "playground-examples";

/**
 * Identifies the committed snapshot this process was built against. Stamped into
 * the disk cache on write and checked on read, so a cache Vercel restores from a
 * previous build's `node_modules/.cache` is only trusted while the snapshot it
 * was written alongside is still the current one.
 */
const SNAPSHOT_HASH = createHash("sha256")
  .update(JSON.stringify(snapshotPaths))
  .digest("hex")
  .slice(0, 16);

type DiskCache = { fetchedAt: number; snapshotHash: string; tree: GitTreeEntry[] };

async function readDiskCache(): Promise<DiskCache | null> {
  try {
    const cache = JSON.parse(await readFile(CACHE_FILE, "utf8")) as DiskCache;
    // Also drops pre-hash caches, whose snapshotHash is undefined.
    if (cache.snapshotHash !== SNAPSHOT_HASH) return null;
    return cache;
  } catch {
    return null;
  }
}

async function writeDiskCache(tree: GitTreeEntry[]): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const cache: DiskCache = { fetchedAt: Date.now(), snapshotHash: SNAPSHOT_HASH, tree };
    await writeFile(CACHE_FILE, JSON.stringify(cache), "utf8");
  } catch {
    /* best-effort; a read-only FS just means we refetch next process */
  }
}

async function fetchTree(): Promise<GitTreeEntry[]> {
  const url = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    // In the Next runtime this also caches the response across requests; the tag
    // lets /api/clear-cache invalidate it.
    next: { revalidate: CACHE_TTL / 1000, tags: [PLAYGROUND_TAG] },
  });
  if (!res.ok) throw new Error(`GitHub tree fetch failed: ${res.status} ${res.statusText}`);
  const { tree } = (await res.json()) as { tree: GitTreeEntry[] };
  return tree;
}

async function resolveGroups(): Promise<PlaygroundGroup[]> {
  const disk = await readDiskCache();
  if (disk && Date.now() - disk.fetchedAt < CACHE_TTL) {
    return buildGroups(disk.tree);
  }
  try {
    const tree = await fetchTree();
    await writeDiskCache(tree);
    return buildGroups(tree);
  } catch (err) {
    // Rate-limited or offline: fall back to a stale disk cache, then the snapshot.
    if (disk) return buildGroups(disk.tree);
    console.warn(`[playground] ${(err as Error).message} — using committed snapshot`);
    return buildGroupsFromPaths(snapshotPaths as string[]);
  }
}

// One resolution per process. On failure we clear the memo so a later call retries.
let groupsPromise: Promise<PlaygroundGroup[]> | null = null;

export function getPlaygroundGroups(): Promise<PlaygroundGroup[]> {
  if (!groupsPromise) {
    groupsPromise = resolveGroups().catch((err) => {
      groupsPromise = null;
      throw err;
    });
  }
  return groupsPromise;
}

/**
 * Drop the playground caches this process owns: the in-memory memo and the
 * on-disk tree cache. The Next fetch cache is tag-based — the caller should also
 * `revalidateTag(PLAYGROUND_TAG)` from its request scope. After this, the next
 * getPlaygroundGroups() refetches the example list from GitHub.
 */
export async function clearPlaygroundCache(): Promise<void> {
  groupsPromise = null;
  try {
    await unlink(CACHE_FILE);
  } catch {
    /* nothing cached on disk yet */
  }
}
