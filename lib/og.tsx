import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site";

// ============================================
// Bahan bersama OG image (1200×630) bergaya terminal/SOC.
// Font dibaca dari @fontsource (format woff — didukung ImageResponse);
// next.config.ts memasukkan file ini ke bundle server lewat
// outputFileTracingIncludes.
// ============================================

export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = join(process.cwd(), "node_modules", "@fontsource");

export async function loadOgFonts() {
  const [mono, monoBold, display] = await Promise.all([
    readFile(join(FONT_DIR, "jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff")),
    readFile(join(FONT_DIR, "jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff")),
    readFile(join(FONT_DIR, "space-grotesk/files/space-grotesk-latin-700-normal.woff")),
  ]);
  return [
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: monoBold, weight: 700 as const, style: "normal" as const },
    { name: "Space Grotesk", data: display, weight: 700 as const, style: "normal" as const },
  ];
}

export const OG_COLORS = {
  bg: "#020617",
  panel: "#0f172a",
  border: "#1e293b",
  cyan: "#06b6d4",
  green: "#22c55e",
  text: "#f1f5f9",
  muted: "#94a3b8",
  dim: "#475569",
};

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Bingkai jendela terminal: grid latar, title bar dengan path, footer domain */
export function OgFrame({ path, children }: { path: string; children: ReactNode }) {
  const c = OG_COLORS;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 40,
        background: c.bg,
        backgroundImage: `linear-gradient(${c.border}55 1px, transparent 1px), linear-gradient(90deg, ${c.border}55 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        fontFamily: "JetBrains Mono",
        color: c.text,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${c.border}`,
          borderRadius: 16,
          background: `${c.panel}f2`,
          boxShadow: `0 0 80px ${c.cyan}33`,
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 24px",
            borderBottom: `1px solid ${c.border}`,
            fontSize: 20,
            color: c.muted,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#ef4444" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#eab308" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: c.green }} />
          <div style={{ display: "flex", marginLeft: 16 }}>{path}</div>
        </div>

        {/* Isi */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 48px 0" }}>
          {children}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 48px",
            borderTop: `1px solid ${c.border}`,
            fontSize: 20,
            color: c.muted,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: c.green }} />
            Dony Kurniawan
          </div>
          <div style={{ display: "flex", color: c.cyan }}>{SITE_URL.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    </div>
  );
}
