"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { createExperience, updateExperience } from "@/app/actions/experience";
import type { Experience, TechTag } from "@/lib/types";
import FormModal from "../_components/FormModal";
import ImageUploadField from "../_components/ImageUploadField";
import TagQuickPick from "../_components/TagQuickPick";
import { inputCls, labelCls } from "../_components/styles";
import { useEntityForm } from "../_components/useEntityForm";
import { useFileUpload } from "../_components/useFileUpload";

export default function ExperienceForm({
  initialData,
  availableTags,
  onClose,
  onSaved,
}: {
  initialData: Experience | null;
  availableTags: TechTag[];
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(", "));
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const { isEditing, isPending, error, setError, submit } = useEntityForm({
    initialData,
    create: createExperience,
    update: updateExperience,
    messages: { created: "Pengalaman ditambahkan!", updated: "Pengalaman diupdate!" },
    onSaved,
  });
  const upload = useFileUpload({
    folder: "experiences",
    onStart: () => setError(""),
    onUploaded: setImageUrl,
    onError: setError,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("tags", tagsInput);
    fd.set("image_url", imageUrl);
    submit(fd);
  };

  return (
    <FormModal
      formId="exp-form"
      kicker={isEditing ? "Edit" : "Tambah"}
      title={initialData?.position ?? "Pengalaman Baru"}
      maxWidth="max-w-2xl"
      isEditing={isEditing}
      isPending={isPending}
      submitDisabled={upload.isUploading}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
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

      <ImageUploadField
        label="Logo Perusahaan / Gambar (opsional)"
        url={imageUrl}
        upload={upload}
        onRemove={() => setImageUrl("")}
        previewClassName="w-20 h-20"
        buttonLabel="Upload Logo"
        hint="PNG/JPG/WebP, max 5 MB. Rekomendasi 200×200 px."
      />

      <TagQuickPick
        label="Tags (pisahkan dengan koma)"
        value={tagsInput}
        onChange={setTagsInput}
        availableTags={availableTags}
        placeholder="IT Audit, Compliance, Security"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Urutan (kecil = atas)</label>
          <input name="order_index" type="number" defaultValue={initialData?.order_index ?? 0} className={inputCls} />
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
    </FormModal>
  );
}
