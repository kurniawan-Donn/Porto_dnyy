"use client";
import { useEffect, useState, useRef } from "react";

/**
 * Hook untuk mendeteksi section mana yang sedang aktif di viewport.
 * Menggunakan IntersectionObserver untuk performa optimal.
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");
  const visibilityMap = useRef<Map<string, number>>(new Map());
  const idsRef = useRef(sectionIds);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Update visibility ratio untuk setiap section
      entries.forEach((entry) => {
        visibilityMap.current.set(entry.target.id, entry.intersectionRatio);
      });

      // Cari section dengan visibility tertinggi
      let maxRatio = 0;
      let currentSection = "";

      visibilityMap.current.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          currentSection = id;
        }
      });

      if (currentSection && maxRatio > 0) {
        setActiveSection(currentSection);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      // rootMargin atas -20% & bawah -35% → fokus ke area tengah viewport
      rootMargin: "-20% 0px -35% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    // Tunggu sedikit agar semua section ter-render dulu
    const timer = setTimeout(() => {
      idsRef.current.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return activeSection;
}