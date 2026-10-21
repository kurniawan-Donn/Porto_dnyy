"use server";

import { requireAdmin } from "@/lib/supabase/auth";
import type { ActionResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createTechTag(formData: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const payload = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    icon: (formData.get("icon") as string) || null,
    category: (formData.get("category") as string) || null,
  };

  if (!payload.name?.trim()) {
    return { success: false, error: "Nama tag wajib diisi." };
  }

  const { error } = await supabase.from("tech_tags").insert(payload);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tech-tags");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateTechTag(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const payload = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    icon: (formData.get("icon") as string) || null,
    category: (formData.get("category") as string) || null,
  };

  if (!payload.name?.trim()) {
    return { success: false, error: "Nama tag wajib diisi." };
  }

  const { error } = await supabase
    .from("tech_tags")
    .update(payload)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tech-tags");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteTechTag(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("tech_tags").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tech-tags");
  revalidatePath("/", "layout");
  return { success: true };
}