import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.shortTitle,
    description: siteConfig.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
