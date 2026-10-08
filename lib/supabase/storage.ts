import { createClient } from "./client";

/**
 * Upload file ke Supabase Storage bucket "portfolio"
 * @param file - File yang akan di-upload
 * @param folder - Subfolder (mis. "profile", "cv", "projects")
 * @returns Public URL file
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const supabase = createClient();

  // Buat nama file unik dengan timestamp
  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${folder}/${timestamp}-${cleanName}`;

  // Upload
  const { error } = await supabase.storage
    .from("portfolio")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Upload gagal: ${error.message}`);

  // Ambil public URL
  const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Hapus file dari Supabase Storage
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  const supabase = createClient();

  // Extract path dari URL
  const path = publicUrl.split("/portfolio/")[1];
  if (!path) return;

  await supabase.storage.from("portfolio").remove([path]);
}