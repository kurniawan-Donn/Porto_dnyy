// Nama view-transition bersama antara kartu project (beranda) dan halaman
// case study. Nama yang sama di kedua halaman = elemen yang "terbang"
// (morph) saat navigasi. Harus identifier CSS yang valid.

export function projectImageTransition(id: string): string {
  return `project-image-${id}`;
}

export function projectTitleTransition(id: string): string {
  return `project-title-${id}`;
}
