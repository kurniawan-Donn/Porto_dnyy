"use client";
import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, ArrowRight, Download, Eye } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { useMediaQuery } from "../hooks/useMediaQuery";
import ProfilePhoto from "./ProfilePhoto";

// Titik fokus zoom pada banner (≈ monitor tengah). Sama dengan penanda di admin.
const FOCUS_ORIGIN = "50% 45%";

/** Latar Hero: banner (jika ada) atau grid cyber, keduanya di-zoom saat scroll */
function HeroBackdrop({
  bannerUrl,
  scale,
}: {
  bannerUrl: string | null;
  scale: MotionValue<number> | number;
}) {
  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ scale, transformOrigin: FOCUS_ORIGIN }}
      aria-hidden="true"
    >
      {bannerUrl ? (
        <>
          <Image src={bannerUrl} alt="" fill priority sizes="100vw" className="object-cover" />
          {/* Gelapkan/terangkan sisi kiri agar teks tetap terbaca di kedua tema */}
          <div className="absolute inset-0 bg-slate-50/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-slate-50 lg:via-slate-50/85 lg:to-slate-50/10 dark:bg-slate-900/80 dark:lg:bg-transparent dark:lg:from-slate-900 dark:lg:via-slate-900/85 dark:lg:to-slate-900/20" />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.18) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 50% 45%, #000 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, #000 20%, transparent 70%)",
          }}
        />
      )}
      {/* Glow pusat */}
      <div className="absolute top-[45%] left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px] dark:bg-cyan-500/20" />
    </motion.div>
  );
}

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  // Fallback kalau data belum ada
  const greeting = settings?.hero_greeting || "Halo, nama saya";
  const name = settings?.hero_name || "Dony Kurniawan.";
  const role = settings?.hero_role || "IT Audit & Web Developer.";
  const description =
    settings?.hero_description ||
    "Mahasiswa IT di Politeknik Negeri Madiun dengan fokus IT Audit dan Web Development.";
  const photoUrl = settings?.hero_photo_url || null;
  const bannerUrl = settings?.hero_banner_url || null;
  const cvUrl = settings?.cv_url || null;

  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // Zoom hanya di desktop: di HP konten Hero lebih tinggi dari layar,
  // sehingga versi sticky akan memotongnya
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // 0 → 1 selama "landasan" scroll Hero (section lebih tinggi dari layar,
  // isinya sticky). Konten tetap utuh di awal, lalu memudar ke atas sambil
  // kamera zoom ke titik fokus, dan layar larut ke section berikutnya.
  //
  // Setiap rentang SENGAJA ditulis lengkap 0 → 1: motion menjalankannya
  // sebagai animasi ViewTimeline bawaan browser, dan keyframe yang berhenti
  // sebelum 1 membuat browser mengembalikan nilai ke kondisi awal (konten
  // muncul lagi di akhir scroll).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, bannerUrl ? 2.6 : 3.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [1, 1, 0, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0, -90, -90]);
  const contentScale = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [1, 1, 0.94, 0.94]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.75, 1], [0, 0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1, 1], [1, 0, 0]);

  const animated = isDesktop && !reduceMotion;

  // Tata letak (landasan scroll + sticky) memakai varian CSS lg:/motion-reduce:
  // agar markup server & client identik; JS hanya mengatur nilai transform.
  return (
    <section ref={ref} id="tentang" className="relative lg:h-[170vh] motion-reduce:lg:h-auto">
      <div className="relative min-h-screen overflow-hidden lg:sticky lg:top-0 lg:h-screen motion-reduce:lg:relative motion-reduce:lg:h-auto">
        <HeroBackdrop bannerUrl={bannerUrl} scale={animated ? backdropScale : 1} />

        <motion.div
          style={animated ? { opacity: contentOpacity, y: contentY, scale: contentScale } : undefined}
          // Jarak atas menyisakan ruang navbar + banner pengumuman yang melayang
          // (AnnouncementBanner). Desktop: ≈ tengah layar di layar tinggi,
          // minimal 9rem di layar pendek agar tombol CTA tetap terlihat.
          className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pt-44 pb-16 lg:h-full lg:min-h-0 lg:justify-start lg:pt-[max(9rem,calc(50vh_-_15rem))] lg:pb-10"
        >
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-3">
            {/* KONTEN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1 lg:col-span-2"
            >
              <p className="mb-5 flex items-center gap-2 font-mono text-sm text-cyan-600 sm:text-base dark:text-cyan-400">
                <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
                  &gt;
                </span>
                {greeting}
                <span
                  className="inline-block h-[1.1em] w-[0.55em] animate-pulse bg-cyan-500/80 dark:bg-cyan-400/80"
                  aria-hidden="true"
                />
              </p>
              <h1 className="mb-4 font-display text-5xl leading-[0.92] font-bold tracking-tighter text-slate-900 sm:text-6xl md:text-8xl lg:text-7xl dark:text-slate-50">
                {name}
              </h1>
              <p className="mb-8 font-display text-2xl font-medium tracking-tight text-slate-500 sm:text-3xl md:text-4xl dark:text-slate-400">
                {role}
              </p>
              <p className="mb-10 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="#proyek"
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] dark:text-slate-900"
                >
                  Lihat Karya Saya <ArrowRight size={18} />
                </a>

                {cvUrl && (
                  <>
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white/40 px-6 py-3 font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
                    >
                      <Eye size={18} /> Lihat CV
                    </a>
                    <a
                      href={cvUrl}
                      download="CV-Dony-Kurniawan.pdf"
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white/40 px-6 py-3 font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
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
              className="order-1 flex justify-center lg:order-2 lg:justify-end"
            >
              <ProfilePhoto photoUrl={photoUrl} />
            </motion.div>
          </div>
        </motion.div>

        {/* Petunjuk scroll */}
        <motion.div
          style={animated ? { opacity: hintOpacity } : undefined}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase lg:flex motion-reduce:lg:hidden dark:text-slate-400"
          aria-hidden="true"
        >
          scroll
          <ArrowDown size={14} className="animate-bounce text-cyan-500" />
        </motion.div>

        {/* Larut ke warna latar section berikutnya */}
        <motion.div
          style={{ opacity: animated ? fadeOut : 0 }}
          className="pointer-events-none absolute inset-0 z-20 bg-slate-50 dark:bg-slate-900"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
