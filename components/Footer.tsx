import Link from "next/link";
import Image from "next/image";

const links = {
  Framework: [
    { label: "Introduction", href: "/docs/#intro" },
    { label: "Quick Start", href: "/docs/#quick-start" },
    { label: "Examples", href: "/docs/#examples" },
    // { label: "Changelog", href: "/blog/changlog" },
    // { label: "Roadmap", href: "/roadmap" },
  ],
  Ecosystem: [
    { label: "Router", href: "router.olumjs.top" },
    { label: "Extension", href: "vsc.olumjs.top" },
    { label: "Devtool", href: "devtool.olumjs.top" },
  ],
  Community: [
    { label: "GitHub", href: "https://github.com/olumjs" },
    { label: "Twitter", href: "https://x.com/olumjs" },
    { label: "Blog", href: "/blog" },
  ],
  Resources: [
    { label: "Docs", href: "/docs" },
    { label: "API Reference", href: "/docs/#api" },
    { label: "Templates", href: "/templates" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 xl:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.svg" width={24} height={24} alt="Olum logo" />
              <span className="text-lg font-bold text-[var(--fg)] relative top-[2px]" style={{ fontFamily: "var(--font-syne)" }}>
                Olum
              </span>
            </Link>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6">The fastest way to turn ideas into apps for hackathons.</p>
            <div className="flex items-center gap-3">
              {[
                {
                  link: "https://github.com/olumjs",
                  label: "GitHub",
                  path: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z",
                },
                {
                  link: "https://x.com/olumjs",
                  label: "Twitter",
                  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label={s.label}>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-[var(--fg)] mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:justify-between">
            {/* Radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 100% at 0% 50%, var(--glow), transparent)" }}
            />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[rgba(37,201,126,0.1)] border border-[rgba(37,201,126,0.2)] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25C97E">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--fg)]" style={{ fontFamily: "var(--font-syne)" }}>
                  Sponsor Olum
                </h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">Help keep Olum free and open source.</p>
              </div>
            </div>
            <a
              href="https://github.com/sponsors/olumjs"
              className="relative flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#25C97E] rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-[0_0_40px_rgba(37,201,126,0.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Sponsor
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--fg-subtle)]">© {new Date().getFullYear()} Olum contributors. MIT License.</p>
          <div className="flex items-center gap-1 text-sm text-[var(--fg-subtle)]">
            <span>Made with</span>
            <span className="text-[#25C97E]">♥</span>
            <span>by the Community </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
