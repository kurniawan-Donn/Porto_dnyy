"use client";

import type { TechTag } from "@/lib/types";
import { inputCls, labelCls } from "./styles";

/**
 * Input daftar tag dipisah koma + tombol cepat dari tabel tech_tags.
 * Nilai dikirim pemanggil lewat fd.set(...) karena input ini tidak ber-name.
 */
export default function TagQuickPick({
  label,
  value,
  onChange,
  availableTags,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  availableTags: TechTag[];
  placeholder: string;
}) {
  const add = (name: string) => {
    const current = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (!current.includes(name)) onChange([...current, name].join(", "));
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      <div className="flex flex-wrap gap-1.5 mt-3">
        <p className="text-[10px] font-mono text-slate-600 uppercase mr-1 self-center">Klik untuk tambah:</p>
        {availableTags.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => add(t.name)}
            className="text-[10px] font-mono text-cyan-400/80 hover:text-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/15 border border-cyan-400/20 px-2 py-0.5 rounded-full transition-all"
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
