import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-8xl font-bold text-cyan-500/30 dark:text-cyan-400/20 font-mono mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
          Sepertinya Anda tersesat. Halaman yang Anda cari tidak ada di sini.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-semibold px-6 py-2.5 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          <Home size={16} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}