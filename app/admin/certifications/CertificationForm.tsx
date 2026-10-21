"use client";

import { useState, type FormEvent } from "react";
import { createCertification, updateCertification } from "@/app/actions/certifications";
import { CERT_ICON_OPTIONS as ICON_OPTIONS } from "@/lib/lucide-icons";
import type { Certification } from "@/lib/types";
import FormModal from "../_components/FormModal";
import ImageUploadField from "../_components/ImageUploadField";
import { inputCls, labelCls } from "../_components/styles";
import { useEntityForm } from "../_components/useEntityForm";
import { useFileUpload } from "../_components/useFileUpload";

export default function CertificationForm({
  initialData,
  onClose,
  onSaved,
}: {
  initialData: Certification | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [iconName, setIconName] = useState(initialData?.icon_name || "Award");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const { isEditing, isPending, error, setError, submit } = useEntityForm({
    initialData,
    create: createCertification,
    update: updateCertification,
    messages: { created: "Sertifikasi ditambahkan!", updated: "Sertifikasi diupdate!" },
    onSaved,
  });
  const upload = useFileUpload({
    folder: "certifications",
    onStart: () => setError(""),
    onUploaded: setImageUrl,
    onError: setError,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("icon_name", iconName);
    fd.set("image_url", imageUrl);
    submit(fd);
  };

  return (
    <FormModal
      formId="cert-form"
      kicker={isEditing ? "Edit" : "Tambah"}
      title={initialData?.name ?? "Sertifikasi Baru"}
      maxWidth="max-w-lg"
      isEditing={isEditing}
      isPending={isPending}
      submitDisabled={upload.isUploading}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
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
          <input name="date" defaultValue={initialData?.date ?? ""} placeholder="Agustus 2024" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Urutan</label>
          <input name="order_index" type="number" defaultValue={initialData?.order_index ?? 0} className={inputCls} />
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
          Kosongkan kalau tidak ada link. Tombol akan jadi &ldquo;Segera Hadir&rdquo;.
        </p>
      </div>

      <ImageUploadField
        label="Gambar Sertifikat (opsional)"
        url={imageUrl}
        upload={upload}
        onRemove={() => setImageUrl("")}
        previewClassName="w-32 h-20"
        hint="Rekomendasi 800×500 px (rasio 16:10)."
      />

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
    </FormModal>
  );
}
