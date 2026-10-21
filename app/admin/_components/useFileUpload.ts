"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { uploadFile } from "@/lib/supabase/storage";

type Kind = "image" | "pdf";

export type FileUpload = ReturnType<typeof useFileUpload>;

/**
 * Upload satu file ke Supabase Storage dengan validasi tipe & ukuran.
 * URL hasil upload diserahkan ke pemanggil lewat onUploaded — state URL
 * tetap milik form masing-masing.
 */
export function useFileUpload({
  folder,
  kind = "image",
  maxMb = 5,
  messages,
  onStart,
  onUploaded,
  onError,
}: {
  /** Subfolder di bucket "portfolio", mis. "projects" */
  folder: string;
  kind?: Kind;
  maxMb?: number;
  messages?: { type?: string; size?: string };
  onStart?: () => void;
  onUploaded: (url: string, file: File) => void;
  onError: (message: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validType = kind === "pdf" ? file.type === "application/pdf" : file.type.startsWith("image/");
    if (!validType) {
      onError(messages?.type ?? "File harus gambar.");
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      onError(messages?.size ?? `Max ${maxMb} MB.`);
      return;
    }

    setIsUploading(true);
    onStart?.();
    try {
      onUploaded(await uploadFile(file, folder), file);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setIsUploading(false);
      // Reset agar file yang sama bisa dipilih ulang
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return {
    isUploading,
    open: () => inputRef.current?.click(),
    inputProps: {
      ref: inputRef,
      type: "file" as const,
      accept: kind === "pdf" ? "application/pdf" : "image/*",
      onChange,
      className: "hidden",
    },
  };
}
