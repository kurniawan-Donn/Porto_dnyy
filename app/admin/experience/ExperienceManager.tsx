"use client";

import { AnimatePresence } from "motion/react";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { deleteExperience } from "@/app/actions/experience";
import type { Experience, TechTag } from "@/lib/types";
import { AddButton, RowActions } from "../_components/buttons";
import ConfirmDeleteDialog from "../_components/ConfirmDeleteDialog";
import { StatusMessage } from "../_components/StatusMessage";
import { useAdminList } from "../_components/useAdminList";
import ExperienceForm from "./ExperienceForm";

export default function ExperienceManager({
  initialExperiences,
  availableTags,
}: {
  initialExperiences: Experience[];
  availableTags: TechTag[];
}) {
  const list = useAdminList({
    initialItems: initialExperiences,
    remove: deleteExperience,
    deletedMessage: "Pengalaman dihapus!",
  });

  return (
    <div className="space-y-6">
      <StatusMessage message={list.message} />

      <AddButton onClick={() => list.setEditing("new")}>Tambah Pengalaman</AddButton>

      <div className="space-y-3">
        {list.items.map((exp) => (
          <div
            key={exp.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Logo Perusahaan */}
                {exp.image_url ? (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={exp.image_url} alt={exp.company} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center text-cyan-400">
                    <Briefcase size={20} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-100">{exp.position}</h3>
                    {exp.is_current && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Active
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-600">#{exp.order_index}</span>
                  </div>
                  <p className="text-cyan-400/80 text-sm flex items-center gap-1.5">
                    <Briefcase size={12} /> {exp.company}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500 font-mono">
                    {exp.period && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} /> {exp.period}
                      </span>
                    )}
                    {exp.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} /> {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono text-cyan-400/80 bg-cyan-400/5 border border-cyan-400/20 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <RowActions
                size="md"
                className="flex items-center gap-1 flex-shrink-0"
                onEdit={() => list.setEditing(exp)}
                onDelete={() => list.setDeleteId(exp.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {list.editing && (
          <ExperienceForm
            initialData={list.editing === "new" ? null : list.editing}
            availableTags={availableTags}
            onClose={() => list.setEditing(null)}
            onSaved={list.handleSaved}
          />
        )}
      </AnimatePresence>

      <ConfirmDeleteDialog
        open={!!list.deleteId}
        title="Hapus Pengalaman?"
        isPending={list.isDeleting}
        onCancel={() => list.setDeleteId(null)}
        onConfirm={list.confirmDelete}
      />
    </div>
  );
}
