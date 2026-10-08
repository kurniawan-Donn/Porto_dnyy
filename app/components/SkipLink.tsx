export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-md focus:font-medium focus:shadow-lg"
    >
      Lewati ke konten utama
    </a>
  );
}