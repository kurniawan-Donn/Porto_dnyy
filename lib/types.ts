// ============================================
// Tipe baris tabel Supabase — satu sumber untuk situs publik & admin.
// Skema lengkap: supabase/migrations/20261021000000_initial_schema.sql
// ============================================

export type SiteSettings = {
  id: number;
  hero_greeting: string | null;
  hero_name: string | null;
  hero_role: string | null;
  hero_description: string | null;
  hero_photo_url: string | null;
  // Banner lebar untuk efek zoom Hero (migration 20261023000000_hero_banner.sql)
  hero_banner_url: string | null;
  cv_url: string | null;
  email: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  banner_text: string | null;
  banner_active: boolean;
  updated_at: string;
};

export type Skill = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_index: number;
};

export type TechTag = {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  category: string | null;
};

export type CaseStudy = {
  subtitle?: string;
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
};

export type Project = {
  id: string;
  // Nullable hanya sampai migration 20261022000000_project_slug.sql dijalankan
  slug: string | null;
  title: string;
  description: string | null;
  tech: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  featured: boolean | null;
  card_cta_text: string | null;
  case_study: CaseStudy | null;
  order_index: number;
};

export type Experience = {
  id: string;
  position: string;
  company: string;
  period: string;
  location: string | null;
  description: string | null;
  tags: string[] | null;
  is_current: boolean | null;
  image_url: string | null;
  order_index: number | null;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string | null;
  // Teks bebas (mis. "Agustus 2024"), bukan tipe date
  date: string | null;
  credential_url: string | null;
  icon_name: string | null;
  image_url: string | null;
  order_index: number | null;
};

export const STAT_AUTO_SOURCES = [
  "projects",
  "certifications",
  "experiences",
  "skills",
] as const;

export type StatAutoSource = (typeof STAT_AUTO_SOURCES)[number];

export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  icon_name: string | null;
  order_index: number | null;
  auto_source: StatAutoSource | null;
};

export type StatCounts = Record<StatAutoSource, number>;

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type ActionResult = {
  success: boolean;
  error?: string;
};
