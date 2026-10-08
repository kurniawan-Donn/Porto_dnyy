"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  // Pastikan user sudah login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const data = {
    hero_greeting: formData.get("hero_greeting") as string,
    hero_name: formData.get("hero_name") as string,
    hero_role: formData.get("hero_role") as string,
    hero_description: formData.get("hero_description") as string,
    hero_photo_url: formData.get("hero_photo_url") as string,
    cv_url: formData.get("cv_url") as string,
    email: formData.get("email") as string,
    location: formData.get("location") as string,
    github_url: formData.get("github_url") as string,
    linkedin_url: formData.get("linkedin_url") as string,
    instagram_url: formData.get("instagram_url") as string,
    banner_text: formData.get("banner_text") as string,
    banner_active: formData.get("banner_active") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("site_settings")
    .update(data)
    .eq("id", 1);

  if (error) {
    return { success: false, error: error.message };
  }

  // Refresh cache halaman
  revalidatePath("/");
  revalidatePath("/admin/profile");

  return { success: true };
}