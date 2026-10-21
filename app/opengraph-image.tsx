import { ImageResponse } from "next/og";
import { OG_COLORS as c, OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — IT Audit, Cybersecurity & Web Developer`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame path="~/dony — zsh">
        <div style={{ display: "flex", fontSize: 26, color: c.muted }}>
          <span style={{ color: c.green }}>dony@soc</span>
          <span>:~$&nbsp;</span>
          <span style={{ color: c.text }}>whoami</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          {SITE_NAME}
          <span style={{ color: c.cyan }}>.</span>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 32, fontSize: 26 }}>
          {["IT Audit", "Cybersecurity", "Web Dev"].map((role) => (
            <div
              key={role}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 8,
                border: `1px solid ${c.cyan}66`,
                background: `${c.cyan}14`,
                color: c.cyan,
              }}
            >
              {role}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", marginTop: 32, fontSize: 24, color: c.muted }}>
          Mahasiswa IT Politeknik Negeri Madiun · Portofolio & Case Studies
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
