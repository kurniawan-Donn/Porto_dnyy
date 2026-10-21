import { cache } from "react";
import { unstable_cache } from "next/cache";
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

// ============================================
// Lapisan data publik.
//
// Halaman dirender per request (CSP nonce, lihat proxy.ts), jadi hasil query
// di-cache di Data Cache Next: maksimal 1 jam, dan langsung dibuang saat
// admin menyimpan (revalidatePublicSite → tag PUBLIC_DATA_TAG).
// ============================================

export const PUBLIC_DATA_TAG = "public-data";
const CACHE_OPTIONS = { tags: [PUBLIC_DATA_TAG], revalidate: 3600 };

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

class QueryError extends Error {}

// Query gagal → lempar error, supaya hasil kosong TIDAK ikut tersimpan di cache
function rows<T>(table: string, res: QueryResult): T[] {
  if (res.error) throw new QueryError(`${table}: ${res.error.message}`);
  return (res.data as T[] | null) ?? [];
}

/**
 * Jalankan versi ter-cache; bila query gagal, log lalu tampilkan nilai
 * cadangan (tidak di-cache) agar satu tabel bermasalah tidak menjatuhkan halaman.
 */
async function withFallback<T>(cached: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await cached();
  } catch (err) {
    console.error("[data]", err instanceof Error ? err.message : err);
    return fallback;
  }
}

// ============================================
// Beranda
// ============================================

async function fetchPortfolioData(): Promise<PortfolioData> {
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

  if (settingsRes.error) throw new QueryError(`site_settings: ${settingsRes.error.message}`);

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

const getCachedPortfolioData = unstable_cache(fetchPortfolioData, ["portfolio-data"], CACHE_OPTIONS);

/** Semua data halaman utama, diambil paralel dan di-cache */
export function getPortfolioData(): Promise<PortfolioData> {
  return withFallback(getCachedPortfolioData, {
    settings: null,
    skills: [],
    projects: [],
    experiences: [],
    certifications: [],
    techTags: [],
    stats: [],
  });
}

// ============================================
// Halaman project, OG image, sitemap, terminal
// ============================================

const getCachedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const supabase = createPublicClient();
    const res = await supabase.from("projects").select("*").order("order_index", { ascending: true });
    return rows<Project>("projects", res);
  },
  ["projects"],
  CACHE_OPTIONS
);

const getCachedTechTags = unstable_cache(
  async (): Promise<TechTag[]> => {
    const supabase = createPublicClient();
    return rows<TechTag>("tech_tags", await supabase.from("tech_tags").select("*"));
  },
  ["tech-tags"],
  CACHE_OPTIONS
);

const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    const supabase = createPublicClient();
    const res = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (res.error) throw new QueryError(`site_settings: ${res.error.message}`);
    return (res.data as SiteSettings | null) ?? null;
  },
  ["site-settings"],
  CACHE_OPTIONS
);

// cache(): generateMetadata, page, dan OG image dalam satu render berbagi hasil
export const getProjects = cache(() => withFallback(getCachedProjects, [] as Project[]));
export const getTechTags = cache(() => withFallback(getCachedTechTags, [] as TechTag[]));
export const getSiteSettings = cache(() =>
  withFallback(getCachedSiteSettings, null as SiteSettings | null)
);

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
