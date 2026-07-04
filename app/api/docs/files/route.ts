import { NextResponse } from "next/server";
import { isRepoAllowed, getRepoDocMetas } from "@/lib/docs-content";

// GET /api/docs/files?repo=olumjs/olum&ref=<branch>
// Returns that branch's docs (slug/title/order) for the sidebar's file list.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");
  const ref = searchParams.get("ref");

  if (!repo || !ref) {
    return NextResponse.json({ error: "Missing repo or ref" }, { status: 400 });
  }
  // Only allow repos we actually serve (guards against arbitrary fetches).
  if (!isRepoAllowed(repo)) {
    return NextResponse.json({ error: "Unknown repo" }, { status: 400 });
  }

  try {
    const docs = await getRepoDocMetas(repo, ref);
    return NextResponse.json({ repo, ref, docs });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
