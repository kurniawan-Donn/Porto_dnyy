import { createClient } from "@/lib/supabase/server";
import SkillsManager from "./SkillsManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("order_index", { ascending: true });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Keahlian</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola daftar keahlian dan teknologi.
        </p>
      </div>

      <SkillsManager initialSkills={skills ?? []} />
    </div>
  );
}