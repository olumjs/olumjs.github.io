import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Playground from "@/components/Playground";
import { siteConfig } from "@/lib/site-config";
import { getPlaygroundGroups } from "@/lib/playground-examples.server";
import {
  flattenExamples,
  defaultExample,
  findExample,
} from "@/lib/playground-examples";

interface Props {
  params: Promise<{ example?: string[] }>;
}

// Prerender /playground and every /playground/<group>/<item>.
export async function generateStaticParams() {
  const groups = await getPlaygroundGroups();
  return [
    { example: [] as string[] },
    ...flattenExamples(groups).map((e) => ({ example: e.slug.split("/") })),
  ];
}

// Resolve the optional catch-all segments to a known example slug, or null.
async function resolveSlug(segments?: string[]): Promise<string | null> {
  const groups = await getPlaygroundGroups();
  if (!segments || segments.length === 0) return defaultExample(groups)?.slug ?? null;
  const slug = segments.join("/");
  return findExample(groups, slug) ? slug : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { example } = await params;
  const groups = await getPlaygroundGroups();
  const slug = await resolveSlug(example);
  const found = slug ? findExample(groups, slug) : null;
  const fallback = defaultExample(groups)?.slug;

  const title = found ? `${found.title} — OlumJS Playground` : "Playground — OlumJS";
  const description = found
    ? `Try the “${found.title}” OlumJS example live in your browser — edit it and see it run, no install required.`
    : "Try OlumJS in your browser — an interactive playground where you can edit components and see them run live, no install required.";
  // Bare /playground and its default example are the same page; canonicalise
  // both onto the slugged URL so ranking signals consolidate.
  const canonical = `${siteConfig.url}/playground/${slug ?? fallback ?? ""}`;

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
  const groups = await getPlaygroundGroups();
  const slug = await resolveSlug(example);
  if (!slug) notFound();

  return <Playground groups={groups} initialSlug={slug} />;
}
