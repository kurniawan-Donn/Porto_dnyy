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

function parseTech(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function buildPayload(fd: FormData) {
  const caseStudy = {
    subtitle: (fd.get("cs_subtitle") as string) || "",
    situation: (fd.get("cs_situation") as string) || "",
    task: (fd.get("cs_task") as string) || "",
    action: (fd.get("cs_action") as string) || "",
    result: (fd.get("cs_result") as string) || "",
  };
  const hasCaseStudy = caseStudy.situation || caseStudy.task || caseStudy.action || caseStudy.result;

  return {
    title: fd.get("title") as string,
    description: fd.get("description") as string,
    tech: parseTech((fd.get("tech") as string) || ""),
    github_url: (fd.get("github_url") as string) || null,
    demo_url: (fd.get("demo_url") as string) || null,
    image_url: (fd.get("image_url") as string) || null,
    featured: fd.get("featured") === "on",
    card_cta_text: (fd.get("card_cta_text") as string) || "Lihat Selengkapnya",
    order_index: parseInt(fd.get("order_index") as string) || 0,
    case_study: hasCaseStudy ? caseStudy : null,
  };
}

export async function createProject(fd: FormData) {
  const sb = await auth();
  const { error } = await sb.from("projects").insert(buildPayload(fd));
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

export async function updateProject(id: string, fd: FormData) {
  const sb = await auth();
  const { error } = await sb.from("projects").update(buildPayload(fd)).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: string) {
  const sb = await auth();
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}