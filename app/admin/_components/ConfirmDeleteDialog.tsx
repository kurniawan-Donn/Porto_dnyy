"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2, Trash2 } from "lucide-react";

/** Dialog konfirmasi hapus. Tampil selama `open` true. */
export default function ConfirmDeleteDialog({
  open,
  title,
  isPending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-label={title}
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-100 text-center mb-2">{title}</h3>
            <p className="text-sm text-slate-500 text-center mb-6">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 border border-slate-700 hover:border-slate-600 text-slate-300 py-2.5 rounded-md text-sm transition-all"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white font-medium py-2.5 rounded-md text-sm transition-all"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Hapus
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
