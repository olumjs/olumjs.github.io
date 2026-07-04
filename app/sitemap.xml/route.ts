import { siteConfig } from "@/lib/site-config";
import { getDocOrder } from "@/lib/docs-content";

const today = new Date().toISOString().split("T")[0];

export async function GET() {
  const docOrder = await getDocOrder();
  const staticRoutes = [
    { url: siteConfig.url, changefreq: "monthly", priority: "1.0", lastmod: today },
  ];

  const docRoutes = docOrder.map((href) => ({
    url: `${siteConfig.url}${href}`,
    changefreq: "monthly",
    priority: href === "/docs" ? "0.9" : "0.8",
    lastmod: today,
  }));

  const allRoutes = [...staticRoutes, ...docRoutes];

  const urlEntries = allRoutes
    .map(({ url, lastmod, changefreq, priority }) =>
      [
        `  <url>`,
        `    <loc>${url}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        `  </url>`,
      ].join("\n")
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
