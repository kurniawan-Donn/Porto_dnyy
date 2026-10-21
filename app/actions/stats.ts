"use server";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

function buildPayload(fd: FormData) {
  const autoSource = fd.get("auto_source") as string;
  return {
    label: fd.get("label") as string,
    value: parseInt(fd.get("value") as string) || 0,
    suffix: (fd.get("suffix") as string) || "+",
    icon_name: (fd.get("icon_name") as string) || "FolderGit2",
    order_index: parseInt(fd.get("order_index") as string) || 0,
    auto_source: autoSource === "none" || !autoSource ? null : autoSource,
  };
}

export async function createStat(fd: FormData) {
  const sb = await requireAdmin();
  const { error } = await sb.from("stats").insert(buildPayload(fd));
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/stats");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateStat(id: string, fd: FormData) {
  const sb = await requireAdmin();
  const { error } = await sb.from("stats").update(buildPayload(fd)).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/stats");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteStat(id: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("stats").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/stats");
  revalidatePath("/", "layout");
  return { success: true };
}