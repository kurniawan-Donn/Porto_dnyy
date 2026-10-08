"use client";
import { useState, type FormEvent, type ChangeEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useSound } from "./SoundProvider";

// ============================================
// Ikon Sosial (SVG manual)
// ============================================
const GithubIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.6-.1-3.3 0 0-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C7.8 1.2 6.6 1.6 6.6 1.6c-.7 1.7-.2 3 .1 3.3-.8.9-1.3 2-1.3 3.4 0 5 3 6.2 6 6.5-.4.4-.7.9-.8 1.6-.7.3-2.6.9-3.7-1.1-.5-.8-1.4-1.3-2.3-1.3-.9 0-1.6.5-2.3 1.3" />
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// ============================================
// Types
// ============================================
type ContactSettings = {
  email: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
} | null;

type Social = {
  name: string;
  href: string;
  icon: (props: { size?: number; className?: string }) => ReactNode;
};

type Status = "idle" | "loading" | "success" | "error";

// ============================================
// Komponen Utama
// ============================================
export default function Contact({ settings }: { settings: ContactSettings }) {
  const { play } = useSound();

  // Bangun config kontak dari settings + fallback
  const CONTACT_INFO = {
    email: settings?.email || "donykurniawan1298@gmail.com",
    location: settings?.location || "Madiun, Jawa Timur, Indonesia",
    socials: [
      settings?.github_url && {
        name: "GitHub",
        href: settings.github_url,
        icon: GithubIcon,
      },
      settings?.linkedin_url && {
        name: "LinkedIn",
        href: settings.linkedin_url,
        icon: LinkedinIcon,
      },
      settings?.instagram_url && {
        name: "Instagram",
        href: settings.instagram_url,
        icon: InstagramIcon,
      },
    ].filter(Boolean) as Social[],
  };

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status === "error" || status === "success") setStatus("idle");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Mohon lengkapi Nama, Email, dan Pesan.");
      play("error");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setStatus("error");
      setErrorMsg("Format email tidak valid.");
      play("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan.");
      setStatus("success");
      play("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      play("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <section id="kontak" className="max-w-5xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-4 text-slate-900 dark:text-slate-100">
          <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xl">05.</span> Mari Terhubung
          <div className="h-px bg-slate-300 dark:bg-slate-700 flex-grow ml-4 max-w-xs"></div>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ============================
              KOLOM KIRI: Info Kontak
          ============================ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Punya proyek atau peluang?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Saya selalu terbuka untuk diskusi seputar{" "}
                <span className="text-cyan-600 dark:text-cyan-400">IT Audit</span>,{" "}
                <span className="text-cyan-600 dark:text-cyan-400">Web Development</span>, atau peluang
                kolaborasi. Kirim pesan dan saya akan merespons secepatnya.
              </p>
            </div>

            {/* Detail Kontak */}
            <div className="space-y-4">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                onMouseEnter={() => play("hover")}
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-400/20 group-hover:scale-105 transition-all duration-300">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    Email
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors break-all">
                    {CONTACT_INFO.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    Lokasi
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                    {CONTACT_INFO.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Sosial Media */}
            {CONTACT_INFO.socials.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-3">
                  Sosial Media
                </p>
                <div className="flex gap-3">
                  {CONTACT_INFO.socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => play("hover")}
                        aria-label={s.name}
                        className="w-11 h-11 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* ============================
              KOLOM KANAN: Form
          ============================ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="relative bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 space-y-5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 dark:via-cyan-400/60 to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Nama <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap Anda"
                    disabled={status === "loading"}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 dark:focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/30 dark:focus:ring-cyan-400/30 transition-all disabled:opacity-60"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Email <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    disabled={status === "loading"}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 dark:focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/30 dark:focus:ring-cyan-400/30 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Subjek
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Topik pembicaraan"
                  disabled={status === "loading"}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 dark:focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/30 dark:focus:ring-cyan-400/30 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Pesan <span className="text-cyan-600 dark:text-cyan-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tulis pesan Anda di sini..."
                  disabled={status === "loading"}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 dark:focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/30 dark:focus:ring-cyan-400/30 transition-all resize-none disabled:opacity-60"
                />
              </div>

              {status === "error" && errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10 border border-red-500/20 dark:border-red-400/20 rounded-md px-4 py-2.5"
                >
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-sm text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 rounded-md px-4 py-2.5"
                >
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Pesan berhasil terkirim! Saya akan segera membalas ke email Anda.</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                onMouseEnter={() => play("hover")}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-white dark:text-slate-900 font-semibold px-8 py-3 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}