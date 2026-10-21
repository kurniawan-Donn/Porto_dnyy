-- =====================================================================
-- Skema awal portofolio (direkonstruksi dari kode aplikasi, Okt 2026)
--
-- Aman dijalankan di database yang SUDAH berisi tabel:
--   * `create table if not exists` tidak mengubah tabel yang sudah ada
--     (kolom yang kurang TIDAK ditambahkan — bandingkan manual bila perlu).
--   * Policy dibuat ulang dengan nama tetap (drop if exists → create).
--     Policy lama dengan NAMA LAIN tetap ada; cek di Dashboard →
--     Authentication → Policies dan hapus yang tumpang tindih.
--
-- Model akses:
--   anon          → SELECT tabel konten; INSERT saja ke `messages`
--   authenticated → admin, akses penuh
--   ⚠ "authenticated" = SIAPA PUN yang bisa login. Pastikan sign-up publik
--     dimatikan: Dashboard → Authentication → Sign In / Providers →
--     "Allow new users to sign up" = OFF.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- site_settings (satu baris, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id               integer primary key default 1 check (id = 1),
  hero_greeting    text,
  hero_name        text,
  hero_role        text,
  hero_description text,
  hero_photo_url   text,
  cv_url           text,
  email            text,
  location         text,
  github_url       text,
  linkedin_url     text,
  instagram_url    text,
  banner_text      text,
  banner_active    boolean not null default false,
  updated_at       timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  name        text not null,
  description text,
  icon        text,
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- tech_tags (dicocokkan dengan projects.tech / experiences.tags lewat nama,
-- case-insensitive)
-- ---------------------------------------------------------------------
create table if not exists public.tech_tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  icon        text,
  description text,
  category    text,
  created_at  timestamptz not null default now()
);
-- Opsional setelah memastikan tidak ada nama duplikat:
--   create unique index tech_tags_name_lower_key on public.tech_tags (lower(name));

-- ---------------------------------------------------------------------
-- projects
-- case_study: { subtitle, situation, task, action, result } (STAR)
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  tech          text[] not null default '{}',
  github_url    text,
  demo_url      text,
  image_url     text,
  featured      boolean not null default false,
  card_cta_text text,
  case_study    jsonb,
  order_index   integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- experiences
-- ---------------------------------------------------------------------
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  position    text not null,
  company     text not null,
  period      text not null,
  location    text,
  description text,
  tags        text[] not null default '{}',
  is_current  boolean not null default false,
  image_url   text,
  order_index integer default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- certifications
-- `date` sengaja text bebas (mis. "Agustus 2024"); urutan tampil memakai
-- order_index.
-- ---------------------------------------------------------------------
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  issuer         text,
  date           text,
  credential_url text,
  icon_name      text default 'Award',
  image_url      text,
  order_index    integer default 0,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- stats
-- auto_source terisi → nilai dihitung otomatis dari jumlah baris tabel itu
-- ---------------------------------------------------------------------
create table if not exists public.stats (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  value       integer not null default 0,
  suffix      text default '+',
  icon_name   text default 'FolderGit2',
  order_index integer default 0,
  auto_source text check (auto_source in ('projects', 'certifications', 'experiences', 'skills')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- messages (form kontak)
-- Batas panjang sama dengan validasi di app/api/contact/route.ts
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 100),
  email      text not null check (char_length(email) between 3 and 254),
  subject    text check (subject is null or char_length(subject) <= 150),
  message    text not null check (char_length(message) between 1 and 5000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- =====================================================================
-- Row Level Security
-- =====================================================================
do $$
declare
  t text;
begin
  -- Tabel konten: publik boleh baca, admin boleh semua
  foreach t in array array[
    'site_settings', 'skills', 'tech_tags', 'projects',
    'experiences', 'certifications', 'stats'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format(
      'create policy "public_read" on public.%I for select to anon, authenticated using (true)', t
    );

    execute format('drop policy if exists "admin_write" on public.%I', t);
    execute format(
      'create policy "admin_write" on public.%I for all to authenticated using (true) with check (true)', t
    );
  end loop;
end
$$;

-- messages: pengunjung hanya bisa mengirim, tidak bisa membaca
alter table public.messages enable row level security;

drop policy if exists "anon_insert" on public.messages;
create policy "anon_insert" on public.messages
  for insert to anon, authenticated
  with check (is_read = false);

drop policy if exists "admin_manage" on public.messages;
create policy "admin_manage" on public.messages
  for all to authenticated
  using (true) with check (true);

-- =====================================================================
-- Storage: bucket publik "portfolio" (foto, CV, gambar project/sertifikat)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "portfolio_public_read" on storage.objects;
create policy "portfolio_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "portfolio_admin_write" on storage.objects;
create policy "portfolio_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');
