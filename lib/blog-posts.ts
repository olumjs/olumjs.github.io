export interface Post {
  title: string;
  excerpt: string;
  author: { name: string; avatar: string; color: string; role: string };
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  content: Section[];
}

interface Section {
  type: "h2" | "h3" | "p" | "code" | "ul" | "callout";
  text?: string;
  items?: string[];
  lang?: string;
}

export const featuredPost: Post = {
  title: "Introducing Olum 2.0: Signals, Streaming, and a New Compiler",
  excerpt:
    "Today we're releasing Olum 2.0 — the biggest update in the project's history. A rewritten compiler, native signal primitives, streaming SSR, and a completely new DevTools experience.",
  author: { name: "Kai Nakamura", avatar: "KN", color: "#25C97E", role: "Core Team" },
  date: "May 20, 2026",
  readTime: "8 min read",
  tags: ["release", "signals", "compiler"],
  slug: "olum-2-0",
  content: [
    { type: "p", text: "After 18 months of work, thousands of commits, and an enormous amount of feedback from the community, Olum 2.0 is finally here. This release represents a fundamental shift in how Olum works under the hood — and in how you'll experience building with it every day." },
    { type: "h2", text: "What's new in 2.0" },
    { type: "p", text: "The headline features are native signal primitives, a fully rewritten compiler, first-class streaming SSR support, and a redesigned DevTools extension. But the list goes much deeper than that." },
    { type: "h3", text: "Native signal primitives" },
    { type: "p", text: "Signals are now a first-class language feature in Olum. You no longer need a separate reactivity library — signal(), computed(), and effect() ship in the core runtime at just 1.2kb." },
    { type: "code", lang: "ts", text: `import { signal, computed, effect } from 'olum'

const count = signal(0)
const doubled = computed(() => count.value * 2)

effect(() => {
  console.log(\`count is \${count.value}, doubled is \${doubled.value}\`)
})

count.value++
// → "count is 1, doubled is 2"` },
    { type: "h3", text: "Rewritten compiler" },
    { type: "p", text: "The Olum 2.0 compiler is a ground-up rewrite in Rust. It's 40× faster than the 1.x compiler and produces significantly smaller, more optimized output. Template compilation is now fully incremental — only changed files are recompiled on save." },
    { type: "ul", items: ["40× faster build times", "30% smaller output bundles on average", "Incremental compilation with file-level granularity", "Compile-time constant folding and dead code elimination", "Source maps are accurate to the character"] },
    { type: "h3", text: "Streaming SSR" },
    { type: "p", text: "Olum 2.0 ships with built-in streaming server-side rendering. Components can suspend while data loads, streaming HTML to the browser progressively. This dramatically improves Time to First Byte on data-heavy pages." },
    { type: "h2", text: "Migration from 1.x" },
    { type: "p", text: "We've worked hard to make the 2.0 upgrade as smooth as possible. The vast majority of 1.x code is compatible without changes. Run the codemod to handle the breaking changes automatically:" },
    { type: "code", lang: "bash", text: `npx olum-migrate@latest ./src` },
    { type: "callout", text: "The migration guide covers every breaking change in detail, including the updated component API and the new router conventions. Read it before upgrading a production application." },
    { type: "h2", text: "What comes next" },
    { type: "p", text: "The 2.x series will focus on server components, a native test runner, and deeper IDE integration. The roadmap is public — we'd love your input on what to prioritize." },
  ],
};

export const posts: Post[] = [
  {
    title: "Building a Real-Time Dashboard with Olum Signals",
    excerpt:
      "Learn how to use Olum's fine-grained reactivity to build a data dashboard that updates hundreds of times per second without breaking a sweat.",
    author: { name: "Sofia Laurent", avatar: "SL", color: "#25C97E", role: "Developer Advocate" },
    date: "May 15, 2026",
    readTime: "5 min read",
    tags: ["tutorial", "signals"],
    slug: "real-time-dashboard",
    content: [
      { type: "p", text: "Fine-grained reactivity shines brightest when data changes frequently. In this tutorial we'll build a live trading dashboard that renders hundreds of price updates per second — and stays buttery smooth doing it." },
      { type: "h2", text: "The problem with coarse-grained updates" },
      { type: "p", text: "Most frameworks re-render an entire component tree when any piece of state changes. For a dashboard with 200 tickers updating 10 times a second, that's 2,000 full re-renders per second. Even with a virtual DOM, the diffing cost adds up." },
      { type: "p", text: "Olum signals update only the exact DOM nodes that depend on a changed value. A price update touches one <span> — nothing else runs." },
      { type: "h2", text: "Setting up the signal store" },
      { type: "code", lang: "ts", text: `import { signal, computed } from 'olum'

export interface Ticker {
  symbol: string
  price: signal<number>
  change: computed<number>
  changePercent: computed<number>
}

export function createTicker(symbol: string, initial: number): Ticker {
  const price = signal(initial)
  const open = initial
  const change = computed(() => price.value - open)
  const changePercent = computed(() => (change.value / open) * 100)
  return { symbol, price, change, changePercent }
}` },
      { type: "h2", text: "Rendering without re-renders" },
      { type: "p", text: "Because each cell binds directly to a signal, Olum patches only the changed text node when a price updates. The surrounding component — headers, layout, other rows — never runs again." },
      { type: "h2", text: "Benchmarks" },
      { type: "ul", items: ["200 tickers × 10 updates/s = 2,000 DOM patches/s", "CPU usage: ~1.2% on an M4 MacBook Pro", "Memory stable at 28MB after 10 minutes", "Comparison: equivalent React app at ~18% CPU"] },
      { type: "callout", text: "The full source code for this tutorial is available on GitHub. Clone it and run npm dev to see the dashboard in action with simulated market data." },
    ],
  },
  {
    title: "Why We Migrated 150k Lines of Vue to Olum",
    excerpt:
      "A deep dive into our migration story: the challenges, the wins, and why our bundle went from 340kb to 41kb.",
    author: { name: "Marcus Rodriguez", avatar: "MR", color: "#06b6d4", role: "Staff Engineer" },
    date: "May 10, 2026",
    readTime: "12 min read",
    tags: ["migration", "case study"],
    slug: "vue-to-olum-migration",
    content: [
      { type: "p", text: "We've been running a large SaaS dashboard on Vue 3 for three years. It worked. But as the codebase grew to 150,000 lines, the cracks started to show: slow builds, a 340kb bundle that refused to shrink, and SSR hydration mismatches that cost us hours of debugging every sprint." },
      { type: "h2", text: "The decision to migrate" },
      { type: "p", text: "We evaluated Svelte, Solid, and Olum. Olum won on three criteria: the Vue-like single-file component format minimized the learning curve, the compiler promised genuine bundle improvements, and the migration tooling looked serious." },
      { type: "h2", text: "Phase 1: Running both frameworks side-by-side" },
      { type: "p", text: "We didn't do a big-bang rewrite. Olum's compatibility layer lets you mount Olum components inside a Vue app and vice versa. We started with leaf components — buttons, inputs, badges — and worked inward." },
      { type: "code", lang: "ts", text: `// Wrapping an Olum component for use inside Vue
import { defineOlumWrapper } from '@olum/vue-compat'
import { MyButton } from './MyButton.olum'

export default defineOlumWrapper(MyButton)` },
      { type: "h2", text: "Results after full migration" },
      { type: "ul", items: ["Bundle: 340kb → 41kb gzipped (88% reduction)", "Build time: 42s → 3.1s (cold), 90ms (incremental)", "Lighthouse performance score: 67 → 97", "SSR hydration errors: eliminated entirely", "TypeScript errors surfaced by stricter prop inference: 214 (all fixed)"] },
      { type: "h2", text: "What we'd do differently" },
      { type: "p", text: "Start the migration from the data layer, not the UI. Migrating stores first gave us a stable reactive foundation before we touched a single template. We wasted two weeks going UI-first before we realised this." },
      { type: "callout", text: "This migration was done by a team of 4 over 14 weeks while shipping features in parallel. The compatibility layer was essential — without it, we couldn't have kept the product running throughout." },
    ],
  },
  {
    title: "Understanding Olum's Compile-Time Reactivity",
    excerpt:
      "How Olum's compiler transforms your components into optimized JavaScript with zero virtual DOM overhead.",
    author: { name: "Priya Mehta", avatar: "PM", color: "#f59e0b", role: "Compiler Engineer" },
    date: "May 3, 2026",
    readTime: "7 min read",
    tags: ["internals", "compiler"],
    slug: "compile-time-reactivity",
    content: [
      { type: "p", text: "Most reactive frameworks do their work at runtime: they build a virtual DOM, diff it against the previous render, and patch the real DOM. Olum takes a different path — the compiler does as much work as possible at build time, leaving the runtime with almost nothing to do." },
      { type: "h2", text: "Static analysis of templates" },
      { type: "p", text: "When Olum compiles a .olum file, it parses the template into an AST and annotates every node with its reactive dependencies. A node that depends on no signals is marked static and compiled to a plain DOM creation call — it will never be compared or patched again." },
      { type: "code", lang: "ts", text: `// Input template
<div class="card">
  <h1>Hello, {name}</h1>
  <p class="static-text">This never changes.</p>
</div>

// Compiled output (simplified)
const _static = _createStaticNode('<p class="static-text">This never changes.</p>')

function render(name: Signal<string>) {
  const h1 = _el('h1')
  _effect(() => _setText(h1, name.value))
  return _div('card', [h1, _static])
}` },
      { type: "h2", text: "The reactive graph" },
      { type: "p", text: "For dynamic nodes, the compiler generates direct signal subscriptions rather than a render function. When a signal changes, exactly the DOM nodes that depend on it are updated — no diffing, no component re-render, no work for anything else in the tree." },
      { type: "h2", text: "What this means in practice" },
      { type: "ul", items: ["No virtual DOM allocation on every render", "Static subtrees are created once and never touched again", "Updates are O(1) per changed signal, not O(n) for the subtree", "The runtime ships at 8kb gzipped — most of it is the scheduler"] },
      { type: "callout", text: "If you're curious about the compiled output for your own components, run olum build --inspect. It writes human-readable compiled JS alongside your bundles." },
    ],
  },
  {
    title: "TypeScript-First Development with Olum",
    excerpt:
      "Leverage Olum's full TypeScript support for props, emits, slots, and the Composition API. No configuration required.",
    author: { name: "Aisha Patel", avatar: "AP", color: "#8b5cf6", role: "DX Engineer" },
    date: "Apr 28, 2026",
    readTime: "4 min read",
    tags: ["typescript", "guide"],
    slug: "typescript-with-olum",
    content: [
      { type: "p", text: "TypeScript support in Olum isn't bolted on — it's the primary authoring experience. Every API is designed so that TypeScript can infer types without manual annotations." },
      { type: "h2", text: "Typed props with zero boilerplate" },
      { type: "p", text: "Define your props as a TypeScript interface. Olum's compiler reads the type at build time and generates the runtime prop validation automatically." },
      { type: "code", lang: "ts", text: `// UserCard.olum
import { signal } from 'olum'

interface Props {
  name: string
  role?: 'admin' | 'user' | 'guest'
  onSelect: (id: string) => void
}

export function UserCard({ name, role = 'user', onSelect }: Props) {
  const hovered = signal(false)

  return (
    <div
      class={{ card: true, hovered: hovered }}
      on:mouseenter={() => hovered.value = true}
      on:mouseleave={() => hovered.value = false}
      on:click={() => onSelect(name)}
    >
      <span>{name}</span>
      <Badge type={role} />
    </div>
  )
}` },
      { type: "h2", text: "Typed emits and slots" },
      { type: "p", text: "The emit() helper is fully typed — TypeScript will error if you emit an event that isn't declared in the component's interface, or pass the wrong payload type." },
      { type: "h2", text: "IDE support" },
      { type: "p", text: "The VS Code extension provides autocomplete for props, emits, and slot names — including completions from child components that are imported in the template. The language server is built on the same compiler infrastructure as the bundler, so it's always in sync." },
      { type: "callout", text: "Strict mode is on by default for new Olum projects. We recommend keeping it — the types surfaced 214 latent bugs when one team migrated from Vue." },
    ],
  },
  {
    title: "SSR and SSG in Olum: The Complete Guide",
    excerpt:
      "Everything you need to know about server-side rendering, static generation, and incremental regeneration with Olum.",
    author: { name: "Kai Nakamura", avatar: "KN", color: "#25C97E", role: "Core Team" },
    date: "Apr 20, 2026",
    readTime: "9 min read",
    tags: ["ssr", "ssg", "guide"],
    slug: "ssr-ssg-guide",
    content: [
      { type: "p", text: "Olum supports three rendering modes out of the box: client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG). You can mix modes per-route — no separate framework needed." },
      { type: "h2", text: "Server-side rendering" },
      { type: "p", text: "SSR renders your components to HTML on the server on each request. This gives you fast first paint and full SEO indexability. Olum's SSR is streaming by default — HTML starts arriving in the browser before all data has loaded." },
      { type: "code", lang: "ts", text: `// pages/product/[id].olum
export async function load({ params }) {
  const product = await db.products.findById(params.id)
  if (!product) throw new NotFoundError()
  return { product }
}

export default function ProductPage({ product }) {
  return (
    <article>
      <h1>{product.name}</h1>
      <Price value={product.price} />
    </article>
  )
}` },
      { type: "h2", text: "Static site generation" },
      { type: "p", text: "Export a paths() function from a page to pre-render it at build time. The output is plain HTML + JS — no server required. CDN-deployable in one command." },
      { type: "h2", text: "Incremental static regeneration" },
      { type: "p", text: "For pages that are static most of the time but need occasional updates, use ISR. Set a revalidate interval and Olum will regenerate the page in the background when it becomes stale — serving the cached version until the new one is ready." },
      { type: "ul", items: ["SSR: per-request rendering with streaming", "SSG: build-time pre-rendering, zero server cost", "ISR: stale-while-revalidate for dynamic-ish content", "Hybrid: mix modes freely per route"] },
      { type: "callout", text: "When in doubt, start with SSG. You can always opt individual routes into SSR or ISR later. Static is faster, cheaper, and simpler to cache." },
    ],
  },
  {
    title: "Olum DevTools 2.0: Debug Signals Like a Pro",
    excerpt:
      "The new DevTools extension makes it trivial to visualize your reactive graph, time-travel through state changes, and profile component renders.",
    author: { name: "Elena Vasquez", avatar: "EV", color: "#ec4899", role: "Tooling Team" },
    date: "Apr 12, 2026",
    readTime: "5 min read",
    tags: ["devtools", "dx"],
    slug: "devtools-2-0",
    content: [
      { type: "p", text: "Debugging reactive applications is hard. When a value changes, you want to know: what caused this change? What does it affect? How many times did it update in the last second? Olum DevTools 2.0 answers all of these questions visually." },
      { type: "h2", text: "The signal graph explorer" },
      { type: "p", text: "The new graph view renders your entire reactive dependency graph as an interactive diagram. Nodes are signals and computed values; edges show dependencies. Click any node to see its current value, its history, and which components read it." },
      { type: "h2", text: "Time-travel debugging" },
      { type: "p", text: "DevTools 2.0 records a history of every signal mutation. Use the timeline scrubber to step backward and forward through your app's state — like a DVR for your reactive graph. This is invaluable for tracking down the source of unexpected UI states." },
      { type: "h2", text: "Component profiler" },
      { type: "p", text: "The profiler tab shows a flame graph of every component render, with wall-clock time and signal subscription counts. Filter to find the components that update most frequently or take the longest to render." },
      { type: "ul", items: ["Signal graph: interactive dependency visualization", "Time-travel: step through every state mutation", "Profiler: flame graph with per-component render times", "Inspector: live prop and signal values for any component", "Network: track load() calls and their timing"] },
      { type: "callout", text: "DevTools 2.0 is available now for Chrome and Firefox. Install it from the extension stores — it auto-connects to any Olum app running in dev mode." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  if (featuredPost.slug === slug) return featuredPost;
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return [featuredPost.slug, ...posts.map((p) => p.slug)];
}
