"use client";
import { motion } from "motion/react";
import { ArrowRight, Download, Eye } from "lucide-react";
import ProfilePhoto from "./ProfilePhoto";

type SiteSettings = {
  hero_greeting: string | null;
  hero_name: string | null;
  hero_role: string | null;
  hero_description: string | null;
  hero_photo_url: string | null;
  cv_url: string | null;
} | null;

export default function Hero({ settings }: { settings: SiteSettings }) {
  // Fallback kalau data belum ada
  const greeting = settings?.hero_greeting || "Halo, nama saya";
  const name = settings?.hero_name || "Dony Kurniawan.";
  const role = settings?.hero_role || "IT Audit & Web Developer.";
  const description =
    settings?.hero_description ||
    "Mahasiswa IT di Politeknik Negeri Madiun dengan fokus IT Audit dan Web Development.";
  const photoUrl = settings?.hero_photo_url || null;
  const cvUrl = settings?.cv_url || null;

  return (
    <section
      id="tentang"
      className="relative max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col justify-center min-h-screen"
    >
      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-400/10 dark:bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        {/* KONTEN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 order-2 lg:order-1"
        >
          <p className="text-cyan-600 dark:text-cyan-400 mb-4 font-mono text-lg">
            {greeting}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">
            {name}
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-500 dark:text-slate-400 mb-8">
            {role}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl mb-10">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#proyek"
              className="inline-flex items-center gap-2 bg-cyan-500 text-white dark:text-slate-900 hover:bg-cyan-400 px-6 py-3 rounded-md font-semibold transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              Lihat Karya Saya <ArrowRight size={18} />
            </a>

            {cvUrl && (
              <>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-6 py-3 rounded-md font-semibold transition-all duration-300"
                >
                  <Eye size={18} /> Lihat CV
                </a>
                <a
                  href={cvUrl}
                  download="CV-Dony-Kurniawan.pdf"
                  className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-6 py-3 rounded-md font-semibold transition-all duration-300"
                >
                  <Download size={18} /> Download CV
                </a>
              </>
            )}
          </div>
        </motion.div>

        {/* FOTO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center lg:justify-end order-1 lg:order-2"
        >
          <ProfilePhoto photoUrl={photoUrl} />
        </motion.div>
      </div>
    </section>
  );
}