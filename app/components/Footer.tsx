export default function Footer() {
  return (
    <footer className="text-center py-8 text-slate-500 dark:text-slate-500 text-sm font-mono border-t border-slate-200 dark:border-slate-800 mt-10 transition-colors duration-300">
      <p>
        Dirancang & Dibangun oleh{" "}
        <span className="text-slate-700 dark:text-slate-300">Dony Kurniawan</span>
      </p>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-600">
        Diberdayakan oleh Next.js, Tailwind CSS & Vercel
      </p>
    </footer>
  );
}