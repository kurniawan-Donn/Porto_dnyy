"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { complete, runCommand, type TerminalData, type TerminalEffect } from "./commands";

type Entry = { id: number; input?: string; output?: ReactNode };

const PROMPT_USER = "guest@dony-soc";

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-emerald-600 dark:text-emerald-400">{PROMPT_USER}</span>
      <span className="text-slate-400 dark:text-slate-500">:</span>
      <span className="text-cyan-600 dark:text-cyan-400">~</span>
      <span className="text-slate-400 dark:text-slate-500">$&nbsp;</span>
    </span>
  );
}

const WELCOME: Entry = {
  id: 0,
  output: (
    <div className="space-y-1">
      <p className="text-cyan-600 dark:text-cyan-400">dony-soc v1.0 — secure shell (read-only)</p>
      <p className="text-slate-500 dark:text-slate-400">
        Ketik <span className="text-cyan-600 dark:text-cyan-400">help</span> untuk melihat perintah.
      </p>
    </div>
  ),
};

/**
 * Terminal interaktif (scripted, tanpa AI). Dimuat lazy oleh TerminalLauncher
 * hanya saat pertama kali dibuka, jadi tidak menambah bundle awal.
 */
export default function Terminal({ data, onClose }: { data: TerminalData; onClose: () => void }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    inputRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const applyEffect = (effect: TerminalEffect) => {
    switch (effect.type) {
      case "clear":
        setEntries([]);
        break;
      case "close":
        onClose();
        break;
      case "open-url":
        // Dipanggil langsung dari event keydown → tidak diblokir popup blocker
        window.open(effect.url, "_blank", "noopener,noreferrer");
        break;
      case "navigate":
        // Beri waktu sejenak agar pesan "membuka…" terbaca
        setTimeout(() => go(effect.href), 350);
        break;
    }
  };

  const submit = () => {
    const command = input.trim();
    setInput("");
    setHistoryIndex(null);
    if (!command) {
      setEntries((prev) => [...prev, { id: nextId.current++, input: "" }]);
      return;
    }

    const newHistory = [...history, command];
    setHistory(newHistory);
    const result = runCommand(command, { data, history: newHistory, go });
    if (result.effect?.type !== "clear") {
      setEntries((prev) => [...prev, { id: nextId.current++, input: command, output: result.output }]);
    }
    if (result.effect) applyEffect(result.effect);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      setInput((value) => complete(value, data));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(index);
        setInput(history[index]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-[70vh] max-h-[560px] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-300 bg-white/95 font-mono text-[13px] leading-relaxed text-slate-800 shadow-[0_0_60px_-10px_rgba(6,182,212,0.35)] dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-200"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
          <span className="h-3 w-3 rounded-full bg-red-500/80" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" aria-hidden="true" />
          <span className="ml-3 truncate text-xs text-slate-500 dark:text-slate-400">
            {PROMPT_USER}: ~ — zsh
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup terminal"
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-cyan-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
          >
            <X size={15} />
          </button>
        </div>

        {/* Output */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          {entries.map((entry) => (
            <div key={entry.id}>
              {entry.input !== undefined && (
                <div className="flex">
                  <Prompt />
                  <span className="break-all">{entry.input}</span>
                </div>
              )}
              {entry.output && <div className="mt-1">{entry.output}</div>}
            </div>
          ))}

          {/* Input */}
          <div className="flex items-center">
            <Prompt />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Perintah terminal"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent caret-cyan-500 outline-none focus-visible:outline-none"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
