import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("❌ NEXT_PUBLIC_SUPABASE_URL tidak ditemukan di .env.local");
  }
  if (!supabaseAnonKey) {
    throw new Error(
      "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY tidak ditemukan di .env.local"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}