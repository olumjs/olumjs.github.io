const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://olumjs.github.io";

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
  github: "https://github.com/olumjs",
  npm: "https://www.npmjs.com/package/olum",
  twitterHandle: "@olumjs",
};
