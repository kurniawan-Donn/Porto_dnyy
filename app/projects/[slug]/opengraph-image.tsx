import { ImageResponse } from "next/og";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { OG_COLORS as c, OG_SIZE, OgFrame, loadOgFonts, truncate } from "@/lib/og";
import { projectSlug } from "@/lib/slug";

export const alt = "Case study project — Dony Kurniawan";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

// Dibuat saat build seperti halamannya; project baru dibuat saat pertama diminta
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: projectSlug(p) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [data, fonts] = await Promise.all([getProjectBySlug(slug), loadOgFonts()]);

  const project = data?.project;
  const title = project?.title ?? "Project tidak ditemukan";
  const summary = project?.case_study?.subtitle || project?.description || "";
  const tech = (project?.tech ?? []).slice(0, 5);
  const extraTech = (project?.tech?.length ?? 0) - tech.length;
  const number = data ? String(data.index + 1).padStart(2, "0") : "--";

  return new ImageResponse(
    (
      <OgFrame path={`~/proyek/${project ? projectSlug(project) : slug}`}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: c.cyan }}>
          {`CASE STUDY ${number}`}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: title.length > 28 ? 68 : 84,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {truncate(title, 60)}
        </div>

        {summary && (
          <div style={{ display: "flex", marginTop: 20, fontSize: 24, lineHeight: 1.4, color: c.muted }}>
            {truncate(summary, 130)}
          </div>
        )}

        {tech.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: "auto", marginBottom: 28 }}>
            {tech.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: `1px solid ${c.border}`,
                  background: c.bg,
                  fontSize: 20,
                  color: c.text,
                }}
              >
                {`</> ${t}`}
              </div>
            ))}
            {extraTech > 0 && (
              <div style={{ display: "flex", padding: "6px 4px", fontSize: 20, color: c.dim }}>
                {`+${extraTech}`}
              </div>
            )}
          </div>
        )}
      </OgFrame>
    ),
    { ...size, fonts }
  );
}
