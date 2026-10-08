"use client";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import { useSound } from "./SoundProvider";

// ============================================
// Ikon GitHub (named export — WAJIB ada)
// ============================================
export const GithubIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.6-.1-3.3 0 0-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C7.8 1.2 6.6 1.6 6.6 1.6c-.7 1.7-.2 3 .1 3.3-.8.9-1.3 2-1.3 3.4 0 5 3 6.2 6 6.5-.4.4-.7.9-.8 1.6-.7.3-2.6.9-3.7-1.1-.5-.8-1.4-1.3-2.3-1.3-.9 0-1.6.5-2.3 1.3" />
  </svg>
);

// ============================================
// Types
// ============================================
export type CaseStudy = {
  subtitle: string;
  situation: string;
  task: string;
  action: string;
  result: string;
};

export type CaseStudyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tech: string[];
  github: string;
  demo: string;
  caseStudy: CaseStudy | null;
  onTagClick?: (name: string) => void;
};

// ============================================
// Konfigurasi Blok STAR
// ============================================
const starBlocks = [
  { key: "S", label: "Situation", field: "situation" as const },
  { key: "T", label: "Task", field: "task" as const },
  { key: "A", label: "Action", field: "action" as const },
  { key: "R", label: "Result", field: "result" as const },
];

// ============================================
// Komponen Utama
// ============================================
export default function CaseStudyModal({
  isOpen,
  onClose,
  tech,
  github,
  demo,
  caseStudy,
  onTagClick,
}: CaseStudyModalProps) {
  const { play } = useSound();

  // ESC key handler
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // Side effects: ESC key + scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, handleEsc]);

  if (!caseStudy) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.2)]"
          >
            {/* Accent Line Top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 dark:via-cyan-400 to-transparent" />

            {/* Glow sudut */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/15 dark:bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />

            {/* ============================
                HEADER
            ============================ */}
            <div className="relative flex items-start justify-between gap-4 p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
              <div className="min-w-0">
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2"
                >
                  <span className="inline-block w-6 h-px bg-cyan-600 dark:bg-cyan-400" />
                  Case Study
                </motion.p>
                <motion.h3
                  id="case-study-title"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight"
                >
                  {caseStudy.subtitle}
                </motion.h3>
              </div>
              <button
                onClick={() => {
                  play("click");
                  onClose();
                }}
                onMouseEnter={() => play("hover")}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 dark:hover:bg-cyan-400/20 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* ============================
                BODY (Scrollable)
            ============================ */}
            <div className="relative overflow-y-auto p-6 md:p-8 space-y-6">
              {starBlocks.map((block, i) => (
                <motion.div
                  key={block.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/30 dark:border-cyan-400/30 flex items-center justify-center font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {block.key}
                    </div>
                  </div>
                  <div className="pt-1 min-w-0">
                    <h4 className="text-sm font-mono uppercase tracking-wider text-cyan-600/80 dark:text-cyan-400/80 mb-2">
                      {block.label}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed text-justify">
                      {caseStudy[block.field]}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Footer: Tech Tags & Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4"
              >
                <ul className="flex flex-wrap gap-2 font-mono text-xs">
                 {tech.map((t, i) => (
                  <li key={i}>
                  <button
                     type="button"
                     onClick={() => onTagClick?.(t)}
                     className="text-cyan-700 dark:text-cyan-400/80 hover:text-cyan-600 dark:hover:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-400/10 hover:bg-cyan-500/20 dark:hover:bg-cyan-400/20 px-3 py-1 rounded-full border border-cyan-500/20 dark:border-cyan-400/20 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all cursor-pointer"
                    >
                     {t}
                    </button>
                  </li>
                  ))}
                </ul>        

                <div className="flex gap-3">
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => play("hover")}
                    className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-300 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 px-4 py-2 rounded-md text-sm transition-all duration-200"
                  >
                    <GithubIcon size={16} /> Repo
                  </a>
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => play("hover")}
                    className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-medium px-4 py-2 rounded-md text-sm transition-all duration-200"
                  >
                    <ExternalLink size={16} /> Demo
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Footer Hint */}
            <div className="hidden md:flex items-center justify-center gap-2 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 font-mono">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] text-slate-600 dark:text-slate-400">
                ESC
              </kbd>
              untuk menutup
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}