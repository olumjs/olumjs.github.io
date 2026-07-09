// The playground's example catalogue. Each entry maps a URL slug to a file in
// the `olumjs-compact` StackBlitz project. To add an example: create
// `src/<slug>/page.html` in that project, then add it here — the dropdown, the
// routes (/playground/<slug>) and the sitemap all derive from this list.

export type PlaygroundExample = { slug: string; title: string };
export type PlaygroundGroup = { label: string; items: PlaygroundExample[] };

export const playgroundGroups: PlaygroundGroup[] = [
  {
    label: "Introduction",
    items: [
      { slug: "hello-world", title: "Hello world" },
      { slug: "dynamic-attributes", title: "Dynamic attributes" },
    ],
  },
  {
    label: "Examples",
    items: [
      { slug: "todo-app", title: "Todo app" },
    ],
  },
];

/** Flat list of every example, in sidebar order. */
export const playgroundExamples: PlaygroundExample[] =
  playgroundGroups.flatMap((g) => g.items);

/** The example shown when visiting /playground with no slug. */
export const defaultExampleSlug = playgroundExamples[0].slug;

/** Editor file path inside the StackBlitz project, e.g. src/hello-world/page.html */
export const exampleFilePath = (slug: string) => `src/${slug}/page.html`;

/** Route the previewed OlumJS app should navigate to, e.g. /hello-world */
export const examplePreviewPath = (slug: string) => `/${slug}`;

export function findExample(slug: string | undefined): PlaygroundExample | undefined {
  return playgroundExamples.find((e) => e.slug === slug);
}
