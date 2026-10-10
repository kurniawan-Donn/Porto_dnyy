"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  MapPin,
  Calendar,
  Loader2,
  Briefcase,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import TagPill from "./TagPill";
import TagPopup, { type TagData } from "./TagPopup";

// ============================================
// Types
// ============================================
type Experience = {
  id: string;
  position: string;
  company: string;
  period: string;
  location: string | null;
  description: string | null;
  tags: string[] | null;
  is_current: boolean | null;
  image_url: string | null;
  order_index?: number;
};

type TechTag = {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  category: string | null;
};

// ============================================
// Experience Card
// ============================================
function ExperienceCard({
  experience,
  index,
  techTagsMap,
  onTagClick,
}: {
  experience: Experience;
  index: number;
  techTagsMap: Map<string, TechTag>;
  onTagClick: (t: TechTag) => void;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-xl border border-slate-700/60 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/60 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)] sm:p-6"
    >
      {/* Accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Logo / Number block */}
        <div className="flex flex-shrink-0 items-start gap-3">
          {experience.image_url ? (
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
              src={experience.image_url}
              alt={experience.company}
              className="h-full w-full object-contain p-1.5"
            />
          </div>
          ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Building2 size={22} />
          </div>
      )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-[10px] text-cyan-400">
                  {number}
                </span>
                {experience.is_current && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold leading-snug text-slate-100 sm:text-xl">
                {experience.position}
              </h3>
              <p className="mt-0.5 text-sm text-cyan-400">
                {experience.company}
              </p>
            </div>

            {/* Meta: period + location */}
            <div className="flex flex-shrink-0 flex-col gap-1 text-right sm:items-end">
              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                <Calendar size={11} />
                {experience.period}
              </div>
              {experience.location && (
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                  <MapPin size={11} />
                  {experience.location}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {experience.description && (
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {experience.description}
            </p>
          )}

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-800 pt-4">
              {experience.tags.map((tagName) => {
                const tag = techTagsMap.get(tagName.toLowerCase());
                return (
                  <TagPill
                    key={tagName}
                    icon={tag?.icon ?? null}
                    label={tagName}
                    onClick={tag ? () => onTagClick(tag) : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ============================================
// Main Component
// ============================================
export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [techTags, setTechTags] = useState<TechTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null);

  // Fetch experiences + tech tags
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [expRes, tagsRes] = await Promise.all([
        supabase
          .from("experiences")
          .select("*")
          .order("order_index", { ascending: true, nullsFirst: false }),
        supabase.from("tech_tags").select("*"),
      ]);

      if (expRes.data) setExperiences(expRes.data);
      if (tagsRes.data) setTechTags(tagsRes.data);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Map lowercase tech name -> TechTag
  const techTagsMap = new Map(
    techTags.map((t) => [t.name.toLowerCase(), t])
  );

  return (
    <section id="pengalaman" className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Section heading */}
        <h2 className="mb-12 flex items-center gap-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
          <span className="font-mono text-xl text-cyan-600 dark:text-cyan-400">
            03.
          </span>{" "}
          Pengalaman
          <div className="ml-4 h-px max-w-xs flex-grow bg-slate-300 dark:bg-slate-700"></div>
        </h2>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-cyan-400" size={28} />
          </div>
        ) : experiences.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/20 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 text-slate-500">
              <Briefcase size={20} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Belum ada pengalaman. Tambahkan melalui admin panel.
            </p>
          </div>
        ) : (
          /* ─── Timeline ─── */
          <div className="relative space-y-5 lg:pl-12">
            {/* 
              ═══ GARIS VERTIKAL dengan efek glow ═══
              - Gradient: cyan terang → cyan redup → transparan
              - Drop shadow cyan untuk efek "glow"
              - Lebar lebih tebal (w-0.5 = 2px) biar glow kelihatan
            */}
            {experiences.length > 1 && (
              <div
                className="absolute left-6 top-12 bottom-12 hidden w-0.5 lg:block"
                aria-hidden="true"
              >
                {/* Layer 1: garis inti (gradient) */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/70 via-cyan-500/30 via-slate-700/40 to-transparent" />

                {/* Layer 2: glow blur di belakang garis */}
                <div className="absolute -inset-x-2 inset-y-0 bg-gradient-to-b from-cyan-500/20 via-cyan-500/5 to-transparent blur-sm" />
              </div>
            )}

            {experiences.map((experience, index) => (
              <div key={experience.id} className="relative">
                {/* 
                  ═══ DOT dengan efek glow ═══
                  - Ring dark (ring-slate-900/950) untuk "cutout" dari garis
                  - Inner cyan core
                  - Outer glow ring
                  - Drop shadow cyan
                */}
                <div className="absolute -left-6 top-11 z-10 hidden -translate-x-1/2 lg:block">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="relative"
                  >
                    {/* Outer pulse ring (glow effect) */}
                    <span className="absolute inset-0 -m-1.5 animate-pulse rounded-full bg-cyan-500/30 blur-sm" />

                    {/* Middle ring (cutout dari garis) */}
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 ring-4 ring-slate-900 dark:bg-slate-950 dark:ring-slate-950">
                      {/* Inner cyan core */}
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(6,182,212,0.8)]" />
                    </span>
                  </motion.div>
                </div>

                {/* Card */}
                <ExperienceCard
                  experience={experience}
                  index={index}
                  techTagsMap={techTagsMap}
                  onTagClick={setSelectedTag}
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tag popup */}
      <AnimatePresence>
        {selectedTag && (
          <TagPopup tag={selectedTag} onClose={() => setSelectedTag(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}