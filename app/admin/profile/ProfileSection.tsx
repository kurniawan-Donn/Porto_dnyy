import type { ChangeEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { inputCls } from "../_components/styles";

// Input profil ikut redup saat disabled (form utuh sedang disimpan)
export const profileInputCls = `${inputCls} disabled:opacity-60`;

export type ProfileFieldProps = {
  data: SiteSettings;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

/** Kartu satu bagian form profil: ikon, judul, keterangan, isi */
export default function ProfileSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
