import { createClient } from "@/lib/supabase/server";
import TechTagsManager from "./TechTagsManager";

export const dynamic = "force-dynamic";

export default async function AdminTechTagsPage() {
  const supabase = await createClient();

  const { data: tags } = await supabase
    .from("tech_tags")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Tech Tags</h1>
        <p className="mt-1 text-sm text-slate-500">
          Master tag yang dipakai di Projects &amp; Experiences.
        </p>
      </div>

      <TechTagsManager initialTags={tags ?? []} />
    </div>
  );
}