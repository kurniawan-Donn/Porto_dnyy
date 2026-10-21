import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { getProjectBySlug, getProjects, getTechTags } from "@/lib/data";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { projectPath, projectSlug } from "@/lib/slug";
import type { CaseStudy, Project } from "@/lib/types";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SkipLink from "@/app/components/SkipLink";
import ScrollProgress from "@/app/components/ScrollProgress";
import BackToTop from "@/app/components/BackToTop";
import CustomCursor from "@/app/components/CustomCursor";
import TechTagList from "@/app/components/TechTagList";

// Sama dengan beranda: cache 1 jam, admin memicu revalidasi langsung
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

const STAR_BLOCKS: { key: keyof CaseStudy; label: string; letter: string; hint: string }[] = [
  { key: "situation", label: "Situation", letter: "S", hint: "Konteks & masalah" },
  { key: "task", label: "Task", letter: "T", hint: "Tujuan & tanggung jawab" },
  { key: "action", label: "Action", letter: "A", hint: "Yang saya kerjakan" },
  { key: "result", label: "Result", letter: "R", hint: "Dampak & hasil" },
];

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: projectSlug(p) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) notFound();

  const { project } = data;
  const description =
    project.description ||
    project.case_study?.subtitle ||
    `Case study project ${project.title} oleh ${SITE_NAME}.`;
  const url = `${SITE_URL}${projectPath(project)}`;

  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — Case Study`,
      description,
      siteName: SITE_NAME,
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study`,
      description,
    },
  };
}

function ProjectJsonLd({ project }: { project: Project }) {
  const url = `${SITE_URL}${projectPath(project)}`;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description ?? undefined,
      url,
      image: project.image_url ?? undefined,
      keywords: project.tech?.join(", "),
      author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
      ...(project.demo_url ? { sameAs: project.demo_url } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Proyek", item: `${SITE_URL}/#proyek` },
        { "@type": "ListItem", position: 3, name: project.title, item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Escape "<" agar teks dari database tidak bisa menutup tag <script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

function SiblingLink({ project, direction }: { project: Project; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={projectPath(project)}
      className={`group flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-cyan-500/60 hover:shadow-[0_0_30px_-12px_rgba(6,182,212,0.5)] dark:border-slate-700/60 dark:bg-white/5 ${
        isNext ? "items-end text-right sm:col-start-2" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {!isNext && <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />}
        {isNext ? "Proyek berikutnya" : "Proyek sebelumnya"}
        {isNext && <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />}
      </span>
      <span className="font-semibold text-slate-900 group-hover:text-cyan-600 dark:text-slate-100 dark:group-hover:text-cyan-400">
        {project.title}
      </span>
    </Link>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [data, techTags] = await Promise.all([getProjectBySlug(slug), getTechTags()]);
  if (!data) notFound();

  const { project, index, total, prev, next } = data;
  const cs = project.case_study ?? {};
  const blocks = STAR_BLOCKS.filter((b) => cs[b.key]?.trim());
  const number = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <ProjectJsonLd project={project} />
      <CustomCursor />
      <SkipLink />
      <ScrollProgress />

      <main
        id="main-content"
        className="min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-50"
      >
        <Navbar />

        <article className="relative mx-auto max-w-4xl px-6 pt-28 pb-16 md:pt-32">
          <div
            className="pointer-events-none absolute top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px] dark:bg-cyan-500/15"
            aria-hidden="true"
          />

          {/* Breadcrumb ala path terminal */}
          <nav aria-label="Breadcrumb" className="relative mb-10 font-mono text-xs">
            <Link
              href="/#proyek"
              className="group inline-flex items-center gap-2 text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>
                ~/proyek/<span className="text-cyan-600 dark:text-cyan-400">{projectSlug(project)}</span>
              </span>
            </Link>
          </nav>

          {/* Header */}
          <header className="relative mb-10">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
              Case Study {number(index + 1)} / {number(total)}
              {cs.subtitle && <span className="text-slate-400 dark:text-slate-500"> — {cs.subtitle}</span>}
            </p>
            <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-50">
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
                {project.description}
              </p>
            )}

            {(project.demo_url || project.github_url) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-all hover:border-cyan-500/50 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-cyan-400"
                  >
                    <SiGithub size={14} />
                    Source Code
                  </a>
                )}
              </div>
            )}
          </header>

          {/* Gambar */}
          {project.image_url && (
            <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-[0_0_60px_-20px_rgba(6,182,212,0.35)] dark:border-slate-700/60 dark:bg-slate-950">
              <Image
                src={project.image_url}
                alt={`Tampilan ${project.title}`}
                fill
                priority
                sizes="(min-width: 896px) 848px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Tech stack */}
          {project.tech && project.tech.length > 0 && (
            <section aria-labelledby="tech-stack" className="mb-14">
              <h2
                id="tech-stack"
                className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400"
              >
                Tech Stack
              </h2>
              <TechTagList names={project.tech} techTags={techTags} />
            </section>
          )}

          {/* STAR */}
          <section aria-label="Case study (STAR)">
            {blocks.length > 0 ? (
              <ol className="relative space-y-10 border-l border-slate-200 pl-6 sm:pl-8 dark:border-slate-800">
                {blocks.map((block) => (
                  <li key={block.key} className="relative">
                    <span
                      className="absolute top-0 -left-[calc(1.5rem+17px)] flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-slate-50 font-mono text-sm font-bold text-cyan-600 sm:-left-[calc(2rem+17px)] dark:bg-slate-900 dark:text-cyan-400"
                      aria-hidden="true"
                    >
                      {block.letter}
                    </span>
                    <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-100">
                        {block.label}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {"// "}
                        {block.hint}
                      </span>
                    </h2>
                    <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {cs[block.key]}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500 italic">Studi kasus untuk project ini sedang ditulis.</p>
            )}
          </section>

          {/* Navigasi antar project */}
          {(prev || next) && (
            <nav
              aria-label="Navigasi proyek"
              className="mt-20 grid grid-cols-1 gap-4 border-t border-slate-200 pt-10 sm:grid-cols-2 dark:border-slate-800"
            >
              {prev && <SiblingLink project={prev} direction="prev" />}
              {next && <SiblingLink project={next} direction="next" />}
            </nav>
          )}
        </article>

        <Footer />
      </main>

      <BackToTop />
    </>
  );
}
