"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function createTechTag(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

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
  revalidatePath("/");
  return { success: true };
}

export async function updateTechTag(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

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
  revalidatePath("/");
  return { success: true };
}

export async function deleteTechTag(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("tech_tags").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tech-tags");
  revalidatePath("/");
  return { success: true };
}