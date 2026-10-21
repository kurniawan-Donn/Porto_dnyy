import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { projectSlug } from "@/lib/slug";
import type {
  Certification,
  Experience,
  Project,
  SiteSettings,
  Skill,
  Stat,
  StatCounts,
  TechTag,
} from "@/lib/types";

export type PortfolioData = {
  settings: SiteSettings | null;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  techTags: TechTag[];
  stats: Stat[];
};

type QueryResult = { data: unknown; error: { message: string } | null };

// Error di-log lalu diganti nilai kosong, supaya satu tabel bermasalah
// tidak menjatuhkan seluruh halaman.
function rows<T>(table: string, res: QueryResult): T[] {
  if (res.error) console.error(`[data] Gagal mengambil ${table}:`, res.error.message);
  return (res.data as T[] | null) ?? [];
}

/**
 * Ambil semua data halaman utama sekaligus (paralel) di server.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = createPublicClient();

  const [settingsRes, skillsRes, projectsRes, experiencesRes, certsRes, tagsRes, statsRes] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("order_index", { ascending: true }),
      supabase.from("projects").select("*").order("order_index", { ascending: true }),
      supabase
        .from("experiences")
        .select("*")
        .order("order_index", { ascending: true, nullsFirst: false }),
      supabase
        .from("certifications")
        .select("*")
        .order("order_index", { ascending: true, nullsFirst: false }),
      supabase.from("tech_tags").select("*"),
      supabase.from("stats").select("*").order("order_index"),
    ]);

  if (settingsRes.error) {
    console.error("[data] Gagal mengambil site_settings:", settingsRes.error.message);
  }

  const skills = rows<Skill>("skills", skillsRes);
  const projects = rows<Project>("projects", projectsRes);
  const experiences = rows<Experience>("experiences", experiencesRes);
  const certifications = rows<Certification>("certifications", certsRes);

  // Stat dengan auto_source memakai jumlah baris yang sudah diambil di atas
  const counts: StatCounts = {
    projects: projects.length,
    certifications: certifications.length,
    experiences: experiences.length,
    skills: skills.length,
  };
  const stats = rows<Stat>("stats", statsRes).map((s) => ({
    ...s,
    value: s.auto_source ? counts[s.auto_source] : s.value,
  }));

  return {
    settings: (settingsRes.data as SiteSettings | null) ?? null,
    skills,
    projects,
    experiences,
    certifications,
    techTags: rows<TechTag>("tech_tags", tagsRes),
    stats,
  };
}

// ============================================
// Halaman project (/projects/[slug])
// ============================================

// cache(): generateMetadata, page, dan OG image dalam satu render
// berbagi satu query yang sama
export const getProjects = cache(async (): Promise<Project[]> => {
  const supabase = createPublicClient();
  const res = await supabase.from("projects").select("*").order("order_index", { ascending: true });
  return rows<Project>("projects", res);
});

export const getTechTags = cache(async (): Promise<TechTag[]> => {
  const supabase = createPublicClient();
  return rows<TechTag>("tech_tags", await supabase.from("tech_tags").select("*"));
});

export type ProjectPageData = {
  project: Project;
  index: number;
  total: number;
  prev: Project | null;
  next: Project | null;
};

export async function getProjectBySlug(slug: string): Promise<ProjectPageData | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => projectSlug(p) === slug);
  if (index === -1) return null;

  return {
    project: projects[index],
    index,
    total: projects.length,
    prev: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
  };
}
