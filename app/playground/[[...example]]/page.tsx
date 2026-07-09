import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Playground from "@/components/Playground";
import { siteConfig } from "@/lib/site-config";
import {
  playgroundExamples,
  defaultExampleSlug,
  findExample,
} from "@/lib/playground-examples";

interface Props {
  params: Promise<{ example?: string[] }>;
}

// Prerender /playground and every /playground/<slug>.
export function generateStaticParams() {
  return [
    { example: [] as string[] },
    ...playgroundExamples.map((e) => ({ example: [e.slug] })),
  ];
}

// Resolve the optional catch-all segment to a known example slug, or null.
function resolveSlug(segments?: string[]): string | null {
  if (!segments || segments.length === 0) return defaultExampleSlug;
  if (segments.length > 1) return null;
  return findExample(segments[0]) ? segments[0] : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { example } = await params;
  const slug = resolveSlug(example);
  const found = slug ? findExample(slug) : null;

  const title = found ? `${found.title} — OlumJS Playground` : "Playground — OlumJS";
  const description = found
    ? `Try the “${found.title}” OlumJS example live in your browser — edit it and see it run, no install required.`
    : "Try OlumJS in your browser — an interactive playground where you can edit components and see them run live, no install required.";
  // Bare /playground and its default example are the same page; canonicalise
  // both onto the slugged URL so ranking signals consolidate.
  const canonical = `${siteConfig.url}/playground/${slug ?? defaultExampleSlug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
    },
  };
}

export default async function PlaygroundPage({ params }: Props) {
  const { example } = await params;
  const slug = resolveSlug(example);
  if (!slug) notFound();

  return <Playground initialSlug={slug} />;
}
