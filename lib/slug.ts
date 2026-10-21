import type { Project } from "@/lib/types";

/** "Metadata Remover v2!" → "metadata-remover-v2" (aturan sama dengan migration SQL) */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Slug dari DB; fallback ke judul kalau kolom slug belum diisi */
export function projectSlug(project: Pick<Project, "slug" | "title">): string {
  return project.slug || slugify(project.title);
}

export function projectPath(project: Pick<Project, "slug" | "title">): string {
  return `/projects/${projectSlug(project)}`;
}
