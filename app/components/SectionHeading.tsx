import type { ReactNode } from "react";

/**
 * Heading section bergaya editorial/SOC:
 *   01 ── ARSENAL
 *   Keahlian & Teknologi
 * dengan angka besar ber-outline samar di latar.
 */
export default function SectionHeading({
  index,
  code,
  title,
  kicker,
}: {
  index: string;
  code: string;
  title: ReactNode;
  kicker?: ReactNode;
}) {
  return (
    <header className="relative mb-12 md:mb-16">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-0 select-none font-display text-[7rem] leading-none font-bold text-transparent md:-top-14 md:text-[11rem] [-webkit-text-stroke:1px_rgba(8,145,178,0.18)] dark:[-webkit-text-stroke:1px_rgba(34,211,238,0.14)]"
      >
        {index}
      </span>

      <p className="relative flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-cyan-600 uppercase dark:text-cyan-400">
        <span className="tabular-nums">{index}</span>
        <span className="h-px w-10 bg-current opacity-50" aria-hidden="true" />
        <span>{code}</span>
      </p>

      <h2 className="relative mt-4 font-display text-4xl leading-[0.95] font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-50">
        {title}
      </h2>

      {kicker && (
        <p className="relative mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {kicker}
        </p>
      )}
    </header>
  );
}
