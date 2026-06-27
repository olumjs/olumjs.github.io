import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.title;

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
        {/* Green radial glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1000,
            height: 700,
            background:
              "radial-gradient(ellipse at 50% 20%, rgba(37,201,126,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Framework badge */}
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#25C97E" }} />
          <span
            style={{
              color: "#25C97E",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            VanillaJS Framework
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#f0f0f2",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 20,
          }}
        >
          OlumJS
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#71717a",
            marginBottom: 52,
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          {siteConfig.shortDescription}
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Signal Reactivity", "Scoped CSS", "8 kb gzip", "Native HTML"].map((feat) => (
            <div
              key={feat}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "10px 20px",
                color: "#a1a1aa",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {feat}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 100,
            color: "#25C97E",
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          {siteConfig.domain}
        </div>
      </div>
    ),
    size
  );
}
