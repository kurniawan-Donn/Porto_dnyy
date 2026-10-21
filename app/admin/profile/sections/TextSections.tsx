import { Link as LinkIcon, Mail, MapPin, Megaphone, User } from "lucide-react";
import { labelCls } from "../../_components/styles";
import ProfileSection, { profileInputCls as inputCls, type ProfileFieldProps } from "../ProfileSection";

export function AnnouncementSection({ data, onChange }: ProfileFieldProps) {
  return (
    <ProfileSection
      icon={Megaphone}
      title="Banner Pengumuman"
      description="Muncul di paling atas website. Berguna untuk info lowongan/freelance."
    >
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Teks Banner</label>
          <input
            type="text"
            name="banner_text"
            value={data.banner_text ?? ""}
            onChange={onChange}
            placeholder="Mis. Open for freelance projects!"
            className={inputCls}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="banner_active"
            checked={data.banner_active}
            onChange={onChange}
            className="w-4 h-4 accent-cyan-500 cursor-pointer"
          />
          <span className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">
            Tampilkan banner di website
          </span>
        </label>
      </div>
    </ProfileSection>
  );
}

export function HeroContentSection({ data, onChange }: ProfileFieldProps) {
  return (
    <ProfileSection icon={User} title="Konten Hero Section" description="Bagian yang pertama kali dilihat pengunjung.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Sapaan</label>
            <input
              type="text"
              name="hero_greeting"
              value={data.hero_greeting ?? ""}
              onChange={onChange}
              placeholder="Halo, nama saya"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Nama Lengkap</label>
            <input
              type="text"
              name="hero_name"
              value={data.hero_name ?? ""}
              onChange={onChange}
              placeholder="Dony Kurniawan."
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Role / Posisi</label>
          <input
            type="text"
            name="hero_role"
            value={data.hero_role ?? ""}
            onChange={onChange}
            placeholder="IT Audit & Web Developer."
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Deskripsi Singkat</label>
          <textarea
            name="hero_description"
            value={data.hero_description ?? ""}
            onChange={onChange}
            rows={4}
            placeholder="Ceritakan tentang diri Anda..."
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>
    </ProfileSection>
  );
}

const SOCIAL_FIELDS = [
  { name: "github_url", label: "GitHub URL", placeholder: "https://github.com/username" },
  { name: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
  { name: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/username" },
] as const;

export function ContactSection({ data, onChange }: ProfileFieldProps) {
  return (
    <ProfileSection icon={LinkIcon} title="Kontak & Sosial Media" description="Informasi ini muncul di section Contact.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              <Mail size={12} className="inline mr-1" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email ?? ""}
              onChange={onChange}
              placeholder="dony@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              <MapPin size={12} className="inline mr-1" /> Lokasi
            </label>
            <input
              type="text"
              name="location"
              value={data.location ?? ""}
              onChange={onChange}
              placeholder="Madiun, Indonesia"
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.name}>
              <label className={labelCls}>{field.label}</label>
              <input
                type="url"
                name={field.name}
                value={data[field.name] ?? ""}
                onChange={onChange}
                placeholder={field.placeholder}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>
    </ProfileSection>
  );
}
