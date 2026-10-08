import { createClient } from "@/lib/supabase/server";
import StatsManager from "./StatsManager";

export default async function StatsPage() {
  const supabase = await createClient();

  const { data: stats } = await supabase
    .from("stats")
    .select("*")
    .order("order_index");

  // Hitung jumlah real untuk preview auto-count
  const [projects, certs, exps, skills] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("certifications").select("*", { count: "exact", head: true }),
    supabase.from("experiences").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
  ]);

  const counts = {
    projects: projects.count ?? 0,
    certifications: certs.count ?? 0,
    experiences: exps.count ?? 0,
    skills: skills.count ?? 0,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
          Content Editor
        </p>
        <h1 className="text-3xl font-bold text-slate-100">Stats Counter</h1>
        <p className="text-slate-500 text-sm mt-2">
          Kartu statistik di atas section Keahlian. Bisa manual atau auto-count dari data.
        </p>
      </div>
      <StatsManager initialStats={stats ?? []} counts={counts} />
    </div>
  );
}