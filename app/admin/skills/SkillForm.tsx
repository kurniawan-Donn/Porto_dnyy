"use client";

import { useState, type FormEvent } from "react";
import { createSkill, updateSkill } from "@/app/actions/skills";
import SkillIconPicker from "@/app/components/admin/SkillIconPicker";
import type { Skill } from "@/lib/types";
import { InlineForm, InlineFormActions } from "../_components/InlineForm";
import { inputCls, labelCls } from "../_components/styles";
import { useEntityForm } from "../_components/useEntityForm";
import { SKILL_CATEGORIES } from "./categories";

export default function SkillForm({
  initialData,
  onCancel,
  onSaved,
}: {
  initialData?: Skill | null;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const [iconValue, setIconValue] = useState<string>(initialData?.icon ?? "");
  const { isEditing, isPending, error, submit } = useEntityForm({
    initialData,
    create: createSkill,
    update: updateSkill,
    messages: { created: "Keahlian ditambahkan!", updated: "Keahlian diupdate!" },
    onSaved,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(new FormData(e.currentTarget));
  };

  return (
    <InlineForm onSubmit={handleSubmit} error={error}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Kategori</label>
          <select name="category" defaultValue={initialData?.category ?? SKILL_CATEGORIES[0].name} className={inputCls}>
            {SKILL_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Nama Keahlian</label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name ?? ""}
            required
            placeholder="Mis. Kotlin"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Icon</label>
        <SkillIconPicker value={iconValue} onChange={setIconValue} />
      </div>

      <div>
        <label className={labelCls}>Deskripsi (muncul di popup public)</label>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ""}
          rows={3}
          placeholder="Jelaskan secara singkat tentang keahlian ini, pengalaman Anda, atau tools terkait..."
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className={labelCls}>Urutan (kecil = atas)</label>
          <input type="number" name="order_index" defaultValue={initialData?.order_index ?? 0} className={inputCls} />
        </div>
        <InlineFormActions
          isEditing={isEditing}
          isPending={isPending}
          onCancel={onCancel}
          className="md:col-span-2 flex gap-3 justify-end"
        />
      </div>
    </InlineForm>
  );
}
