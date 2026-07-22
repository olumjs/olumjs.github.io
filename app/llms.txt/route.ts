import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const content = await readFile(path.join(process.cwd(), "app/llms.txt/llms.txt"), "utf-8");

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
