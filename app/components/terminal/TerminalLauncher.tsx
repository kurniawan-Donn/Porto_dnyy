"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import type { TerminalData } from "./commands";

// Terminal (dan mesin perintahnya) baru diunduh saat pertama kali dibuka
const Terminal = dynamic(() => import("./Terminal"), { ssr: false });

export const OPEN_TERMINAL_EVENT = "open-terminal";

/** Buka terminal dari komponen mana pun (mis. tombol di Navbar) */
export function openTerminal() {
  window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT));
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * Pintasan keyboard: ` (backtick) atau Ctrl/⌘+K. Diabaikan saat pengguna
 * sedang mengetik di form agar tidak mengganggu form kontak.
 */
export default function TerminalLauncher({ data }: { data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isShortcut = (e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "`" && !e.ctrlKey && !e.metaKey);
      if (!isShortcut || isTypingTarget(e.target)) return;
      e.preventDefault();
      show();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_TERMINAL_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_TERMINAL_EVENT, show);
    };
  }, [show]);

  return <AnimatePresence>{open && <Terminal data={data} onClose={close} />}</AnimatePresence>;
}
