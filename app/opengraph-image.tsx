import { ImageResponse } from "next/og";
export const alt = "Sukhmeet Singh — Software, systems & AI evaluation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#EEEDE8",
        padding: "55px 65px",
        color: "#151515",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
        }}
      >
        <span>THE PERSONAL PROJECT WORKSHOP</span>
        <span>DELHI, INDIA / 2026</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 142,
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: "-7px",
        }}
      >
        <span>SUKHMEET</span>
        <span>
          SINGH<span style={{ color: "#4355F9" }}>.</span>
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 31 }}>
        Software, systems & AI evaluation.
      </div>
    </div>,
    size,
  );
}
