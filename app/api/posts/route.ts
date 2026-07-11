import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { Post } from "@/lib/blog-posts";

const filePath = path.join(process.cwd(), "data", "blog.json");

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Dev only" }, { status: 403 });
  }

  try {
    const raw = await readFile(filePath, "utf-8");
    const posts: Post[] = JSON.parse(raw);
    return NextResponse.json({ ok: true, posts });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
