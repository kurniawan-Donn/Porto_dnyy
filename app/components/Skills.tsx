"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TechIcon } from "@/lib/tech-icons";
import {
  Code2,
  Smartphone,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================
type Skill = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_index: number;
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Web Development": Code2,
  "Mobile & Software": Smartphone,
  "Tools & Audit": ShieldCheck,
};

// ============================================
// Komponen Popup
// ============================================
function SkillPopup({
  skill,
  onClose,
}: {
  skill: Skill;
  onClose: () => void;
}) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden"
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 dark:via-cyan-400 to-transparent" />

        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-center transition-all hover:rotate-90"
        >
          <X size={16} />
        </button>

        {/* Icon besar */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-center text-2xl flex-shrink-0">
            {skill.icon || "▹"}
          </div>
          <div className="min-w-0">
            <p className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase tracking-widest mb-1">
              {skill.category}
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {skill.name}
            </h3>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {skill.description ||
              "Belum ada deskripsi untuk keahlian ini."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// Komponen Utama Skills
// ============================================
export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Fetch dari Supabase
  useEffect(() => {
    const fetchSkills = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("order_index", { ascending: true });

      if (!error && data) {
        setSkills(data);
      }
      setIsLoading(false);
    };
    fetchSkills();
  }, []);

  // Group by category
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const grouped = categories.map((cat) => ({
    name: cat,
    icon: CATEGORY_ICONS[cat] || Code2,
    items: skills.filter((s) => s.category === cat),
  }));

  return (
    <section id="keahlian" className="max-w-5xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-4 text-slate-900 dark:text-slate-100">
          <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xl">
            01.
          </span>{" "}
          Keahlian & Teknologi
          <div className="h-px bg-slate-300 dark:bg-slate-700 flex-grow ml-4 max-w-xs"></div>
        </h2>

        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse h-64"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grouped.map((group, groupIndex) => {
              const GroupIcon = group.icon;
              return (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                  className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300"
                >
                  <GroupIcon
                    className="text-cyan-600 dark:text-cyan-400 mb-4"
                    size={32}
                  />
                  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                    {group.name}
                  </h3>
                  <ul className="space-y-1">
                    {group.items.map((skill) => (
                      <li key={skill.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSkill(skill)}
                          className="w-full text-left flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-mono text-sm py-1.5 px-2 rounded-md hover:bg-cyan-500/5 dark:hover:bg-cyan-400/5 transition-all group/skill"
                        >
                          <span className="flex-shrink-0 flex items-center">
                            <TechIcon name={skill.icon} size={16} />
                          </span>
                          <span className="truncate">{skill.name}</span>
                          <span className="ml-auto opacity-0 group-hover/skill:opacity-100 text-[10px] text-cyan-600 dark:text-cyan-400 transition-opacity">
                            klik
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillPopup
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}