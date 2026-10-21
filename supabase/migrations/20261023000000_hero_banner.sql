-- =====================================================================
-- Banner Hero (gambar lebar, mis. meja kerja 3 monitor) untuk efek zoom
-- saat scroll. Kosong → Hero memakai latar grid sebagai cadangan.
-- Aman dijalankan ulang.
-- =====================================================================

alter table public.site_settings add column if not exists hero_banner_url text;
