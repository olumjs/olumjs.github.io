import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Post } from "@/lib/blog-posts";

const filePath = path.join(process.cwd(), "data", "blog.json");

export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Dev only" }, { status: 403 });
  }

  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }

    const posts: Post[] = JSON.parse(await readFile(filePath, "utf-8"));
    const filtered = posts.filter((p) => p.slug !== slug);

    if (filtered.length === posts.length) {
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    await writeFile(filePath, JSON.stringify(filtered, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
