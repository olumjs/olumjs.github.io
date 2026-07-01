import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `OlumJS Documentation`;

export default function OgImage() {
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
            Documentation
          </span>
        </div>

        <div style={{ fontSize: 72, fontWeight: 800, color: "#f0f0f2", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }}>
          OlumJS Docs
        </div>

        <div style={{ fontSize: 26, fontWeight: 400, color: "#71717a", marginBottom: 0, maxWidth: 680, lineHeight: 1.5 }}>
          Syntax rules, components, reactivity, loops, events and everything in between.
        </div>

        <div style={{ position: "absolute", bottom: 60, right: 100, color: "#25C97E", fontSize: 18, fontWeight: 500 }}>
          {`${siteConfig.domain}/docs`}
        </div>
      </div>
    ),
    size
  );
}
