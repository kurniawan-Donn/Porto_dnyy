-- =====================================================================
-- Slug untuk URL halaman project: /projects/<slug>
-- Aman dijalankan ulang.
-- =====================================================================

alter table public.projects add column if not exists slug text;

-- Isi slug dari judul untuk project lama: "Metadata Remover" → "metadata-remover"
update public.projects
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

-- Judul kembar → tambahkan potongan id agar tetap unik
update public.projects p
set slug = p.slug || '-' || left(p.id::text, 6)
where exists (
  select 1 from public.projects q
  where q.slug = p.slug and q.id::text < p.id::text
);

alter table public.projects alter column slug set not null;

alter table public.projects drop constraint if exists projects_slug_format;
alter table public.projects add constraint projects_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

create unique index if not exists projects_slug_key on public.projects (slug);
