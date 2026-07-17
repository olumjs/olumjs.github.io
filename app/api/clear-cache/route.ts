import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { DOCS_TAG } from "@/lib/docs-content";
import { PLAYGROUND_TAG, clearPlaygroundCache } from "@/lib/playground-examples.server";

// GET /api/clear-cache
// Invalidates the cached docs and playground examples so the next request
// refetches them from GitHub.
//
// Always protected: the request MUST include a `?secret=…` (or
// `x-revalidate-secret` header) that matches REVALIDATE_SECRET. If that env var
// is unset, the endpoint is disabled entirely — it never runs unauthenticated.
export async function GET(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Endpoint disabled: REVALIDATE_SECRET is not configured." },
      { status: 503 },
    );
  }
  const provided = new URL(request.url).searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Invalid or missing secret." }, { status: 401 });
  }

  // "max" → stale-while-revalidate: entries are marked stale and refetched in
  // the background on the next visit (recommended over the deprecated 1-arg form).
  revalidateTag(DOCS_TAG, "max");
  revalidateTag(PLAYGROUND_TAG, "max");
  // The playground also keeps an in-process memo and an on-disk tree cache that
  // the fetch tag doesn't cover — drop those too.
  await clearPlaygroundCache();

  return NextResponse.json({
    revalidated: true,
    tags: [DOCS_TAG, PLAYGROUND_TAG],
    now: new Date().toISOString(),
  });
}
