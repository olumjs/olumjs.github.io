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
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }

    const posts: Post[] = JSON.parse(await readFile(filePath, "utf-8"));

    if (!posts.find((p) => p.slug === slug)) {
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    // Exactly one post is featured at a time.
    const updated = posts.map((p) => {
      if (p.slug === slug) return { ...p, featured: true };
      if (!p.featured) return p;
      const rest = { ...p };
      delete rest.featured;
      return rest;
    });

    await writeFile(filePath, JSON.stringify(updated, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
