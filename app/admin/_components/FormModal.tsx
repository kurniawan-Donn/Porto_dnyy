"use client";

import type { FormEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { FormError } from "./StatusMessage";
import { primaryButtonCls, secondaryButtonCls } from "./styles";

/**
 * Kerangka modal form admin: header (kicker + judul + tutup), isi form yang
 * bisa di-scroll, error, dan footer Batal / Simpan. Bungkus dengan
 * <AnimatePresence> di pemanggil agar animasi keluar berjalan.
 */
export default function FormModal({
  formId,
  kicker,
  title,
  maxWidth,
  isEditing,
  isPending,
  submitDisabled = false,
  error,
  onSubmit,
  onClose,
  children,
}: {
  formId: string;
  kicker: string;
  title: string;
  /** Kelas lebar maksimum panel, mis. "max-w-lg" */
  maxWidth: string;
  isEditing: boolean;
  isPending: boolean;
  submitDisabled?: boolean;
  error: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-slate-900 border border-slate-700 rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.2)]`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">{kicker}</p>
            <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>

        <form id={formId} onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {children}
          <FormError message={error} />
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
          <button type="button" onClick={onClose} className={secondaryButtonCls}>
            <X size={16} /> Batal
          </button>
          <button
            type="submit"
            form={formId}
            disabled={isPending || submitDisabled}
            className={primaryButtonCls}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} /> {isEditing ? "Update" : "Simpan"}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
