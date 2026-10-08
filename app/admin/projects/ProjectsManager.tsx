"use client";
import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, CheckCircle2, AlertCircle,
  Upload, Star, Image as ImageIcon,
} from "lucide-react";
import {
  createProject, updateProject, deleteProject,
} from "@/app/actions/projects";
import { uploadFile } from "@/lib/supabase/storage";

type Project = {
  id: string;
  title: string;
  description: string | null;
  tech: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  featured: boolean | null;
  card_cta_text: string | null;
  order_index: number | null;
  case_study: any;
};

type TechTag = { id: string; name: string; icon: string | null };

const inputCls = "w-full bg-slate-950/60 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all";
const labelCls = "block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2";

export default function ProjectsManager({
  initialProjects,
  availableTags,
}: {
  initialProjects: Project[];
  availableTags: TechTag[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSuccess = (m: string) => {
    setMsg(m);
    setTimeout(() => window.location.reload(), 700);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const r = await deleteProject(id);
      if (r.success) {
        setProjects((p) => p.filter((x) => x.id !== id));
        setMsg("Proyek dihapus!");
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
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
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
        <Plus size={18} /> Tambah Proyek
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {p.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    <Star size={10} /> Featured
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-600">#{p.order_index}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(p)} className="w-8 h-8 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-slate-100 mb-1">{p.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
            {p.tech && p.tech.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="text-[10px] font-mono text-cyan-400/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {editing && (
          <ProjectFormModal
            initialData={editing === "new" ? null : editing}
            availableTags={availableTags}
            onClose={() => setEditing(null)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-100 text-center mb-2">Hapus Proyek?</h3>
              <p className="text-sm text-slate-500 text-center mb-6">Tindakan ini tidak bisa dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 border border-slate-700 text-slate-300 py-2.5 rounded-md text-sm">Batal</button>
                <button onClick={() => handleDelete(deleteId)} disabled={isPending} className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white font-medium py-2.5 rounded-md text-sm">
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Hapus
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
// Modal Form
// ============================================
function ProjectFormModal({
  initialData, availableTags, onClose, onSuccess,
}: {
  initialData: Project | null;
  availableTags: TechTag[];
  onClose: () => void;
  onSuccess: (m: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [techInput, setTechInput] = useState((initialData?.tech ?? []).join(", "));
  const isEditing = !!initialData;
  const fileRef = useRef<HTMLInputElement>(null);

  // Case study
  const cs = initialData?.case_study ?? {};

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("File harus gambar."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Max 5 MB."); return; }
    setIsUploading(true);
    try {
      const url = await uploadFile(file, "projects");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleTagClick = (name: string) => {
    const current = techInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (!current.includes(name)) {
      setTechInput([...current, name].join(", "));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("image_url", imageUrl);
    fd.set("tech", techInput);

    startTransition(async () => {
      const r = isEditing
        ? await updateProject(initialData.id, fd)
        : await createProject(fd);
      if (r.success) onSuccess(isEditing ? "Proyek diupdate!" : "Proyek ditambahkan!");
      else setError(r.error ?? "Gagal.");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.2)]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
              {isEditing ? "Edit Proyek" : "Proyek Baru"}
            </p>
            <h2 className="text-xl font-bold text-slate-100">
              {isEditing ? initialData.title : "Tambah Proyek"}
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all hover:rotate-90">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Basic Info */}
          <div>
            <label className={labelCls}>Judul Proyek *</label>
            <input name="title" defaultValue={initialData?.title ?? ""} required placeholder="Sistem Informasi Audit TI" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Deskripsi Singkat *</label>
            <textarea name="description" defaultValue={initialData?.description ?? ""} required rows={3} placeholder="Deskripsi singkat yang muncul di card..." className={`${inputCls} resize-none`} />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Gambar Card (opsional)</label>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-32 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-slate-700" />
                )}
              </div>
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading} className="inline-flex items-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm transition-all">
                  {isUploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><Upload size={16} /> Upload Gambar</>}
                </button>
                {imageUrl && (
                  <button type="button" onClick={() => setImageUrl("")} className="ml-2 text-xs text-red-400 hover:underline">Hapus</button>
                )}
                <p className="text-xs text-slate-600 mt-2">Format: JPG/PNG/WebP, max 5 MB</p>
              </div>
            </div>
          </div>

          {/* Tech Tags */}
          <div>
            <label className={labelCls}>Tech Tags (pisahkan dengan koma)</label>
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="PHP, JavaScript, MySQL" className={inputCls} />
            <div className="flex flex-wrap gap-1.5 mt-3">
              <p className="text-[10px] font-mono text-slate-600 uppercase mr-1 self-center">Klik untuk tambah:</p>
              {availableTags.map((t) => (
                <button key={t.id} type="button" onClick={() => handleTagClick(t.name)} className="text-[10px] font-mono text-cyan-400/80 hover:text-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/15 border border-cyan-400/20 px-2 py-0.5 rounded-full transition-all">
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>GitHub URL</label>
              <input name="github_url" type="url" defaultValue={initialData?.github_url ?? ""} placeholder="https://github.com/..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Demo URL</label>
              <input name="demo_url" type="url" defaultValue={initialData?.demo_url ?? ""} placeholder="https://..." className={inputCls} />
            </div>
          </div>

          {/* CTA & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>CTA Text (tombol di card)</label>
              <input name="card_cta_text" defaultValue={initialData?.card_cta_text ?? "Lihat Selengkapnya"} placeholder="Lihat Studi Kasus / Baca Detail / dll." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Urutan</label>
              <input name="order_index" type="number" defaultValue={initialData?.order_index ?? 0} className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" name="featured" defaultChecked={initialData?.featured ?? false} className="w-4 h-4 accent-cyan-500 cursor-pointer" />
            <span className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              <Star size={14} /> Tampilkan sebagai Featured (full-width)
            </span>
          </label>

          {/* Case Study */}
          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-cyan-400" /> Case Study (Opsional)
            </h3>
            <p className="text-xs text-slate-500 mb-4">Isi kalau proyek ini punya studi kasus STAR. Kalau kosong, klik card tidak akan buka popup.</p>

            <div className="space-y-3">
              <div>
                <label className={labelCls}>Subtitle</label>
                <input name="cs_subtitle" defaultValue={cs.subtitle ?? ""} placeholder="Studi Kasus: ..." className={inputCls} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>S — Situation</label>
                  <textarea name="cs_situation" defaultValue={cs.situation ?? ""} rows={3} className={`${inputCls} resize-none text-xs`} />
                </div>
                <div>
                  <label className={labelCls}>T — Task</label>
                  <textarea name="cs_task" defaultValue={cs.task ?? ""} rows={3} className={`${inputCls} resize-none text-xs`} />
                </div>
                <div>
                  <label className={labelCls}>A — Action</label>
                  <textarea name="cs_action" defaultValue={cs.action ?? ""} rows={3} className={`${inputCls} resize-none text-xs`} />
                </div>
                <div>
                  <label className={labelCls}>R — Result</label>
                  <textarea name="cs_result" defaultValue={cs.result ?? ""} rows={3} className={`${inputCls} resize-none text-xs`} />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
          <button onClick={onClose} className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-2.5 rounded-md text-sm">
            <X size={16} /> Batal
          </button>
          <button
            onClick={(e) => {
              const form = (e.target as HTMLElement).closest("div")?.previousElementSibling as HTMLFormElement;
              form?.requestSubmit();
            }}
            disabled={isPending || isUploading}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold px-6 py-2.5 rounded-md text-sm"
          >
            {isPending ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> {isEditing ? "Update" : "Simpan"}</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}