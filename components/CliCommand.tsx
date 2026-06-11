import { CopyButton } from "@/components/CopyButton";

export default function CliCommand({ cmd, className = "" }: { cmd: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4 hover:border-[rgba(37,201,126,0.3)] transition-colors ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[var(--fg-subtle)] font-mono select-none">$</span>
        <code className="text-sm font-mono text-[var(--fg)] truncate">{cmd}</code>
      </div>
      <CopyButton text={cmd} />
    </div>
  );
}
