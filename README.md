<p align="center"><img width="100" src="https://github.com/olumjs.png" alt="Olum logo"></p>
<p align="center">
 <a href="https://www.npmjs.com/package/olum" target="_blank"><img src="https://img.shields.io/npm/v/olum" alt="npm"></a>
 <img src="https://img.shields.io/npm/dm/olum" alt="npm">
 <img src="https://img.shields.io/npm/l/olum" alt="npm">
</p>

# Olumjs
The VanillaJS developer’s platform.

See [Documentation](https://olum.eissawebdev.top/docs)


# OlumJS — Syntax & Rules

OlumJS is a small, Vue/React-inspired UI framework. You write components as plain **`.html` files** (with a `<script>`, a `<style>`, and template markup); a compiler turns each one into a JavaScript module. The template language is deliberately **native-HTML-friendly**: no naked `{}` in attributes, and HTML formatters/linters work on your files unchanged.

---

## The one rule (read this first)

> **Everything lives inside `""`:** `when` / `each` / `key` / `on*` / `html` hold a **JS expression** (with `html` being the deliberate escape opt-out for trusted HTML); **props and all other attributes** are **literal strings with `{expr}` inside for dynamics** — a whole-value `prop="{expr}"` keeps the expression's real type — and **text** is `{expr}`, **auto-escaped**.

Two buckets, decided by what the attribute fundamentally is (mirrors native HTML, where `onclick=""` is code and `class=""` is a string):

| Bucket | Attributes | Inside `""` |
|---|---|---|
| **Code** | `when`, `each`, `key`, `on*` (events), `html` | a JS expression |
| **String** | `class`, `style`, `title`, `href`, `id`, props, … | a literal string; `{expr}` interpolates dynamics |
| **Text** | element text content | `{expr}`, auto-escaped |

---

## 1. Component file structure

A component is one `.html` file with up to three parts: `<script>` (logic), `<style>` (scoped CSS), and the template (everything else).

```html
<!-- Counter.html -->
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
</div>
```

- `state`, methods, and `props` declared in `<script>` are directly available in the template (same closure).
- `<style>` is automatically **scoped** to the component (the compiler tags the component's elements with a unique attribute).
- Component **tag names are PascalCase** (capitalized first letter) — that's how the compiler tells a component apart from a normal element.

---

## 2. Bootstrapping an app

Import the framework and your root component, then mount it onto a DOM node.

```js
// main.js
import Olum from "olum";
import App from "./App.js"; // the compiled output of App.html

new Olum().$("#app").use(App);
```

```html
<!-- index.html -->
<div id="app"></div>
<script type="module" src="/main.js"></script>
```

---

## 3. State & reactivity

Declare reactive state as `const state = { ... }`. **Mutating `state` re-renders** the component.

```html
<script>
  const state = { count: 0, user: { name: "Ann" } };

  const inc = () => state.count++;                 // reassign / mutate → re-render
  const rename = () => (state.user = { name: "Bo" });
</script>

<p>{state.count} — {state.user.name}</p>
<button onclick="inc()">+</button>
```

> Only `state` is reactive. Plain `const`/`let` variables are not tracked.

---

## 4. Text interpolation `{expr}`

Any `{expr}` in **text** is evaluated as JavaScript and **HTML-escaped by default** (XSS-safe).

```html
<p>Hello {state.user.name}</p>
<p>Total: {state.items.length} items</p>
<p>{state.count > 0 ? 'positive' : 'zero'}</p>
```

- `null` / `undefined` render as an empty string.
- To render **unescaped** HTML, see [Raw HTML](#10-raw-html).
- ⚠️ There is **no escape for a literal `{` in text** — any `{…}` is treated as interpolation. To display a literal brace, render it from an expression whose source contains no braces, e.g. `{String.fromCharCode(123)}` → `{`, or a variable: `const lb = "{"` then `{lb}`.

---

## 5. Attributes

### 5a. String attributes (class, style, title, href, id, …) — default

A literal string; use `{expr}` **inside** for dynamic parts. Native HTML keeps working untouched.

```html
<div class="card {state.active ? 'is-active' : ''}"></div>
<a href="/users/{state.user.id}" title="Open {state.user.name}">Profile</a>
<img src="/avatars/{state.user.id}.png" alt="avatar" />
<input id="field-{state.index}" type="text" />

<!-- dynamic inline style is just a string with {expr} (kebab-case CSS) -->
<div style="color:{state.color}; background:{state.bg}; padding:8px;">box</div>
```

### 5b. Code attributes — value is an expression

`when`, `each`, `key`, `on*`, and `html` evaluate their `""` value as JS (covered in their own sections below). Example:

```html
<if when="state.count > 0"> … </if>
<button onclick="inc()">+</button>
```

---

## 6. Events `on*`

Native `on*` attributes hold **code** (like real HTML). Two forms:

```html
<!-- method call(s) -->
<button onclick="inc()">+</button>
<button onclick="inc(), log()">multi</button>

<!-- inline arrow / function (extracted into a method automatically) -->
<input oninput="(e) => state.text = e.target.value" />
<button onclick="e => state.n++">no-paren arrow</button>
```

- Pass the DOM event with **`$event`**:

  ```html
  <input oninput="setValue($event)" />
  ```
- Comparison operators are fine inside an arrow body: `onclick="(e)=> { if (state.n > 0) dec() }"`.

> Event modifiers (`mode="prevent"`, `stop`, …) are **not** a feature — do it in the handler: `onsubmit="(e)=> { e.preventDefault(); save() }"`.

---

## 7. Conditionals — `<if>` / `<else-if>` / `<else>`

`when` is always a JS expression. The element is **added/removed** from the DOM.

```html
<if when="state.tab === 'a'">
  <p>Tab A</p>
</if>
<else-if when="state.tab === 'b'">
  <p>Tab B</p>
</else-if>
<else>
  <p>Fallback</p>
</else>
```

Comparison operators work as expected:

```html
<if when="state.count >= 5 && state.count < 10">in range</if>
```

---

## 8. Show / hide — `<show>`

Like `<if>`, but keeps the element in the DOM and toggles `display:none`.

```html
<show when="state.visible">
  <div class="panel">Always in the DOM; only visibility toggles.</div>
</show>
```

---

## 9. Loops — `<for>`

`each` is a JS expression. Three forms:

```html
<!-- array: "item of list" -->
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
</for>
```

### Keyed loops — `key`

When the loop body contains a **component**, add `key` so each instance (its state + DOM) is reused by **identity** across reorders/insertions/removals instead of by position:

```html
<for each="todo of state.todos" key="todo.id">
  <TodoRow todo="{todo}" />
</for>
```

> `key` only matters for **component** loops. On a loop of plain elements there is no per-item instance to preserve, so `key` is a harmless no-op.

---

## 10. Raw HTML

All interpolation is escaped by default. Opt out **only for trusted/sanitized HTML**. Two ways:

### `html="expr"` (element-level, Vue `v-html` style)

The element's content becomes the unescaped HTML of the expression (replaces any children):

```html
<div html="state.articleHtml"></div>
<span html="state.richText"></span>
```

### `olum.html(value)` (inline, per-value)

Use inside `{}` when you need raw HTML mixed with other text:

```html
<p>Intro: {olum.html(state.snippetHtml)} — end.</p>
```

Both are greppable opt-outs. Everything else stays auto-escaped.

---

## 11. Components & props

Use a component by its **PascalCase** tag. Import it in `<script>`.

```html
<script>
  import StatusBadge from "./StatusBadge";
  import CounterCard from "./CounterCard";
  const state = { score: 5, name: "Ann" };
</script>

<StatusBadge label="Online" color="#16a34a" />
<CounterCard title="Counter" initialValue="{state.score}" />
```

### Props rule

A prop is a **literal string by default**; a whole-value `prop="{expr}"` passes the expression's **real value/type** (number, object, …); `{}` **inside text** yields an interpolated string.

```html
<Comp
  title="Hello"               <!-- "Hello"     → string                -->
  count="{n + 1}"             <!-- 6           → number (type kept)    -->
  data="{state.user}"         <!-- {...}       → object (type kept)    -->
  greet="Hi {state.name}"     <!-- "Hi Ann"    → interpolated string   -->
/>
```

### Reading props in the child

```html
<!-- StatusBadge.html -->
<script>
  // props.label, props.color
  const mounted = () => console.log(props.label);
</script>
<span class="badge" style="color:{props.color}">{props.label}</span>
```

### Prop write-back (two-way to parent)

If a prop is passed a `state.X` (or another `props.X`), the child can assign to it and the change propagates up to the owner and re-renders:

```html
<!-- parent -->
<CounterCard initialValue="{state.score}" />

<!-- CounterCard.html: writing props.initialValue updates the parent's state.score -->
<script>
  const inc = () => { state.count++; props.initialValue = state.count; };
</script>
```

---

## 12. Slots — `{children}`

Content placed between a component's tags is available as `{children}` inside that component.

```html
<!-- parent -->
<CounterCard title="Score">
  <em>passed from the parent</em>
</CounterCard>

<!-- CounterCard.html -->
<div class="slot">{children}</div>
```

---

## 13. Two-way binding (manual)

There is no `model` attribute — bind manually with a value + an `oninput` handler:

```html
<input
  type="text"
  value="{state.text}"
  oninput="(e) => state.text = e.target.value"
/>
<p>Echo: {state.text}</p>
```

---

## 14. Watchers

Declare `const watcher = { ... }` with a function per `state` key; it fires on change with `(oldValue, newValue)`.

```html
<script>
  const state = { count: 0, log: "—" };
  const watcher = {
    count(old, next) {
      state.log = `count: ${old} → ${next}`;
    },
  };
</script>
<p>{state.count} — {state.log}</p>
```

---

## 15. Lifecycle hooks

Declare `mounted` and/or `unMounted` (note the capital **M**).

```html
<script>
  const mounted   = () => console.log("mounted ✓");
  const unMounted = () => console.log("removed from DOM");
</script>
```

- `mounted` runs when the component is inserted into the DOM.
- `unMounted` runs when it's removed (e.g. an `<if>` toggles it off, or a keyed list item is removed).

---

## 16. Scoped CSS

A component's `<style>` is automatically scoped — selectors only affect that component's elements. Just write normal CSS:

```html
<style>
  .title { color: #4f46e5; }   /* won't leak to other components */
</style>
<h1 class="title">Hello</h1>
```

---

## 17. Imports

Import child components (and any JS) in `<script>`. Import a component by its file (the `.html` compiles to `.js`):

```html
<script>
  import Navbar from "./components/Navbar";
  import { formatDate } from "./utils";
</script>
```

---

## 18. Routing & route params

Routing is **file-based**: every folder under `src/` with a `page.html` is a route, and a `[param]` folder is a dynamic segment. Place a `<router-view>` in your shell to render the matched page, and mark anchors with `link` for client-side navigation.

A dynamic segment's value is available in the page component through the `params` object — no config, no wiring. Hitting `/blog/[slug]` exposes the captured segment as `params.slug`, ready to use in `<script>` and the template:

```html
<!-- src/blog/[slug]/page.html -->
<script>
  const { slug } = params;
</script>

<h1>blog: {slug}</h1>
```

**History mode & the 404 page:**

- The router uses **history mode by default** (clean URLs like `/blog/hello`). If history mode isn't available it **falls back to hash mode** (`/#/blog/hello`).
- Add a `not-found.html` at the **root of your project's `src/` directory** and it becomes the default 404 page, rendered whenever no route matches.

> **Limitation — deeply nested dynamic segments.** A single dynamic segment like `/blog/[slug]` works. Chaining multiple dynamic segments in one path — e.g. `/user/[id]/[name]` — is **not tested yet** and may not resolve correctly. Stick to one dynamic segment per route for now.

---

## 19. Escaping & security (summary)

- **Default:** every text/attribute `{expr}` is HTML-escaped via `olum.esc` (prevents XSS and "special characters break the page" bugs).
- **Opt out** (trusted HTML only): `html="expr"` (element) or `olum.html(value)` (inline). Both are the deliberate, greppable bypass.

---

## 20. Not supported / common mistakes

OlumJS intentionally has **no naked braces** and **one way** to do each thing. These do **not** work:

| ✗ Don't write | ✓ Write instead | Why |
|---|---|---|
| `when={x}` / `each={x}` | `when="x"` / `each="x"` | values live in `""` |
| `value={state.x}` | `value="{state.x}"` | string attr + `{}` |
| `oninput={(e)=>…}` | `oninput="(e)=>…"` | events in `""` |
| `<Comp {a} />` | `<Comp a="{a}" />` | no shorthand |
| `<Comp a={a} />` | `<Comp a="{a}" />` | no naked-brace prop |
| `<img {src} />` | `<img src="{src}" />` | no shorthand |
| `:style="{…}"` | `style="color:{x}; …"` | string style + `{}` |
| `:title="x"` | `title="{x}"` | string attr + `{}` |
| `model="state.x"` | `value="{state.x}"` + `oninput` | bind manually |
| `mode="prevent"` | `e.preventDefault()` in the handler | no modifiers |
| literal `{` in text | `{String.fromCharCode(123)}` (or a `const` holding `"{"`) | any `{…}` is interpolated |
| lowercase component tag `<comp/>` | `<Comp/>` | components are PascalCase |

---

## 21. Quick reference

```html
<!-- TEXT (auto-escaped) -->
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
</Card>
```

---

## 22. Limitations

A few rough edges to be aware of today — each has a workaround by design.

**1. Re-renders rebuild the whole stateful component.** When a component has `state` and it changes, Olum rebuilds that entire component **including its inner child components**. Any live DOM state Olum doesn't track is lost in the rebuild: a playing `<video>` restarts, a running animation resets, and focused/typed-in form inputs lose their value and focus.

> **Avoid it by design:** keep the reactive `state` **outside** the component that holds the video / animation / form inputs. If that media component stays stateless, it never re-renders and its DOM state is preserved.

```html
<!-- ✗ state inside the media component → re-render restarts the video -->
<!-- MediaBox.html -->
<script>
  const state = { count: 0 };
  const inc = () => state.count++;
</script>
<video src="/clip.mp4" controls></video>
<button onclick="inc()">{state.count}</button>

<!-- ✓ lift state to the parent; keep the media component stateless -->
<!-- Parent.html -->
<script>
  const state = { count: 0 };
  const inc = () => state.count++;
</script>
<MediaBox />
<button onclick="inc()">{state.count}</button>
```

**2. No integrated unit testing.** There is no testing framework wired into OlumJS yet — no built-in runner or component testing utilities.

**3. Global store ergonomics.** There is already a global store across the whole app, plus the scope system (private/public attributes on the `<script>` tag) for exposing props/methods. It's a little awkward, though: a registered component's name isn't straightforward, so you reach it through its location key — e.g. `olum.app.store["page>App#0"]`.

> **For now:** use a single dedicated component for your store, put your props/methods in it, and access it by its location key:
>
> ```js
> olum.app.store["page>App#0"].user;
> olum.app.store["page>App#0"].login();
> ```

---

## Appendix — the design principle

OlumJS draws one line: **is the attribute fundamentally code or a string?** Native HTML already answers it (`onclick=""` is code, `class=""` is a string). Code-shaped attributes (`when`/`each`/`key`/`on*`/`html`) take an expression directly in `""`; everything else is a literal string with `{}` for the dynamic bits; text uses `{}` and is escaped unless you opt out. No naked braces, no colon-bindings, no special directives to memorize — just quotes, `{}`, and that one distinction.
