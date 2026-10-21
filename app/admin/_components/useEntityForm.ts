"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/types";

/**
 * Logika simpan form tambah/edit: memanggil server action create atau
 * update sesuai ada tidaknya initialData, lalu melapor ke onSaved.
 */
export function useEntityForm<T extends { id: string }>({
  initialData,
  create,
  update,
  messages,
  onSaved,
}: {
  initialData?: T | null;
  create: (fd: FormData) => Promise<ActionResult>;
  update: (id: string, fd: FormData) => Promise<ActionResult>;
  messages: { created: string; updated: string };
  onSaved: (message: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isEditing = !!initialData;

  const submit = (fd: FormData) => {
    setError("");
    startTransition(async () => {
      const result = initialData ? await update(initialData.id, fd) : await create(fd);
      if (result.success) onSaved(isEditing ? messages.updated : messages.created);
      else setError(result.error ?? "Gagal menyimpan.");
    });
  };

  return { isEditing, isPending, error, setError, submit };
}
