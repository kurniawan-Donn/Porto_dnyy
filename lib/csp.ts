// ============================================
// Content-Security-Policy berbasis nonce (dibuat per request di proxy.ts).
//
// - script-src: hanya script ber-nonce; 'strict-dynamic' meneruskan izin ke
//   chunk yang dimuat script tersebut. Tanpa 'unsafe-inline'.
// - style-src: 'unsafe-inline' tetap diperlukan untuk atribut style="" hasil
//   SSR (animasi motion, Tailwind arbitrary). Risiko injeksi CSS jauh lebih
//   kecil daripada script — dicatat sebagai accepted risk di Audit Report.
//   Jangan tambahkan nonce ke style-src: browser lalu mengabaikan
//   'unsafe-inline' dan atribut style ikut terblokir.
// - Supabase: gambar Storage (img-src) + Auth/upload admin (connect-src).
// - Vercel Analytics/Speed Insights (jika dipasang) berjalan same-origin
//   (/_vercel/*), sudah tercakup 'self'. Font di-host sendiri oleh next/font.
// ============================================

export function buildCsp(nonce: string, isDev = process.env.NODE_ENV === "development"): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function createNonce(): string {
  return btoa(crypto.randomUUID());
}
