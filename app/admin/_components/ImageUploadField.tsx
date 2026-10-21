"use client";

import { Image as ImageIcon } from "lucide-react";
import { UploadButton } from "./buttons";
import { labelCls } from "./styles";
import type { FileUpload } from "./useFileUpload";

/** Field upload gambar kecil: thumbnail + tombol upload/hapus + petunjuk ukuran */
export default function ImageUploadField({
  label,
  url,
  upload,
  onRemove,
  previewClassName,
  buttonLabel = "Upload Gambar",
  hint,
}: {
  label: string;
  url: string;
  upload: FileUpload;
  onRemove: () => void;
  /** Ukuran kotak thumbnail, mis. "w-32 h-20" */
  previewClassName: string;
  buttonLabel?: string;
  hint: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-4 items-start">
        <div
          className={`${previewClassName} rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={26} className="text-slate-700" />
          )}
        </div>
        <div className="flex-1">
          <UploadButton upload={upload} label={buttonLabel} />
          {url && (
            <button type="button" onClick={onRemove} className="ml-2 text-xs text-red-400 hover:underline">
              Hapus
            </button>
          )}
          <p className="text-xs text-slate-600 mt-2">{hint}</p>
        </div>
      </div>
    </div>
  );
}
