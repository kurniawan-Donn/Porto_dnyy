import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validasi eksplisit agar error message jelas
  if (!supabaseUrl) {
    throw new Error(
      "❌ NEXT_PUBLIC_SUPABASE_URL tidak ditemukan. " +
        "Pastikan file .env.local ada di root project dan isinya benar."
    );
  }
  if (!supabaseAnonKey) {
    throw new Error(
      "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY tidak ditemukan. " +
        "Pastikan file .env.local ada di root project dan isinya benar."
    );
  }

  // 1. Simpan client ke dalam variabel 'supabase'
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Diabaikan: dipanggil dari Server Component, tidak bisa set cookie.
          // Ini aman karena proxy.ts yang akan handle refresh session.
        }
      },
    },
  });

  // 2. TAMBAHKAN INI — auto-clear session kalau refresh token invalid
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error?.code === "refresh_token_not_found") {
    // Clear cookies yang invalid
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        try {
          // Menghapus semua cookie bawaan Supabase
          cookieStore.delete(cookie.name);
        } catch {
          // ignore error jika dipanggil dari Server Component yang tidak mengizinkan modifikasi cookie
        }
      }
    });
  }

  // 3. Return client yang sudah diverifikasi
  return supabase;
}