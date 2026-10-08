"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

// ============================================
// Types
// ============================================
type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credential_url?: string | null;
  icon_name?: string | null;
  image_url?: string | null;
};

// ============================================
// Komponen Utama Certifications
// ============================================
export default function Certifications({
  items = [],
}: {
  items?: Certification[];
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  };

  return (
    <section id="sertifikasi" className="max-w-5xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* ═══ SECTION HEADING — sama persis dengan Skills.tsx ═══ */}
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-4 text-slate-900 dark:text-slate-100">
          <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xl">
            04.
          </span>{" "}
          Sertifikasi
          <div className="h-px bg-slate-300 dark:bg-slate-700 flex-grow ml-4 max-w-xs"></div>
        </h2>

        {/* ═══ GRID CARD ═══ */}
        {items.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Belum ada sertifikasi. Tambahkan melalui admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((cert, index) => {
              const Icon =
                (cert.icon_name &&
                  (Icons as any)[cert.icon_name as keyof typeof Icons]) ||
                Icons.Award;

              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative flex flex-col h-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.5)]"
                >
                  {/* Accent line cyan di atas card */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"
                    aria-hidden="true"
                  />

                  <div className="flex flex-1 flex-col p-4">
                    {/* ═══ GAMBAR / IKON ═══ */}
                    {cert.image_url ? (
                      <button
                        type="button"
                        onClick={() =>
                          openLightbox(cert.image_url!, cert.name)
                        }
                        className="group/img relative block w-full cursor-zoom-in overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        aria-label={`Perbesar sertifikat ${cert.name}`}
                      >
                        <div className="flex aspect-[3/2] w-full items-center justify-center p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cert.image_url}
                            alt={cert.name}
                            className="max-h-full max-w-full object-contain transition duration-500 group-hover/img:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>

                        {/* Zoom hint saat hover */}
                        <span
                          className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-950/80 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-300 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/img:opacity-100"
                          aria-hidden="true"
                        >
                          <Icons.Maximize2 size={11} />
                          Perbesar
                        </span>
                      </button>
                    ) : (
                      <div className="flex aspect-[3/2] w-full items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-500/30 dark:border-cyan-400/30 bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                          <Icon size={26} />
                        </div>
                      </div>
                    )}

                    {/* ═══ KONTEN TEKS ═══ */}
                    <div className="mt-4 flex flex-1 flex-col">
                      <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        {cert.name}
                      </h3>

                      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                        {cert.issuer} · {cert.date}
                      </p>

                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-1 pt-4 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                        >
                          Lihat Kredensial <Icons.ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Lightbox — menampilkan gambar ORIGINAL ukuran penuh */}
      <ImageLightbox
        src={lightboxSrc}
        alt={lightboxAlt}
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </section>
  );
}