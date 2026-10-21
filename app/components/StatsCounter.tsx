"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { getStatIcon } from "@/lib/lucide-icons";
import type { Stat } from "@/lib/types";

// ============================================
// Counter (animasi angka)
// ============================================
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1800;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// ============================================
// Komponen Utama
// ============================================
// Nilai stat dengan auto_source sudah dihitung di server (lib/data.ts)
export default function StatsCounter({ stats }: { stats: Stat[] }) {
  // Sembunyikan section kalau tidak ada stats
  if (stats.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 dark:via-cyan-400 to-transparent" />
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div
          className={`relative grid grid-cols-2 gap-6 md:gap-4 ${
            stats.length === 3 ? "md:grid-cols-3" : stats.length <= 4 ? "md:grid-cols-4" : "md:grid-cols-5"
          }`}
        >
          {stats.map((stat, index) => {
            const Icon = getStatIcon(stat.icon_name);
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center text-center py-2 group"
              >
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-400/20 group-hover:scale-110 transition-all duration-300">
                  <Icon size={24} />
                </div>

                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1 font-mono">
                  <Counter value={stat.value} suffix={stat.suffix || "+"} />
                </div>

                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                  {stat.label}
                </p>

                {index < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}