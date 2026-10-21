"use client";

import { useState, type FormEvent } from "react";
import { createStat, updateStat } from "@/app/actions/stats";
import { STAT_ICON_OPTIONS as ICON_OPTIONS } from "@/lib/lucide-icons";
import type { Stat, StatCounts } from "@/lib/types";
import FormModal from "../_components/FormModal";
import { inputCls, labelCls } from "../_components/styles";
import { useEntityForm } from "../_components/useEntityForm";

const AUTO_SOURCE_OPTIONS = [
  { value: "none", label: "Manual (isi angka sendiri)" },
  { value: "projects", label: "Auto: Jumlah Proyek" },
  { value: "certifications", label: "Auto: Jumlah Sertifikasi" },
  { value: "experiences", label: "Auto: Jumlah Pengalaman" },
  { value: "skills", label: "Auto: Jumlah Keahlian" },
];

export default function StatForm({
  initialData,
  counts,
  onClose,
  onSaved,
}: {
  initialData: Stat | null;
  counts: StatCounts;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [iconName, setIconName] = useState(initialData?.icon_name || "FolderGit2");
  const [autoSource, setAutoSource] = useState<string>(initialData?.auto_source || "none");
  const { isEditing, isPending, error, submit } = useEntityForm({
    initialData,
    create: createStat,
    update: updateStat,
    messages: { created: "Stats ditambahkan!", updated: "Stats diupdate!" },
    onSaved,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("icon_name", iconName);
    fd.set("auto_source", autoSource);
    submit(fd);
  };

  return (
    <FormModal
      formId="stat-form"
      kicker={isEditing ? "Edit" : "Tambah"}
      title={initialData?.label ?? "Kartu Stats Baru"}
      maxWidth="max-w-lg"
      isEditing={isEditing}
      isPending={isPending}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <div>
        <label className={labelCls}>Label *</label>
        <input name="label" defaultValue={initialData?.label ?? ""} required placeholder="Proyek Selesai" className={inputCls} />
      </div>

      {/* Auto Source */}
      <div>
        <label className={labelCls}>Mode Angka</label>
        <select value={autoSource} onChange={(e) => setAutoSource(e.target.value)} className={inputCls}>
          {AUTO_SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {autoSource !== "none" && (
          <p className="text-xs text-cyan-400/80 mt-2 font-mono">
            Preview: {counts[autoSource as keyof StatCounts] ?? 0} (dari database)
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Nilai</label>
          <input
            name="value"
            type="number"
            defaultValue={initialData?.value ?? 0}
            disabled={autoSource !== "none"}
            className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>
        <div>
          <label className={labelCls}>Suffix</label>
          <input name="suffix" defaultValue={initialData?.suffix ?? "+"} placeholder="+" maxLength={3} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Urutan</label>
          <input name="order_index" type="number" defaultValue={initialData?.order_index ?? 0} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Icon</label>
        <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
          {ICON_OPTIONS.map((opt) => {
            const IconComp = opt.icon;
            const isActive = iconName === opt.name;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => setIconName(opt.name)}
                className={`flex items-center justify-center p-2.5 rounded-md border transition-all ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                    : "bg-slate-950/60 border-slate-700 text-slate-500 hover:border-slate-600"
                }`}
                title={opt.name}
              >
                <IconComp size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </FormModal>
  );
}
