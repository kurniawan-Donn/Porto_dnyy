import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { buildCsp, createNonce } from "@/lib/csp";

export async function proxy(request: NextRequest) {
  // Nonce baru per request: Next.js membacanya dari header CSP request dan
  // menempelkannya ke semua <script> miliknya saat render
  const nonce = createNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const next = () => NextResponse.next({ request: { headers: requestHeaders } });
  let response = next();

  // Sesi Supabase hanya relevan untuk area admin — halaman publik tidak
  // perlu menunggu round-trip ke Supabase Auth
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase env vars are missing in proxy");
      response.headers.set("Content-Security-Policy", csp);
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = next();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Proteksi route /admin
    if (!user && pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Redirect dari /admin/login jika sudah login
    if (user && pathname === "/admin/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Semua halaman & request RSC (termasuk prefetch, agar proteksi /admin
  // tetap berlaku); aset statis dan gambar dilewati
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|pdf|woff2?)$).*)",
  ],
};
