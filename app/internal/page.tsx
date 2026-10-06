import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FPX Internal Tools",
  description: "Private FPX internal tools workspace.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

const tools = [
  {
    href: "/internal/lead-journey-lab",
    title: "Lead Journey Lab",
    description: "Map, review and export FPX lead and customer journeys.",
  },
  {
    href: "/saw-point-admin",
    title: "Saw Point Admin",
    description: "Manage and publish Saw Point content.",
  },
];

export default function InternalToolsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040E0E",
        color: "#F7F4EA",
        padding: "72px 24px",
        fontFamily: "Open Sans, Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(83,195,150,.28)",
            borderRadius: 999,
            padding: "7px 11px",
            color: "#53C396",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          FPX Internal
        </div>

        <h1
          style={{
            margin: "22px 0 10px",
            fontFamily: "Montserrat, Arial, sans-serif",
            fontSize: "clamp(34px, 5vw, 58px)",
            lineHeight: 1,
            letterSpacing: "-.035em",
          }}
        >
          Internal tools
        </h1>
        <p style={{ margin: 0, maxWidth: 650, color: "#B8C7C1", fontSize: 16, lineHeight: 1.65 }}>
          Private working tools for FPX operations and marketing.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginTop: 38,
          }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 18,
                padding: 24,
                background: "rgba(255,255,255,.045)",
              }}
            >
              <div
                style={{
                  fontFamily: "Montserrat, Arial, sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                {tool.title}
              </div>
              <div style={{ color: "#B8C7C1", fontSize: 14, lineHeight: 1.55 }}>{tool.description}</div>
              <div style={{ marginTop: 18, color: "#53C396", fontSize: 13, fontWeight: 800 }}>Open tool →</div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
