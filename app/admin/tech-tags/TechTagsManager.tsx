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
  Tag as TagIcon,
} from "lucide-react";
import {
  createTechTag,
  updateTechTag,
  deleteTechTag,
} from "@/app/actions/techTags";
import SkillIconPicker from "@/app/components/admin/SkillIconPicker";
import { TechIcon } from "@/lib/tech-icons";

type TechTag = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
};

// ============================================
// Form
// ============================================
function TechTagForm({
  initialData,
  onCancel,
  onSuccess,
}: {
  initialData?: TechTag | null;
  onCancel: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [iconValue, setIconValue] = useState<string>(initialData?.icon ?? "");
  const isEditing = !!initialData;

  const inputClass =
    "w-full bg-slate-950/60 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all";
  const labelClass =
    "block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    // Override icon dengan state picker
    fd.set("icon", iconValue);

    startTransition(async () => {
      const result = isEditing
        ? await updateTechTag(initialData.id, fd)
        : await createTechTag(fd);

      if (result.success) {
        onSuccess(isEditing ? "Tech tag diupdate!" : "Tech tag ditambahkan!");
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
      className="space-y-4 overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-800/60 p-5"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Nama Tech Tag</label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name ?? ""}
            required
            placeholder="Mis. Python"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Kategori</label>
          <input
            type="text"
            name="category"
            defaultValue={initialData?.category ?? ""}
            placeholder="Mis. Programming, Tools, Database"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Deskripsi (muncul di popup)</label>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ""}
          rows={2}
          placeholder="Jelaskan singkat tentang teknologi ini..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Icon</label>
        <SkillIconPicker value={iconValue} onChange={setIconValue} />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition-all hover:border-slate-600"
        >
          <X size={16} /> Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-cyan-400 disabled:opacity-60"
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

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          <AlertCircle size={16} /> {error}
        </div>
      )}
    </motion.form>
  );
}

// ============================================
// Manager
// ============================================
export default function TechTagsManager({
  initialTags,
}: {
  initialTags: TechTag[];
}) {
  const [tags, setTags] = useState(initialTags);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteTechTag(id);
      if (result.success) {
        setTags((prev) => prev.filter((t) => t.id !== id));
        setMessage("Tech tag dihapus!");
        setDeleteId(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    });
  };

  const handleSuccess = (msg: string) => {
    setMessage(msg);
    setEditingId(null);
    setIsAdding(false);
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-400"
          >
            <CheckCircle2 size={16} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {!isAdding && (
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-5 py-2.5 font-semibold text-slate-900 transition-all hover:bg-cyan-400"
        >
          <Plus size={18} /> Tambah Tech Tag
        </button>
      )}

      <AnimatePresence>
        {isAdding && (
          <TechTagForm
            onCancel={() => setIsAdding(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-800/40 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <TagIcon size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-100">Semua Tech Tags</h3>
            <p className="text-xs text-slate-500">{tags.length} tag</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {tags.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-600">
              Belum ada tech tag.
            </div>
          )}

          {tags.map((tag) => {
            const isEditing = editingId === tag.id;

            if (isEditing) {
              return (
                <div key={tag.id} className="p-4">
                  <TechTagForm
                    initialData={tag}
                    onCancel={() => setEditingId(null)}
                    onSuccess={handleSuccess}
                  />
                </div>
              );
            }

            return (
              <motion.div
                key={tag.id}
                layout
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-slate-800/40"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
                  <TechIcon name={tag.icon} size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-medium text-slate-100">{tag.name}</h4>
                    {tag.category && (
                      <span className="font-mono text-[10px] text-slate-600">
                        {tag.category}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {tag.description || "— Tidak ada deskripsi —"}
                  </p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    onClick={() => setEditingId(tag.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-cyan-500/10 hover:text-cyan-400"
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(tag.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
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

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
                <Trash2 size={24} />
              </div>
              <h3 className="mb-2 text-center text-lg font-bold text-slate-100">
                Hapus Tech Tag?
              </h3>
              <p className="mb-6 text-center text-sm text-slate-500">
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-md border border-slate-700 py-2.5 text-sm text-slate-300 transition-all hover:border-slate-600"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isPending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-red-500 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-400 disabled:opacity-60"
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