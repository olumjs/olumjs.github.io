"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarGroups } from "@/lib/docs-sections";

export default function DocsSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-24 overflow-y-auto max-h-[calc(100vh-6rem)] pr-2 scrollbar-thin">
        <nav className="space-y-6">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-subtle)] font-mono mb-2 px-3">
                {group.label}
              </h4>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                          active
                            ? "bg-[rgba(37,201,126,0.1)] text-[#25C97E] font-medium"
                            : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[rgba(255,255,255,0.04)]"
                        }`}
                      >
                        {active && (
                          <span className="w-1 h-1 rounded-full bg-[#25C97E]" />
                        )}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
