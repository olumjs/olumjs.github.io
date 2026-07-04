import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { DOCS_TAG } from "@/lib/docs-content";

// GET /api/clear-cache
// Invalidates the cached docs so the next request refetches them from GitHub.
//
// Optional protection: if REVALIDATE_SECRET is set, the request must include a
// matching `?secret=…` (or `x-revalidate-secret` header). Without that env var
// the endpoint is open — set it in production to prevent abuse.
export async function GET(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret) {
    const provided =
      new URL(request.url).searchParams.get("secret") ??
      request.headers.get("x-revalidate-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Invalid or missing secret." }, { status: 401 });
    }
  }

  // "max" → stale-while-revalidate: docs are marked stale and refetched in the
  // background on the next visit (recommended over the deprecated 1-arg form).
  revalidateTag(DOCS_TAG, "max");

  return NextResponse.json({
    revalidated: true,
    tag: DOCS_TAG,
    now: new Date().toISOString(),
  });
}
