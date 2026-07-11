import type { NextConfig } from "next";
import { getPlaygroundGroups } from "./lib/playground-examples.server";
import { defaultExample } from "./lib/playground-examples";

const nextConfig: NextConfig = {
  async redirects() {
    // Land the bare playground on the first example. Derive it from the starter
    // repo, falling back to the known first example if GitHub is unreachable.
    let defaultSlug = "introduction/hello-world";
    try {
      defaultSlug = (defaultExample(await getPlaygroundGroups())?.slug) ?? defaultSlug;
    } catch {
      /* offline/rate-limited — keep the fallback */
    }
    return [
      { source: "/playground", destination: `/playground/${defaultSlug}`, permanent: false },
    ];
  },
  async headers() {
    // The StackBlitz embed on the playground is a WebContainers project, which
    // relies on SharedArrayBuffer and therefore requires the embedding page to
    // be cross-origin isolated. Scope these headers to the playground routes
    // only so the rest of the site is unaffected. COEP `credentialless` lets the
    // cross-origin StackBlitz iframe load without needing CORP opt-in.
    const isolation = [
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
    ];
    return [
      { source: "/playground", headers: isolation },
      { source: "/playground/:path*", headers: isolation },
    ];
  },
};

export default nextConfig;
