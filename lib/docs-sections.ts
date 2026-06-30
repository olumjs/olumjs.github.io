export type SidebarItem = { label: string; href: string };
export type SidebarGroup = { label: string; items: SidebarItem[] };

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Get Started", href: "/docs/get-started" },
      { label: "Component File Structure", href: "/docs/component-structure" },
      { label: "Bootstrapping an App", href: "/docs/bootstrap" },
    ],
  },
  {
    label: "Reactivity",
    items: [
      { label: "State & Reactivity", href: "/docs/state" },
      { label: "Text Interpolation", href: "/docs/text-interpolation" },
      { label: "Watchers", href: "/docs/watchers" },
    ],
  },
  {
    label: "Template Syntax",
    items: [
      { label: "Conditionals", href: "/docs/conditionals" },
      { label: "Show / Hide", href: "/docs/show" },
      { label: "Loops", href: "/docs/loops" },
      { label: "Events", href: "/docs/events" },
      { label: "Two-way Binding", href: "/docs/two-way-binding" },
      { label: "Attributes", href: "/docs/attributes" },
      { label: "Raw HTML", href: "/docs/raw-html" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Components & Props", href: "/docs/components" },
      { label: "Slots", href: "/docs/slots" },
      { label: "Imports", href: "/docs/imports" },
      { label: "Props & Methods Scope", href: "/docs/scope" },
    ],
  },
  {
    label: "Routing",
    items: [
      { label: "Router", href: "/docs/router" },
    ],
  },
  {
    label: "Advanced",
    items: [
      { label: "Scoped CSS", href: "/docs/scoped-css" },
      { label: "Lifecycle Hooks", href: "/docs/lifecycle" },
      { label: "Escaping & Security", href: "/docs/security" },
      { label: "Common Mistakes", href: "/docs/common-mistakes" },
      { label: "Quick Reference", href: "/docs/quick-reference" },
    ],
  },
];

export const sectionMeta: Record<string, { title: string; group: string }> = Object.fromEntries(
  sidebarGroups.flatMap((g) =>
    g.items
      .filter((i) => i.href.startsWith("/docs/") && i.href !== "/docs")
      .map((i) => [i.href.replace("/docs/", ""), { title: i.label, group: g.label }])
  )
);

export const docOrder = [
  "/docs",
  "/docs/get-started",
  "/docs/component-structure",
  "/docs/bootstrap",
  "/docs/state",
  "/docs/text-interpolation",
  "/docs/watchers",
  "/docs/conditionals",
  "/docs/show",
  "/docs/loops",
  "/docs/events",
  "/docs/two-way-binding",
  "/docs/attributes",
  "/docs/raw-html",
  "/docs/components",
  "/docs/slots",
  "/docs/imports",
  "/docs/scope",
  "/docs/router",
  "/docs/scoped-css",
  "/docs/lifecycle",
  "/docs/security",
  "/docs/common-mistakes",
  "/docs/quick-reference",
];
