import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { sectionMeta } from "@/lib/docs-sections";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const meta = sectionMeta[slug];
  const title = meta?.title ?? "Docs";
  const group = meta?.group ?? "OlumJS";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#09090b",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1000,
            height: 700,
            background: "radial-gradient(ellipse at 50% 20%, rgba(37,201,126,0.1) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Group badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(37,201,126,0.08)",
            border: "1px solid rgba(37,201,126,0.25)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 44,
          }}
        >
          <span style={{ color: "#25C97E", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {group}
          </span>
        </div>

        {/* Section title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f0f0f2",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#52525b", fontSize: 20, fontWeight: 500 }}>OlumJS</span>
          <span style={{ color: "#3f3f46", fontSize: 20 }}>›</span>
          <span style={{ color: "#52525b", fontSize: 20, fontWeight: 500 }}>Docs</span>
          <span style={{ color: "#3f3f46", fontSize: 20 }}>›</span>
          <span style={{ color: "#71717a", fontSize: 20, fontWeight: 500 }}>{title}</span>
        </div>

        {/* URL */}
        <div style={{ position: "absolute", bottom: 60, right: 100, color: "#25C97E", fontSize: 18, fontWeight: 500 }}>
          {`${siteConfig.domain}/docs/${slug}`}
        </div>
      </div>
    ),
    size
  );
}
