"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/types";

// Jeda sebelum reload supaya pesan sukses sempat terbaca
const RELOAD_DELAY_MS = 700;

/**
 * State bersama halaman daftar admin: item, item yang sedang diedit
 * ("new" untuk tambah), konfirmasi hapus, dan pesan status.
 */
export function useAdminList<T extends { id: string }>({
  initialItems,
  remove,
  deletedMessage,
}: {
  initialItems: T[];
  remove: (id: string) => Promise<ActionResult>;
  deletedMessage: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isDeleting, startTransition] = useTransition();

  /** Setelah simpan: tampilkan pesan lalu muat ulang data dari server */
  const handleSaved = (msg: string) => {
    setMessage(msg);
    setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
  };

  const confirmDelete = () => {
    const id = deleteId;
    if (!id) return;
    startTransition(async () => {
      const result = await remove(id);
      if (result.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setMessage(deletedMessage);
        setDeleteId(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    });
  };

  return {
    items,
    editing,
    setEditing,
    deleteId,
    setDeleteId,
    message,
    isDeleting,
    handleSaved,
    confirmDelete,
  };
}
