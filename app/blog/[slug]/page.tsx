import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { getPost, getAllSlugs } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(37,201,126,0.12), transparent 65%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[#25C97E] transition-colors mb-8 group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M12 7H2M6 3L2 7l4 4" />
            </svg>
            Back to Blog
          </Link>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2.5 py-1 rounded-full border"
                style={{
                  background: "rgba(37,201,126,0.07)",
                  border: "1px solid rgba(37,201,126,0.2)",
                  color: "#25C97E",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--fg)] leading-tight mb-6"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 pb-8 border-b border-[var(--border-subtle)]">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#09090b] shrink-0"
              style={{ background: post.author.color }}
            >
              {post.author.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--fg)]">{post.author.name}</p>
              <p className="text-xs text-[var(--fg-subtle)]">{post.author.role}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-[var(--fg-2)]">{post.date}</p>
              <p className="text-xs text-[var(--fg-subtle)] font-mono">{post.readTime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-6">
        {post.content.map((section, i) => {
          if (section.type === "h2") {
            return (
              <h2
                key={i}
                className="text-2xl sm:text-3xl font-extrabold text-[var(--fg)] mt-12 mb-2"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {section.text}
              </h2>
            );
          }
          if (section.type === "h3") {
            return (
              <h3
                key={i}
                className="text-xl font-bold text-[var(--fg)] mt-8 mb-1"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {section.text}
              </h3>
            );
          }
          if (section.type === "p") {
            return (
              <p key={i} className="text-base text-[var(--fg-2)] leading-relaxed">
                {section.text}
              </p>
            );
          }
          if (section.type === "ul") {
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {section.items?.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(37,201,126,0.15)", border: "1px solid rgba(37,201,126,0.3)" }}
                    >
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                        <polyline points="1.5,4 3,5.5 6.5,2" stroke="#25C97E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm text-[var(--fg-2)] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          if (section.type === "code") {
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-[var(--border)] my-6"
                style={{ background: "#0d0d0d" }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-2.5 border-b"
                  style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  {section.lang && (
                    <span className="ml-auto text-[10px] font-mono text-[rgba(255,255,255,0.25)] uppercase tracking-widest">
                      {section.lang}
                    </span>
                  )}
                </div>
                <pre className="overflow-x-auto px-5 py-4 text-sm font-mono leading-relaxed text-[#e2e8f0]">
                  <code>{section.text}</code>
                </pre>
              </div>
            );
          }
          if (section.type === "callout") {
            return (
              <div
                key={i}
                className="flex gap-4 rounded-xl p-5 my-6"
                style={{
                  background: "rgba(37,201,126,0.06)",
                  border: "1px solid rgba(37,201,126,0.2)",
                }}
              >
                <svg className="shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25C97E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-[var(--fg-2)] leading-relaxed">{section.text}</p>
              </div>
            );
          }
          return null;
        })}

        {/* Author card */}
        <div
          className="flex items-center gap-5 rounded-2xl p-6 mt-16"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-[#09090b] shrink-0"
            style={{ background: post.author.color }}
          >
            {post.author.avatar}
          </div>
          <div>
            <p className="font-bold text-[var(--fg)]" style={{ fontFamily: "var(--font-syne)" }}>
              {post.author.name}
            </p>
            <p className="text-sm text-[var(--fg-muted)]">{post.author.role} · Olum Team</p>
          </div>
        </div>

        {/* Back */}
        <div className="pt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg-muted)] hover:text-[#25C97E] transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M12 7H2M6 3L2 7l4 4" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
