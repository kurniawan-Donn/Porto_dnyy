"use client";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Maaf, ada masalah saat memuat halaman ini. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-semibold px-6 py-2.5 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          <RotateCcw size={16} />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}