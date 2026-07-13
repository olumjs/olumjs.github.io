// Server-side helpers that derive blog view counts from the analytics visit
// log. A "view" is one visit to /blog/<slug> recorded by AnalyticsTracker —
// there is no separate counter to keep in sync.

// Dedicated collection for this site. Kept distinct from other projects that
// share the same Firebase Realtime Database so their data never collides.
export const ANALYTICS_COL = "olum-analytics";

async function fetchRecentVisits() {
  // Imported lazily so a build without Firebase credentials degrades to zero
  // views (via the callers' catch) instead of failing at module load.
  const { db } = await import("@/lib/firebaseAdmin");
  return db.ref(`${ANALYTICS_COL}/recentVisits`).get();
}

export async function getBlogViewsBySlug(slug: string): Promise<number> {
  try {
    const snap = await fetchRecentVisits();
    if (!snap.exists()) return 0;
    let count = 0;
    snap.forEach((child) => {
      if (child.val()?.blogSlug === slug) count++;
    });
    return count;
  } catch {
    return 0;
  }
}

export async function getAllBlogViews(): Promise<Record<string, number>> {
  try {
    const snap = await fetchRecentVisits();
    if (!snap.exists()) return {};
    const counts: Record<string, number> = {};
    snap.forEach((child) => {
      const slug = child.val()?.blogSlug;
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    });
    return counts;
  } catch {
    return {};
  }
}
