import { createClient } from "@/lib/supabase/server";
import {
  FolderGit2,
  Award,
  Briefcase,
  Wrench,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Ambil statistik dari database
  const [projectsCount, certsCount, expCount, skillsCount] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("certifications").select("*", { count: "exact", head: true }),
    supabase.from("experiences").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Proyek",
      value: projectsCount.count ?? 0,
      icon: FolderGit2,
      href: "/admin/projects",
      color: "cyan",
    },
    {
      label: "Sertifikasi",
      value: certsCount.count ?? 0,
      icon: Award,
      href: "/admin/certifications",
      color: "purple",
    },
    {
      label: "Pengalaman",
      value: expCount.count ?? 0,
      icon: Briefcase,
      href: "/admin/experience",
      color: "green",
    },
    {
      label: "Keahlian",
      value: skillsCount.count ?? 0,
      icon: Wrench,
      href: "/admin/skills",
      color: "orange",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold text-slate-100">Selamat Datang 👋</h1>
        <p className="text-slate-500 text-sm mt-2">
          Kelola konten portofolio Anda dari sini. Perubahan akan langsung
          tampil di website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
                />
              </div>

              <div className="text-3xl font-bold font-mono text-slate-100 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-medium px-4 py-2 rounded-md text-sm transition-all"
          >
            Edit Banner & Profil
          </Link>
          <Link
            href="/admin/skills"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-md text-sm transition-all border border-slate-700"
          >
            Tambah Keahlian
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-md text-sm transition-all border border-slate-700"
          >
            Tambah Proyek
          </Link>
        </div>
      </div>
    </div>
  );
}