import { getPortfolioData } from "@/lib/data";
import SkipLink from "./components/SkipLink";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsCounter from "./components/StatsCounter";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AnnouncementBanner from "./components/AnnouncementBanner";

// ISR: halaman di-cache dan dibangun ulang paling lama tiap 1 jam.
// Setiap simpan dari admin memanggil revalidatePath("/"), jadi perubahan
// tetap langsung tampil tanpa harus menunggu.
export const revalidate = 3600;

export default async function Home() {
  const { settings, skills, projects, experiences, certifications, techTags, stats } =
    await getPortfolioData();

  return (
    <>
      <CustomCursor />
      <SkipLink />
      <ScrollProgress />

      <main
        id="main-content"
        className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300 overflow-x-clip"
      >
        <Navbar />
        <AnnouncementBanner
          text={settings?.banner_text ?? null}
          active={settings?.banner_active ?? false}
          version={settings?.updated_at ?? null}
        />
        <Hero settings={settings} />
        <StatsCounter stats={stats} />
        <Skills skills={skills} />
        <Projects projects={projects} techTags={techTags} />
        <Experience experiences={experiences} techTags={techTags} />
        <Certifications items={certifications} />
        <Contact settings={settings} />
        <Footer />
      </main>

      <BackToTop />
    </>
  );
}
