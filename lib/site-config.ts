const FALLBACK_URL = "https://olumjs.top";

// Guard against a missing OR malformed NEXT_PUBLIC_SITE_URL. This value flows
// into `new URL(...)` (layout metadataBase), and because it's a NEXT_PUBLIC_
// var it's inlined into the client bundle — so an invalid value like a bare
// number would throw "Invalid URL" during module evaluation in the browser and
// take down the whole site. Fall back to the canonical URL instead.
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!raw) return FALLBACK_URL;
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_URL;
  }
}

const siteUrl = resolveSiteUrl();

export const siteConfig = {
  name: "OlumJS",
  url: siteUrl,
  domain: siteUrl.replace(/^https?:\/\//, ""),
  title: "OlumJS — The VanillaJS Developer's Platform",
  shortTitle: "OlumJS",
  description:
    "Build reactive, performant web applications with OlumJS — a small Vue/React-inspired UI framework with signal-based reactivity, scoped CSS, and a native-HTML template syntax. 8 kb gzipped.",
  shortDescription: "A small, Vue/React-inspired UI framework for the VanillaJS developer.",
  keywords: [
    "OlumJS",
    "JavaScript UI framework",
    "VanillaJS framework",
    "reactive UI framework",
    "signal-based reactivity",
    "frontend framework",
    "component-based JavaScript",
    "lightweight JavaScript framework",
    "8kb frontend framework",
    "olum",
    "JavaScript components",
    "frontend web development",
  ],
  themeColor: "#09090b",
  accentColor: "#25C97E",
  locale: "en_US",
  logo: `${siteUrl}/logo.png`,
  github: "https://github.com/olumjs",
  npm: "https://www.npmjs.com/package/olum",
  bluesky: "https://bsky.app/profile/olumjs.bsky.social",
  blueskyHandle: "@olumjs.bsky.social",
  // Canonical off-site profiles — feeds JSON-LD `sameAs` for entity resolution.
  sameAs: [
    "https://github.com/olumjs",
    "https://www.npmjs.com/package/olum",
    "https://bsky.app/profile/olumjs.bsky.social",
  ],
};
