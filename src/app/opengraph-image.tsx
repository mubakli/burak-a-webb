import { ImageResponse } from "next/og";

export const alt = "Burak Asarcikli, developer by trade and curious by nature";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        color: "#f1eadb",
        background: "#0b0d0f",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "74%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20 }}>
          <span
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: "#0b0d0f",
              background: "#c9f36b",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            B/A
          </span>
          <span>Burak Asarcikli</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 83, fontWeight: 650, letterSpacing: "-5px", lineHeight: 0.9 }}>
            Developer
          </span>
          <span style={{ color: "#9a9c98", fontSize: 83, letterSpacing: "-5px", lineHeight: 0.9 }}>
            by trade.
          </span>
          <span style={{ color: "#c9f36b", fontSize: 83, fontWeight: 650, letterSpacing: "-5px", lineHeight: 0.9 }}>
            Curious by nature.
          </span>
        </div>

        <div style={{ display: "flex", gap: 26, color: "#9a9c98", fontSize: 16 }}>
          <span>Full-stack engineering</span>
          <span>Cycling</span>
          <span>Fragrance</span>
          <span>Istanbul</span>
        </div>
      </div>

      <div
        style={{
          width: "26%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 42px",
          color: "#0b0d0f",
          background: "#2942d3",
        }}
      >
        <span style={{ color: "#f1eadb", fontSize: 15 }}>PERSONAL SPACE / 2026</span>
        <div
          style={{
            width: 170,
            height: 170,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #c9f36b",
            borderRadius: "50%",
            color: "#c9f36b",
            fontSize: 18,
            transform: "rotate(-10deg)",
          }}
        >
          IST / TR
        </div>
        <span style={{ color: "#f1eadb", fontSize: 18, lineHeight: 1.4 }}>
          Work, interests, and life beyond the screen.
        </span>
      </div>
    </div>,
    size,
  );
}
