export default function PalestineSection() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-[var(--bg-alt)]">
      {/* Top separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(37,201,126,0.25), transparent)" }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          {/* Palestinian flag */}
          <div
            className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative"
            role="img"
            aria-label="Flag of Palestine"
          >
            <div className="w-full h-1/3" style={{ background: "#000000" }} />
            <div className="w-full h-1/3" style={{ background: "#FFFFFF" }} />
            <div className="w-full h-1/3" style={{ background: "#009639" }} />
            {/* Red triangle on the hoist side */}
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: "40%",
                background: "#EE2A35",
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              }}
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest uppercase mb-3 px-3 py-1.5 rounded-full border" style={{ color: "#009639", background: "rgba(0,150,57,0.08)", borderColor: "rgba(0,150,57,0.2)" }}>
              #StandWithPalestine
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[var(--fg)] leading-tight mb-2"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              We stand with Palestine
            </h2>
            <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed max-w-xl">
              Our thoughts are with the people of Palestine. If you can, please consider
              supporting humanitarian relief efforts.
            </p>
          </div>

          <a
            href="https://unrwa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
            style={{ background: "#009639", boxShadow: "0 0 30px rgba(0,150,57,0.25)" }}
          >
            Support Palestine
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
