"use client";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Untuk glow di ujung (0% → 100% width viewport)
  const glowLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        aria-hidden="true"
      />

      {/* Glow Tip */}
      <motion.div
        style={{ left: glowLeft }}
        className="fixed top-0 h-[3px] w-16 z-[101] -translate-x-full pointer-events-none bg-gradient-to-l from-white/90 to-transparent blur-sm"
        aria-hidden="true"
      />
    </>
  );
}