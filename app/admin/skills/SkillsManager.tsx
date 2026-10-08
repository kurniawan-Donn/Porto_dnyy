"use client";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
  Smartphone,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { createSkill, updateSkill, deleteSkill } from "@/app/actions/skills";

import SkillIconPicker from "@/app/components/admin/SkillIconPicker";
import { TechIcon } from "@/lib/tech-icons";

type Skill = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_index: number;
};

const CATEGORIES = [
  { name: "Web Development", icon: Code2 },
  { name: "Mobile & Software", icon: Smartphone },
  { name: "Tools & Audit", icon: ShieldCheck },
];

// ============================================
// Komponen Form (Add / Edit)
// ============================================
function SkillForm({
  initialData,
  onCancel,
  onSuccess,
}: {
  initialData?: Skill | null;
  onCancel: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isEditing = !!initialData;

  const [iconValue, setIconValue] = useState<string>(initialData?.icon ?? "");

  const inputClass =
    "w-full bg-slate-950/60 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all";
  const labelClass =
    "block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isEditing
        ? await updateSkill(initialData.id, fd)
        : await createSkill(fd);

      if (result.success) {
        onSuccess(isEditing ? "Keahlian diupdate!" : "Keahlian ditambahkan!");
      } else {
        setError(result.error ?? "Gagal menyimpan.");
      }
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="bg-slate-800/60 border border-cyan-500/30 rounded-lg p-5 space-y-4 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className={labelClass}>Kategori</label>
    <select
      name="category"
      defaultValue={initialData?.category ?? CATEGORIES[0].name}
      className={inputClass}
    >
      {CATEGORIES.map((c) => (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  </div>
  <div>
    <label className={labelClass}>Nama Keahlian</label>
    <input
      type="text"
      name="name"
      defaultValue={initialData?.name ?? ""}
      required
      placeholder="Mis. Kotlin"
      className={inputClass}
    />
  </div>
</div>

{/* ⬇️ FIELD ICON DIPISAH — full width di bawah */}
<div>
  <label className={labelClass}>Icon</label>
  <SkillIconPicker value={iconValue} onChange={setIconValue} />
</div>

      <div>
        <label className={labelClass}>
          Deskripsi (muncul di popup public)
        </label>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ""}
          rows={3}
          placeholder="Jelaskan secara singkat tentang keahlian ini, pengalaman Anda, atau tools terkait..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className={labelClass}>Urutan (kecil = atas)</label>
          <input
            type="number"
            name="order_index"
            defaultValue={initialData?.order_index ?? 0}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
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
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </motion.form>
  );
}

// ============================================
// Komponen Utama Manager
// ============================================
export default function SkillsManager({
  initialSkills,
}: {
  initialSkills: Skill[];
}) {
  const [skills, setSkills] = useState(initialSkills);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ============================================
  // Handle delete
  // ============================================
  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteSkill(id);
      if (result.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        setMessage("Keahlian dihapus!");
        setDeleteId(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    });
  };

  // ============================================
  // Handle success (dari form)
  // ============================================
  const handleSuccess = (msg: string) => {
    setMessage(msg);
    setEditingId(null);
    setIsAdding(false);
    // Force reload untuk dapat data terbaru
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // ============================================
  // Group by category
  // ============================================
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: skills.filter((s) => s.category === cat.name),
  }));

  return (
    <div className="space-y-6">
      {/* Status Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md px-4 py-2.5"
          >
            <CheckCircle2 size={16} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Button */}
      {!isAdding && (
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-md transition-all"
        >
          <Plus size={18} /> Tambah Keahlian Baru
        </button>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <SkillForm
            onCancel={() => setIsAdding(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      {/* Grouped List */}
      {grouped.map((group) => {
        const GroupIcon = group.icon;
        return (
          <div
            key={group.name}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
          >
            {/* Group Header */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/40 border-b border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <GroupIcon size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">{group.name}</h3>
                <p className="text-xs text-slate-500">
                  {group.skills.length} keahlian
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-800">
              {group.skills.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-600">
                  Belum ada keahlian di kategori ini.
                </div>
              )}

              {group.skills.map((skill) => {
                const isEditing = editingId === skill.id;

                if (isEditing) {
                  return (
                    <div key={skill.id} className="p-4">
                      <SkillForm
                        initialData={skill}
                        onCancel={() => setEditingId(null)}
                        onSuccess={handleSuccess}
                      />
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={skill.id}
                    layout
                    className="flex items-center gap-4 p-4 hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                      <TechIcon name={skill.icon} size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-medium text-slate-100">
                          {skill.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-600">
                          #{skill.order_index}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {skill.description || "— Tidak ada deskripsi —"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditingId(skill.id)}
                        className="w-9 h-9 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center transition-all"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(skill.id)}
                        className="w-9 h-9 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all"
                        aria-label="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
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
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-100 text-center mb-2">
                Hapus Keahlian?
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-slate-700 hover:border-slate-600 text-slate-300 py-2.5 rounded-md text-sm transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white font-medium py-2.5 rounded-md text-sm transition-all"
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
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