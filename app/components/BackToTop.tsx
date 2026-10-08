"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useSound } from "./SoundProvider";


export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const { play } = useSound();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Muncul kalau sudah scroll > 15% dari halaman
      setIsVisible(latest > 0.15);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToTop = () => {
    play("click"); // ← tambah
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] w-12 h-12 md:w-14 md:h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 shadow-[0_8px_30px_rgba(6,182,212,0.5)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.7)] flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
        >
          {/* Ring animasi */}
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping opacity-30" />

          {/* Icon */}
          <ArrowUp
            size={20}
            className="group-hover:-translate-y-0.5 transition-transform duration-300"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}