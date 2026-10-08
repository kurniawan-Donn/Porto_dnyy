"use client";
import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, CheckCircle2, AlertCircle,
  Award, ShieldCheck, Code2, BadgeCheck, Trophy, Medal, Star, BookOpen,
  Upload, Image as ImageIcon,
} from "lucide-react";
import {
  createCertification, updateCertification, deleteCertification,
} from "@/app/actions/certifications";
import { uploadFile } from "@/lib/supabase/storage";

type Certification = {
  id: string;
  name: string;
  issuer: string | null;
  date: string | null;
  credential_url: string | null;
  icon_name: string | null;
  order_index: number | null;
  image_url: string | null;
};

const ICON_OPTIONS = [
  { name: "Award", icon: Award },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Code2", icon: Code2 },
  { name: "BadgeCheck", icon: BadgeCheck },
  { name: "Trophy", icon: Trophy },
  { name: "Medal", icon: Medal },
  { name: "Star", icon: Star },
  { name: "BookOpen", icon: BookOpen },
];

const ICON_MAP: Record<string, any> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.name, o.icon])
);

const inputCls =
  "w-full bg-slate-950/60 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all";
const labelCls =
  "block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2";

export default function CertificationsManager({
  initialCertifications,
}: {
  initialCertifications: Certification[];
}) {
  const [certs, setCerts] = useState(initialCertifications);
  const [editing, setEditing] = useState<Certification | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSuccess = (m: string) => {
    setMsg(m);
    setTimeout(() => window.location.reload(), 700);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const r = await deleteCertification(id);
      if (r.success) {
        setCerts((p) => p.filter((x) => x.id !== id));
        setMsg("Sertifikasi dihapus!");
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
        <Plus size={18} /> Tambah Sertifikasi
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert) => {
          const Icon = ICON_MAP[cert.icon_name || "Award"] || Award;
          return (
            <div
              key={cert.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group flex flex-col"
            >
              {/* Thumbnail */}
              {cert.image_url && (
                <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.image_url}
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(cert)}
                      className="w-8 h-8 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cert.id)}
                      className="w-8 h-8 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-100 mb-1 leading-snug">{cert.name}</h3>
                <p className="text-sm text-slate-400 mb-1">{cert.issuer}</p>
                <p className="text-xs text-slate-500 font-mono">{cert.date}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-600">
                    #{cert.order_index} • {cert.icon_name}
                  </span>
                  {cert.credential_url && (
                    <span className="text-[10px] font-mono text-cyan-400/70">
                      ✓ Link aktif
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {editing && (
          <CertificationFormModal
            initialData={editing === "new" ? null : editing}
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
                Hapus Sertifikasi?
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
function CertificationFormModal({
  initialData, onClose, onSuccess,
}: {
  initialData: Certification | null;
  onClose: () => void;
  onSuccess: (m: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [iconName, setIconName] = useState(initialData?.icon_name || "Award");
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
      const url = await uploadFile(file, "certifications");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("icon_name", iconName);
    fd.set("image_url", imageUrl);

    startTransition(async () => {
      const r = isEditing
        ? await updateCertification(initialData.id, fd)
        : await createCertification(fd);
      if (r.success) onSuccess(isEditing ? "Sertifikasi diupdate!" : "Sertifikasi ditambahkan!");
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
              {isEditing ? initialData.name : "Sertifikasi Baru"}
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
          id="cert-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          <div>
            <label className={labelCls}>Nama Sertifikasi *</label>
            <input
              name="name"
              defaultValue={initialData?.name ?? ""}
              required
              placeholder="Dasar Keamanan Informasi"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Penerbit</label>
            <input
              name="issuer"
              defaultValue={initialData?.issuer ?? ""}
              placeholder="Dicoding Indonesia"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tanggal</label>
              <input
                name="date"
                defaultValue={initialData?.date ?? ""}
                placeholder="Agustus 2024"
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
            <label className={labelCls}>URL Kredensial (opsional)</label>
            <input
              name="credential_url"
              type="url"
              defaultValue={initialData?.credential_url ?? ""}
              placeholder="https://www.dicoding.com/certificates/XXXXX"
              className={inputCls}
            />
            <p className="text-xs text-slate-600 mt-2">
              Kosongkan kalau tidak ada link. Tombol akan jadi "Segera Hadir".
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Gambar Sertifikat (opsional)</label>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-20 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    <><Upload size={16} /> Upload Gambar</>
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
                <p className="text-xs text-slate-600 mt-2">Rekomendasi 800×500 px (rasio 16:10).</p>
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Icon (fallback kalau tidak ada gambar)</label>
            <div className="grid grid-cols-4 gap-2">
              {ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isActive = iconName === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIconName(opt.name)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-md border transition-all ${
                      isActive
                        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                        : "bg-slate-950/60 border-slate-700 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    <IconComp size={20} />
                    <span className="text-[9px] font-mono">{opt.name}</span>
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
            form="cert-form"
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