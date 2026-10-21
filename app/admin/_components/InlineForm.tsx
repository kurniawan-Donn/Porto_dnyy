"use client";

import type { FormEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { FormError } from "./StatusMessage";

/** Form yang terbuka di dalam daftar (Keahlian, Tech Tags), bukan di modal */
export function InlineForm({
  onSubmit,
  error,
  children,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  error: string;
  children: ReactNode;
}) {
  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={onSubmit}
      className="bg-slate-800/60 border border-cyan-500/30 rounded-lg p-5 space-y-4 overflow-hidden"
    >
      {children}
      <FormError message={error} />
    </motion.form>
  );
}

/** Tombol Batal + Tambah/Update untuk InlineForm */
export function InlineFormActions({
  isEditing,
  isPending,
  onCancel,
  className = "flex justify-end gap-3",
}: {
  isEditing: boolean;
  isPending: boolean;
  onCancel: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-2.5 rounded-md text-sm transition-all"
      >
        <X size={16} /> Batal
      </button>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold px-6 py-2.5 rounded-md text-sm transition-all"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Menyimpan...
          </>
        ) : (
          <>
            <Save size={16} /> {isEditing ? "Update" : "Tambah"}
          </>
        )}
      </button>
    </div>
  );
}
