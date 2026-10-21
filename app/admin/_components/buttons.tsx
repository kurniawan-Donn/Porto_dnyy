"use client";

import type { ReactNode } from "react";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import type { FileUpload } from "./useFileUpload";

/** Tombol utama "Tambah ..." di atas daftar */
export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-md transition-all"
    >
      <Plus size={18} /> {children}
    </button>
  );
}

const ROW_ACTION_SIZE = {
  sm: { box: "w-8 h-8", icon: 14 },
  md: { box: "w-9 h-9", icon: 16 },
};

/** Tombol Edit & Hapus di tiap item daftar */
export function RowActions({
  onEdit,
  onDelete,
  size = "sm",
  className = "flex items-center gap-1",
}: {
  onEdit: () => void;
  onDelete: () => void;
  size?: keyof typeof ROW_ACTION_SIZE;
  className?: string;
}) {
  const { box, icon } = ROW_ACTION_SIZE[size];
  return (
    <div className={className}>
      <button
        onClick={onEdit}
        aria-label="Edit"
        className={`${box} rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center transition-all`}
      >
        <Pencil size={icon} />
      </button>
      <button
        onClick={onDelete}
        aria-label="Hapus"
        className={`${box} rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all`}
      >
        <Trash2 size={icon} />
      </button>
    </div>
  );
}

/** Tombol pemicu upload + input file tersembunyi */
export function UploadButton({
  upload,
  label,
  className = "inline-flex items-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm transition-all disabled:opacity-60",
}: {
  upload: FileUpload;
  label: string;
  className?: string;
}) {
  return (
    <>
      <input {...upload.inputProps} />
      <button type="button" onClick={upload.open} disabled={upload.isUploading} className={className}>
        {upload.isUploading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload size={16} /> {label}
          </>
        )}
      </button>
    </>
  );
}
