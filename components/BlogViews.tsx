import { formatViews } from "@/lib/utils";

// Small "N views" badge fed by the analytics visit log. Renders nothing until
// the post has at least one recorded visit, so fresh posts don't show "0".
// The leading "·" separates it from the preceding meta text (reading time)
// and disappears together with the badge.
export default function BlogViews({ views }: { views: number }) {
  if (!views) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--fg-subtle)]">
      <span className="me-0.5" aria-hidden="true">·</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
      {formatViews(views)}
    </span>
  );
}
