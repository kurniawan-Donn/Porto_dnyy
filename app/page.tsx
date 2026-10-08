import { createClient } from "@/lib/supabase/server";
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


// Force dynamic — supaya setiap load fetch fresh dari Supabase
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("date", { ascending: false });

  return (
    <>
      <CustomCursor />
      <SkipLink />
      <ScrollProgress />

      <main
        id="main-content"
        className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300 overflow-x-hidden"
      >
        <Navbar />
        <AnnouncementBanner
        text={settings?.banner_text ?? null}
        active={settings?.banner_active ?? false}
        version={settings?.updated_at ?? null}
        />
        <Hero settings={settings} />
        <StatsCounter />
        <Skills />
        <Projects />
        <Experience />
        <Certifications items={certifications ?? []} />
        <Contact settings={settings} />
        <Footer />
      </main>

      <BackToTop />
    </>
  );
}