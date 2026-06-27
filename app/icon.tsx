import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#09090b",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(37,201,126,0.3)",
        }}
      >
        <span
          style={{
            color: "#25C97E",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          O
        </span>
      </div>
    ),
    size
  );
}
