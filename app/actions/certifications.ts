"use server";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

function buildPayload(fd: FormData) {
  return {
    name: fd.get("name") as string,
    issuer: fd.get("issuer") as string,
    date: fd.get("date") as string,
    credential_url: fd.get("credential_url") as string,
    icon_name: (fd.get("icon_name") as string) || "Award",
    order_index: parseInt(fd.get("order_index") as string) || 0,
    image_url: (fd.get("image_url") as string) || null,
  };
}

export async function createCertification(fd: FormData) {
  const sb = await requireAdmin();
  const { error } = await sb.from("certifications").insert(buildPayload(fd));
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/certifications");
  revalidatePublicSite();
  return { success: true };
}

export async function updateCertification(id: string, fd: FormData) {
  const sb = await requireAdmin();
  const { error } = await sb.from("certifications").update(buildPayload(fd)).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/certifications");
  revalidatePublicSite();
  return { success: true };
}

export async function deleteCertification(id: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("certifications").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/certifications");
  revalidatePublicSite();
  return { success: true };
}