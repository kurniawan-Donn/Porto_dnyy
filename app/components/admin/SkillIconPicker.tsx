"use client";

import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { AVAILABLE_ICONS, TechIcon } from "@/lib/tech-icons";

type Props = {
  value: string | null;
  onChange: (value: string) => void;
};

export default function SkillIconPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return AVAILABLE_ICONS;
    const q = query.toLowerCase().trim();
    return AVAILABLE_ICONS.filter(
      (icon) =>
        icon.label.toLowerCase().includes(q) ||
        icon.key.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Cari icon... (misal: python, git, laravel)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
        />
      </div>

      {/* Hidden input — supaya nilai tetap terkirim saat submit form */}
      <input type="hidden" name="icon" value={value ?? ""} />

      {/* Grid picker */}
      <div className="max-h-60 overflow-y-auto rounded-md border border-slate-700 bg-slate-950/40 p-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            Tidak ada icon yang cocok dengan &quot;{query}&quot;
          </p>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {filtered.map((icon) => {
              const isSelected = value === icon.key;
              return (
                <button
                  key={icon.key}
                  type="button"
                  onClick={() => onChange(icon.key)}
                  title={icon.label}
                  aria-label={icon.label}
                  aria-pressed={isSelected}
                  className={`relative flex flex-col items-center justify-center gap-1 rounded-md border p-2 transition ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/50"
                      : "border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/60"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}

                  <span className="flex h-7 w-7 items-center justify-center">
                    <TechIcon name={icon.key} size={22} />
                  </span>

                  <span className="text-[9px] text-slate-400 text-center leading-tight truncate w-full">
                    {icon.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview yang dipilih */}
      {value && (
        <div className="flex items-center gap-3 rounded-md border border-cyan-500/30 bg-cyan-500/5 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/10">
            <TechIcon name={value} size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Icon terpilih
            </p>
            <p className="text-sm font-medium text-cyan-400 truncate">
              {value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}