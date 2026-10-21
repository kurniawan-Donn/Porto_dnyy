// ============================================
// Self-assessment keamanan situs ini (section "Audit Report").
//
// Sengaja disimpan di kode, bukan di database: setiap klaim harus sesuai
// dengan kode & konfigurasi pada commit yang sama, dan ikut ter-review saat
// kode berubah. Perbarui `ASSESSED_AT` dan status setiap kali ada perubahan
// keamanan. Jangan menandai PASS untuk hal yang belum diverifikasi.
// ============================================

export const ASSESSED_AT = "2026-10-21";

export type ControlStatus = "pass" | "finding" | "accepted" | "manual";
export type Severity = "high" | "medium" | "low" | "info";

/** Header yang dicek langsung dari respons situs (lihat AuditReport.tsx) */
export type LiveCheck = "csp" | "hsts" | "nosniff" | "frame" | "referrer" | "permissions";

export type AuditControl = {
  id: string;
  title: string;
  status: ControlStatus;
  severity?: Severity;
  /** Referensi standar: OWASP ASVS 4.0.3 & ISO/IEC 27001:2022 Annex A */
  refs: string[];
  evidence: string;
  /** Untuk finding/accepted: rencana perbaikan atau alasan risiko diterima */
  note?: string;
  live?: LiveCheck[];
};

export const AUDIT_SCOPE =
  "Aplikasi web publik, panel admin, API form kontak, dan konfigurasi Supabase (database & storage).";

export const AUDIT_METHOD =
  "Review kode & konfigurasi, npm audit, dan pengecekan header HTTP secara langsung dari browser Anda.";

export const AUDIT_CONTROLS: AuditControl[] = [
  {
    id: "SC-01",
    title: "Content-Security-Policy ketat berbasis nonce",
    status: "pass",
    refs: ["ASVS V14.4.3", "ISO A.8.26"],
    evidence:
      "Nonce acak per request dari proxy; script-src hanya 'nonce-…' + 'strict-dynamic' tanpa 'unsafe-inline'. object-src, frame-src 'none'; base-uri & form-action 'self'.",
    live: ["csp"],
  },
  {
    id: "SC-02",
    title: "Header keamanan HTTP",
    status: "pass",
    refs: ["ASVS V14.4.4–V14.4.7", "ISO A.8.26"],
    evidence:
      "HSTS 2 tahun + preload, X-Content-Type-Options nosniff, frame-ancestors 'none' + X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy menonaktifkan kamera/mikrofon/lokasi/pembayaran.",
    live: ["hsts", "nosniff", "frame", "referrer", "permissions"],
  },
  {
    id: "SC-03",
    title: "Gaya inline diizinkan (style-src 'unsafe-inline')",
    status: "accepted",
    severity: "low",
    refs: ["ASVS V14.4.3"],
    evidence: "style-src mengizinkan 'unsafe-inline' untuk atribut style hasil render server.",
    note:
      "Diperlukan oleh animasi & atribut style dari SSR. Injeksi CSS berdampak jauh lebih kecil dari injeksi script, dan script tetap dikunci nonce.",
  },
  {
    id: "AC-01",
    title: "Akses data dibatasi Row Level Security",
    status: "pass",
    refs: ["ASVS V4.1", "ISO A.8.3"],
    evidence:
      "RLS aktif di semua tabel. Pengunjung (anon) hanya bisa SELECT konten publik dan INSERT ke tabel pesan — tidak bisa membaca pesan orang lain. Skema & policy di supabase/migrations.",
  },
  {
    id: "AC-02",
    title: "Panel admin terlindungi berlapis",
    status: "pass",
    refs: ["ASVS V4.1.3", "ISO A.8.5"],
    evidence:
      "Lapis 1: proxy mengalihkan /admin ke login bila belum ada sesi. Lapis 2: setiap server action admin memanggil requireAdmin() sebelum menulis ke database.",
  },
  {
    id: "AC-03",
    title: "Pendaftaran akun publik dinonaktifkan",
    status: "manual",
    refs: ["ASVS V4.1", "ISO A.5.18"],
    evidence:
      "Diatur di dashboard Supabase (Authentication → Sign up), bukan di kode — perlu bukti manual (screenshot) saat audit.",
  },
  {
    id: "IV-01",
    title: "Validasi & encoding input form kontak",
    status: "pass",
    refs: ["ASVS V5.1", "ASVS V5.3", "ISO A.8.28"],
    evidence:
      "Validasi format & panjang di server; isi pesan di-escape sebelum masuk email HTML; honeypot anti-bot.",
  },
  {
    id: "IV-02",
    title: "Rate limiting form kontak",
    status: "finding",
    severity: "low",
    refs: ["ASVS V11.1.4", "ISO A.8.16"],
    evidence: "Batas 3 pesan / 10 menit per IP, disimpan di memori tiap instance serverless.",
    note:
      "Instance serverless tidak berbagi memori, jadi batas bisa dilewati dengan request paralel. Rencana: rate limit terdistribusi (Vercel Firewall / Redis).",
  },
  {
    id: "SD-01",
    title: "Dependensi production bebas kerentanan yang diketahui",
    status: "pass",
    refs: ["ASVS V14.2.1", "ISO A.8.8"],
    evidence:
      "npm audit --omit=dev: 0 kerentanan. Next.js dinaikkan ke 16.4.2 untuk menutup advisory kritis (termasuk RCE di next/og).",
  },
  {
    id: "SD-02",
    title: "Kerentanan pada tooling development",
    status: "accepted",
    severity: "info",
    refs: ["ISO A.8.8"],
    evidence: "Advisory 'braces' (high) lewat rantai eslint-config-next.",
    note: "Hanya dipakai saat lint di mesin developer, tidak ikut ter-deploy. Dipantau sampai rilis perbaikan upstream.",
  },
  {
    id: "SD-03",
    title: "Integritas script (Subresource Integrity)",
    status: "finding",
    severity: "info",
    refs: ["ASVS V14.2.3", "ISO A.8.28"],
    evidence:
      "SRI eksperimental Next.js (sha256) baru menempel pada chunk bootstrap — 7 dari 17 <script src> di beranda; chunk komponen belum.",
    note:
      "Risiko rendah: semua script same-origin dan tetap dikunci CSP nonce. Pantau dukungan SRI penuh di rilis Next.js berikutnya.",
  },
  {
    id: "SM-01",
    title: "Manajemen secret",
    status: "pass",
    refs: ["ASVS V6.4.1", "ISO A.8.24"],
    evidence:
      "Hanya anon key Supabase yang publik (dibatasi RLS). Service-role key tidak dipakai di aplikasi; API key email hanya di environment server.",
  },
  {
    id: "PR-01",
    title: "Privasi pengunjung",
    status: "pass",
    refs: ["ISO A.5.34"],
    evidence:
      "Tanpa cookie pelacak atau analytics pihak ketiga. Font di-host sendiri — tidak ada request ke Google Fonts.",
  },
  {
    id: "EM-01",
    title: "Autentikasi email notifikasi",
    status: "finding",
    severity: "info",
    refs: ["ISO A.5.14"],
    evidence: "Notifikasi form kontak dikirim dari domain sandbox Resend.",
    note: "Verifikasi domain sendiri (SPF, DKIM, DMARC) setelah domain kustom aktif.",
  },
];
