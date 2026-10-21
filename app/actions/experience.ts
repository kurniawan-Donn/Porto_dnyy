"use server";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

function parseTags(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function buildPayload(fd: FormData) {
  return {
    position: fd.get("position") as string,
    company: fd.get("company") as string,
    period: fd.get("period") as string,
    location: fd.get("location") as string,
    description: fd.get("description") as string,
    tags: parseTags((fd.get("tags") as string) || ""),
    is_current: fd.get("is_current") === "on",
    order_index: parseInt(fd.get("order_index") as string) || 0,
    image_url: (fd.get("image_url") as string) || null,
  };
}

export async function createExperience(fd: FormData) {
  const sb = await requireAdmin();
  const { error } = await sb.from("experiences").insert(buildPayload(fd));
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/experience");
  revalidatePublicSite();
  return { success: true };
}

export async function updateExperience(id: string, fd: FormData) {
  const sb = await requireAdmin();
  const { error } = await sb.from("experiences").update(buildPayload(fd)).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/experience");
  revalidatePublicSite();
  return { success: true };
}

export async function deleteExperience(id: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("experiences").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/experience");
  revalidatePublicSite();
  return { success: true };
}