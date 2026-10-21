"use client";

import { AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { deleteProject } from "@/app/actions/projects";
import type { Project, TechTag } from "@/lib/types";
import { AddButton, RowActions } from "../_components/buttons";
import ConfirmDeleteDialog from "../_components/ConfirmDeleteDialog";
import { StatusMessage } from "../_components/StatusMessage";
import { useAdminList } from "../_components/useAdminList";
import ProjectForm from "./ProjectForm";

export default function ProjectsManager({
  initialProjects,
  availableTags,
}: {
  initialProjects: Project[];
  availableTags: TechTag[];
}) {
  const list = useAdminList({
    initialItems: initialProjects,
    remove: deleteProject,
    deletedMessage: "Proyek dihapus!",
  });

  return (
    <div className="space-y-6">
      <StatusMessage message={list.message} />

      <AddButton onClick={() => list.setEditing("new")}>Tambah Proyek</AddButton>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.items.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {p.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    <Star size={10} /> Featured
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-600">#{p.order_index}</span>
              </div>
              <RowActions onEdit={() => list.setEditing(p)} onDelete={() => list.setDeleteId(p.id)} />
            </div>
            <h3 className="font-bold text-slate-100 mb-1">{p.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
            {p.tech && p.tech.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono text-cyan-400/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {list.editing && (
          <ProjectForm
            initialData={list.editing === "new" ? null : list.editing}
            availableTags={availableTags}
            onClose={() => list.setEditing(null)}
            onSaved={list.handleSaved}
          />
        )}
      </AnimatePresence>

      <ConfirmDeleteDialog
        open={!!list.deleteId}
        title="Hapus Proyek?"
        isPending={list.isDeleting}
        onCancel={() => list.setDeleteId(null)}
        onConfirm={list.confirmDelete}
      />
    </div>
  );
}
