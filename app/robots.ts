import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep internal API routes and the redirected /blog space out of the index.
    // Versioned doc URLs (?repo=&ref=) are de-duplicated via canonical tags, so
    // they stay crawlable but don't create duplicate-content entries.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/blog"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
