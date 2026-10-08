"use client";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSound } from "./SoundProvider";

export default function SoundToggle() {
  const { isEnabled, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      aria-label={`Sound ${isEnabled ? "aktif" : "nonaktif"} — klik untuk ${
        isEnabled ? "matikan" : "nyalakan"
      }`}
      title={
        isEnabled
          ? "Sound: ON (SFX + Ambient)"
          : "Sound: OFF — klik untuk nyalakan"
      }
      className="group relative w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-center transition-all duration-300 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isEnabled ? "on" : "off"}
          initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25 }}
          className="absolute"
        >
          {isEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </motion.div>
      </AnimatePresence>

      {/* Indikator hijau + icon musik kecil saat aktif */}
      {isEnabled && (
        <>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-1 left-1 text-cyan-500 dark:text-cyan-400"
          >
            <Music size={8} />
          </motion.span>
        </>
      )}
    </button>
  );
}