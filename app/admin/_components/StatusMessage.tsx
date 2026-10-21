"use client";

import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const TONE = {
  success: {
    icon: CheckCircle2,
    className: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  error: {
    icon: AlertCircle,
    className: "text-red-400 bg-red-500/10 border-red-500/20",
  },
};

/** Banner pesan beranimasi (mis. "Proyek dihapus!"). Kosong → tidak tampil. */
export function StatusMessage({
  message,
  tone = "success",
  className = "",
}: {
  message: string;
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const { icon: Icon, className: toneCls } = TONE[tone];
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-center gap-2 text-sm border rounded-md px-4 py-2.5 ${toneCls} ${className}`}
        >
          <Icon size={16} /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Kotak error statis di dalam form */
export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5">
      <AlertCircle size={16} /> {message}
    </div>
  );
}
