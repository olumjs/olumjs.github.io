const testimonials = [
  {
    quote: "Olum completely changed how I think about frontend development. The signal-based reactivity feels like the future — intuitive, predictable, and blazing fast.",
    author: "Sarah Chen", role: "Lead Engineer", company: "Vercel", avatar: "SC", color: "#25C97E",
  },
  {
    quote: "We migrated 150k lines of Vue to Olum in two weeks. Bundle went from 340kb to 41kb. Core Web Vitals are all perfect green now. The ROI was immediate.",
    author: "Marcus Rodriguez", role: "CTO", company: "Prism Labs", avatar: "MR", color: "#25C97E",
  },
  {
    quote: "The DX is unmatched. TypeScript inference that actually works, HMR in under 50ms, and components that compose exactly how you'd expect. I can't go back.",
    author: "Aisha Patel", role: "Senior Frontend Engineer", company: "Stripe", avatar: "AP", color: "#25C97E",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-[var(--bg)]" id="community">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(37,201,126,0.25), transparent)" }}
      />
      <div className="absolute inset-0 bg-dot-grid opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#25C97E] tracking-widest uppercase mb-4 px-3 py-1.5 bg-[rgba(37,201,126,0.07)] border border-[rgba(37,201,126,0.15)] rounded-full">
            Community
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--fg)] leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Loved by developers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto">
            Don&apos;t take our word for it — hear from the engineers building with Olum every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card-glow relative flex flex-col gap-5 p-7 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
            >
              {/* Quote mark */}
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true" className="opacity-25">
                <path d="M0 20V13.6C0 10.4 0.666667 7.73333 2 5.6C3.33333 3.46667 5.46667 1.6 8.4 0L10.4 2.8C8.66667 3.73333 7.33333 4.86667 6.4 6.2C5.46667 7.53333 5 9.06667 5 10.8H9.2V20H0ZM16 20V13.6C16 10.4 16.6667 7.73333 18 5.6C19.3333 3.46667 21.4667 1.6 24.4 0L26.4 2.8C24.6667 3.73333 23.3333 4.86667 22.4 6.2C21.4667 7.53333 21 9.06667 21 10.8H25.2V20H16Z" fill={t.color} />
              </svg>

              <p className="text-sm sm:text-base text-[var(--fg-secondary)] leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#09090b] shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--fg)]">{t.author}</p>
                  <p className="text-xs text-[var(--fg-muted)]">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "24.2k", label: "GitHub Stars" },
            { value: "120k+", label: "Weekly Downloads" },
            { value: "4,800+", label: "Discord Members" },
            { value: "98%",   label: "Satisfaction Score" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl sm:text-4xl font-extrabold gradient-text"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {stat.value}
              </span>
              <span className="text-sm text-[var(--fg-muted)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
