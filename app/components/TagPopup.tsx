"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { TechIcon } from "@/lib/tech-icons";

export type TagData = {
  id?: string;
  name: string;
  icon: string | null;
  description: string | null;
  category: string | null;
};

type TagPopupProps = {
  tag: TagData;
  onClose: () => void;
};

export default function TagPopup({ tag, onClose }: TagPopupProps) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${tag.name}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)]"
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        {/* Glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-[60px]" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 transition-all hover:rotate-90 hover:border-cyan-500/50 hover:text-cyan-400"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
            <TechIcon name={tag.icon} size={30} />
          </div>
          <div className="min-w-0">
            {tag.category && (
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-cyan-400">
                {tag.category}
              </p>
            )}
            <h3 className="text-xl font-bold text-slate-100">{tag.name}</h3>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm leading-relaxed text-slate-400">
            {tag.description || "Belum ada deskripsi untuk teknologi ini."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}