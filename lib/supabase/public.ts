import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase tanpa cookie/sesi untuk data publik (role anon).
 * Tidak memanggil auth.getUser() seperti client server, jadi lebih cepat
 * dan tidak memaksa halaman menjadi dinamis — bisa di-cache (ISR).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
