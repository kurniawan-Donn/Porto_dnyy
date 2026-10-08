import type { ReactNode } from "react";
import Link from "next/link";
import { Tags } from "lucide-react"; 


import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Briefcase,
  Award,
  User,
  Wrench,
  LogOut,
  Home,
  BarChart3
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Banner & Profil", href: "/admin/profile", icon: User },
  { name: "Stats Counter", href: "/admin/stats", icon: BarChart3 },
  { name: "Keahlian", href: "/admin/skills", icon: Wrench },
  { name: "Tech Tags", href: "/admin/tech-tags", icon: Tags },
  { name: "Pengalaman", href: "/admin/experience", icon: Briefcase },
  { name: "Proyek", href: "/admin/projects", icon: FolderGit2 },
  { name: "Sertifikasi", href: "/admin/certifications", icon: Award },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link
            href="/admin"
            className="flex items-center gap-3 text-cyan-400 font-bold tracking-widest text-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-sm">
              D
            </div>
            ADMIN
          </Link>
          <p className="text-[10px] font-mono text-slate-600 mt-1 ml-11">
            Portfolio CMS
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-all duration-200 group"
              >
                <Icon
                  size={18}
                  className="group-hover:text-cyan-400 transition-colors"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-all"
          >
            <Home size={18} />
            Lihat Website
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}