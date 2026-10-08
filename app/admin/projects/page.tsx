import { createClient } from "@/lib/supabase/server";
import ProjectsManager from "./ProjectsManager";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: tags }] = await Promise.all([
    supabase.from("projects").select("*").order("order_index"),
    supabase.from("tech_tags").select("*").order("name"),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
          Content Editor
        </p>
        <h1 className="text-3xl font-bold text-slate-100">Proyek</h1>
        <p className="text-slate-500 text-sm mt-2">
          Kelola proyek. Setiap card punya CTA text dan bisa diklik untuk popup detail.
        </p>
      </div>
      <ProjectsManager initialProjects={projects ?? []} availableTags={tags ?? []} />
    </div>
  );
}