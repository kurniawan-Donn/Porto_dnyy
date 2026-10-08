"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

type ImageLightboxProps = {
  src: string | null;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ImageLightbox({
  src,
  alt = "Preview",
  isOpen,
  onClose,
}: ImageLightboxProps) {
  // Tutup dengan tombol ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);

    // Lock scroll body saat lightbox terbuka
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau gambar"
        >
          {/* Tombol close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau"
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10
                       flex h-11 w-11 items-center justify-center
                       rounded-full border border-slate-700
                       bg-slate-900/80 text-slate-200
                       transition hover:border-cyan-500 hover:text-cyan-400
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <X size={20} />
          </button>

          {/* Gambar */}
          <motion.div
            className="relative max-h-[92vh] max-w-[92vw] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="block max-h-[92vh] max-w-[92vw] object-contain"
            />
          </motion.div>

          {/* Hint kecil */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-400">
            Tekan <kbd className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px]">ESC</kbd> atau klik area luar untuk menutup
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}