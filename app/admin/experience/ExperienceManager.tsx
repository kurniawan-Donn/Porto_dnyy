"use client";
import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, CheckCircle2, AlertCircle,
  Briefcase, Calendar, MapPin, Star, Upload, Image as ImageIcon,
} from "lucide-react";
import {
  createExperience, updateExperience, deleteExperience,
} from "@/app/actions/experience";
import { uploadFile } from "@/lib/supabase/storage";

type Experience = {
  id: string;
  position: string;
  company: string;
  period: string | null;
  location: string | null;
  description: string | null;
  tags: string[] | null;
  is_current: boolean | null;
  order_index: number | null;
  image_url: string | null;
};

type TechTag = { id: string; name: string; icon: string | null };

const inputCls =
  "w-full bg-slate-950/60 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all";
const labelCls =
  "block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2";

export default function ExperienceManager({
  initialExperiences,
  availableTags,
}: {
  initialExperiences: Experience[];
  availableTags: TechTag[];
}) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [editing, setEditing] = useState<Experience | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSuccess = (m: string) => {
    setMsg(m);
    setTimeout(() => window.location.reload(), 700);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const r = await deleteExperience(id);
      if (r.success) {
        setExperiences((p) => p.filter((x) => x.id !== id));
        setMsg("Pengalaman dihapus!");
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

      <button
        onClick={() => setEditing("new")}
        className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-md transition-all"
      >
        <Plus size={18} /> Tambah Pengalaman
      </button>

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Logo Perusahaan */}
                {exp.image_url ? (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={exp.image_url}
                      alt={exp.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center text-cyan-400">
                    <Briefcase size={20} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-100">{exp.position}</h3>
                    {exp.is_current && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Active
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-600">#{exp.order_index}</span>
                  </div>
                  <p className="text-cyan-400/80 text-sm flex items-center gap-1.5">
                    <Briefcase size={12} /> {exp.company}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500 font-mono">
                    {exp.period && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} /> {exp.period}
                      </span>
                    )}
                    {exp.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} /> {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono text-cyan-400/80 bg-cyan-400/5 border border-cyan-400/20 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditing(exp)}
                  className="w-9 h-9 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center transition-all"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(exp.id)}
                  className="w-9 h-9 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <ExperienceFormModal
            initialData={editing === "new" ? null : editing}
            availableTags={availableTags}
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
                Hapus Pengalaman?
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
function ExperienceFormModal({
  initialData, availableTags, onClose, onSuccess,
}: {
  initialData: Experience | null;
  availableTags: TechTag[];
  onClose: () => void;
  onSuccess: (m: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(", "));
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Max 5 MB.");
      return;
    }
    setIsUploading(true);
    setError("");
    try {
      const url = await uploadFile(file, "experiences");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleTagClick = (name: string) => {
    const current = tagsInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (!current.includes(name)) {
      setTagsInput([...current, name].join(", "));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("tags", tagsInput);
    fd.set("image_url", imageUrl);

    startTransition(async () => {
      const r = isEditing
        ? await updateExperience(initialData.id, fd)
        : await createExperience(fd);
      if (r.success) onSuccess(isEditing ? "Pengalaman diupdate!" : "Pengalaman ditambahkan!");
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
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.2)]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
              {isEditing ? "Edit" : "Tambah"}
            </p>
            <h2 className="text-xl font-bold text-slate-100">
              {isEditing ? initialData.position : "Pengalaman Baru"}
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
          id="exp-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Posisi *</label>
              <input
                name="position"
                defaultValue={initialData?.position ?? ""}
                required
                placeholder="IT Audit Intern"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Perusahaan *</label>
              <input
                name="company"
                defaultValue={initialData?.company ?? ""}
                required
                placeholder="Politeknik Negeri Madiun"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Periode</label>
              <input
                name="period"
                defaultValue={initialData?.period ?? ""}
                placeholder="Januari 2025 - Sekarang"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Lokasi</label>
              <input
                name="location"
                defaultValue={initialData?.location ?? ""}
                placeholder="Madiun, Indonesia"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Deskripsi Pekerjaan</label>
            <textarea
              name="description"
              defaultValue={initialData?.description ?? ""}
              rows={4}
              placeholder="Jelaskan tanggung jawab dan pencapaian..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Logo Perusahaan / Gambar (opsional)</label>
            <div className="flex gap-4 items-start">
              <div className="w-20 h-20 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={26} className="text-slate-700" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm transition-all disabled:opacity-60"
                >
                  {isUploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload size={16} /> Upload Logo</>
                  )}
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="ml-2 text-xs text-red-400 hover:underline"
                  >
                    Hapus
                  </button>
                )}
                <p className="text-xs text-slate-600 mt-2">PNG/JPG/WebP, max 5 MB. Rekomendasi 200×200 px.</p>
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Tags (pisahkan dengan koma)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="IT Audit, Compliance, Security"
              className={inputCls}
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              <p className="text-[10px] font-mono text-slate-600 uppercase mr-1 self-center">
                Klik untuk tambah:
              </p>
              {availableTags.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTagClick(t.name)}
                  className="text-[10px] font-mono text-cyan-400/80 hover:text-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/15 border border-cyan-400/20 px-2 py-0.5 rounded-full transition-all"
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Urutan (kecil = atas)</label>
              <input
                name="order_index"
                type="number"
                defaultValue={initialData?.order_index ?? 0}
                className={inputCls}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_current"
                  defaultChecked={initialData?.is_current ?? false}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
                <span className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <Star size={14} /> Posisi saat ini (Active)
                </span>
              </label>
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
            form="exp-form"
            disabled={isPending || isUploading}
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