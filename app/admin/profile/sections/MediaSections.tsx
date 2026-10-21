import { FileText, Image as ImageIcon, Monitor, Trash2 } from "lucide-react";
import { UploadButton } from "../../_components/buttons";
import { labelCls } from "../../_components/styles";
import type { FileUpload } from "../../_components/useFileUpload";
import ProfileSection from "../ProfileSection";

const fullWidthUploadCls =
  "w-full inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm font-medium transition-all disabled:opacity-60";

export function PhotoAndCvSection({
  photoUrl,
  cvUrl,
  photoUpload,
  cvUpload,
}: {
  photoUrl: string | null;
  cvUrl: string | null;
  photoUpload: FileUpload;
  cvUpload: FileUpload;
}) {
  return (
    <ProfileSection
      icon={ImageIcon}
      title="Foto Profil & CV"
      description="Foto sebaiknya PNG transparan, ukuran 900×1200 px."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FOTO PROFIL */}
        <div>
          <label className={labelCls}>Foto Profil</label>
          <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden aspect-[3/4] mb-3 flex items-center justify-center">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Profile" className="object-contain w-full h-full" />
            ) : (
              <div className="text-slate-700 text-center">
                <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">Belum ada foto</p>
              </div>
            )}
          </div>
          <UploadButton upload={photoUpload} label="Upload Foto Baru" className={fullWidthUploadCls} />
        </div>

        {/* CV */}
        <div>
          <label className={labelCls}>File CV (PDF)</label>
          <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden aspect-[3/4] mb-3 flex items-center justify-center">
            {cvUrl ? (
              <div className="text-center p-4">
                <FileText size={48} className="mx-auto mb-3 text-cyan-400" />
                <p className="text-xs text-slate-400 mb-3">CV sudah di-upload</p>
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline">
                  Lihat CV ↗
                </a>
              </div>
            ) : (
              <div className="text-slate-700 text-center">
                <FileText size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">Belum ada CV</p>
              </div>
            )}
          </div>
          <UploadButton upload={cvUpload} label="Upload CV Baru" className={fullWidthUploadCls} />
        </div>
      </div>
    </ProfileSection>
  );
}

export function HeroBannerSection({
  bannerUrl,
  upload,
  onRemove,
}: {
  bannerUrl: string | null;
  upload: FileUpload;
  onRemove: () => void;
}) {
  return (
    <ProfileSection
      icon={Monitor}
      title="Banner Hero"
      description={
        <>
          Gambar lebar 16:9 (min. 1920×1080), mis. meja kerja 3 monitor. Saat di-scroll, kamera &ldquo;masuk&rdquo; ke
          tengah gambar. Kosongkan untuk latar grid.
        </>
      }
    >
      <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden aspect-video mb-3 flex items-center justify-center">
        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt="Banner Hero" className="object-cover w-full h-full" />
        ) : (
          <div className="text-slate-700 text-center">
            <Monitor size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">Belum ada banner — Hero memakai latar grid</p>
          </div>
        )}
        {/* Titik fokus zoom (FOCUS_ORIGIN di app/components/Hero.tsx) */}
        <div className="pointer-events-none absolute left-1/2 top-[45%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/70" />
      </div>

      <div className="flex gap-3">
        <UploadButton
          upload={upload}
          label="Upload Banner"
          className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 px-4 py-2.5 rounded-md text-sm font-medium transition-all disabled:opacity-60"
        />
        {bannerUrl && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-2 border border-slate-700 hover:border-red-400/50 text-slate-400 hover:text-red-400 px-4 py-2.5 rounded-md text-sm font-medium transition-all"
          >
            <Trash2 size={16} /> Hapus
          </button>
        )}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Lingkaran cyan menandai titik fokus zoom — letakkan monitor tengah di sekitar titik itu.
      </p>
    </ProfileSection>
  );
}
