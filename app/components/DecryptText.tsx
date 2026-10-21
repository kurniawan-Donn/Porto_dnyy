"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/\\_=+";
// Batasi update teks ~25 fps; cukup untuk kesan "berkedip" tanpa membebani render
const FRAME_MS = 40;

function scramble(text: string, progress: number): string {
  const revealed = Math.floor(progress * text.length);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

/**
 * Teks yang "terdekripsi" dari karakter acak ke teks asli saat pertama kali
 * terlihat. HTML server berisi teks asli (aman untuk SEO & tanpa JS);
 * pembaca layar membaca versi sr-only, bukan karakter acak.
 */
export default function DecryptText({
  text,
  duration = 900,
}: {
  text: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        let last = 0;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          if (now - last >= FRAME_MS || progress === 1) {
            last = now;
            setDisplay(progress === 1 ? text : scramble(text, progress));
          }
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration, reduceMotion]);

  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
