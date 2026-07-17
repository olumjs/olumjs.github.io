// Refreshes lib/playground-examples.snapshot.json — the last-resort fallback
// lib/playground-examples.server.ts uses when the live GitHub fetch fails (a
// rate-limited CI build, an offline dev box). Run it after adding or renaming
// examples in the starter repo:  npm run snapshot:playground
//
// Writes EVERY blob under src/(examples)/, not just the page.html entries: the
// siblings become the example's StackBlitz tabs, so dropping them makes examples
// silently lose their tabs.
//
// Set GITHUB_TOKEN to lift the unauthenticated 60/hr rate limit.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REPO, BRANCH, EXAMPLES_ROOT } from "../lib/playground-examples.ts";

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "playground-examples.snapshot.json",
);

const res = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`, {
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  },
});
if (!res.ok) {
  console.error(`GitHub tree fetch failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const { tree, truncated } = await res.json();
if (truncated) {
  console.error("GitHub truncated the tree response — the snapshot would be incomplete.");
  process.exit(1);
}

const paths = tree
  .filter((e) => e.type === "blob" && e.path.startsWith(`${EXAMPLES_ROOT}/`))
  .map((e) => e.path)
  .sort();

if (paths.length === 0) {
  console.error(`No files found under ${EXAMPLES_ROOT}/ — refusing to write an empty snapshot.`);
  process.exit(1);
}

await writeFile(OUT, `${JSON.stringify(paths, null, 2)}\n`, "utf8");
console.log(`Wrote ${paths.length} paths to ${path.relative(process.cwd(), OUT)}`);
