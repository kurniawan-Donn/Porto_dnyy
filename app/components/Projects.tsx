"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, ArrowUpRight, Sparkles } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { Project, TechTag } from "@/lib/types";
import TagPill from "./TagPill";
import TagPopup from "./TagPopup";
import { projectPath } from "@/lib/slug";

// ============================================
// Project Card
// ============================================
function ProjectCard({
  project,
  index,
  techTagsMap,
  onTagClick,
}: {
  project: Project;
  index: number;
  techTagsMap: Map<string, TechTag>;
  onTagClick: (t: TechTag) => void;
}) {
  const href = projectPath(project);
  const isFeatured = project.featured;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/60 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)] dark:border-slate-700/60 dark:bg-white/5 ${
        isFeatured ? "md:col-span-2" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"
        aria-hidden="true"
      />

      {project.image_url ? (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block w-full overflow-hidden border-b border-slate-200 bg-slate-100 dark:border-slate-700/60 dark:bg-slate-950"
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
        </Link>
      ) : (
        <div
          className={`flex w-full items-center justify-center border-b border-slate-200 bg-slate-100 dark:border-slate-700/60 dark:bg-slate-900 ${
            isFeatured ? "aspect-[21/9]" : "aspect-[16/10]"
          }`}
        >
          <Sparkles className="text-cyan-500/40" size={40} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start gap-3">
          <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">{number}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl dark:text-slate-100">
              <Link href={href} className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                {project.title}
              </Link>
            </h3>
            {project.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub ${project.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-all hover:border-cyan-500/50 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-cyan-400"
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
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-all hover:border-cyan-500/50 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-cyan-400"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-all hover:gap-2.5 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            {project.card_cta_text || "Lihat Studi Kasus"}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ============================================
// Main Component
// ============================================
export default function Projects({
  projects,
  techTags,
}: {
  projects: Project[];
  techTags: TechTag[];
}) {
  const [selectedTag, setSelectedTag] = useState<TechTag | null>(null);

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

        {projects.length === 0 ? (
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
                onTagClick={setSelectedTag}
              />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedTag && (
          <TagPopup tag={selectedTag} onClose={() => setSelectedTag(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
