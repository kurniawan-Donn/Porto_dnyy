"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Megaphone, X } from "lucide-react";

type Props = {
  text: string | null;
  active: boolean | null;
  version?: string | null; // pakai updated_at untuk reset dismiss saat banner di-update
};

export default function AnnouncementBanner({ text, active, version }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!active || !text || text.trim() === "") return;

    // Key berbeda tiap kali banner di-update
    const dismissKey = `banner-dismissed-${version || "v1"}`;
    const isDismissed = localStorage.getItem(dismissKey) === "1";

    if (!isDismissed) {
      // Delay sedikit biar animasi smooth
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [active, text, version]);

  const handleDismiss = () => {
    const dismissKey = `banner-dismissed-${version || "v1"}`;
    localStorage.setItem(dismissKey, "1");
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full pt-16 md:pt-20"
        >
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="relative flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg pl-4 pr-2 py-2.5 overflow-hidden group">
              {/* Accent bar kiri */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" />

              {/* Icon megaphone */}
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Megaphone size={13} />
              </div>

              {/* Text */}
              <p className="flex-1 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-snug">
                {text}
              </p>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                aria-label="Tutup banner"
                className="flex-shrink-0 w-7 h-7 rounded-md text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10 flex items-center justify-center transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}