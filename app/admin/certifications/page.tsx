import { createClient } from "@/lib/supabase/server";
import CertificationsManager from "./CertificationsManager";

export default async function CertificationsPage() {
  const supabase = await createClient();
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("order_index");

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
          Content Editor
        </p>
        <h1 className="text-3xl font-bold text-slate-100">Sertifikasi</h1>
        <p className="text-slate-500 text-sm mt-2">
          Kelola daftar sertifikasi. Tombol "Lihat Kredensial" akan muncul di halaman publik kalau URL diisi.
        </p>
      </div>
      <CertificationsManager initialCertifications={certifications ?? []} />
    </div>
  );
}