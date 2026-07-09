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
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--fg)] leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
            Build in Seconds
            <br />
            <span className="gradient-text">With no Setup</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--fg-muted)] max-w-xl mx-auto">
            Watch a todo app go from an empty file to running in under a minute — then build your own in the playground, no install required.
          </p>
        </div>

        <BuildDemo />
      </div>
    </section>
  );
}
