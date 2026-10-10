import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // Server Component — set cookies tidak diperbolehkan, abaikan
          }
        },
      },
    }
  );

  // Cek session — kalau refresh token invalid, bersihkan cookie otomatis
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (
    error &&
    (error.code === "refresh_token_not_found" ||
      error.code === "invalid_refresh_token" ||
      error.message?.includes("Refresh Token"))
  ) {
    // Hapus semua cookie Supabase yang invalid
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        try {
          cookieStore.delete(cookie.name);
        } catch {
          // ignore
        }
      }
    });
  }

  return supabase;
}