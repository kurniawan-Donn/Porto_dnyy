"use client";

import { SquareTerminal } from "lucide-react";
import { useSound } from "../SoundProvider";
import { openTerminal } from "./TerminalLauncher";

export default function TerminalButton() {
  const { play } = useSound();

  return (
    <button
      type="button"
      onClick={() => {
        play("open");
        openTerminal();
      }}
      aria-label="Buka terminal (tekan ` atau Ctrl+K)"
      title="Terminal — tekan ` atau Ctrl+K"
      className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-center transition-all duration-300"
    >
      <SquareTerminal size={16} />
    </button>
  );
}
