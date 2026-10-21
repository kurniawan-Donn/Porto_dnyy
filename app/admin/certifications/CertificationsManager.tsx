"use client";

import { AnimatePresence } from "motion/react";
import { deleteCertification } from "@/app/actions/certifications";
import { getCertIcon } from "@/lib/lucide-icons";
import type { Certification } from "@/lib/types";
import { AddButton, RowActions } from "../_components/buttons";
import ConfirmDeleteDialog from "../_components/ConfirmDeleteDialog";
import { StatusMessage } from "../_components/StatusMessage";
import { useAdminList } from "../_components/useAdminList";
import CertificationForm from "./CertificationForm";

export default function CertificationsManager({
  initialCertifications,
}: {
  initialCertifications: Certification[];
}) {
  const list = useAdminList({
    initialItems: initialCertifications,
    remove: deleteCertification,
    deletedMessage: "Sertifikasi dihapus!",
  });

  return (
    <div className="space-y-6">
      <StatusMessage message={list.message} />

      <AddButton onClick={() => list.setEditing("new")}>Tambah Sertifikasi</AddButton>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.items.map((cert) => {
          const Icon = getCertIcon(cert.icon_name);
          return (
            <div
              key={cert.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group flex flex-col"
            >
              {cert.image_url && (
                <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.image_url}
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Icon size={20} />
                  </div>
                  <RowActions onEdit={() => list.setEditing(cert)} onDelete={() => list.setDeleteId(cert.id)} />
                </div>
                <h3 className="font-bold text-slate-100 mb-1 leading-snug">{cert.name}</h3>
                <p className="text-sm text-slate-400 mb-1">{cert.issuer}</p>
                <p className="text-xs text-slate-500 font-mono">{cert.date}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-600">
                    #{cert.order_index} • {cert.icon_name}
                  </span>
                  {cert.credential_url && (
                    <span className="text-[10px] font-mono text-cyan-400/70">✓ Link aktif</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {list.editing && (
          <CertificationForm
            initialData={list.editing === "new" ? null : list.editing}
            onClose={() => list.setEditing(null)}
            onSaved={list.handleSaved}
          />
        )}
      </AnimatePresence>

      <ConfirmDeleteDialog
        open={!!list.deleteId}
        title="Hapus Sertifikasi?"
        isPending={list.isDeleting}
        onCancel={() => list.setDeleteId(null)}
        onConfirm={list.confirmDelete}
      />
    </div>
  );
}
