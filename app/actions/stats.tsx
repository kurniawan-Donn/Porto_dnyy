"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function auth() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

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
  const sb = await auth();
  const { error } = await sb.from("stats").insert(buildPayload(fd));
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/stats");
  revalidatePath("/");
  return { success: true };
}

export async function updateStat(id: string, fd: FormData) {
  const sb = await auth();
  const { error } = await sb.from("stats").update(buildPayload(fd)).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/stats");
  revalidatePath("/");
  return { success: true };
}

export async function deleteStat(id: string) {
  const sb = await auth();
  const { error } = await sb.from("stats").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/stats");
  revalidatePath("/");
  return { success: true };
}