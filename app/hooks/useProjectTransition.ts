"use client";

import { useCallback, useRef, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { projectImageTransition, projectTitleTransition } from "@/lib/view-transitions";

// Browser membatalkan transisi bila update DOM > ~4 detik; beri batas lebih awal
const WAIT_TIMEOUT_MS = 2000;
const POLL_MS = 16;

// Pakai setTimeout, bukan requestAnimationFrame: selama callback view
// transition berjalan, browser menahan rendering sehingga rAF tidak dipanggil
function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Tunggu sampai elemen halaman tujuan ada di DOM (atau timeout) */
async function waitForElement(selector: string) {
  const start = performance.now();
  while (!document.querySelector(selector) && performance.now() - start < WAIT_TIMEOUT_MS) {
    await sleep(POLL_MS);
  }
}

/**
 * Morph gambar & judul kartu project ke posisinya di halaman case study.
 *
 * Sengaja memakai View Transitions API langsung, bukan <ViewTransition> React:
 * kartu berada jauh di bawah beranda, sedangkan React memasangkan elemen
 * sebelum Next menggulir ke atas — elemen tujuan masih di luar layar sehingga
 * pasangan tidak terbentuk. Di sini snapshot "new" baru diambil setelah
 * halaman tujuan tampil dan sudah di-scroll ke atas.
 */
export function useProjectTransition(projectId: string, href: string) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Biarkan perilaku bawaan untuk tab baru, klik tengah, dsb.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (reduceMotion || typeof document.startViewTransition !== "function") return;

      e.preventDefault();

      const named: [HTMLElement | null, string][] = [
        [imageRef.current, projectImageTransition(projectId)],
        [titleRef.current, projectTitleTransition(projectId)],
      ];
      for (const [el, name] of named) {
        if (el) el.style.viewTransitionName = name;
      }

      const transition = document.startViewTransition(async () => {
        // Snapshot lama sudah diambil; lepas nama agar tidak bentrok dengan halaman baru
        for (const [el] of named) {
          if (el) el.style.viewTransitionName = "";
        }
        router.push(href);
        await waitForElement(`[data-project-page="${projectId}"]`);
        window.scrollTo({ top: 0, behavior: "instant" });
      });

      // Navigasi tetap berjalan walau transisi dibatalkan browser
      transition.finished.catch(() => {});
    },
    [href, projectId, reduceMotion, router]
  );

  return { imageRef, titleRef, onClick };
}
