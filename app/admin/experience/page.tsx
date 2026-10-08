import { createClient } from "@/lib/supabase/server";
import ExperienceManager from "./ExperienceManager";

export default async function ExperiencePage() {
  const supabase = await createClient();

  const [{ data: experiences }, { data: tags }] = await Promise.all([
    supabase.from("experiences").select("*").order("order_index"),
    supabase.from("tech_tags").select("*").order("name"),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
          Content Editor
        </p>
        <h1 className="text-3xl font-bold text-slate-100">Pengalaman</h1>
        <p className="text-slate-500 text-sm mt-2">
          Kelola timeline pengalaman. Tags akan clickable di halaman publik.
        </p>
      </div>
      <ExperienceManager
        initialExperiences={experiences ?? []}
        availableTags={tags ?? []}
      />
    </div>
  );
}