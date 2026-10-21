import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Guard untuk server action admin: redirect ke login jika belum masuk,
 * kalau sudah, kembalikan client Supabase yang membawa sesi admin.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}
