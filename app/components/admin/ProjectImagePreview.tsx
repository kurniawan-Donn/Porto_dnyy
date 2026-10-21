"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ImageIcon } from "lucide-react";

// ============================================
// Rasio kotak gambar project di situs publik — samakan bila mengubah
// app/components/Projects.tsx atau app/projects/[slug]/page.tsx.
// ============================================
export const PROJECT_IMAGE_SLOTS = [
  { key: "card", label: "Kartu", ratio: 16 / 10, aspect: "aspect-[16/10]" },
  { key: "featured", label: "Kartu featured", ratio: 21 / 9, aspect: "aspect-[21/9]" },
  { key: "page", label: "Halaman case study", ratio: 16 / 9, aspect: "aspect-[16/9]" },
] as const;

export const RECOMMENDED_IMAGE = { width: 1920, height: 1080, maxKb: 400 };

const RECOMMENDED_RATIO = RECOMMENDED_IMAGE.width / RECOMMENDED_IMAGE.height;
// Lebar tampil terbesar (kartu featured ±976 px, case study ±848 px) di layar retina
const MIN_SHARP_WIDTH = 1600;

type Size = { width: number; height: number };

/**
 * Bagian gambar (dalam pecahan 0–1) yang tetap terlihat di semua slot setelah
 * object-cover. Contoh gambar 16:9 → lebar 0.9 (slot 16:10 memotong sisi)
 * dan tinggi ≈0.76 (slot 21:9 memotong atas-bawah).
 */
function safeArea({ width, height }: Size) {
  const r = width / height;
  let w = 1;
  let h = 1;
  for (const slot of PROJECT_IMAGE_SLOTS) {
    if (r > slot.ratio) w = Math.min(w, slot.ratio / r);
    else h = Math.min(h, r / slot.ratio);
  }
  return { w, h };
}

function formatRatio(r: number) {
  const known: [number, string][] = [
    [16 / 9, "16:9"],
    [16 / 10, "16:10"],
    [4 / 3, "4:3"],
    [3 / 2, "3:2"],
    [21 / 9, "21:9"],
    [1, "1:1"],
  ];
  const match = known.find(([value]) => Math.abs(value - r) < 0.03);
  return match ? match[1] : `${r.toFixed(2)}:1`;
}

/**
 * Preview gambar project: area aman pada gambar asli + tampilan di tiap slot
 * persis seperti di situs (object-cover), plus peringatan ukuran/rasio.
 */
export default function ProjectImagePreview({
  imageUrl,
  featured,
  fileSizeKb,
}: {
  imageUrl: string;
  featured: boolean;
  fileSizeKb?: number | null;
}) {
  const [size, setSize] = useState<Size | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  // Ukuran lama tidak berlaku saat gambar diganti
  const current = loadedUrl === imageUrl ? size : null;

  const readSize = (img: HTMLImageElement) => {
    setSize({ width: img.naturalWidth, height: img.naturalHeight });
    setLoadedUrl(imageUrl);
  };

  if (!imageUrl) {
    return (
      <div className="flex aspect-[16/9] w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950 text-center">
        <ImageIcon size={28} className="text-slate-700" />
        <p className="text-[11px] text-slate-500">
          Belum ada gambar · ideal {RECOMMENDED_IMAGE.width}×{RECOMMENDED_IMAGE.height} (16:9)
        </p>
      </div>
    );
  }

  const area = current ? safeArea(current) : null;
  const ratio = current ? current.width / current.height : null;

  const warnings: string[] = [];
  if (current && ratio) {
    if (Math.abs(ratio - RECOMMENDED_RATIO) / RECOMMENDED_RATIO > 0.08) {
      const lostFeatured = Math.round((1 - Math.min(1, ratio / (21 / 9))) * 100);
      warnings.push(
        `Rasio ${formatRatio(ratio)} — di kartu featured ±${lostFeatured}% tinggi gambar terpotong. Ideal 16:9.`
      );
    }
    if (current.width < MIN_SHARP_WIDTH) {
      warnings.push(
        `Lebar ${current.width}px — bisa terlihat buram di layar retina (kartu featured & halaman case study). Minimal ${MIN_SHARP_WIDTH}px.`
      );
    }
  }
  if (fileSizeKb && fileSizeKb > RECOMMENDED_IMAGE.maxKb) {
    warnings.push(
      `File ${fileSizeKb} KB — kartu di beranda memuat file asli; kompres ke ≤ ${RECOMMENDED_IMAGE.maxKb} KB (WebP/JPG).`
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
        {/* Gambar asli + area aman */}
        <div>
          <p className="mb-1.5 font-mono text-[10px] tracking-wider text-slate-500 uppercase">
            Gambar asli{current && ` · ${current.width}×${current.height} · ${formatRatio(ratio!)}`}
          </p>
          <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Preview gambar project"
              className="block h-auto w-full"
              // Gambar dari cache bisa selesai dimuat sebelum React hydrate,
              // sehingga onLoad terlewat — cek juga saat elemen terpasang
              ref={(el) => {
                if (el?.complete && el.naturalWidth && loadedUrl !== imageUrl) readSize(el);
              }}
              onLoad={(e) => readSize(e.currentTarget)}
            />
            {area && (
              <>
                {/* Gelapkan bagian yang terpotong di salah satu slot */}
                <div
                  className="pointer-events-none absolute border-2 border-dashed border-cyan-400 shadow-[0_0_0_9999px_rgba(2,6,23,0.55)]"
                  style={{
                    width: `${area.w * 100}%`,
                    height: `${area.h * 100}%`,
                    left: `${((1 - area.w) / 2) * 100}%`,
                    top: `${((1 - area.h) / 2) * 100}%`,
                  }}
                />
                <span className="pointer-events-none absolute top-1.5 left-1.5 rounded bg-cyan-500 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-950">
                  AREA AMAN
                </span>
              </>
            )}
          </div>
        </div>

        {/* Tampilan di tiap slot */}
        <div className="space-y-2.5">
          {PROJECT_IMAGE_SLOTS.map((slot) => {
            const active = slot.key === "page" || (slot.key === "featured") === featured;
            return (
              <div key={slot.key} className={active ? "" : "opacity-45"}>
                <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  {slot.label} · {formatRatio(slot.ratio)}
                  {active && <span className="text-cyan-400">· dipakai</span>}
                </p>
                <div
                  className={`${slot.aspect} overflow-hidden rounded-md border ${
                    active ? "border-cyan-500/50" : "border-slate-800"
                  } bg-slate-950`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {current &&
        (warnings.length > 0 ? (
          <ul className="space-y-1">
            {warnings.map((w) => (
              <li key={w} className="flex items-start gap-1.5 text-[11px] text-amber-400">
                <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 size={12} /> Ukuran & rasio sudah pas untuk semua tampilan.
          </p>
        ))}
    </div>
  );
}
