import { ImageResponse } from "next/og";

export const alt = "BomBom Treats - Opening Friday 1st May from 11am";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#91c4ff", // bom-ice
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "white",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          BomBom Treats
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
          }}
        >
          Opening Friday 1st May from 11am · 117 Baylis St, Wagga
        </div>
      </div>
    ),
    { ...size }
  );
}
