import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import DocsSidebar from "@/components/DocsSidebar";
import Footer from "@/components/Footer";
import { docOrder, sidebarGroups } from "@/lib/docs-sections";

// ── Code samples ──────────────────────────────────────────────────────────────

const GET_STARTED_CODE = `npx create-olum@latest my-app`;

const COMPONENT_STRUCTURE_CODE = `<!-- Counter.html -->
<script>
  const state = { count: 0 };
  const inc = () => state.count++;
</script>

<style>
  .counter { font-weight: 700; }
</style>

<div class="counter">
  Count: {state.count}
  <button onclick="inc()">+</button>
</div>`;

const STATE_CODE =`<script>
  const state = { count: 0, user: { name: "Ann" } };

  const inc = () => state.count++;                 // reassign / mutate → re-render
  const rename = () => (state.user = { name: "Bo" });
</script>

<p>{state.count} — {state.user.name}</p>
<button onclick="inc()">+</button>`;

const TEXT_INTERPOLATION_CODE = `<p>Hello {state.user.name}</p>
<p>Total: {state.items.length} items</p>
<p>{state.count > 0 ? 'positive' : 'zero'}</p>`;

const STRING_ATTRS_CODE = `<div class="card {state.active ? 'is-active' : ''}"></div>
<a href="/users/{state.user.id}" title="Open {state.user.name}">Profile</a>
<img src="/avatars/{state.user.id}.png" alt="avatar" />
<input id="field-{state.index}" type="text" />

<!-- dynamic inline style is just a string with {expr} (kebab-case CSS) -->
<div style="color:{state.color}; background:{state.bg}; padding:8px;">box</div>`;

const CODE_ATTRS_CODE = `<if when="state.count > 0"> … </if>
<button onclick="inc()">+</button>`;

const EVENTS_CODE = `<!-- method call(s) -->
<button onclick="inc()">+</button>
<button onclick="inc(), log()">multi</button>

<!-- inline arrow / function (extracted into a method automatically) -->
<input oninput="(e) => state.text = e.target.value" />
<button onclick="e => state.n++">no-paren arrow</button>`;

const EVENTS_DOLLAR_CODE = `<input oninput="setValue($event)" />`;

const CONDITIONALS_CODE = `<if when="state.tab === 'a'">
  <p>Tab A</p>
</if>
<else-if when="state.tab === 'b'">
  <p>Tab B</p>
</else-if>
<else>
  <p>Fallback</p>
</else>`;

const CONDITIONALS_RANGE_CODE = `<if when="state.count >= 5 && state.count < 10">in range</if>`;

const SHOW_CODE = `<show when="state.visible">
  <div class="panel">Always in the DOM; only visibility toggles.</div>
</show>`;

const LOOPS_CODE = `<!-- array: "item of list" -->
<for each="fruit of state.fruits">
  <li>{fruit.name}</li>
</for>

<!-- numeric range: "i of N"  (i goes 1 → N, not 0-based) -->
<for each="i of 6">
  <span>Step {i}</span>
</for>

<!-- object keys: "key in obj" -->
<for each="key in state.settings">
  <div>{key}: {state.settings[key]}</div>
</for>`;

const LOOPS_KEY_CODE = `<for each="todo of state.todos" key="todo.id">
  <TodoRow todo="{todo}" />
</for>`;

const RAW_HTML_ATTR_CODE = `<div html="state.articleHtml"></div>
<span html="state.richText"></span>`;

const RAW_HTML_INLINE_CODE = `<p>Intro: {olum.html(state.snippetHtml)} — end.</p>`;

const SCOPE_DEFAULT_CODE = `<!-- No scope attributes → every prop and method is PRIVATE (encapsulated). -->
<script>
  const name  = "Ann";
  const age   = 30;
  const greet = () => "Hi " + name;
</script>`;

const SCOPE_KEYWORDS_CODE = `<!-- Expose all props AND methods -->
<script public> … </script>

<!-- Expose all props only (methods stay private) -->
<script public-props> … </script>

<!-- Expose all methods only (props stay private) -->
<script public-methods> … </script>

<!-- Explicitly private (the default) — both dimensions -->
<script private> … </script>
<script private-props> … </script>
<script private-methods> … </script>`;

const SCOPE_EXAMPLE_CODE = `<script public-props exclude-age exclude-name private-methods exclude-get-age>
  const age     = 30;
  const name    = "Ann";
  const role    = "admin";

  const getAge  = () => age;
  const getRole = () => role;
</script>

<!--
  props:   public  EXCEPT age, name   →  role is public; age + name private
  methods: private EXCEPT getAge      →  getAge is public; getRole private
-->`;

const SCOPE_ORDER_CODE = `['public-props', 'exclude-age', 'exclude-name',  'private-methods', 'exclude-get-age']
      ↓               ↓              ↓                 ↓                  ↓
  open props    →   age      →     name          close props      →    getAge
                                                  open methods      close methods (end)`;

const SCOPE_KEBAB_CODE = `getAge    →  exclude-get-age
userName  →  exclude-user-name
isActive  →  exclude-is-active`;

const ROUTER_STRUCTURE_CODE = `src/
├── page.html                 → /
├── not-found.html            → Global 404 page
│
├── about/
│   └── page.html             → /about
│
├── blog/
│   ├── page.html             → /blog
│   └── [slug]/
│       └── page.html         → /blog/:slug
│
├── users/
│   ├── page.html             → /users
│   └── [id]/
│       └── page.html         → /users/:id`;

const ROUTER_PARAMS_CODE = `<!-- src/blog/[slug]/page.html -->
<script>
  const { slug } = params;
</script>

<h1>blog: {slug}</h1>`;

const ROUTER_VIEW_CODE =`<!-- index.html -->
<!-- The matched route's page renders wherever you place <router-view>. -->
<nav>
  <a href="/" link>Home</a>
  <a href="/about" link>About</a>
</nav>

<router-view></router-view>`;

const ROUTER_LINK_CODE = `<!-- Add the \`link\` attribute so the router intercepts the click -->
<!-- (no full page reload) instead of letting the browser navigate. -->
<a href="/about" link>About</a>

<!-- Without \`link\`, this is a normal browser navigation. -->
<a href="/about">About (hard reload)</a>`;

const COMPONENTS_CODE = `<script>
  import StatusBadge from "./StatusBadge";
  import CounterCard from "./CounterCard";
  const state = { score: 5, name: "Ann" };
</script>

<StatusBadge label="Online" color="#16a34a" />
<CounterCard title="Counter" initialValue="{state.score}" />`;

const PROPS_RULE_CODE = `<Comp
  title="Hello"               <!-- "Hello"     → string                -->
  count="{n + 1}"             <!-- 6           → number (type kept)    -->
  data="{state.user}"         <!-- {...}       → object (type kept)    -->
  greet="Hi {state.name}"     <!-- "Hi Ann"    → interpolated string   -->
/>`;

const PROPS_CHILD_CODE = `<!-- StatusBadge.html -->
<script>
  // props.label, props.color
  const mounted = () => console.log(props.label);
</script>
<span class="badge" style="color:{props.color}">{props.label}</span>`;

const PROPS_WRITEBACK_CODE = `<!-- parent -->
<CounterCard initialValue="{state.score}" />

<!-- CounterCard.html: writing props.initialValue updates the parent's state.score -->
<script>
  const inc = () => { state.count++; props.initialValue = state.count; };
</script>`;

const SLOTS_CODE = `<!-- parent -->
<CounterCard title="Score">
  <em>passed from the parent</em>
</CounterCard>

<!-- CounterCard.html -->
<div class="slot">{children}</div>`;

const TWO_WAY_CODE = `<input
  type="text"
  value="{state.text}"
  oninput="(e) => state.text = e.target.value"
/>
<p>Echo: {state.text}</p>`;

const WATCHERS_CODE = `<script>
  const state = { count: 0, log: "—" };
  const watcher = {
    count(old, next) {
      state.log = \`count: \${old} → \${next}\`;
    },
  };
</script>
<p>{state.count} — {state.log}</p>`;

const LIFECYCLE_CODE = `<script>
  const mounted   = () => console.log("mounted ✓");
  const unMounted = () => console.log("removed from DOM");
</script>`;

const SCOPED_CSS_CODE = `<style>
  .title { color: #4f46e5; }   /* won't leak to other components */
</style>
<h1 class="title">Hello</h1>`;

const IMPORTS_CODE = `<script>
  import Navbar from "./components/Navbar";
  import { formatDate } from "./utils";
</script>`;

const QUICK_REF_CODE = `<!-- TEXT (auto-escaped) -->
{state.value}
{a > b ? 'x' : 'y'}

<!-- RAW / UNESCAPED HTML (opt out of escaping) -->
<div html="state.articleHtml"></div>
{olum.html(state.snippetHtml)}

<!-- STRING ATTRIBUTES (literal + {expr}) -->
<div class="box {state.cls}" style="color:{state.color}" title="Hi {state.name}"></div>

<!-- EVENTS (code in "") -->
<button onclick="save()">Save</button>
<input oninput="(e)=> state.text = e.target.value" />
<form onsubmit="(e)=> { e.preventDefault(); submit() }"></form>

<!-- CONDITIONALS -->
<if when="state.tab === 'a'">…</if>
<else-if when="state.tab === 'b'">…</else-if>
<else>…</else>

<!-- SHOW -->
<show when="state.visible">…</show>

<!-- LOOPS -->
<for each="item of state.items" key="item.id"><Row item="{item}" /></for>
<for each="i of 6">{i}</for>
<for each="key in state.map">{key}</for>

<!-- COMPONENTS + PROPS + SLOT -->
<Card title="Hi" count="{n + 1}" data="{state.obj}">
  <span>slot content → {children}</span>
</Card>`;

const LIMITATION_DOM_CODE = `<!-- ✗ State lives INSIDE the media/input component.
     Any re-render rebuilds it, so the <video> restarts,
     the animation resets, and typed-in inputs lose value/focus. -->
<!-- MediaBox.html -->
<script>
  const state = { count: 0 };          // mutating this re-renders MediaBox
  const inc = () => state.count++;
</script>
<video src="/clip.mp4" controls></video>
<button onclick="inc()">{state.count}</button>

<!-- ✓ Lift the state OUT to a parent, keep the media/input
     component stateless so it never re-renders. -->
<!-- Parent.html -->
<script>
  const state = { count: 0 };          // re-renders the counter, not the video
  const inc = () => state.count++;
</script>
<MediaBox />                           <!-- stateless → the <video> is safe -->
<button onclick="inc()">{state.count}</button>`;

const LIMITATION_STORE_CODE = `<!-- A dedicated store component that exposes its props/methods -->
<!-- App.html (mounted at src/page.html) -->
<script public>
  const user = { name: "Ann" };
  const login = () => { /* … */ };
</script>

// Access it elsewhere by its registered location key:
olum.app.store["page>App#0"].user;
olum.app.store["page>App#0"].login();`;

const commonMistakes = [
  { wrong: 'when={x} / each={x}', right: 'when="x" / each="x"', why: 'values live in ""' },
  { wrong: "value={state.x}", right: 'value="{state.x}"', why: "string attr + {}" },
  { wrong: "oninput={(e)=>…}", right: 'oninput="(e)=>…"', why: 'events in ""' },
  { wrong: "<Comp {a} />", right: '<Comp a="{a}" />', why: "no shorthand" },
  { wrong: "<Comp a={a} />", right: '<Comp a="{a}" />', why: "no naked-brace prop" },
  { wrong: "<img {src} />", right: '<img src="{src}" />', why: "no shorthand" },
  { wrong: ':style="{…}"', right: 'style="color:{x}; …"', why: "string style + {}" },
  { wrong: ':title="x"', right: 'title="{x}"', why: "string attr + {}" },
  { wrong: 'model="state.x"', right: 'value="{state.x}" + oninput', why: "bind manually" },
  { wrong: 'mode="prevent"', right: "e.preventDefault() in the handler", why: "no modifiers" },
  { wrong: "literal { in text", right: "{String.fromCharCode(123)}", why: "any {…} is interpolated" },
  { wrong: "<comp/>", right: "<Comp/>", why: "components are PascalCase" },
];

// ── Section definitions ───────────────────────────────────────────────────────

type Section = {
  title: string;
  group: string;
  content: () => React.ReactNode;
};

const sections: Record<string, Section> = {
  "get-started": {
    title: "Get Started",
    group: "Getting Started",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Scaffold a new OlumJS project with the official CLI — TypeScript, routing, and a dev server ready out of the box:
        </p>
        <CodeBlock code={GET_STARTED_CODE} filename="Terminal" showCopy />
        <div className="mt-6 flex gap-4 p-5 rounded-xl bg-[rgba(37,201,126,0.06)] border border-[rgba(37,201,126,0.2)]">
          <span className="text-xl mt-0.5">💡</span>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            This scaffolds a full project with TypeScript, file-based routing, and a configured dev server in one command.
          </p>
        </div>
      </>
    ),
  },

  "component-structure": {
    title: "Component File Structure",
    group: "Getting Started",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          A component is one{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">.html</code>{" "}
          file with up to three parts:{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;script&gt;</code>{" "}
          (logic),{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;style&gt;</code>{" "}
          (scoped CSS), and the template (everything else).
        </p>
        <CodeBlock code={COMPONENT_STRUCTURE_CODE} filename="Counter.html" showCopy />
        <ul className="mt-6 space-y-3 text-sm text-[var(--fg-2)]">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              <code className="text-[#25C97E] font-mono">state</code>, methods, and{" "}
              <code className="text-[#25C97E] font-mono">props</code> declared in{" "}
              <code className="text-[#25C97E] font-mono">&lt;script&gt;</code> are directly available in the template (same closure).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              <code className="text-[#25C97E] font-mono">&lt;style&gt;</code> is automatically{" "}
              <strong className="text-[var(--fg)]">scoped</strong> to the component (the compiler tags the component&apos;s elements with a unique attribute).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              Component <strong className="text-[var(--fg)]">tag names are PascalCase</strong> — that&apos;s how the compiler tells a component apart from a normal element.
            </span>
          </li>
        </ul>
      </>
    ),
  },

  state: {
    title: "State & Reactivity",
    group: "Reactivity",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Declare reactive state as{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{"const state = { ... }"}</code>.{" "}
          <strong className="text-[var(--fg)]">Mutating <code className="font-mono text-[#25C97E]">state</code> re-renders</strong> the component.
        </p>
        <CodeBlock code={STATE_CODE} filename="Component.html" showCopy />
        <div className="mt-5 flex gap-3 p-4 rounded-lg bg-[rgba(255,200,0,0.06)] border border-[rgba(255,200,0,0.2)]">
          <span className="text-base mt-0.5">⚠️</span>
          <p className="text-sm text-[var(--fg-2)]">
            Only <code className="text-[#25C97E] font-mono">state</code> is reactive. Plain{" "}
            <code className="text-[#25C97E] font-mono">const</code>/<code className="text-[#25C97E] font-mono">let</code>{" "}
            variables are not tracked.
          </p>
        </div>
      </>
    ),
  },

  "text-interpolation": {
    title: "Text Interpolation",
    group: "Reactivity",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Any{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{"{expr}"}</code>{" "}
          in <strong className="text-[var(--fg)]">text</strong> is evaluated as JavaScript and{" "}
          <strong className="text-[var(--fg)]">HTML-escaped by default</strong> (XSS-safe).
        </p>
        <CodeBlock code={TEXT_INTERPOLATION_CODE} filename="Component.html" showCopy />
        <ul className="mt-6 space-y-3 text-sm text-[var(--fg-2)]">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              <code className="text-[#25C97E] font-mono">null</code> /{" "}
              <code className="text-[#25C97E] font-mono">undefined</code> render as an empty string.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              To render unescaped HTML, see{" "}
              <Link href="/docs/raw-html" className="text-[#25C97E] hover:underline">Raw HTML</Link>.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[rgba(255,200,0,0.8)] shrink-0" />
            <span>
              There is <strong className="text-[var(--fg)]">no escape for a literal{" "}
              <code className="font-mono text-[#25C97E]">{"{"}</code></strong> in text — any{" "}
              <code className="text-[#25C97E] font-mono">{"{…}"}</code> is treated as interpolation. Use{" "}
              <code className="text-[#25C97E] font-mono">{"{String.fromCharCode(123)}"}</code> or a <code className="text-[#25C97E] font-mono">const</code> holding <code className="text-[#25C97E] font-mono">{'"{"'}</code>.
            </span>
          </li>
        </ul>
      </>
    ),
  },

  watchers: {
    title: "Watchers",
    group: "Reactivity",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Declare{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{"const watcher = { ... }"}</code>{" "}
          with a function per <code className="text-[#25C97E] font-mono">state</code> key; it fires on change with{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">(oldValue, newValue)</code>.
        </p>
        <CodeBlock code={WATCHERS_CODE} filename="Component.html" showCopy />
      </>
    ),
  },

  attributes: {
    title: "Attributes",
    group: "Template Syntax",
    content: () => (
      <>
        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3" style={{ fontFamily: "var(--font-syne)" }}>
          5a. String attributes — default
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          A literal string; use{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{"{expr}"}</code>{" "}
          <strong className="text-[var(--fg)]">inside</strong> for dynamic parts. Native HTML keeps working untouched.
        </p>
        <CodeBlock code={STRING_ATTRS_CODE} filename="Component.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          5b. Code attributes — value is an expression
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">when</code>,{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">each</code>,{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">key</code>,{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">on*</code>, and{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">html</code>{" "}
          evaluate their <code className="text-[#25C97E] font-mono">&quot;&quot;</code> value as JS (covered in their own sections).
        </p>
        <CodeBlock code={CODE_ATTRS_CODE} filename="Component.html" showCopy />
      </>
    ),
  },

  events: {
    title: "Events",
    group: "Template Syntax",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Native{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">on*</code>{" "}
          attributes hold <strong className="text-[var(--fg)]">code</strong> (like real HTML). Two forms:
        </p>
        <CodeBlock code={EVENTS_CODE} filename="Component.html" showCopy />
        <p className="text-[var(--fg-2)] text-sm mt-6 mb-3">
          Pass the DOM event with{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">$event</code>:
        </p>
        <CodeBlock code={EVENTS_DOLLAR_CODE} filename="Component.html" showCopy />
        <div className="mt-5 flex gap-3 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
          <p className="text-sm text-[var(--fg-2)]">
            Event modifiers (<code className="text-[#25C97E] font-mono">mode=&quot;prevent&quot;</code>,{" "}
            <code className="text-[#25C97E] font-mono">stop</code>, …) are <strong className="text-[var(--fg)]">not</strong> a feature — do it in the handler:{" "}
            <code className="text-[#25C97E] font-mono text-xs">{'onsubmit="(e)=> { e.preventDefault(); save() }"'}</code>.
          </p>
        </div>
      </>
    ),
  },

  conditionals: {
    title: "Conditionals",
    group: "Template Syntax",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">when</code>{" "}
          is always a JS expression. The element is{" "}
          <strong className="text-[var(--fg)]">added/removed</strong> from the DOM.
        </p>
        <div className="space-y-4">
          <CodeBlock code={CONDITIONALS_CODE} filename="Component.html" showCopy />
          <p className="text-[var(--fg-2)] text-sm">Comparison operators work as expected:</p>
          <CodeBlock code={CONDITIONALS_RANGE_CODE} filename="Component.html" showCopy />
        </div>
      </>
    ),
  },

  show: {
    title: "Show / Hide",
    group: "Template Syntax",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Like{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;if&gt;</code>,
          but keeps the element in the DOM and toggles{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">display:none</code>.
        </p>
        <CodeBlock code={SHOW_CODE} filename="Component.html" showCopy />
      </>
    ),
  },

  loops: {
    title: "Loops",
    group: "Template Syntax",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">each</code>{" "}
          is a JS expression. Three forms — array, numeric range, object keys:
        </p>
        <CodeBlock code={LOOPS_CODE} filename="Component.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Keyed loops — <code className="font-mono text-[#25C97E]">key</code>
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          When the loop body contains a <strong className="text-[var(--fg)]">component</strong>, add{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">key</code>{" "}
          so each instance is reused by identity across reorders/insertions/removals instead of by position:
        </p>
        <CodeBlock code={LOOPS_KEY_CODE} filename="Component.html" showCopy />
        <div className="mt-5 flex gap-3 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
          <p className="text-sm text-[var(--fg-2)]">
            <code className="text-[#25C97E] font-mono">key</code> only matters for{" "}
            <strong className="text-[var(--fg)]">component</strong> loops. On a loop of plain elements there is no per-item instance to preserve, so <code className="text-[#25C97E] font-mono">key</code> is a harmless no-op.
          </p>
        </div>
      </>
    ),
  },

  "raw-html": {
    title: "Raw HTML",
    group: "Template Syntax",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          All interpolation is escaped by default. Opt out{" "}
          <strong className="text-[var(--fg)]">only for trusted/sanitized HTML</strong>. Two ways:
        </p>

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3" style={{ fontFamily: "var(--font-syne)" }}>
          <code className="font-mono text-[#25C97E]">html=&quot;expr&quot;</code> — element-level
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-4">
          The element&apos;s content becomes the unescaped HTML of the expression (replaces any children):
        </p>
        <CodeBlock code={RAW_HTML_ATTR_CODE} filename="Component.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          <code className="font-mono text-[#25C97E]">olum.html(value)</code> — inline, per-value
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-4">
          Use inside{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{"{}"}</code>{" "}
          when you need raw HTML mixed with other text:
        </p>
        <CodeBlock code={RAW_HTML_INLINE_CODE} filename="Component.html" showCopy />
        <p className="text-sm text-[var(--fg-2)] mt-4">
          Both are greppable opt-outs. Everything else stays auto-escaped.
        </p>
      </>
    ),
  },

  "two-way-binding": {
    title: "Two-way Binding",
    group: "Template Syntax",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          There is no{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">model</code>{" "}
          attribute — bind manually with a value +{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">oninput</code>{" "}
          handler:
        </p>
        <CodeBlock code={TWO_WAY_CODE} filename="Component.html" showCopy />
      </>
    ),
  },

  components: {
    title: "Components & Props",
    group: "Components",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Use a component by its <strong className="text-[var(--fg)]">PascalCase</strong> tag. Import it in{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;script&gt;</code>.
        </p>
        <CodeBlock code={COMPONENTS_CODE} filename="Parent.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Props rule
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-4">
          A prop is a <strong className="text-[var(--fg)]">literal string by default</strong>; a whole-value{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">prop=&quot;{"{expr}"}&quot;</code>{" "}
          passes the expression&apos;s <strong className="text-[var(--fg)]">real value/type</strong>;{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{"{}"}</code>{" "}
          inside text yields an interpolated string.
        </p>
        <CodeBlock code={PROPS_RULE_CODE} filename="Parent.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Reading props in the child
        </h2>
        <CodeBlock code={PROPS_CHILD_CODE} filename="StatusBadge.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Prop write-back (two-way to parent)
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-4">
          If a prop is passed a{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">state.X</code>{" "}
          (or another{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">props.X</code>),
          the child can assign to it and the change propagates up to the owner:
        </p>
        <CodeBlock code={PROPS_WRITEBACK_CODE} filename="CounterCard.html" showCopy />
      </>
    ),
  },

  slots: {
    title: "Slots",
    group: "Components",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Content placed between a component&apos;s tags is available as{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{"{children}"}</code>{" "}
          inside that component.
        </p>
        <CodeBlock code={SLOTS_CODE} filename="CounterCard.html" showCopy />
      </>
    ),
  },

  imports: {
    title: "Imports",
    group: "Components",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Import child components (and any JS) in{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;script&gt;</code>.
          Import a component by its file name (the{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">.html</code>{" "}
          compiles to{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">.js</code>):
        </p>
        <CodeBlock code={IMPORTS_CODE} filename="Component.html" showCopy />
      </>
    ),
  },

  scope: {
    title: "Props & Methods Scope",
    group: "Components",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          A component&apos;s top-level{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">const</code>{" "}
          props and methods are{" "}
          <strong className="text-[var(--fg)]">private by default</strong> — encapsulated to the component. Add scope
          attributes to the{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;script&gt;</code>{" "}
          opening tag to selectively make them public.
        </p>
        <CodeBlock code={SCOPE_DEFAULT_CODE} filename="Component.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Visibility keywords
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          Six keywords toggle whole groups. The bare{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">public</code>{" "}/{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">private</code>{" "}
          forms apply to <strong className="text-[var(--fg)]">both</strong> props and methods; the{" "}
          <code className="text-[#25C97E] font-mono">-props</code> / <code className="text-[#25C97E] font-mono">-methods</code>{" "}
          forms target one dimension.
        </p>
        <CodeBlock code={SCOPE_KEYWORDS_CODE} filename="Component.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Exceptions — <code className="font-mono text-[#25C97E]">exclude-*</code>
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          An{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">exclude-&lt;name&gt;</code>{" "}
          attribute carves an exception out of the <strong className="text-[var(--fg)]">currently open</strong> visibility
          group — it flips that one member to the opposite visibility:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--card)] border-b border-[var(--border)]">
                <th className="text-left px-4 py-2.5 font-mono text-[var(--fg-subtle)] font-semibold">Open group</th>
                <th className="text-left px-4 py-2.5 font-mono text-[var(--fg-subtle)] font-semibold"><code>exclude-x</code> does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              <tr className="bg-[var(--bg)] hover:bg-[var(--card)] transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-[#25C97E]">public / public-props / public-methods</td>
                <td className="px-4 py-2.5 text-xs text-[var(--fg-2)]">makes <code className="font-mono text-red-400">x</code> private (removed from the public set)</td>
              </tr>
              <tr className="bg-[var(--bg)] hover:bg-[var(--card)] transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-[#25C97E]">private / private-props / private-methods</td>
                <td className="px-4 py-2.5 text-xs text-[var(--fg-2)]">makes <code className="font-mono text-[#25C97E]">x</code> public (the one member that&apos;s surfaced)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock code={SCOPE_EXAMPLE_CODE} filename="Component.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Order matters
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          Attributes are read <strong className="text-[var(--fg)]">left to right</strong>. A visibility keyword
          &ldquo;opens&rdquo; a group; every following{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">exclude-*</code>{" "}
          attaches to it until the next keyword opens a new group.
        </p>
        <CodeBlock code={SCOPE_ORDER_CODE} filename="reading order" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          camelCase → kebab-case
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          HTML attribute names are case-insensitive, so a camelCase prop or method must be written as{" "}
          <strong className="text-[var(--fg)]">kebab-case</strong> in the{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">exclude-*</code>{" "}
          name — the compiler converts it back:
        </p>
        <CodeBlock code={SCOPE_KEBAB_CODE} filename="naming" showCopy />
        <div className="mt-6 flex gap-4 p-5 rounded-xl bg-[rgba(37,201,126,0.06)] border border-[rgba(37,201,126,0.2)]">
          <span className="text-xl mt-0.5">💡</span>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Reactive <code className="text-[#25C97E] font-mono">state</code> is governed by the{" "}
            <strong className="text-[var(--fg)]">props</strong> scope. Exclude the whole reactive object with{" "}
            <code className="text-[#25C97E] font-mono">exclude-state</code> under a public-props group to keep it private.
          </p>
        </div>
      </>
    ),
  },

  router: {
    title: "Router",
    group: "Routing",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Olum uses{" "}
          <span className="text-[var(--fg)] font-semibold">file-based routing</span> — every route is a folder under{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">src/</code>{" "}
          and the files inside it declare how that URL renders. There is no route config to maintain: the file tree{" "}
          <span className="text-[var(--fg)] font-semibold">is</span> the route table.
        </p>
        <CodeBlock code={ROUTER_STRUCTURE_CODE} filename="Project structure" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          File conventions
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--card)] border-b border-[var(--border)]">
                <th className="text-left px-4 py-2.5 font-mono text-[var(--fg-subtle)] font-semibold">File</th>
                <th className="text-left px-4 py-2.5 font-mono text-[var(--fg-subtle)] font-semibold">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              <tr className="bg-[var(--bg)] hover:bg-[var(--card)] transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-[#25C97E] whitespace-nowrap">page.html</td>
                <td className="px-4 py-2.5 text-xs text-[var(--fg-2)]">
                  The UI for a route. A folder becomes a navigable route only when it contains a{" "}
                  <code className="font-mono">page.html</code> — e.g. <code className="font-mono">about/page.html</code> serves{" "}
                  <code className="font-mono">/about</code>.
                </td>
              </tr>
              <tr className="bg-[var(--bg)] hover:bg-[var(--card)] transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-[#25C97E] whitespace-nowrap">not-found.html</td>
                <td className="px-4 py-2.5 text-xs text-[var(--fg-2)]">Rendered when no route matches the current URL — the global 404 page.</td>
              </tr>
              <tr className="bg-[var(--bg)] hover:bg-[var(--card)] transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-[#25C97E] whitespace-nowrap">[param]/</td>
                <td className="px-4 py-2.5 text-xs text-[var(--fg-2)]">
                  A dynamic segment. <code className="font-mono">blog/[slug]/page.html</code> matches{" "}
                  <code className="font-mono">/blog/:slug</code>, capturing the URL part as the{" "}
                  <code className="font-mono">slug</code> param (e.g. <code className="font-mono">/blog/hello</code> →{" "}
                  <code className="font-mono">slug = &quot;hello&quot;</code>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Reading route params
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          A dynamic segment&apos;s value is available in the page component through the{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">params</code>{" "}
          object — no config, no wiring. Hitting{" "}
          <code className="text-[#25C97E] font-mono">/blog/[slug]</code> exposes the captured segment as{" "}
          <code className="text-[#25C97E] font-mono">params.slug</code>, ready to use in{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;script&gt;</code>{" "}
          and the template:
        </p>
        <CodeBlock code={ROUTER_PARAMS_CODE} filename="src/blog/[slug]/page.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Rendering the matched route
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          In your root{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">index.html</code>{" "}
          shell, place a{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;router-view&gt;</code>{" "}
          where the active page should appear — put persistent navigation around it and it stays mounted across route changes.
        </p>
        <CodeBlock code={ROUTER_VIEW_CODE} filename="index.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          Navigating with <code className="font-mono text-[#25C97E]">link</code>
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          Mark an anchor with the{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">link</code>{" "}
          attribute and the router handles the click as a client-side transition — no full page reload.
        </p>
        <CodeBlock code={ROUTER_LINK_CODE} filename="src/page.html" showCopy />
        <div className="mt-6 flex gap-4 p-5 rounded-xl bg-[rgba(255,200,0,0.06)] border border-[rgba(255,200,0,0.2)]">
          <span className="text-base mt-0.5">⚠️</span>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Because routes are resolved on the client, the server must fall back to{" "}
            <code className="text-[#25C97E] font-mono">index.html</code> for unknown paths — otherwise a hard refresh on a
            deep route like <code className="text-[#25C97E] font-mono">/blog/hello</code> 404s before the app can match it.
          </p>
        </div>

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          History mode &amp; the 404 page
        </h2>
        <ul className="space-y-3 text-sm text-[var(--fg-2)] mb-5">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              The router uses <strong className="text-[var(--fg)]">history mode by default</strong> (clean URLs like{" "}
              <code className="text-[#25C97E] font-mono">/blog/hello</code>). If history mode isn&apos;t available it{" "}
              <strong className="text-[var(--fg)]">falls back to hash mode</strong> (<code className="text-[#25C97E] font-mono">/#/blog/hello</code>).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              Add a{" "}
              <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">not-found.html</code>{" "}
              at the <strong className="text-[var(--fg)]">root of your project&apos;s{" "}
              <code className="text-[#25C97E] font-mono">src/</code> directory</strong> and it becomes the default 404 page,
              rendered whenever no route matches.
            </span>
          </li>
        </ul>

        <div className="mt-6 flex gap-4 p-5 rounded-xl bg-[rgba(255,50,50,0.06)] border border-[rgba(255,50,50,0.2)]">
          <span className="text-base mt-0.5">🚧</span>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            <strong className="text-[var(--fg)]">Limitation — deeply nested dynamic segments.</strong> A single dynamic
            segment like <code className="text-[#25C97E] font-mono">/blog/[slug]</code> works. Chaining multiple dynamic
            segments in one path — e.g.{" "}
            <code className="text-[#25C97E] font-mono">/user/[id]/[name]</code> — is <strong className="text-[var(--fg)]">not
            tested yet</strong> and may not resolve correctly. Stick to one dynamic segment per route for now.
          </p>
        </div>
      </>
    ),
  },

  lifecycle: {
    title: "Lifecycle Hooks",
    group: "Advanced",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          Declare{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">mounted</code>{" "}
          and/or{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">unMounted</code>{" "}
          (note the capital <strong className="text-[var(--fg)]">M</strong>).
        </p>
        <CodeBlock code={LIFECYCLE_CODE} filename="Component.html" showCopy />
        <ul className="mt-6 space-y-3 text-sm text-[var(--fg-2)]">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              <code className="text-[#25C97E] font-mono">mounted</code> runs when the component is inserted into the DOM.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              <code className="text-[#25C97E] font-mono">unMounted</code> runs when it&apos;s removed (e.g. an{" "}
              <code className="text-[#25C97E] font-mono">&lt;if&gt;</code> toggles it off, or a keyed list item is removed).
            </span>
          </li>
        </ul>
      </>
    ),
  },

  "scoped-css": {
    title: "Scoped CSS",
    group: "Advanced",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          A component&apos;s{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;style&gt;</code>{" "}
          is automatically scoped — selectors only affect that component&apos;s elements. Just write normal CSS:
        </p>
        <CodeBlock code={SCOPED_CSS_CODE} filename="Component.html" showCopy />
      </>
    ),
  },

  security: {
    title: "Escaping & Security",
    group: "Advanced",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          OlumJS escapes by default to prevent XSS. Opt out deliberately when you need raw HTML.
        </p>
        <ul className="space-y-4 text-sm text-[var(--fg-2)]">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              <strong className="text-[var(--fg)]">Default:</strong> every text/attribute{" "}
              <code className="text-[#25C97E] font-mono">{"{expr}"}</code> is HTML-escaped via{" "}
              <code className="text-[#25C97E] font-mono">olum.esc</code> (prevents XSS and &quot;special characters break the page&quot; bugs).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#25C97E] shrink-0" />
            <span>
              <strong className="text-[var(--fg)]">Opt out</strong> (trusted HTML only):{" "}
              <code className="text-[#25C97E] font-mono">html=&quot;expr&quot;</code> (element) or{" "}
              <code className="text-[#25C97E] font-mono">olum.html(value)</code> (inline). Both are the deliberate, greppable bypass.
            </span>
          </li>
        </ul>
        <div className="mt-6 flex gap-4 p-5 rounded-xl bg-[rgba(255,50,50,0.06)] border border-[rgba(255,50,50,0.2)]">
          <span className="text-xl mt-0.5">🔒</span>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Never pass untrusted user content to <code className="text-[#25C97E] font-mono">html=</code> or{" "}
            <code className="text-[#25C97E] font-mono">olum.html()</code>. Sanitize first if you must render user-supplied HTML.
          </p>
        </div>
      </>
    ),
  },

  "common-mistakes": {
    title: "Common Mistakes",
    group: "Advanced",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          OlumJS intentionally has <strong className="text-[var(--fg)]">no naked braces</strong> and{" "}
          <strong className="text-[var(--fg)]">one way</strong> to do each thing. These do{" "}
          <strong className="text-[var(--fg)]">not</strong> work:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--card)] border-b border-[var(--border)]">
                <th className="text-left px-4 py-2.5 font-mono text-[var(--fg-subtle)] font-semibold">✗ Don&apos;t write</th>
                <th className="text-left px-4 py-2.5 font-mono text-[var(--fg-subtle)] font-semibold">✓ Write instead</th>
                <th className="text-left px-4 py-2.5 font-mono text-[var(--fg-subtle)] font-semibold">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {commonMistakes.map((row) => (
                <tr key={row.wrong} className="bg-[var(--bg)] hover:bg-[var(--card)] transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-red-400">{row.wrong}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-[#25C97E]">{row.right}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--fg-2)]">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  limitations: {
    title: "Limitations",
    group: "Advanced",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-8">
          OlumJS is deliberately small, and a few rough edges come with that. Here&apos;s what to
          watch for today — each has a straightforward workaround by design.
        </p>

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3" style={{ fontFamily: "var(--font-syne)" }}>
          1. Re-renders rebuild the whole stateful component
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          When a component has <code className="text-[#25C97E] font-mono">state</code> and it changes,
          Olum rebuilds that <strong className="text-[var(--fg)]">entire target component — including
          its inner child components</strong>. Any live DOM state that Olum doesn&apos;t track is lost
          in the rebuild: a playing{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;video&gt;</code>{" "}
          restarts, a running animation resets, and focused/typed-in{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">form</code>{" "}
          inputs lose their value and focus.
        </p>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          <strong className="text-[var(--fg)]">Avoid it by design:</strong> keep the reactive{" "}
          <code className="text-[#25C97E] font-mono">state</code> <strong className="text-[var(--fg)]">outside</strong>{" "}
          the component that holds the video / animation / form inputs. If that media component stays
          stateless, it never re-renders and its DOM state is preserved.
        </p>
        <CodeBlock code={LIMITATION_DOM_CODE} filename="lift-state.html" showCopy />

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          2. No integrated unit testing
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          There is no testing framework wired into OlumJS yet — no built-in test runner or component
          testing utilities. You can still test plain JS logic with any external tool, but there&apos;s
          no first-class story for testing components at the moment.
        </p>

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3 mt-10" style={{ fontFamily: "var(--font-syne)" }}>
          3. Global store ergonomics
        </h2>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          There is already a <strong className="text-[var(--fg)]">global store across the whole
          application</strong>, together with the{" "}
          <Link href="/docs/scope" className="text-[#25C97E] hover:underline">scope system</Link>{" "}
          (private/public attributes on the{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">&lt;script&gt;</code>{" "}
          tag) for exposing props/methods. It&apos;s a little awkward in practice, though: a registered
          component&apos;s name isn&apos;t straightforward, so you reach it through its location key —
          e.g.{" "}
          <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">{'olum.app.store["page>App#0"]'}</code>.
        </p>
        <p className="text-[var(--fg-2)] leading-relaxed mb-5">
          <strong className="text-[var(--fg)]">For now:</strong> use a single dedicated component for
          your store, put your props/methods in it, and access it by its location key.
        </p>
        <CodeBlock code={LIMITATION_STORE_CODE} filename="store.html" showCopy />
      </>
    ),
  },

  "quick-reference": {
    title: "Quick Reference",
    group: "Advanced",
    content: () => (
      <>
        <p className="text-[var(--fg-2)] leading-relaxed mb-6">
          A condensed cheat-sheet covering all template syntax at a glance.
        </p>
        <CodeBlock code={QUICK_REF_CODE} filename="cheatsheet.html" showCopy />
        <div className="mt-8 p-6 rounded-xl bg-[rgba(37,201,126,0.04)] border border-[rgba(37,201,126,0.15)]">
          <p className="font-semibold text-[var(--fg)] mb-2" style={{ fontFamily: "var(--font-syne)" }}>
            The design principle
          </p>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            OlumJS draws one line: <strong className="text-[var(--fg)]">is the attribute fundamentally code or a string?</strong>{" "}
            Native HTML already answers it (<code className="text-[#25C97E] font-mono">onclick=&quot;&quot;</code> is code,{" "}
            <code className="text-[#25C97E] font-mono">class=&quot;&quot;</code> is a string). Code-shaped attributes
            (<code className="text-[#25C97E] font-mono">when</code>/<code className="text-[#25C97E] font-mono">each</code>/<code className="text-[#25C97E] font-mono">key</code>/<code className="text-[#25C97E] font-mono">on*</code>/<code className="text-[#25C97E] font-mono">html</code>)
            take an expression directly in <code className="text-[#25C97E] font-mono">&quot;&quot;</code>; everything else is a literal string with{" "}
            <code className="text-[#25C97E] font-mono">{"{}"}</code> for the dynamic bits. No naked braces, no colon-bindings, no special directives to memorize.
          </p>
        </div>
      </>
    ),
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const allItems = sidebarGroups.flatMap((g) => g.items);

function getPrevNext(slug: string) {
  const href = `/docs/${slug}`;
  const idx = docOrder.indexOf(href);
  const prevHref = idx > 0 ? docOrder[idx - 1] : null;
  const nextHref = idx < docOrder.length - 1 ? docOrder[idx + 1] : null;
  return {
    prev: prevHref ? allItems.find((i) => i.href === prevHref) ?? null : null,
    next: nextHref ? allItems.find((i) => i.href === nextHref) ?? null : null,
  };
}

// ── Route ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(sections).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = sections[slug];
  if (!section) return {};
  return { title: `${section.title} — OlumJS Docs` };
}

export default async function DocSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = sections[slug];
  if (!section) notFound();

  const { prev, next } = getPrevNext(slug);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex gap-8 py-8">
          <DocsSidebar />

          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[var(--fg-subtle)] font-mono mb-8">
              <Link href="/" className="hover:text-[#25C97E] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/docs" className="hover:text-[#25C97E] transition-colors">Docs</Link>
              <span>/</span>
              <span className="text-[#25C97E]">{section.title}</span>
            </div>

            <article className="prose-custom max-w-3xl">
              {/* Header */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#25C97E] tracking-widest uppercase mb-4 px-3 py-1.5 bg-[rgba(37,201,126,0.07)] border border-[rgba(37,201,126,0.15)] rounded-full">
                  {section.group}
                </div>
                <h1
                  className="text-4xl sm:text-5xl font-extrabold text-[var(--fg)] leading-tight"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {section.title}
                </h1>
              </div>

              <div className="h-px bg-[var(--border-subtle)] mb-10" />

              {/* Content */}
              {section.content()}

              {/* Prev / Next */}
              <div className="flex justify-between mt-16 pt-8 border-t border-[var(--border-subtle)]">
                {prev ? (
                  <Link
                    href={prev.href}
                    className="flex items-center gap-2 text-sm text-[#25C97E] font-medium hover:opacity-80 transition-opacity"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 7H2M6 3L2 7l4 4" />
                    </svg>
                    {prev.label}
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={next.href}
                    className="flex items-center gap-2 text-sm text-[#25C97E] font-medium hover:opacity-80 transition-opacity"
                  >
                    {next.label}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 7h10M8 3l4 4-4 4" />
                    </svg>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </article>
          </main>

          {/* GitHub link */}
          <aside className="hidden xl:block w-52 shrink-0">
            <div className="sticky top-24">
              <div className="mt-0 pt-0 border-t-0">
                <a
                  href="https://github.com/olumjs"
                  className="flex items-center gap-2 text-xs text-[var(--fg-subtle)] hover:text-[var(--fg-2)] transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Edit on GitHub
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
