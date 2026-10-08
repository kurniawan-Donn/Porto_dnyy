export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-cyan-500 animate-spin" />
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
          Memuat...
        </p>
      </div>
    </div>
  );
}