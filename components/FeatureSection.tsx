"use client";
import { useState, useRef } from "react";
import MiniIDE, { type IDEFile } from "@/components/MiniIDE";

/* ─── Live preview: Todo App ─────────────────────────────────── */
type Todo = { id: number; text: string; done: boolean };

function TodoApp() {
  const nextId = useRef(4);
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Try the Olum framework", done: false },
    { id: 2, text: "Build a todo app", done: true },
    { id: 3, text: "Ship something great", done: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const add = () => {
    const t = input.trim();
    if (!t) return;
    setTodos((p) => [...p, { id: nextId.current++, text: t, done: false }]);
    setInput("");
  };
  const toggle = (id: number) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: number) => setTodos((p) => p.filter((t) => t.id !== id));
  const clearDone = () => setTodos((p) => p.filter((t) => !t.done));

  const visible = filter === "active" ? todos.filter((t) => !t.done) : filter === "done" ? todos.filter((t) => t.done) : todos;

  return (
    <div className="flex flex-col items-center py-10 px-4" style={{ minHeight: 440, background: "var(--bg-alt)", height: "stretch" }}>
      <div className="w-full max-w-xs">
        <h1 className="text-xl font-bold text-center mb-5" style={{ color: "var(--fg)" }}>
          My Tasks
        </h1>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 4px var(--shadow-card)" }}
        >
          {/* Input */}
          <div className="p-3 flex gap-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Add a task…"
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg-2)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#25C97E")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            <button
              onClick={add}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg hover:brightness-105 active:scale-95 transition-all"
              style={{ background: "#25C97E" }}
            >
              Add
            </button>
          </div>

          {/* List */}
          <ul>
            {visible.length === 0 && (
              <li className="py-8 text-center text-xs font-mono" style={{ color: "var(--fg-subtle)" }}>
                {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
              </li>
            )}
            {visible.map((todo) => (
              <li key={todo.id} className="group flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <button
                  onClick={() => toggle(todo.id)}
                  className="w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all duration-150 cursor-pointer"
                  style={{
                    background: todo.done ? "#25C97E" : "transparent",
                    border: `1.5px solid ${todo.done ? "#25C97E" : "var(--border-hover)"}`,
                  }}
                  aria-checked={todo.done}
                  role="checkbox"
                >
                  {todo.done && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span
                  className="flex-1 text-sm cursor-pointer select-none"
                  onClick={() => toggle(todo.id)}
                  style={{ color: todo.done ? "var(--fg-subtle)" : "var(--fg-2)", textDecoration: todo.done ? "line-through" : "none" }}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => remove(todo.id)}
                  className="w-6 h-6 flex items-center justify-center rounded opacity-50 group-hover:opacity-100 transition-all text-base leading-none"
                  style={{ color: "var(--fg-2)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ef4444";
                    e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--fg-2)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
              {todos.filter((t) => !t.done).length} left
            </span>
            <div className="flex gap-0.5">
              {(["all", "active", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-2 py-1 text-xs rounded capitalize transition-colors"
                  style={filter === f ? { background: "rgba(37,201,126,0.1)", color: "#25C97E", fontWeight: 500 } : { color: "var(--fg-muted)" }}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={clearDone}
              className="text-xs transition-colors"
              style={{ color: "var(--fg-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
            >
              Clear done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── File definitions ──────────────────────────────────────── */
const files: IDEFile[] = [
  {
    name: "public/index.html",
    code:`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Olum Project</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="favicon.svg" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../src/main.css">
    <script defer src="/core/app.js"></script>
    <script defer type="module" src="../src/main.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`
  },
  {
    name: "public/favicon.svg",
    code:`<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31.5077 0C14.1785 0 0 14.1785 0 31.5077V480.492C0 497.822 14.1785 512 31.5077 512H133.908C151.237 512 165.415 497.822 165.415 480.492V165.415H480.492C497.822 165.415 512 151.237 512 133.908V31.5077C512 14.1785 497.822 0 480.492 0H31.5077ZM378.092 346.585C360.763 346.585 346.585 360.763 346.585 378.092V480.492C346.585 497.822 360.763 512 378.092 512H480.492C497.822 512 512 497.822 512 480.492V378.092C512 360.763 497.822 346.585 480.492 346.585H378.092Z" fill="#25C97E"/>
</svg>`
  },
  {
    name: "src/App.html",
    code:`<script>
  const state = {
    todos: [
      {id: 1, text: "Try the Olum framework", done: false },
      { id: 2, text: "Build a todo app", done: true },
      { id: 3, text: "Ship something great", done: false },
    ],
    input: "",
    nextId: 4,
    status: "all", // all | active | done
  }
  const add = () => {
    const t = state.input.trim()
    if (!t) return;
    const newTodos = Array.from(state.todos)
    newTodos.push({
      id: state.nextId++,
      text: t,
      done: false
    });
    state.todos = newTodos
    state.input = "";
  };
  const toggle = (id) => {
    state.todos = state.todos.map((t) =>
      t.id === id ? {
        id: t.id,
        text: t.text,
        done: !t.done
      } :
      t
    );
  };
  const remove = (id) => state.todos = state.todos.filter((t) => t.id !== id);
  const clearDone = () => state.todos = state.todos.map((t) => {
    return {
      id: t.id,
      text: t.text,
      done: false
    }
  });
  const filter = (status) => (state.status = status);
</script>

<div data-theme="light" class="flex flex-col items-center py-10 px-4" style="min-height: 440px;">
  <div class="w-full" style="max-width: 320px;">
    <div class="rounded-2xl overflow-hidden"
      style="background: var(--card); border: 1px solid var(--border); box-shadow: 0 1px 4px var(--shadow-card);">
      <div class="p-3 flex gap-2" style="border-bottom: 1px solid var(--border-subtle);">
        <input type="text" placeholder="Add a task…" class="task-input flex-1 px-3 py-2 text-sm rounded-lg" value={state.input} oninput={(e)=> state.input = e.target.value} />
        <button type="button" onclick="add()" class="add-btn px-4 py-2 text-sm font-semibold text-white rounded-lg">
          Add
        </button>
      </div>
      <ul>
        <for each={todo of state.todos} key={todo.id}>
          <if when={state.status=='all' || state.status=='active' && !todo.done || state.status=='done' && todo.done}>
            <li class="task-row flex items-center gap-3 px-4 py-3" style="border-bottom: 1px solid var(--border-subtle);">
              <span class="checkbox {todo.done?'checkbox-done':'checkbox-empty'}" onclick="toggle(todo.id)"></span>
              <span class="task-text flex-1 text-sm select-none {todo.done?'task-text-done':''}" onclick="toggle(todo.id)">{todo.text}</span>
              <button class="delete-btn" onclick="remove(todo.id)">×</button>
            </li>
          </if>
        </for>
      </ul>
      <div class="px-4 py-2 flex items-center justify-between" style="border-top: 1px solid var(--border-subtle);">
        <span class="text-xs" style="color: var(--fg-muted);">{state.todos.filter(todo => !todo.done).length} left</span>
        <div class="flex gap-0.5">
          <button class="filter-btn px-2 py-1 text-xs rounded capitalize {state.status == 'all' ? 'filter-btn-active' : ''}" onclick="filter('all')">all</button>
          <button class="filter-btn px-2 py-1 text-xs rounded capitalize  {state.status == 'active' ? 'filter-btn-active' : ''}" onclick="filter('active')">active</button>
          <button class="filter-btn px-2 py-1 text-xs rounded capitalize  {state.status == 'done' ? 'filter-btn-active' : ''}" onclick="filter('done')">done</button>
        </div>
        <button class="clear-btn text-xs" onclick="clearDone()">Clear done</button>
      </div>
    </div>
  </div>
</div>`
  },
  {
    name: "src/main.js",
    code:`import App from "./App.js";
new Olum().$("#app").use(App);
`
  },
  {
    name: "src/main.css",
    code:`:root {
  --bg: #09090b;
  --bg-alt: #0d0d0f;
  --card: #111113;
  --surface: #18181b;
  --surface-2: #1e1e20;
  --surface-hover: #1f1f22;
  --hover-overlay: rgba(255, 255, 255, 0.05);

  --fg: #fafafa;
  --fg-secondary: #d4d4d8;
  --fg-2: #a1a1aa;
  --fg-muted: #71717a;
  --fg-subtle: #52525b;

  --border: #27272a;
  --border-subtle: #1e1e20;
  --border-hover: #3f3f46;

  --glow: rgba(37, 201, 126, 0.12);
  --glow-sm: rgba(37, 201, 126, 0.18);
  --card-hover-bd: rgba(37, 201, 126, 0.38);
  --shadow-card: rgba(0, 0, 0, 0.5);

  --dot-color: rgba(113, 113, 122, 0.18);

  --accent: #25c97e;
  --accent-end: #25c97e;
}

/* ─── Light mode ───────────────────────────────────────── */
[data-theme="light"] {
  --bg: #ffffff;
  --bg-alt: #f9fafb;
  --card: #ffffff;
  --surface: #f4f4f5;
  --surface-2: #e4e4e7;
  --surface-hover: #ececed;
  --hover-overlay: rgba(0, 0, 0, 0.04);

  --fg: #0a0a0a;
  --fg-secondary: #27272a;
  --fg-2: #52525b;
  --fg-muted: #71717a;
  --fg-subtle: #a1a1aa;

  --border: #e4e4e7;
  --border-subtle: #f0f0f0;
  --border-hover: #d4d4d8;

  --glow: rgba(37, 201, 126, 0.08);
  --glow-sm: rgba(37, 201, 126, 0.12);
  --card-hover-bd: rgba(37, 201, 126, 0.4);
  --shadow-card: rgba(0, 0, 0, 0.08);

  --dot-color: rgba(0, 0, 0, 0.07);
}

/* Checkbox */
.checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox-empty {
  border: 1.5px solid var(--border-hover);
  background: transparent;
}
.checkbox-done {
  border: 1.5px solid #25c97e;
  background: #25c97e;
}

/* Task text */
.task-text {
  color: var(--fg-2);
}
.task-text-done {
  color: var(--fg-subtle);
  text-decoration: line-through;
}

/* Delete button — visible on row hover */
.delete-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--fg-2);
  opacity: 0;
  font-size: 18px;
  line-height: 1;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
}
.task-row:hover .delete-btn {
  opacity: 1;
}
.delete-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Filter buttons */
.filter-btn {
  color: var(--fg-muted);
}
.filter-btn-active {
  background: rgba(37, 201, 126, 0.1);
  color: #25c97e;
  font-weight: 500;
}

/* Clear done */
.clear-btn {
  color: var(--fg-muted);
  transition: color 0.15s;
}
.clear-btn:hover {
  color: #ef4444;
}

/* Add button */
.add-btn {
  background: #25c97e;
  transition: filter 0.15s;
}
.add-btn:hover {
  filter: brightness(1.05);
}
.add-btn:active {
  transform: scale(0.95);
}

/* Input focus */
.task-input {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--fg-2);
  outline: none;
  transition: border-color 0.15s;
}
.task-input:focus {
  border-color: #25c97e;
}
`
  },
  {
    name: "package.json",
    code:`{
  "name": "olum-app",
  "version": "0.1.0",
  "private": true,
  "description": "Olum App",
  "main": "index.js",
  "scripts": {
    "dev": "olum-compiler dev",
    "build": "olum-compiler build"
  },
  "author": "Eissa Saber",
  "dependencies": {
    "olum": "latest"
  },
  "devDependencies": {
    "olum-compiler": "latest"
  }
}`
  },
  {
    name: "tailwind.config.js",
    code:`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
}`
  }

];

/* ─── Section ───────────────────────────────────────────────── */
export default function FeatureSection() {
  return (
    <section className="py-24 sm:py-32 relative bg-[var(--bg)]" id="features">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(37,201,126,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#25C97E] tracking-widest uppercase mb-4 px-3 py-1.5 bg-[rgba(37,201,126,0.07)] border border-[rgba(37,201,126,0.15)] rounded-full">
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--fg)] leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
            Build in Seconds
            <br />
            <span className="gradient-text">With no Setup</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--fg-muted)] max-w-xl mx-auto">
            Signal-based reactivity makes interactive apps feel effortless. Explore the files or run the live preview.
          </p>
        </div>

        <MiniIDE
          projectName="todo-app"
          files={files}
          preview={<TodoApp />}
          defaultView="preview"
          defaultFile="src/App.html"
        />
      </div>
    </section>
  );
}
