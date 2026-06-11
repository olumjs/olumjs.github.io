import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Docs" };

const INSTALL_CODE = `# npm
npm install olum

# pnpm
pnpm add olum

# yarn
yarn add olum`;

const QUICKSTART_CODE = `npx create-olum@latest my-app
cd my-app
npm install
npm run dev`;

const HELLO_CODE = `// src/App.olum
import { signal } from 'olum'

export default function App() {
  const name = signal('World')

  return (
    <div class="app">
      <h1>Hello, {name}!</h1>
      <input
        value={name}
        on:input={(e) => name.value = e.target.value}
        placeholder="Type a name..."
      />
    </div>
  )
}`;

const MAIN_CODE = `// src/main.ts
import { createApp } from 'olum'
import App from './App.olum'

createApp(App).mount('#app')`;

const sidebarGroups = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs", active: true },
      { label: "Installation", href: "/docs" },
      { label: "Quick Start", href: "/docs" },
      { label: "Project Structure", href: "/docs" },
    ],
  },
  {
    label: "Core Concepts",
    items: [
      { label: "Components", href: "/docs" },
      { label: "Reactivity & Signals", href: "/docs" },
      { label: "Lifecycle Hooks", href: "/docs" },
      { label: "Template Syntax", href: "/docs" },
      { label: "Props & Emits", href: "/docs" },
      { label: "Slots", href: "/docs" },
    ],
  },
  {
    label: "Router",
    items: [
      { label: "File-Based Routing", href: "/docs" },
      { label: "Navigation", href: "/docs" },
      { label: "Dynamic Routes", href: "/docs" },
      { label: "Route Guards", href: "/docs" },
      { label: "Data Loading", href: "/docs" },
    ],
  },
  {
    label: "State Management",
    items: [
      { label: "Pinia Store", href: "/docs" },
      { label: "Signals vs Store", href: "/docs" },
      { label: "Devtools", href: "/docs" },
    ],
  },
  {
    label: "Advanced",
    items: [
      { label: "Server-Side Rendering", href: "/docs" },
      { label: "Static Generation", href: "/docs" },
      { label: "TypeScript Guide", href: "/docs" },
      { label: "Testing", href: "/docs" },
      { label: "Performance", href: "/docs" },
    ],
  },
  {
    label: "Deployment",
    items: [
      { label: "Build", href: "/docs" },
      { label: "Vercel", href: "/docs" },
      { label: "Netlify", href: "/docs" },
      { label: "Edge", href: "/docs" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex gap-8 py-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 overflow-y-auto max-h-[calc(100vh-6rem)] pr-2 scrollbar-thin">
              <nav className="space-y-6">
                {sidebarGroups.map((group) => (
                  <div key={group.label}>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-subtle)] font-mono mb-2 px-3">
                      {group.label}
                    </h4>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                              item.active
                                ? "bg-[rgba(37,201,126,0.1)] text-[#25C97E] font-medium"
                                : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[rgba(255,255,255,0.04)]"
                            }`}
                          >
                            {item.active && (
                              <span className="w-1 h-1 rounded-full bg-[#25C97E]" />
                            )}
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[var(--fg-subtle)] font-mono mb-8">
              <Link href="/" className="hover:text-[#25C97E] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/docs" className="hover:text-[#25C97E] transition-colors">
                Docs
              </Link>
              <span>/</span>
              <span className="text-[#25C97E]">Introduction</span>
            </div>

            {/* Content */}
            <article className="prose-custom max-w-3xl">
              {/* Title */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#25C97E] tracking-widest uppercase mb-4 px-3 py-1.5 bg-[rgba(37,201,126,0.07)] border border-[rgba(37,201,126,0.15)] rounded-full">
                  Getting Started
                </div>
                <h1
                  className="text-4xl sm:text-5xl font-extrabold text-[var(--fg)] leading-tight mb-4"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Introduction
                </h1>
                <p className="text-lg text-[var(--fg-2)] leading-relaxed">
                  Olum is a progressive frontend framework for building reactive user
                  interfaces. It combines signal-based reactivity with a familiar
                  component model and compile-time optimizations for exceptional
                  performance out of the box.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--border-subtle)] mb-10" />

              {/* What is Olum */}
              <section className="mb-12">
                <h2
                  className="text-2xl font-bold text-[var(--fg)] mb-4"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  What is Olum?
                </h2>
                <p className="text-[var(--fg-2)] leading-relaxed mb-4">
                  Unlike frameworks that use a virtual DOM, Olum compiles your
                  components at build time into optimized JavaScript. The result is
                  smaller bundles, faster load times, and better Core Web Vitals —
                  without sacrificing developer experience.
                </p>
                <p className="text-[var(--fg-2)] leading-relaxed">
                  At its core, Olum is built on three ideas:
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    {
                      title: "Signals first",
                      desc: "Fine-grained reactivity with no virtual DOM overhead.",
                    },
                    {
                      title: "Compile-time magic",
                      desc: "Your templates are compiled to surgical DOM updates.",
                    },
                    {
                      title: "Progressive adoption",
                      desc: "Start small and scale to full SSR/SSG as you grow.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#25C97E] shrink-0" />
                      <div>
                        <span className="font-semibold text-[var(--fg)]">
                          {item.title}:
                        </span>{" "}
                        <span className="text-[var(--fg-2)]">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Quick Start */}
              <section className="mb-12">
                <h2
                  className="text-2xl font-bold text-[var(--fg)] mb-4"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Quick Start
                </h2>
                <p className="text-[var(--fg-2)] leading-relaxed mb-5">
                  The fastest way to get started is with the official CLI. It
                  scaffolds a full project with TypeScript, routing, and dev server
                  configured:
                </p>
                <CodeBlock code={QUICKSTART_CODE} filename="Terminal" showCopy />
              </section>

              {/* Installation */}
              <section className="mb-12">
                <h2
                  className="text-2xl font-bold text-[var(--fg)] mb-4"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Manual Installation
                </h2>
                <p className="text-[var(--fg-2)] leading-relaxed mb-5">
                  Prefer to set things up yourself? Install Olum into an existing
                  project:
                </p>
                <CodeBlock code={INSTALL_CODE} filename="Terminal" showCopy />
              </section>

              {/* Hello World */}
              <section className="mb-12">
                <h2
                  className="text-2xl font-bold text-[var(--fg)] mb-4"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Your First Component
                </h2>
                <p className="text-[var(--fg-2)] leading-relaxed mb-5">
                  Olum components live in <code className="text-[#25C97E] bg-[rgba(37,201,126,0.08)] px-1.5 py-0.5 rounded font-mono text-sm">.olum</code> files.
                  Here&apos;s a reactive greeting with a live input:
                </p>
                <div className="space-y-4">
                  <CodeBlock code={HELLO_CODE} filename="src/App.olum" showCopy />
                  <CodeBlock code={MAIN_CODE} filename="src/main.ts" showCopy />
                </div>
              </section>

              {/* Info box */}
              <div className="flex gap-4 p-5 rounded-xl bg-[rgba(37,201,126,0.06)] border border-[rgba(37,201,126,0.2)] mb-12">
                <span className="text-xl mt-0.5">💡</span>
                <div>
                  <p className="text-sm font-semibold text-[#25C97E] mb-1">
                    TypeScript is optional but recommended
                  </p>
                  <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                    Olum has first-class TypeScript support. All official packages
                    ship with types. When using TypeScript, your props, emits, and
                    slots are automatically inferred from your component definition.
                  </p>
                </div>
              </div>

              {/* Next steps */}
              <section>
                <h2
                  className="text-2xl font-bold text-[var(--fg)] mb-6"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Next Steps
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Core Concepts",
                      desc: "Learn about components, reactivity, and the template syntax.",
                      href: "/docs",
                      icon: "📖",
                    },
                    {
                      title: "Router Guide",
                      desc: "Add file-based routing to your Olum application.",
                      href: "/docs",
                      icon: "🗺️",
                    },
                    {
                      title: "State Management",
                      desc: "Manage global state with the official @olum/store.",
                      href: "/docs",
                      icon: "🗄️",
                    },
                    {
                      title: "Examples",
                      desc: "Browse real-world examples and starter templates.",
                      href: "/docs",
                      icon: "✨",
                    },
                  ].map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className="card-glow flex gap-4 p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] group"
                    >
                      <span className="text-2xl mt-0.5">{card.icon}</span>
                      <div>
                        <h3 className="font-semibold text-[var(--fg)] group-hover:text-[#25C97E] transition-colors mb-1">
                          {card.title}
                        </h3>
                        <p className="text-sm text-[var(--fg-muted)]">{card.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Pagination */}
              <div className="flex justify-end mt-16 pt-8 border-t border-[var(--border-subtle)]">
                <Link
                  href="/docs"
                  className="flex items-center gap-2 text-sm text-[#25C97E] hover:text-[#25C97E] transition-colors font-medium"
                >
                  Installation
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 7h10M8 3l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </article>
          </main>

          {/* Right: Table of contents */}
          <aside className="hidden xl:block w-52 shrink-0">
            <div className="sticky top-24">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-subtle)] font-mono mb-3">
                On this page
              </h4>
              <nav className="space-y-1">
                {[
                  "What is Olum?",
                  "Quick Start",
                  "Manual Installation",
                  "Your First Component",
                  "Next Steps",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-xs text-[var(--fg-subtle)] hover:text-[#25C97E] py-1 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
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
