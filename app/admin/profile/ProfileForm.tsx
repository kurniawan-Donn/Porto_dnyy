"use client";
import { useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Save,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  Megaphone,
} from "lucide-react";
import { uploadFile } from "@/lib/supabase/storage";
import { updateProfile } from "@/app/actions/profile";

type SiteSettings = {
  id: number;
  hero_greeting: string;
  hero_name: string;
  hero_role: string;
  hero_description: string;
  hero_photo_url: string | null;
  cv_url: string | null;
  email: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  banner_text: string | null;
  banner_active: boolean;
  updated_at: string;
};

export default function ProfileForm({
  initialData,
}: {
  initialData: SiteSettings;
}) {
  const [formData, setFormData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // Handle input change
  // ============================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (status !== "idle") setStatus("idle");
  };

  // ============================================
  // Upload Foto Profil
  // ============================================
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setMessage("File harus berupa gambar (PNG/JPG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setIsUploadingPhoto(true);
    setStatus("idle");

    try {
      const url = await uploadFile(file, "profile");
      setFormData((prev) => ({ ...prev, hero_photo_url: url }));
      setStatus("success");
      setMessage("Foto berhasil di-upload. Jangan lupa klik Save.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  // ============================================
  // Upload CV
  // ============================================
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus("error");
      setMessage("CV harus berupa file PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus("error");
      setMessage("Ukuran PDF maksimal 10 MB.");
      return;
    }

    setIsUploadingCv(true);
    setStatus("idle");

    try {
      const url = await uploadFile(file, "cv");
      setFormData((prev) => ({ ...prev, cv_url: url }));
      setStatus("success");
      setMessage("CV berhasil di-upload. Jangan lupa klik Save.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setIsUploadingCv(false);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
  };

  // ============================================
  // Submit form (Server Action)
  // ============================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        fd.append(key, "");
      } else if (typeof value === "boolean") {
        if (value) fd.append(key, "on");
      } else {
        fd.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = await updateProfile(fd);
      if (result.success) {
        setStatus("success");
        setMessage("Perubahan berhasil disimpan!");
      } else {
        setStatus("error");
        setMessage(result.error ?? "Gagal menyimpan.");
      }
    });
  };

  // ============================================
  // Reusable input classes
  // ============================================
  const inputClass =
    "w-full bg-slate-950/60 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all disabled:opacity-60";
  const labelClass =
    "block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* ============================================
          SECTION 1: BANNER PENGUMUMAN
      ============================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Megaphone size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Banner Pengumuman
            </h2>
            <p className="text-xs text-slate-500">
              Muncul di paling atas website. Berguna untuk info lowongan/freelance.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Teks Banner</label>
            <input
              type="text"
              name="banner_text"
              value={formData.banner_text ?? ""}
              onChange={handleChange}
              placeholder="Mis. Open for freelance projects!"
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="banner_active"
              checked={formData.banner_active}
              onChange={handleChange}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
            <span className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">
              Tampilkan banner di website
            </span>
          </label>
        </div>
      </div>

      {/* ============================================
          SECTION 2: HERO CONTENT
      ============================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Konten Hero Section
            </h2>
            <p className="text-xs text-slate-500">
              Bagian yang pertama kali dilihat pengunjung.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sapaan</label>
              <input
                type="text"
                name="hero_greeting"
                value={formData.hero_greeting}
                onChange={handleChange}
                placeholder="Halo, nama saya"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input
                type="text"
                name="hero_name"
                value={formData.hero_name}
                onChange={handleChange}
                placeholder="Dony Kurniawan."
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Role / Posisi</label>
            <input
              type="text"
              name="hero_role"
              value={formData.hero_role}
              onChange={handleChange}
              placeholder="IT Audit & Web Developer."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Deskripsi Singkat</label>
            <textarea
              name="hero_description"
              value={formData.hero_description}
              onChange={handleChange}
              rows={4}
              placeholder="Ceritakan tentang diri Anda..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 3: FOTO & CV
      ============================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ImageIcon size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Foto Profil & CV
            </h2>
            <p className="text-xs text-slate-500">
              Foto sebaiknya PNG transparan, ukuran 900×1200 px.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FOTO PROFIL */}
          <div>
            <label className={labelClass}>Foto Profil</label>

            {/* Preview */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden aspect-[3/4] mb-3 flex items-center justify-center">
              {formData.hero_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.hero_photo_url}
                  alt="Profile"
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="text-slate-700 text-center">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Belum ada foto</p>
                </div>
              )}
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="w-full inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm font-medium transition-all disabled:opacity-60"
            >
              {isUploadingPhoto ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} /> Upload Foto Baru
                </>
              )}
            </button>
          </div>

          {/* CV */}
          <div>
            <label className={labelClass}>File CV (PDF)</label>

            {/* Preview */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden aspect-[3/4] mb-3 flex items-center justify-center">
              {formData.cv_url ? (
                <div className="text-center p-4">
                  <FileText size={48} className="mx-auto mb-3 text-cyan-400" />
                  <p className="text-xs text-slate-400 mb-3">CV sudah di-upload</p>
                  <a
                    href={formData.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Lihat CV ↗
                  </a>
                </div>
              ) : (
                <div className="text-slate-700 text-center">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Belum ada CV</p>
                </div>
              )}
            </div>

            <input
              ref={cvInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleCvUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              disabled={isUploadingCv}
              className="w-full inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm font-medium transition-all disabled:opacity-60"
            >
              {isUploadingCv ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} /> Upload CV Baru
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 4: KONTAK & SOSIAL
      ============================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <LinkIcon size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Kontak & Sosial Media
            </h2>
            <p className="text-xs text-slate-500">
              Informasi ini muncul di section Contact.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <Mail size={12} className="inline mr-1" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email ?? ""}
                onChange={handleChange}
                placeholder="dony@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <MapPin size={12} className="inline mr-1" /> Lokasi
              </label>
              <input
                type="text"
                name="location"
                value={formData.location ?? ""}
                onChange={handleChange}
                placeholder="Madiun, Indonesia"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url ?? ""}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url ?? ""}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url ?? ""}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          STATUS MESSAGE + SUBMIT
      ============================================ */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md px-4 py-2.5 mb-3"
              >
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5 mb-3"
              >
                <AlertCircle size={16} />
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-mono">
              Terakhir diubah:{" "}
              {new Date(initialData.updated_at).toLocaleString("id-ID")}
            </p>
            <button
              type="submit"
              disabled={isPending || isUploadingPhoto || isUploadingCv}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-semibold px-6 py-2.5 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}