export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-cyan-500 animate-spin" />
        <p className="text-sm font-mono text-slate-400">
          Memuat...
        </p>
      </div>
    </div>
  );
}