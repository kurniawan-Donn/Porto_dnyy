"use client";

import { motion, AnimatePresence } from "motion/react";
import { Tag as TagIcon } from "lucide-react";
import { deleteTechTag } from "@/app/actions/techTags";
import { TechIcon } from "@/lib/tech-icons";
import type { TechTag } from "@/lib/types";
import { AddButton, RowActions } from "../_components/buttons";
import ConfirmDeleteDialog from "../_components/ConfirmDeleteDialog";
import { StatusMessage } from "../_components/StatusMessage";
import { useAdminList } from "../_components/useAdminList";
import TechTagForm from "./TechTagForm";

export default function TechTagsManager({ initialTags }: { initialTags: TechTag[] }) {
  const list = useAdminList({
    initialItems: initialTags,
    remove: deleteTechTag,
    deletedMessage: "Tech tag dihapus!",
  });
  const isAdding = list.editing === "new";
  const editingId = list.editing && list.editing !== "new" ? list.editing.id : null;

  // Form inline langsung ditutup, lalu halaman dimuat ulang
  const handleSaved = (message: string) => {
    list.setEditing(null);
    list.handleSaved(message);
  };

  return (
    <div className="space-y-6">
      <StatusMessage message={list.message} />

      {!isAdding && <AddButton onClick={() => list.setEditing("new")}>Tambah Tech Tag</AddButton>}

      <AnimatePresence>
        {isAdding && <TechTagForm onCancel={() => list.setEditing(null)} onSaved={handleSaved} />}
      </AnimatePresence>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-800/40 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <TagIcon size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-100">Semua Tech Tags</h3>
            <p className="text-xs text-slate-500">{list.items.length} tag</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {list.items.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-600">Belum ada tech tag.</div>
          )}

          {list.items.map((tag) =>
            editingId === tag.id ? (
              <div key={tag.id} className="p-4">
                <TechTagForm initialData={tag} onCancel={() => list.setEditing(null)} onSaved={handleSaved} />
              </div>
            ) : (
              <motion.div
                key={tag.id}
                layout
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-slate-800/40"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
                  <TechIcon name={tag.icon} size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-medium text-slate-100">{tag.name}</h4>
                    {tag.category && <span className="font-mono text-[10px] text-slate-600">{tag.category}</span>}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {tag.description || "— Tidak ada deskripsi —"}
                  </p>
                </div>

                <RowActions
                  size="md"
                  className="flex flex-shrink-0 items-center gap-1"
                  onEdit={() => list.setEditing(tag)}
                  onDelete={() => list.setDeleteId(tag.id)}
                />
              </motion.div>
            )
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={!!list.deleteId}
        title="Hapus Tech Tag?"
        isPending={list.isDeleting}
        onCancel={() => list.setDeleteId(null)}
        onConfirm={list.confirmDelete}
      />
    </div>
  );
}
