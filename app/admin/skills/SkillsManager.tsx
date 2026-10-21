"use client";

import { motion, AnimatePresence } from "motion/react";
import { deleteSkill } from "@/app/actions/skills";
import { TechIcon } from "@/lib/tech-icons";
import type { Skill } from "@/lib/types";
import { AddButton, RowActions } from "../_components/buttons";
import ConfirmDeleteDialog from "../_components/ConfirmDeleteDialog";
import { StatusMessage } from "../_components/StatusMessage";
import { useAdminList } from "../_components/useAdminList";
import { SKILL_CATEGORIES } from "./categories";
import SkillForm from "./SkillForm";

export default function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const list = useAdminList({
    initialItems: initialSkills,
    remove: deleteSkill,
    deletedMessage: "Keahlian dihapus!",
  });
  const isAdding = list.editing === "new";
  const editingId = list.editing && list.editing !== "new" ? list.editing.id : null;

  // Form inline langsung ditutup, lalu halaman dimuat ulang
  const handleSaved = (message: string) => {
    list.setEditing(null);
    list.handleSaved(message);
  };

  const grouped = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: list.items.filter((s) => s.category === cat.name),
  }));

  return (
    <div className="space-y-6">
      <StatusMessage message={list.message} />

      {!isAdding && <AddButton onClick={() => list.setEditing("new")}>Tambah Keahlian Baru</AddButton>}

      <AnimatePresence>
        {isAdding && <SkillForm onCancel={() => list.setEditing(null)} onSaved={handleSaved} />}
      </AnimatePresence>

      {grouped.map((group) => {
        const GroupIcon = group.icon;
        return (
          <div key={group.name} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Group Header */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/40 border-b border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <GroupIcon size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">{group.name}</h3>
                <p className="text-xs text-slate-500">{group.skills.length} keahlian</p>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-800">
              {group.skills.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-600">Belum ada keahlian di kategori ini.</div>
              )}

              {group.skills.map((skill) =>
                editingId === skill.id ? (
                  <div key={skill.id} className="p-4">
                    <SkillForm initialData={skill} onCancel={() => list.setEditing(null)} onSaved={handleSaved} />
                  </div>
                ) : (
                  <motion.div
                    key={skill.id}
                    layout
                    className="flex items-center gap-4 p-4 hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                      <TechIcon name={skill.icon} size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-medium text-slate-100">{skill.name}</h4>
                        <span className="text-[10px] font-mono text-slate-600">#{skill.order_index}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {skill.description || "— Tidak ada deskripsi —"}
                      </p>
                    </div>

                    <RowActions
                      size="md"
                      className="flex items-center gap-1 flex-shrink-0"
                      onEdit={() => list.setEditing(skill)}
                      onDelete={() => list.setDeleteId(skill.id)}
                    />
                  </motion.div>
                )
              )}
            </div>
          </div>
        );
      })}

      <ConfirmDeleteDialog
        open={!!list.deleteId}
        title="Hapus Keahlian?"
        isPending={list.isDeleting}
        onCancel={() => list.setDeleteId(null)}
        onConfirm={list.confirmDelete}
      />
    </div>
  );
}
