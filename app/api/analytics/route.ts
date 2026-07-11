import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

// Dedicated collection for this site. Kept distinct from other projects that
// share the same Firebase Realtime Database so their data never collides.
const COL = "olum-analytics";

// GET /api/analytics?pw=<password>
// Returns the raw visit log for the dashboard. If ANALYTICS_PASSWORD is set,
// the request must supply a matching `pw`; otherwise the endpoint is open.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pw = searchParams.get("pw");
  const expected = process.env.ANALYTICS_PASSWORD;

  if (expected && pw !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const [metaSnap, recentSnap] = await Promise.all([
    db.ref(`${COL}/lastVisited`).get(),
    db.ref(`${COL}/recentVisits`).orderByKey().get(),
  ]);

  // Push keys are chronological, so reversing (unshift) yields newest-first.
  const recentVisits: unknown[] = [];
  if (recentSnap.exists()) {
    recentSnap.forEach((child) => {
      recentVisits.unshift({ key: child.key, ...child.val() });
    });
  }

  return NextResponse.json({
    ok: true,
    data: { lastVisited: metaSnap.val() ?? null, recentVisits },
  });
}

// POST /api/analytics
// Records a single page visit. Called by the client-side AnalyticsTracker.
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const { route, blogSlug, device, os, browser, timezone, referrer, ip } =
    body as Record<string, unknown>;

  if (typeof route !== "string" || !route) {
    return NextResponse.json({ ok: false, error: "route required" }, { status: 400 });
  }

  const deviceKey = typeof device === "string" ? device : "unknown";

  await db.ref(COL).update({ lastVisited: new Date().toISOString() });

  await db.ref(`${COL}/recentVisits`).push({
    route,
    device: deviceKey,
    timezone: typeof timezone === "string" ? timezone : "Unknown",
    os: typeof os === "string" ? os : "Unknown",
    browser: typeof browser === "string" ? browser : "Unknown",
    ts: Date.now(),
    ...(typeof blogSlug === "string" && blogSlug ? { blogSlug } : {}),
    ...(typeof referrer === "string" && referrer ? { referrer } : {}),
    ...(typeof ip === "string" && ip && ip !== "n/a" ? { ip } : {}),
  });

  return NextResponse.json({ ok: true });
}
