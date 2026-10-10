"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  X,
  ArrowUpRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { createClient } from "@/lib/supabase/client";
import TagPill from "./TagPill";
import TagPopup, { type TagData } from "./TagPopup";
import { TechIcon } from "@/lib/tech-icons";

// ============================================
// Types
// ============================================
type CaseStudy = {
  subtitle?: string;
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  tech: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  featured: boolean | null;
  card_cta_text: string | null;
  case_study: CaseStudy | null;
  order_index: number;
};

type TechTag = {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  category: string | null;
};

// ============================================
// Case Study Modal
// ============================================
function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const cs = project.case_study || {};

  const sections = [
    { key: "situation", label: "Situation", value: cs.situation, letter: "S" },
    { key: "task", label: "Task", value: cs.task, letter: "T" },
    { key: "action", label: "Action", value: cs.action, letter: "A" },
    { key: "result", label: "Result", value: cs.result, letter: "R" },
  ].filter((s) => s.value && s.value.trim());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md dark:bg-slate-950/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study ${project.title}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_0_60px_rgba(6,182,212,0.2)] dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="absolute top-0 left-0 right-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 backdrop-blur-sm transition-all hover:rotate-90 hover:border-cyan-500/50 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-cyan-400"
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto">
          {project.image_url && (
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image_url}
                alt={project.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-slate-950 dark:via-slate-950/20" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              {cs.subtitle && (
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  {cs.subtitle}
                </p>
              )}
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
                {project.title}
              </h2>
              {project.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                  {project.description}
                </p>
              )}
            </div>

            {project.tech && project.tech.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {sections.length > 0 ? (
              <div className="space-y-6 border-t border-slate-200 pt-6 dark:border-slate-800">
                {sections.map((section) => (
                  <div key={section.key} className="flex gap-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">
                      {section.letter}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-600/80 dark:text-cyan-400/80">
                        {section.label}
                      </p>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {section.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                <p className="text-sm italic text-slate-500">
                  Belum ada studi kasus untuk project ini.
                </p>
              </div>
            )}

            {(project.github_url || project.demo_url) && (
              <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-all hover:border-cyan-500/50 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-cyan-400"
                  >
                    <SiGithub size={14} />
                    Source Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// Project Card
// ============================================
function ProjectCard({
  project,
  index,
  techTagsMap,
  onOpenCaseStudy,
  onTagClick,
}: {
  project: Project;
  index: number;
  techTagsMap: Map<string, TechTag>;
  onOpenCaseStudy: (p: Project) => void;
  onTagClick: (t: TechTag) => void;
}) {
  const hasCaseStudy =
    project.case_study &&
    Object.values(project.case_study).some((v) => v && String(v).trim());

  const isFeatured = project.featured;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/60 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)] ${
        isFeatured ? "md:col-span-2" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"
        aria-hidden="true"
      />

      {project.image_url ? (
        <button
          type="button"
          onClick={() => hasCaseStudy && onOpenCaseStudy(project)}
          disabled={!hasCaseStudy}
          className={`relative block w-full overflow-hidden border-b border-slate-700/60 bg-slate-950 ${
            hasCaseStudy ? "cursor-pointer" : "cursor-default"
          }`}
          aria-label={hasCaseStudy ? `Buka case study ${project.title}` : undefined}
        >
          <div
            className={`relative w-full overflow-hidden ${
              isFeatured ? "aspect-[21/9]" : "aspect-[16/10]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image_url}
              alt={project.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
              loading="lazy"
            />
          </div>
        </button>
      ) : (
        <div
          className={`flex w-full items-center justify-center border-b border-slate-700/60 bg-slate-900 ${
            isFeatured ? "aspect-[21/9]" : "aspect-[16/10]"
          }`}
        >
          <Sparkles className="text-cyan-500/40" size={40} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start gap-3">
          <span className="font-mono text-xs text-cyan-400">{number}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-snug text-slate-100 sm:text-xl">
              {project.title}
            </h3>
            {project.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {project.tech && project.tech.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.tech.map((techName) => {
              const tag = techTagsMap.get(techName.toLowerCase());
              return (
                <TagPill
                  key={techName}
                  icon={tag?.icon ?? null}
                  label={techName}
                  onClick={tag ? () => onTagClick(tag) : undefined}
                />
              );
            })}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub ${project.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-400 transition-all hover:border-cyan-500/50 hover:text-cyan-400"
              >
                <SiGithub size={14} />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Demo ${project.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-400 transition-all hover:border-cyan-500/50 hover:text-cyan-400"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          {hasCaseStudy && (
            <button
              type="button"
              onClick={() => onOpenCaseStudy(project)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-400 transition-all hover:gap-2.5 hover:text-cyan-300"
            >
              {project.card_cta_text || "Lihat Studi Kasus"}
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ============================================
// Main Component
// ============================================
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techTags, setTechTags] = useState<TechTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [projectsRes, tagsRes] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase.from("tech_tags").select("*"),
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (tagsRes.data) setTechTags(tagsRes.data);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const techTagsMap = new Map(
    techTags.map((t) => [t.name.toLowerCase(), t])
  );

  return (
    <section id="proyek" className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-12 flex items-center gap-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
          <span className="font-mono text-xl text-cyan-600 dark:text-cyan-400">
            02.
          </span>{" "}
          Proyek
          <div className="ml-4 h-px max-w-xs flex-grow bg-slate-300 dark:bg-slate-700"></div>
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-cyan-400" size={28} />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum ada project. Tambahkan melalui admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                techTagsMap={techTagsMap}
                onOpenCaseStudy={setSelectedProject}
                onTagClick={setSelectedTag}
              />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTag && (
          <TagPopup tag={selectedTag} onClose={() => setSelectedTag(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}