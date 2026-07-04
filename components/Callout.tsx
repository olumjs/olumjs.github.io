import type { ReactNode } from "react";

type CalloutType = "tip" | "warn" | "danger" | "note";

const STYLES: Record<CalloutType, { box: string; icon: string }> = {
  tip:    { box: "bg-[rgba(37,201,126,0.06)] border-[rgba(37,201,126,0.2)]", icon: "💡" },
  warn:   { box: "bg-[rgba(255,200,0,0.06)] border-[rgba(255,200,0,0.2)]",   icon: "⚠️" },
  danger: { box: "bg-[rgba(255,50,50,0.06)] border-[rgba(255,50,50,0.2)]",   icon: "🚨" },
  note:   { box: "bg-[var(--card)] border-[var(--border)]",                  icon: "" },
};

export function Callout({
  type = "note",
  icon,
  label,
  children,
}: {
  type?: string;
  icon?: string;
  label?: string;
  children: ReactNode;
}) {
  const style = STYLES[(type as CalloutType) in STYLES ? (type as CalloutType) : "note"];
  const shownIcon = icon || style.icon;

  return (
    <div className={`callout my-6 flex gap-4 p-5 rounded-xl border ${style.box}`}>
      {shownIcon && <span className="text-xl mt-0.5 shrink-0">{shownIcon}</span>}
      <div className="min-w-0 flex-1 text-sm text-[var(--fg-2)] leading-relaxed [&>*:last-child]:mb-0">
        {label && (
          <p className="font-semibold text-[var(--fg)] mb-2" style={{ fontFamily: "var(--font-syne)" }}>
            {label}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
