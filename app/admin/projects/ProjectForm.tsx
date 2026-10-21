"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { createProject, updateProject } from "@/app/actions/projects";
import ProjectImagePreview, { RECOMMENDED_IMAGE } from "@/app/components/admin/ProjectImagePreview";
import type { Project, TechTag } from "@/lib/types";
import { UploadButton } from "../_components/buttons";
import FormModal from "../_components/FormModal";
import TagQuickPick from "../_components/TagQuickPick";
import { inputCls, labelCls } from "../_components/styles";
import { useEntityForm } from "../_components/useEntityForm";
import { useFileUpload } from "../_components/useFileUpload";

const STAR_FIELDS = [
  { name: "cs_situation", key: "situation", label: "S — Situation" },
  { name: "cs_task", key: "task", label: "T — Task" },
  { name: "cs_action", key: "action", label: "A — Action" },
  { name: "cs_result", key: "result", label: "R — Result" },
] as const;

export default function ProjectForm({
  initialData,
  availableTags,
  onClose,
  onSaved,
}: {
  initialData: Project | null;
  availableTags: TechTag[];
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  // Ukuran file hanya diketahui untuk gambar yang baru diunggah
  const [imageSizeKb, setImageSizeKb] = useState<number | null>(null);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [techInput, setTechInput] = useState((initialData?.tech ?? []).join(", "));
  const cs = initialData?.case_study ?? {};

  const { isEditing, isPending, error, setError, submit } = useEntityForm({
    initialData,
    create: createProject,
    update: updateProject,
    messages: { created: "Proyek ditambahkan!", updated: "Proyek diupdate!" },
    onSaved,
  });
  const upload = useFileUpload({
    folder: "projects",
    onUploaded: (url, file) => {
      setImageUrl(url);
      setImageSizeKb(Math.round(file.size / 1024));
    },
    onError: setError,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("image_url", imageUrl);
    fd.set("tech", techInput);
    submit(fd);
  };

  return (
    <FormModal
      formId="project-form"
      kicker={isEditing ? "Edit Proyek" : "Proyek Baru"}
      title={initialData?.title ?? "Tambah Proyek"}
      maxWidth="max-w-4xl"
      isEditing={isEditing}
      isPending={isPending}
      submitDisabled={upload.isUploading}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {/* Basic Info */}
      <div>
        <label className={labelCls}>Judul Proyek *</label>
        <input
          name="title"
          defaultValue={initialData?.title ?? ""}
          required
          placeholder="Sistem Informasi Audit TI"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Slug URL (opsional)</label>
        <input
          name="slug"
          defaultValue={initialData?.slug ?? ""}
          placeholder="otomatis dari judul, mis. sistem-informasi-audit-ti"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Huruf kecil, angka, dan tanda hubung saja"
          className={`${inputCls} font-mono`}
        />
        <p className="mt-1.5 text-[11px] text-slate-500">
          Alamat halaman: /projects/&lt;slug&gt;. Mengubah slug akan mematikan link lama yang sudah dibagikan.
        </p>
      </div>

      <div>
        <label className={labelCls}>Deskripsi Singkat *</label>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ""}
          required
          rows={3}
          placeholder="Deskripsi singkat yang muncul di card..."
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelCls}>Gambar Project (opsional)</label>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Ideal{" "}
          <span className="font-mono text-cyan-400">
            {RECOMMENDED_IMAGE.width}×{RECOMMENDED_IMAGE.height} px (16:9)
          </span>
          , WebP/JPG ≤ {RECOMMENDED_IMAGE.maxKb} KB. Gambar dipotong otomatis agar memenuhi kotak — letakkan
          judul & elemen penting di dalam garis putus-putus <span className="text-cyan-400">area aman</span>.
        </p>
        <ProjectImagePreview imageUrl={imageUrl} featured={featured} fileSizeKb={imageSizeKb} />
        <div className="mt-3 flex items-center gap-3">
          <UploadButton
            upload={upload}
            label={imageUrl ? "Ganti Gambar" : "Upload Gambar"}
            className="inline-flex items-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm transition-all"
          />
          {imageUrl && (
            <button
              type="button"
              onClick={() => {
                setImageUrl("");
                setImageSizeKb(null);
              }}
              className="text-xs text-red-400 hover:underline"
            >
              Hapus
            </button>
          )}
          <p className="text-xs text-slate-600">JPG/PNG/WebP, max 5 MB</p>
        </div>
      </div>

      <TagQuickPick
        label="Tech Tags (pisahkan dengan koma)"
        value={techInput}
        onChange={setTechInput}
        availableTags={availableTags}
        placeholder="PHP, JavaScript, MySQL"
      />

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>GitHub URL</label>
          <input
            name="github_url"
            type="url"
            defaultValue={initialData?.github_url ?? ""}
            placeholder="https://github.com/..."
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Demo URL</label>
          <input
            name="demo_url"
            type="url"
            defaultValue={initialData?.demo_url ?? ""}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
      </div>

      {/* CTA & Featured */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className={labelCls}>CTA Text (tombol di card)</label>
          <input
            name="card_cta_text"
            defaultValue={initialData?.card_cta_text ?? "Lihat Selengkapnya"}
            placeholder="Lihat Studi Kasus / Baca Detail / dll."
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Urutan</label>
          <input name="order_index" type="number" defaultValue={initialData?.order_index ?? 0} className={inputCls} />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 accent-cyan-500 cursor-pointer"
        />
        <span className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
          <Star size={14} /> Tampilkan sebagai Featured (full-width)
        </span>
      </label>

      {/* Case Study */}
      <div className="border-t border-slate-800 pt-5">
        <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-cyan-400" /> Case Study (Opsional)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Isi kalau proyek ini punya studi kasus STAR. Kalau kosong, klik card tidak akan buka popup.
        </p>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Subtitle</label>
            <input name="cs_subtitle" defaultValue={cs.subtitle ?? ""} placeholder="Studi Kasus: ..." className={inputCls} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STAR_FIELDS.map((field) => (
              <div key={field.name}>
                <label className={labelCls}>{field.label}</label>
                <textarea
                  name={field.name}
                  defaultValue={cs[field.key] ?? ""}
                  rows={3}
                  className={`${inputCls} resize-none text-xs`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormModal>
  );
}
