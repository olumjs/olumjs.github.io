<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap — OlumJS</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #09090b;
            color: #e5e5e5;
            padding: 2rem 1rem;
            min-height: 100vh;
          }
          .container { max-width: 860px; margin: 0 auto; }
          header { margin-bottom: 2rem; border-bottom: 1px solid #222; padding-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; }
          header h1 { font-size: 1.5rem; font-weight: 600; color: #fff; }
          header .accent { color: #25C97E; }
          header p { margin-top: 0.4rem; font-size: 0.875rem; color: #888; }
          table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
          thead th {
            text-align: left;
            padding: 0.6rem 1rem;
            color: #888;
            font-weight: 500;
            border-bottom: 1px solid #222;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          tbody tr { border-bottom: 1px solid #161616; }
          tbody tr:hover { background: #111; }
          tbody td { padding: 0.65rem 1rem; vertical-align: middle; }
          a { color: #25C97E; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .meta { color: #666; font-size: 0.8rem; }
          .count { font-size: 0.8rem; color: #666; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div>
              <h1><span class="accent">OlumJS</span> Sitemap</h1>
              <p>XML Sitemap — generated for search engines</p>
            </div>
          </header>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td class="meta"><xsl:value-of select="substring(sitemap:lastmod,0,11)"/></td>
                  <td class="meta"><xsl:value-of select="sitemap:changefreq"/></td>
                  <td class="meta"><xsl:value-of select="sitemap:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <p class="count">
            <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs indexed
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
