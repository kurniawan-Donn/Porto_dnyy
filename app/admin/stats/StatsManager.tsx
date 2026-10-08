"use client";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, CheckCircle2, AlertCircle,
  FolderGit2, Award, Calendar, Cpu, Briefcase, Users, Star, Trophy,
  Code2, Zap, Target, Rocket, Layers, TrendingUp, Link as LinkIcon,
} from "lucide-react";
import { createStat, updateStat, deleteStat } from "@/app/actions/stats";

type Stat = {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  icon_name: string | null;
  order_index: number | null;
  auto_source: string | null;
};

type Counts = {
  projects: number;
  certifications: number;
  experiences: number;
  skills: number;
};

const ICON_OPTIONS = [
  { name: "FolderGit2", icon: FolderGit2 },
  { name: "Award", icon: Award },
  { name: "Calendar", icon: Calendar },
  { name: "Cpu", icon: Cpu },
  { name: "Briefcase", icon: Briefcase },
  { name: "Users", icon: Users },
  { name: "Star", icon: Star },
  { name: "Trophy", icon: Trophy },
  { name: "Code2", icon: Code2 },
  { name: "Zap", icon: Zap },
  { name: "Target", icon: Target },
  { name: "Rocket", icon: Rocket },
  { name: "Layers", icon: Layers },
  { name: "TrendingUp", icon: TrendingUp },
];

const ICON_MAP: Record<string, any> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.name, o.icon])
);

const AUTO_SOURCE_OPTIONS = [
  { value: "none", label: "Manual (isi angka sendiri)" },
  { value: "projects", label: "Auto: Jumlah Proyek" },
  { value: "certifications", label: "Auto: Jumlah Sertifikasi" },
  { value: "experiences", label: "Auto: Jumlah Pengalaman" },
  { value: "skills", label: "Auto: Jumlah Keahlian" },
];

const inputCls =
  "w-full bg-slate-950/60 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all";
const labelCls =
  "block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2";

export default function StatsManager({
  initialStats,
  counts,
}: {
  initialStats: Stat[];
  counts: Counts;
}) {
  const [stats, setStats] = useState(initialStats);
  const [editing, setEditing] = useState<Stat | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSuccess = (m: string) => {
    setMsg(m);
    setTimeout(() => window.location.reload(), 700);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const r = await deleteStat(id);
      if (r.success) {
        setStats((p) => p.filter((x) => x.id !== id));
        setMsg("Stats dihapus!");
        setDeleteId(null);
        setTimeout(() => setMsg(""), 3000);
      } else setMsg(`Error: ${r.error}`);
    });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md px-4 py-2.5"
          >
            <CheckCircle2 size={16} /> {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info banner tentang auto-count */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <LinkIcon size={14} />
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <p className="font-mono uppercase tracking-wider text-cyan-400 mb-1">
              Auto-Count Feature
            </p>
            Pilih <strong className="text-slate-200">auto_source</strong> untuk
            sync otomatis. Contoh: kalau pilih "Jumlah Proyek", angka akan
            otomatis menyesuaikan jumlah proyek di database. Saat ini: <br />
            <span className="text-cyan-400 font-mono">
              {counts.projects} proyek • {counts.certifications} sertifikasi •{" "}
              {counts.experiences} pengalaman • {counts.skills} keahlian
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setEditing("new")}
        className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-md transition-all"
      >
        <Plus size={18} /> Tambah Kartu Stats
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = ICON_MAP[s.icon_name || "FolderGit2"] || FolderGit2;
          // Preview real value kalau auto
          const displayValue = s.auto_source
            ? counts[s.auto_source as keyof Counts] ?? s.value
            : s.value;

          return (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(s)}
                    className="w-8 h-8 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="w-8 h-8 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="text-3xl font-bold font-mono text-slate-100 mb-1">
                {displayValue}
                {s.suffix}
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                {s.label}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-600">
                  #{s.order_index}
                </span>
                {s.auto_source ? (
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                    ⇄ {s.auto_source}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">
                    manual
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {editing && (
          <StatFormModal
            initialData={editing === "new" ? null : editing}
            counts={counts}
            onClose={() => setEditing(null)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-100 text-center mb-2">
                Hapus Kartu Stats?
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-slate-700 text-slate-300 py-2.5 rounded-md text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white font-medium py-2.5 rounded-md text-sm"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Form Modal
// ============================================
function StatFormModal({
  initialData, counts, onClose, onSuccess,
}: {
  initialData: Stat | null;
  counts: Counts;
  onClose: () => void;
  onSuccess: (m: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [iconName, setIconName] = useState(initialData?.icon_name || "FolderGit2");
  const [autoSource, setAutoSource] = useState(initialData?.auto_source || "none");
  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("icon_name", iconName);
    fd.set("auto_source", autoSource);

    startTransition(async () => {
      const r = isEditing
        ? await updateStat(initialData.id, fd)
        : await createStat(fd);
      if (r.success) onSuccess(isEditing ? "Stats diupdate!" : "Stats ditambahkan!");
      else setError(r.error ?? "Gagal.");
    });
  };

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
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.2)]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
              {isEditing ? "Edit" : "Tambah"}
            </p>
            <h2 className="text-xl font-bold text-slate-100">
              {isEditing ? initialData.label : "Kartu Stats Baru"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>

        <form
          id="stat-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          <div>
            <label className={labelCls}>Label *</label>
            <input
              name="label"
              defaultValue={initialData?.label ?? ""}
              required
              placeholder="Proyek Selesai"
              className={inputCls}
            />
          </div>

          {/* Auto Source */}
          <div>
            <label className={labelCls}>Mode Angka</label>
            <select
              value={autoSource}
              onChange={(e) => setAutoSource(e.target.value)}
              className={inputCls}
            >
              {AUTO_SOURCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {autoSource !== "none" && (
              <p className="text-xs text-cyan-400/80 mt-2 font-mono">
                Preview: {counts[autoSource as keyof Counts] ?? 0} (dari database)
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
              <input
                name="suffix"
                defaultValue={initialData?.suffix ?? "+"}
                placeholder="+"
                maxLength={3}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Urutan</label>
              <input
                name="order_index"
                type="number"
                defaultValue={initialData?.order_index ?? 0}
                className={inputCls}
              />
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

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-md text-sm"
          >
            <X size={16} /> Batal
          </button>
          <button
            type="submit"
            form="stat-form"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold px-6 py-2.5 rounded-md text-sm"
          >
            {isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
            ) : (
              <><Save size={16} /> {isEditing ? "Update" : "Simpan"}</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}