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
  title: "Introducing OlumJS: Reactive UIs with Nothing but HTML",
  excerpt:
    "Today marks the first public release of OlumJS — a tiny, Vue/React-inspired UI framework with signal-based reactivity, scoped styles, and a template syntax that's just HTML. All in 8 kb gzipped.",
  author: { name: "Kai Nakamura", avatar: "KN", color: "#25C97E", role: "Core Team" },
  date: "Jul 11, 2026",
  readTime: "5 min read",
  tags: ["release", "announcement"],
  slug: "introducing-olumjs",
  content: [
    { type: "p", text: "We're thrilled to announce the first public release of OlumJS — a small UI framework for developers who like the ergonomics of Vue and React but don't want to leave HTML behind. If you can write a web page, you already know most of Olum." },
    { type: "p", text: "The whole runtime is 8 kb gzipped. There's no virtual DOM, no build-time magic you can't inspect, and no new templating language to learn. Components are ordinary .html files with a little reactivity sprinkled on top." },
    { type: "h2", text: "A component is just a file" },
    { type: "p", text: "Every Olum component is a single .html file with an optional <script>, an optional scoped <style>, and markup. Here's the entire \"hello world\":" },
    { type: "code", lang: "html", text: `<script>
  const state = { name: "world", count: 0 };

  const inc = () => state.count++;
</script>

<h1>Hello {state.name}!</h1>

<input value="{state.name}" oninput="(e) => state.name = e.target.value" />
<button onclick="inc()">clicks: {state.count}</button>` },
    { type: "p", text: "Mutate state.count and the button updates. No setState, no ref(), no re-render call — you assign to the value and the exact text node that reads it changes. That's the whole mental model." },
    { type: "h2", text: "What's in the box" },
    { type: "ul", items: [
      "Signal-based reactivity — mutate plain state, only the DOM that depends on it updates",
      "Native-HTML templates — {expressions}, attribute bindings, and inline event handlers",
      "Scoped <style> per component, with zero configuration",
      "Control-flow elements: <if when=\"…\"> and <for each=\"item of list\">",
      "Component composition via plain ES module imports",
      "8 kb gzipped, no virtual DOM, no runtime dependencies",
    ] },
    { type: "h2", text: "Control flow you can read" },
    { type: "p", text: "Conditionals and loops are elements, so your template stays valid HTML and your editor keeps highlighting it correctly." },
    { type: "code", lang: "html", text: `<if when="state.user.loggedIn">
  <button onclick="toggle()">Log out</button>
</if>

<ul>
  <for each="cat of cats">
    <li>{cats.indexOf(cat) + 1}: {cat.name}</li>
  </for>
</ul>` },
    { type: "h2", text: "Composition" },
    { type: "p", text: "Components import each other like any ES module, and pass data down as attributes. Props are just attributes with braces around dynamic values." },
    { type: "code", lang: "html", text: `<script>
  import Nested from "./Nested";
</script>

<Nested answer="{42}" />` },
    { type: "callout", text: "Olum is intentionally small and this is an early release — expect the API to keep tightening as we hit 1.0. Try it out, file issues, and tell us what feels right and what doesn't." },
    { type: "h2", text: "Get started" },
    { type: "p", text: "Scaffold a project with the starter, open the dev server, and start editing .html files. From there, the interactive Playground walks you through every feature one example at a time — and our next post is a five-minute tutorial that builds a small app from scratch." },
  ],
};

export const posts: Post[] = [
  {
    title: "Build Your First OlumJS App in 5 Minutes",
    excerpt:
      "A hands-on quick start: from an empty component to a working counter with state, events, conditionals, lists, and scoped styles — using nothing but HTML.",
    author: { name: "Sofia Laurent", avatar: "SL", color: "#25C97E", role: "Developer Advocate" },
    date: "Jul 11, 2026",
    readTime: "4 min read",
    tags: ["tutorial", "guide"],
    slug: "quick-start-tutorial",
    content: [
      { type: "p", text: "This tutorial takes you from nothing to a small, interactive Olum component. No prior framework experience needed — if you know HTML and a little JavaScript, you're ready. We'll build a tiny task list to touch every core feature." },
      { type: "h2", text: "1. State and interpolation" },
      { type: "p", text: "A component's reactive data lives in a state object inside <script>. Reference it in markup with curly braces. Change a value and the DOM follows automatically." },
      { type: "code", lang: "html", text: `<script>
  const state = { title: "My tasks", count: 0 };
</script>

<h1>{state.title}</h1>
<p>You have {state.count} tasks.</p>` },
      { type: "h2", text: "2. Events" },
      { type: "p", text: "Wire up DOM events inline with on-prefixed attributes. Call a function you defined in <script>, or write the handler right there." },
      { type: "code", lang: "html", text: `<script>
  const state = { count: 0 };

  const add = () => state.count++;
</script>

<button onclick="add()">Add task</button>
<button onclick="(e) => state.count = 0">Clear</button>` },
      { type: "h2", text: "3. Two-way input binding" },
      { type: "p", text: "Reflecting an input into state is a value binding plus an oninput handler — the same pattern for any form field." },
      { type: "code", lang: "html", text: `<script>
  const state = { draft: "" };
</script>

<input
  value="{state.draft}"
  oninput="(e) => state.draft = e.target.value"
  placeholder="New task…"
/>
<p>Preview: {state.draft}</p>` },
      { type: "h2", text: "4. Conditionals and lists" },
      { type: "p", text: "Use <if> to show something conditionally, and <for> to render a list. Both are elements, so the template stays valid HTML." },
      { type: "code", lang: "html", text: `<script>
  const state = { tasks: ["Learn Olum", "Ship something"] };
</script>

<if when="state.tasks.length === 0">
  <p>Nothing to do 🎉</p>
</if>

<ul>
  <for each="task of state.tasks">
    <li>{task}</li>
  </for>
</ul>` },
      { type: "h2", text: "5. Scoped styles" },
      { type: "p", text: "Add a <style> block and the rules apply only to this component — no class-name collisions, no extra tooling." },
      { type: "code", lang: "html", text: `<style>
  h1 {
    color: #25c97e;
    font-family: system-ui, sans-serif;
  }
  li { padding: 4px 0; }
</style>` },
      { type: "callout", text: "That's the whole surface area: state, {interpolation}, events, bindings, <if>, <for>, and scoped <style>. Everything else in Olum builds on these primitives." },
      { type: "h2", text: "Where to go next" },
      { type: "p", text: "Open the Playground to see each feature as a live, editable example, or read the docs for the full API. When you're comfortable, try splitting your UI into multiple .html components and passing data down as attributes." },
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
