import { getPortfolioData } from "@/lib/data";
import { toTerminalData } from "@/lib/terminal-data";
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
import AuditReport from "./components/AuditReport";
import TerminalLauncher from "./components/terminal/TerminalLauncher";

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
        <AuditReport />
        <Contact settings={settings} />
        <Footer />
      </main>

      <BackToTop />
      <TerminalLauncher data={toTerminalData(settings, projects)} />
    </>
  );
}
