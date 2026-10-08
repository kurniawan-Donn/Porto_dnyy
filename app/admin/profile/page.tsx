import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !settings) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          Error memuat data: {error?.message ?? "Data tidak ditemukan"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
          Content Editor
        </p>
        <h1 className="text-3xl font-bold text-slate-100">Banner & Profil</h1>
        <p className="text-slate-500 text-sm mt-2">
          Edit konten hero section, foto profil, CV, dan media sosial.
        </p>
      </div>

      <ProfileForm initialData={settings} />
    </div>
  );
}