"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import type { SiteSettings } from "@/lib/types";
import { StatusMessage } from "../_components/StatusMessage";
import { useFileUpload } from "../_components/useFileUpload";
import { HeroBannerSection, PhotoAndCvSection } from "./sections/MediaSections";
import { AnnouncementSection, ContactSection, HeroContentSection } from "./sections/TextSections";

type Status = "idle" | "success" | "error";

export default function ProfileForm({ initialData }: { initialData: SiteSettings }) {
  const [formData, setFormData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const report = (next: Status, msg: string) => {
    setStatus(next);
    setMessage(msg);
  };

  // Upload hanya mengganti URL di state; tersimpan setelah klik Simpan
  const uploadInto = (field: "hero_photo_url" | "cv_url" | "hero_banner_url", successMessage: string) => ({
    onStart: () => setStatus("idle"),
    onUploaded: (url: string) => {
      setFormData((prev) => ({ ...prev, [field]: url }));
      report("success", successMessage);
    },
    onError: (msg: string) => report("error", msg),
  });

  const photoUpload = useFileUpload({
    folder: "profile",
    messages: { type: "File harus berupa gambar (PNG/JPG).", size: "Ukuran gambar maksimal 5 MB." },
    ...uploadInto("hero_photo_url", "Foto berhasil di-upload. Jangan lupa klik Save."),
  });
  const cvUpload = useFileUpload({
    folder: "cv",
    kind: "pdf",
    maxMb: 10,
    messages: { type: "CV harus berupa file PDF.", size: "Ukuran PDF maksimal 10 MB." },
    ...uploadInto("cv_url", "CV berhasil di-upload. Jangan lupa klik Save."),
  });
  const bannerUpload = useFileUpload({
    folder: "banner",
    maxMb: 8,
    messages: { type: "Banner harus berupa gambar (JPG/PNG/WebP).", size: "Ukuran banner maksimal 8 MB." },
    ...uploadInto("hero_banner_url", "Banner berhasil di-upload. Jangan lupa klik Save."),
  });
  const isUploading = photoUpload.isUploading || cvUpload.isUploading || bannerUpload.isUploading;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) fd.append(key, "");
      else if (typeof value === "boolean") {
        if (value) fd.append(key, "on");
      } else fd.append(key, String(value));
    });

    startTransition(async () => {
      const result = await updateProfile(fd);
      if (result.success) report("success", "Perubahan berhasil disimpan!");
      else report("error", result.error ?? "Gagal menyimpan.");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <AnnouncementSection data={formData} onChange={handleChange} />
      <HeroContentSection data={formData} onChange={handleChange} />
      <PhotoAndCvSection
        photoUrl={formData.hero_photo_url}
        cvUrl={formData.cv_url}
        photoUpload={photoUpload}
        cvUpload={cvUpload}
      />
      <HeroBannerSection
        bannerUrl={formData.hero_banner_url}
        upload={bannerUpload}
        onRemove={() => setFormData((prev) => ({ ...prev, hero_banner_url: null }))}
      />
      <ContactSection data={formData} onChange={handleChange} />

      {/* Status + tombol simpan, menempel di bawah layar */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <StatusMessage
            message={status === "idle" ? "" : message}
            tone={status === "error" ? "error" : "success"}
            className="mb-3"
          />

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-mono">
              Terakhir diubah: {new Date(initialData.updated_at).toLocaleString("id-ID")}
            </p>
            <button
              type="submit"
              disabled={isPending || isUploading}
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
