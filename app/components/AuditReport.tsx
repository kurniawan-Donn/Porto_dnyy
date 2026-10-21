"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Radio } from "lucide-react";
import {
  ASSESSED_AT,
  AUDIT_CONTROLS,
  AUDIT_METHOD,
  AUDIT_SCOPE,
  type AuditControl,
  type ControlStatus,
  type LiveCheck,
} from "@/lib/audit-report";
import SectionHeading from "./SectionHeading";

const STATUS_STYLE: Record<ControlStatus, { label: string; className: string }> = {
  pass: {
    label: "PASS",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  finding: {
    label: "FINDING",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  accepted: {
    label: "ACCEPTED",
    className: "border-slate-400/40 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  },
  manual: {
    label: "MANUAL",
    className: "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  },
};

type LiveResult = Record<LiveCheck, boolean>;

/** Baca header respons situs ini dari browser pengunjung — bukti, bukan klaim */
async function checkHeaders(): Promise<LiveResult> {
  const res = await fetch(window.location.pathname, { method: "HEAD", cache: "no-store" });
  const h = (name: string) => res.headers.get(name) ?? "";
  const csp = h("content-security-policy");
  const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src")) ?? "";

  return {
    csp: scriptSrc.includes("'nonce-") && !scriptSrc.includes("'unsafe-inline'"),
    hsts: /max-age=\d{7,}/.test(h("strict-transport-security")),
    nosniff: h("x-content-type-options").toLowerCase() === "nosniff",
    frame: csp.includes("frame-ancestors 'none'") || h("x-frame-options").toUpperCase() === "DENY",
    referrer: h("referrer-policy") !== "",
    permissions: h("permissions-policy") !== "",
  };
}

function LiveBadge({ checks, live }: { checks: LiveCheck[]; live: LiveResult | null | "error" }) {
  if (live === null) {
    return <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">cek live…</span>;
  }
  if (live === "error") {
    return <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">cek live gagal</span>;
  }
  const passed = checks.filter((c) => live[c]).length;
  const allOk = passed === checks.length;
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${
        allOk ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
      }`}
      title="Diverifikasi dari header respons halaman ini, di browser Anda"
    >
      <Radio size={11} className={allOk ? "animate-pulse" : ""} />
      live {passed}/{checks.length}
    </span>
  );
}

function ControlRow({ control, live }: { control: AuditControl; live: LiveResult | null | "error" }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_STYLE[control.status];
  const panelId = `audit-${control.id}`;

  return (
    <li className="border-b border-slate-200 last:border-b-0 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-cyan-500/5 sm:px-5"
      >
        <span className="w-12 shrink-0 font-mono text-[11px] text-slate-400 dark:text-slate-500">{control.id}</span>
        <span className="min-w-0 flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
          {control.title}
        </span>
        {control.live && (
          <span className="hidden sm:inline">
            <LiveBadge checks={control.live} live={live} />
          </span>
        )}
        <span
          className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider ${status.className}`}
        >
          {status.label}
          {control.severity && <span className="font-normal opacity-70"> · {control.severity}</span>}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={panelId} className="space-y-2 px-4 pb-4 pl-[4.75rem] text-sm leading-relaxed sm:px-5 sm:pl-[5.25rem]">
          <p className="text-slate-600 dark:text-slate-400">
            <span className="font-mono text-[11px] tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Bukti ·{" "}
            </span>
            {control.evidence}
          </p>
          {control.note && (
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-mono text-[11px] tracking-wider text-slate-400 uppercase dark:text-slate-500">
                {control.status === "accepted" ? "Alasan · " : "Rencana · "}
              </span>
              {control.note}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {control.refs.map((ref) => (
              <span
                key={ref}
                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
              >
                {ref}
              </span>
            ))}
            {control.live && (
              <span className="sm:hidden">
                <LiveBadge checks={control.live} live={live} />
              </span>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function AuditReport() {
  const [live, setLive] = useState<LiveResult | null | "error">(null);

  useEffect(() => {
    checkHeaders()
      .then(setLive)
      .catch(() => setLive("error"));
  }, []);

  const counts = AUDIT_CONTROLS.reduce(
    (acc, c) => ({ ...acc, [c.status]: acc[c.status] + 1 }),
    { pass: 0, finding: 0, accepted: 0, manual: 0 } as Record<ControlStatus, number>
  );
  const assessed = new Date(`${ASSESSED_AT}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="audit" className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeading
          index="05"
          code="Self-Audit"
          title="Situs Ini Mengaudit Dirinya"
          kicker="Laporan keamanan situs ini, ditulis seperti laporan audit TI: kontrol, bukti, status, dan temuan yang masih terbuka."
        />

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700/60 dark:bg-white/5">
          {/* Ringkasan */}
          <div className="grid grid-cols-1 gap-6 border-b border-slate-200 p-5 sm:p-6 md:grid-cols-[1fr_auto] dark:border-slate-800">
            <dl className="space-y-2 text-sm">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="w-24 shrink-0 font-mono text-[11px] tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Scope
                </dt>
                <dd className="text-slate-700 dark:text-slate-300">{AUDIT_SCOPE}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="w-24 shrink-0 font-mono text-[11px] tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Metode
                </dt>
                <dd className="text-slate-700 dark:text-slate-300">{AUDIT_METHOD}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="w-24 shrink-0 font-mono text-[11px] tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Dinilai
                </dt>
                <dd className="text-slate-700 dark:text-slate-300">
                  {assessed} · OWASP ASVS 4.0.3 & ISO/IEC 27001:2022
                </dd>
              </div>
            </dl>

            <div className="grid grid-cols-4 gap-2 md:w-72">
              {(Object.keys(STATUS_STYLE) as ControlStatus[]).map((s) => (
                <div
                  key={s}
                  className={`flex flex-col items-center justify-center rounded-lg border px-2 py-3 ${STATUS_STYLE[s].className}`}
                >
                  <span className="font-display text-2xl leading-none font-bold">{counts[s]}</span>
                  <span className="mt-1 font-mono text-[9px] tracking-wider">{STATUS_STYLE[s].label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daftar kontrol */}
          <ul>
            {AUDIT_CONTROLS.map((control) => (
              <ControlRow key={control.id} control={control} live={live} />
            ))}
          </ul>
        </div>

        <p className="mt-4 font-mono text-[11px] text-slate-400 dark:text-slate-500">
          Badge <span className="text-emerald-600 dark:text-emerald-400">live</span> = dicek ulang dari header respons
          halaman ini, langsung di browser Anda.
        </p>
      </motion.div>
    </section>
  );
}
