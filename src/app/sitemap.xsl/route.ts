export const dynamic = "force-static";

// XSLT stylesheet for /sitemap.xml — browsers apply it to render a clean,
// human-readable table, while crawlers ignore it and read the raw XML.
// Served from a route handler so the Content-Type is reliably text/xsl.
const XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="vi">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap — VERITY GEAR</title>
        <style>
          :root { color-scheme: light dark; }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fafaf9; color: #0a0a0a; }
          .wrap { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
          h1 { font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 4px; }
          .sub { color: #6b6b6b; font-size: 14px; margin: 0 0 24px; }
          .count { display: inline-block; margin-bottom: 16px; font-size: 13px; font-weight: 600; background: #0a0a0a; color: #fafaf9; padding: 4px 12px; border-radius: 999px; }
          table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e5e5; }
          th, td { text-align: left; padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #eee; vertical-align: top; }
          th { background: #f5f5f4; text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; color: #6b6b6b; }
          tr:hover td { background: #fafafa; }
          a { color: #1d4ed8; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .alt { font-size: 12px; color: #6b6b6b; }
          .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
          .muted { color: #9ca3af; white-space: nowrap; }
          @media (prefers-color-scheme: dark) {
            body { background: #0a0a0a; color: #fafaf9; }
            .sub, th, .alt { color: #a1a1aa; }
            table { background: #141414; border-color: #272727; }
            th { background: #1c1c1c; }
            td { border-color: #272727; }
            tr:hover td { background: #1a1a1a; }
            .count { background: #fafaf9; color: #0a0a0a; }
            a { color: #93c5fd; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>VERITY GEAR — Sitemap</h1>
          <p class="sub">Danh sách URL gửi tới công cụ tìm kiếm. Trang này chỉ để xem cho dễ — Google đọc dữ liệu XML gốc.</p>
          <div class="count"><xsl:value-of select="count(s:urlset/s:url)"/> URL</div>
          <table>
            <thead>
              <tr>
                <th>URL (Tiếng Việt)</th>
                <th>Ngôn ngữ khác</th>
                <th>Cập nhật</th>
                <th>Tần suất</th>
                <th class="num">Ưu tiên</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td class="alt">
                    <xsl:for-each select="xhtml:link">
                      <div><xsl:value-of select="@hreflang"/>: <a href="{@href}"><xsl:value-of select="@href"/></a></div>
                    </xsl:for-each>
                  </td>
                  <td class="muted">
                    <xsl:value-of select="substring(s:lastmod, 1, 10)"/>
                  </td>
                  <td class="muted"><xsl:value-of select="s:changefreq"/></td>
                  <td class="num"><xsl:value-of select="s:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export async function GET() {
  return new Response(XSL, {
    headers: {
      "Content-Type": "text/xsl; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
