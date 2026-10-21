import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { createPublicClient } from "@/lib/supabase/public";

// ============================================
// Batas input & rate limit
// ============================================
const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit sederhana per IP di memori. Di Vercel tiap instance serverless
// punya Map sendiri, jadi ini "best effort" — cukup untuk menahan spam
// beruntun dari satu sumber. Lapisan utama tetap RLS (anon hanya INSERT).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function field(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

// TODO: setelah punya domain kustom, verifikasi domain di Resend lalu ganti
// `from` ke alamat domain sendiri. Selama masih memakai onboarding@resend.dev,
// Resend hanya mengirim ke email pemilik akun Resend.
async function sendNotification(msg: { name: string; email: string; subject: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !to) {
    console.warn("[contact] RESEND_API_KEY / CONTACT_EMAIL_TO belum diset, email dilewati.");
    return;
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: [to],
    replyTo: msg.email,
    subject: msg.subject || `Pesan baru dari ${msg.name}`,
    html: `
      <h2>Pesan Baru dari Portofolio</h2>
      <p><strong>Nama:</strong> ${escapeHtml(msg.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(msg.email)}</p>
      <p><strong>Subjek:</strong> ${escapeHtml(msg.subject || "-")}</p>
      <hr />
      <p>${escapeHtml(msg.message).replace(/\n/g, "<br />")}</p>
    `,
  });
  if (error) console.error("[contact] Resend error:", error);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  // Honeypot terisi → hampir pasti bot. Balas sukses palsu agar bot tidak mencoba ulang.
  if (field(body, "website")) {
    return NextResponse.json({ success: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak pesan. Coba lagi dalam beberapa menit." },
      { status: 429 }
    );
  }

  const msg = {
    name: field(body, "name"),
    email: field(body, "email"),
    subject: field(body, "subject"),
    message: field(body, "message"),
  };

  if (!msg.name || !msg.email || !msg.message) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }
  if (!EMAIL_RE.test(msg.email)) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
  }
  const tooLong = (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).find(
    (key) => msg[key].length > LIMITS[key]
  );
  if (tooLong) {
    return NextResponse.json(
      { error: `Kolom ${tooLong} terlalu panjang (maks ${LIMITS[tooLong]} karakter).` },
      { status: 400 }
    );
  }

  // 1) Simpan dulu ke database — pesan aman walau email gagal terkirim
  const supabase = createPublicClient();
  const { error } = await supabase.from("messages").insert({
    name: msg.name,
    email: msg.email,
    subject: msg.subject || null,
    message: msg.message,
  });

  if (error) {
    console.error("[contact] Gagal menyimpan pesan:", error.message);
    return NextResponse.json({ error: "Gagal mengirim pesan. Coba lagi nanti." }, { status: 500 });
  }

  // 2) Notifikasi email dikirim setelah respons, tidak membuat pengunjung menunggu
  after(() => sendNotification(msg));

  return NextResponse.json({ success: true });
}
