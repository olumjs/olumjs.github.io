import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Post } from "@/lib/blog-posts";

const filePath = path.join(process.cwd(), "data", "blog.json");

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Dev only" }, { status: 403 });
  }

  try {
    const post: Post = await req.json();
    if (!post.slug?.trim()) {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }

    let posts: Post[] = [];
    try {
      posts = JSON.parse(await readFile(filePath, "utf-8"));
    } catch {
      // file missing — start fresh
    }

    const idx = posts.findIndex((p) => p.slug === post.slug);
    if (idx !== -1) {
      // Preserve the featured flag across edits — it's toggled separately.
      const existing = posts[idx];
      posts[idx] = { ...post, ...(existing.featured ? { featured: true } : {}) };
    } else {
      posts.push(post);
    }

    await writeFile(filePath, JSON.stringify(posts, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
