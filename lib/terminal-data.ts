import type { TerminalData } from "@/app/components/terminal/commands";
import { projectSlug } from "@/lib/slug";
import type { Project, SiteSettings } from "@/lib/types";

/** Ringkas data server menjadi props kecil untuk terminal (dikirim ke client) */
export function toTerminalData(settings: SiteSettings | null, projects: Project[]): TerminalData {
  return {
    name: settings?.hero_name?.trim() || "Dony Kurniawan",
    role: settings?.hero_role?.trim() || "IT Audit & Web Developer",
    location: settings?.location || "Madiun, Jawa Timur, Indonesia",
    email: settings?.email || null,
    cvUrl: settings?.cv_url || null,
    githubUrl: settings?.github_url || null,
    linkedinUrl: settings?.linkedin_url || null,
    projects: projects.map((p) => ({ slug: projectSlug(p), title: p.title, tech: p.tech ?? [] })),
  };
}
