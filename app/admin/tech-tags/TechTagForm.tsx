"use client";

import { useState, type FormEvent } from "react";
import { createTechTag, updateTechTag } from "@/app/actions/techTags";
import SkillIconPicker from "@/app/components/admin/SkillIconPicker";
import type { TechTag } from "@/lib/types";
import { InlineForm, InlineFormActions } from "../_components/InlineForm";
import { inputCls, labelCls } from "../_components/styles";
import { useEntityForm } from "../_components/useEntityForm";

export default function TechTagForm({
  initialData,
  onCancel,
  onSaved,
}: {
  initialData?: TechTag | null;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const [iconValue, setIconValue] = useState<string>(initialData?.icon ?? "");
  const { isEditing, isPending, error, submit } = useEntityForm({
    initialData,
    create: createTechTag,
    update: updateTechTag,
    messages: { created: "Tech tag ditambahkan!", updated: "Tech tag diupdate!" },
    onSaved,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // Override icon dengan state picker
    fd.set("icon", iconValue);
    submit(fd);
  };

  return (
    <InlineForm onSubmit={handleSubmit} error={error}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Nama Tech Tag</label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name ?? ""}
            required
            placeholder="Mis. Python"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Kategori</label>
          <input
            type="text"
            name="category"
            defaultValue={initialData?.category ?? ""}
            placeholder="Mis. Programming, Tools, Database"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Deskripsi (muncul di popup)</label>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ""}
          rows={2}
          placeholder="Jelaskan singkat tentang teknologi ini..."
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className={labelCls}>Icon</label>
        <SkillIconPicker value={iconValue} onChange={setIconValue} />
      </div>

      <InlineFormActions isEditing={isEditing} isPending={isPending} onCancel={onCancel} />
    </InlineForm>
  );
}
