"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Search, Check, Plus } from "lucide-react";
import { TechIcon } from "@/lib/tech-icons";

export type TechTagOption = {
  id: string;
  name: string;
  icon: string | null;
};

type Props = {
  /** Daftar semua tag yang tersedia di database */
  availableTags: TechTagOption[];
  /** Tag yang saat ini dipilih (array of tag names) */
  value: string[];
  /** Callback saat ada perubahan */
  onChange: (tags: string[]) => void;
  /** Placeholder input */
  placeholder?: string;
};

export default function TechTagSelector({
  availableTags,
  value,
  onChange,
  placeholder = "Ketik untuk mencari tag...",
}: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter tag berdasarkan query
  const filtered = useMemo(() => {
    if (!query.trim()) return availableTags;
    const q = query.toLowerCase().trim();
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(q)
    );
  }, [query, availableTags]);

  // Deteksi tag yang sudah dipilih (case-insensitive)
  const selectedSet = useMemo(
    () => new Set(value.map((v) => v.toLowerCase())),
    [value]
  );

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tagName: string) => {
    if (selectedSet.has(tagName.toLowerCase())) return;
    onChange([...value, tagName]);
    setQuery("");
    setHighlightIndex(0);
    inputRef.current?.focus();
  };

  const removeTag = (tagName: string) => {
    onChange(value.filter((t) => t !== tagName));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIndex]) {
        addTag(filtered[highlightIndex].name);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (
      e.key === "Backspace" &&
      !query &&
      value.length > 0
    ) {
      // Hapus tag terakhir kalau input kosong
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      {/* ─── Selected Tags ─── */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tagName) => {
            const tag = availableTags.find(
              (t) => t.name.toLowerCase() === tagName.toLowerCase()
            );
            return (
              <span
                key={tagName}
                className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 font-mono text-xs text-cyan-600 dark:text-cyan-400"
              >
                <TechIcon name={tag?.icon} size={12} />
                {tagName}
                <button
                  type="button"
                  onClick={() => removeTag(tagName)}
                  className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full transition hover:bg-cyan-500/20"
                  aria-label={`Hapus ${tagName}`}
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* ─── Input + Dropdown ─── */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setHighlightIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:placeholder:text-slate-600"
          />
        </div>

        {/* Dropdown hasil */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">
                Tidak ada tag cocok dengan &quot;{query}&quot;
              </div>
            ) : (
              filtered.map((tag, index) => {
                const isSelected = selectedSet.has(tag.name.toLowerCase());
                const isHighlighted = index === highlightIndex;

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addTag(tag.name)}
                    onMouseEnter={() => setHighlightIndex(index)}
                    disabled={isSelected}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? "cursor-not-allowed bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                        : isHighlighted
                          ? "bg-slate-100 dark:bg-slate-800"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                      <TechIcon name={tag.icon} size={16} />
                    </span>
                    <span className="flex-1 truncate text-slate-700 dark:text-slate-300">
                      {tag.name}
                    </span>

                    {/* Indikator: sudah dipakai atau belum */}
                    {isSelected ? (
                      <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        <Check size={12} /> Dipakai
                      </span>
                    ) : (
                      <Plus size={14} className="text-slate-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-slate-500">
        Ketik untuk mencari, klik untuk menambah. Tekan{" "}
        <kbd className="rounded border border-slate-300 px-1 text-[10px] dark:border-slate-700">
          Enter
        </kbd>{" "}
        untuk pilih yang disorot,{" "}
        <kbd className="rounded border border-slate-300 px-1 text-[10px] dark:border-slate-700">
          ↑↓
        </kbd>{" "}
        navigasi.
      </p>
    </div>
  );
}