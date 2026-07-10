import BuildDemo from "@/components/BuildDemo";

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
            <span className="h-1.5 w-1.5 rounded-full bg-[#25C97E] animate-pulse" />
            Live build · unedited
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--fg)] leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
            Blank File to Todo App
            <br />
            <span className="gradient-text">Before Your Coffee Gets Cold</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--fg-muted)] max-w-xl mx-auto">
            Start from an empty file and have a working app in under 5 minutes — no setup, no config. Watch it happen, then build your own.
          </p>
        </div>

        <BuildDemo />
      </div>
    </section>
  );
}
