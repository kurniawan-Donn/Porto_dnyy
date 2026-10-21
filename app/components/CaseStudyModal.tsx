"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { Project } from "@/lib/types";

const STAR_BLOCKS = [
  { key: "situation", label: "Situation", letter: "S" },
  { key: "task", label: "Task", letter: "T" },
  { key: "action", label: "Action", letter: "A" },
  { key: "result", label: "Result", letter: "R" },
] as const;

export function hasCaseStudy(project: Project): boolean {
  return Boolean(
    project.case_study &&
      Object.values(project.case_study).some((v) => v && String(v).trim())
  );
}

export default function CaseStudyModal({
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

  const sections = STAR_BLOCKS.map((block) => ({
    ...block,
    value: cs[block.key],
  })).filter((s) => s.value && s.value.trim());

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
