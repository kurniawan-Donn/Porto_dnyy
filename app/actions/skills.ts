"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================
// AUTH GUARD
// ============================================
async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

// ============================================
// CREATE
// ============================================
export async function createSkill(formData: FormData) {
  const supabase = await requireAuth();

  const { error } = await supabase.from("skills").insert({
    category: formData.get("category") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
    order_index: parseInt(formData.get("order_index") as string) || 0,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}

// ============================================
// UPDATE
// ============================================
export async function updateSkill(id: string, formData: FormData) {
  const supabase = await requireAuth();

  const { error } = await supabase
    .from("skills")
    .update({
      category: formData.get("category") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}

// ============================================
// DELETE
// ============================================
export async function deleteSkill(id: string) {
  const supabase = await requireAuth();

  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}