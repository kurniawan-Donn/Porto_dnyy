"use client";

import { AnimatePresence } from "motion/react";
import { Link as LinkIcon } from "lucide-react";
import { deleteStat } from "@/app/actions/stats";
import { getStatIcon } from "@/lib/lucide-icons";
import type { Stat, StatCounts } from "@/lib/types";
import { AddButton, RowActions } from "../_components/buttons";
import ConfirmDeleteDialog from "../_components/ConfirmDeleteDialog";
import { StatusMessage } from "../_components/StatusMessage";
import { useAdminList } from "../_components/useAdminList";
import StatForm from "./StatForm";

export default function StatsManager({
  initialStats,
  counts,
}: {
  initialStats: Stat[];
  counts: StatCounts;
}) {
  const list = useAdminList({
    initialItems: initialStats,
    remove: deleteStat,
    deletedMessage: "Stats dihapus!",
  });

  return (
    <div className="space-y-6">
      <StatusMessage message={list.message} />

      {/* Info banner tentang auto-count */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <LinkIcon size={14} />
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <p className="font-mono uppercase tracking-wider text-cyan-400 mb-1">Auto-Count Feature</p>
            Pilih <strong className="text-slate-200">auto_source</strong> untuk sync otomatis. Contoh: kalau pilih
            &ldquo;Jumlah Proyek&rdquo;, angka akan otomatis menyesuaikan jumlah proyek di database. Saat ini: <br />
            <span className="text-cyan-400 font-mono">
              {counts.projects} proyek • {counts.certifications} sertifikasi • {counts.experiences} pengalaman •{" "}
              {counts.skills} keahlian
            </span>
          </div>
        </div>
      </div>

      <AddButton onClick={() => list.setEditing("new")}>Tambah Kartu Stats</AddButton>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.items.map((s) => {
          const Icon = getStatIcon(s.icon_name);
          // Preview nilai sebenarnya kalau auto
          const displayValue = s.auto_source ? counts[s.auto_source] ?? s.value : s.value;

          return (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Icon size={20} />
                </div>
                <RowActions onEdit={() => list.setEditing(s)} onDelete={() => list.setDeleteId(s.id)} />
              </div>

              <div className="text-3xl font-bold font-mono text-slate-100 mb-1">
                {displayValue}
                {s.suffix}
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{s.label}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-600">#{s.order_index}</span>
                {s.auto_source ? (
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                    ⇄ {s.auto_source}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">manual</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {list.editing && (
          <StatForm
            initialData={list.editing === "new" ? null : list.editing}
            counts={counts}
            onClose={() => list.setEditing(null)}
            onSaved={list.handleSaved}
          />
        )}
      </AnimatePresence>

      <ConfirmDeleteDialog
        open={!!list.deleteId}
        title="Hapus Kartu Stats?"
        isPending={list.isDeleting}
        onCancel={() => list.setDeleteId(null)}
        onConfirm={list.confirmDelete}
      />
    </div>
  );
}
