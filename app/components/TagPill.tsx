"use client";

import { TechIcon } from "@/lib/tech-icons";

type TagPillProps = {
  icon: string | null | undefined;
  label: string;
  onClick?: () => void;
  variant?: "default" | "compact";
};

export default function TagPill({
  icon,
  label,
  onClick,
  variant = "default",
}: TagPillProps) {
  const isInteractive = !!onClick;

  const baseClass =
    "inline-flex items-center gap-1.5 rounded-md border font-mono transition-all " +
    "border-slate-200 bg-slate-100 text-slate-700 " +
    "dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300";

  const sizeClass =
    variant === "compact" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  const interactiveClass = isInteractive
    ? "cursor-pointer hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400"
    : "";

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} ${sizeClass} ${interactiveClass}`}
      >
        <span className="flex h-3.5 w-3.5 items-center justify-center">
          <TechIcon name={icon} size={12} />
        </span>
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <span className={`${baseClass} ${sizeClass}`}>
      <span className="flex h-3.5 w-3.5 items-center justify-center">
        <TechIcon name={icon} size={12} />
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}