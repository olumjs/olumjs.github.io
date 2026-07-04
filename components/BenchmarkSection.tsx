"use client";

const ecosystem = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
      </svg>
    ),
    name: "Olum Router",
    tag: "official",
    description: "File-based routing with dynamic segments, nested layouts, and async data loading. Zero-config, instant HMR.",
    links: [{ label: "Docs", href: "/docs" }, { label: "npm", href: "#" }],
    accent: "#25C97E",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polyline points="8 21 12 17 16 21" />
      </svg>
    ),
    name: "Olum DevTools",
    tag: "official",
    description: "Browser extension with component inspector, signal graph explorer, and time-travel debugging built in.",
    links: [{ label: "Chrome", href: "#" }, { label: "Firefox", href: "#" }],
    accent: "#25C97E",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    name: "create-olum",
    tag: "CLI",
    description: "Scaffold a new project in seconds. Choose from starter templates: minimal, full-stack, PWA, or library.",
    links: [{ label: "npm", href: "#" }, { label: "Guide", href: "/docs" }],
    accent: "#25C97E",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    name: "Olum Store",
    tag: "official",
    description: "Ergonomic global state built on the same signal primitives. No boilerplate, no selectors — just reactive stores.",
    links: [{ label: "Docs", href: "/docs" }, { label: "npm", href: "#" }],
    accent: "#25C97E",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
      </svg>
    ),
    name: "VS Code Extension",
    tag: "IDE",
    description: "Syntax highlighting, IntelliSense, auto-imports, and inline signal previews for `.olum` single-file components.",
    links: [{ label: "VSC Marketplace", href: "https://marketplace.visualstudio.com/items?itemName=eissapk.olum" }, { label: "VSX Marketplace", href: "https://open-vsx.org/extension/eissapk/olum" }],
    accent: "#25C97E",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    name: "Olum Testing",
    tag: "official",
    description: "First-class testing utilities. Mount components, trigger signals, and assert DOM output — all without a browser.",
    links: [{ label: "Docs", href: "/docs" }, { label: "npm", href: "#" }],
    accent: "#25C97E",
  },
];

export default function BenchmarkSection() {
  return (
    <section className="py-24 sm:py-32 bg-[var(--bg-alt)] relative" id="ecosystem">
      {/* Top separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(37,201,126,0.25), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#25C97E] tracking-widest uppercase mb-4 px-3 py-1.5 bg-[rgba(37,201,126,0.07)] border border-[rgba(37,201,126,0.15)] rounded-full">
            Ecosystem
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--fg)] leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Everything works
            <br />
            <span className="gradient-text">out of the box.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto">
            Official packages built and maintained by the Olum team — fully integrated, always up to date.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ecosystem.map((item) => (
            <div
              key={item.name}
              className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 flex flex-col gap-4 hover:border-[var(--card-hover-bd)] transition-all duration-300 hover:-translate-y-0.5"
              style={{ "--item-accent": item.accent } as React.CSSProperties}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 30% 20%, ${item.accent}0d 0%, transparent 65%)` }}
              />

              {/* Icon + tag */}
              <div className="relative flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${item.accent}18`,
                    border: `1px solid ${item.accent}30`,
                    color: item.accent,
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-[10px] font-mono font-semibold uppercase tracking-widest px-2 py-1 rounded-md"
                  style={{
                    background: `${item.accent}12`,
                    border: `1px solid ${item.accent}28`,
                    color: item.accent,
                  }}
                >
                  {item.tag}
                </span>
              </div>

              {/* Name + description */}
              <div className="relative flex flex-col gap-1.5">
                <h3
                  className="text-base font-bold text-[var(--fg)]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {item.name}
                </h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Links */}
              <div className="relative mt-auto flex items-center gap-3 pt-2 border-t border-[var(--border-subtle)]">
                {item.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs font-medium transition-colors duration-150"
                    style={{ color: "var(--fg-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = item.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
