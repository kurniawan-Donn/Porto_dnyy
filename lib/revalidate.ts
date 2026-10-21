import { revalidatePath, revalidateTag } from "next/cache";
import { PUBLIC_DATA_TAG } from "@/lib/data";

/**
 * Dipanggil server action admin setelah menyimpan: buang cache data publik
 * (expire: 0 → kunjungan berikutnya langsung mengambil data baru) lalu
 * segarkan semua halaman publik, termasuk OG image dan sitemap.
 */
export function revalidatePublicSite() {
  revalidateTag(PUBLIC_DATA_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}
