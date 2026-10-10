import type { ComponentType, SVGProps } from "react";
import {
  SiKotlin,
  SiPython,
  SiFigma,
  SiGit,
  SiGithub,
  SiLaravel,
  SiPhp,
  SiMysql,
  SiFirebase,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiAndroid,
  SiAndroidstudio,
  SiSqlite,
  SiPostgresql,
  SiSupabase,
  SiMongodb,
  SiNextdotjs,
  SiTailwindcss,
  SiVercel,
  SiNodedotjs,
  SiDocker,
  SiLinux,
  SiGooglechrome,
  SiGnubash,
  SiStreamlit,
  SiGithubactions,
} from "react-icons/si";
import {
  Code2,
  ShieldCheck,
  Search,
  FileSpreadsheet,
  Award,
  BookOpen,
  BadgeCheck,
  Cpu,
  Palette,
  Bot,
  FileText,
  Image as ImageIcon,
  Presentation,
  Music,
  Cloud,
  Shuffle,
} from "lucide-react";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string; color?: string }
>;

type TechIconEntry = {
  component: IconComponent;
  color: string;
  label: string;
  isBrand: boolean;
};

export const TECH_ICONS: Record<string, TechIconEntry> = {
  // ── PROGRAMMING ──
  php:            { component: SiPhp,              color: "#777BB4", label: "PHP",                 isBrand: true },
  python:         { component: SiPython,           color: "#3776AB", label: "Python",              isBrand: true },
  java:           { component: Code2,              color: "#007396", label: "Java",                isBrand: false },
  kotlin:         { component: SiKotlin,           color: "#7F52FF", label: "Kotlin",              isBrand: true },
  javascript:     { component: SiJavascript,       color: "#F7DF1E", label: "JavaScript",          isBrand: true },
  typescript:     { component: SiTypescript,       color: "#3178C6", label: "TypeScript",          isBrand: true },
  html:           { component: SiHtml5,            color: "#E34F26", label: "HTML5",               isBrand: true },
  css:            { component: Palette,            color: "#1572B6", label: "CSS3",                isBrand: false },
  gnubash:        { component: SiGnubash,          color: "#4EAA25", label: "Bash / Shell",        isBrand: true },

  // ── FRAMEWORKS & TOOLS ──
  laravel:        { component: SiLaravel,          color: "#FF2D20", label: "Laravel",             isBrand: true },
  nextjs:         { component: SiNextdotjs,        color: "#000000", label: "Next.js",             isBrand: true },
  tailwind:       { component: SiTailwindcss,      color: "#06B6D4", label: "Tailwind CSS",        isBrand: true },
  android:        { component: SiAndroid,          color: "#34A853", label: "Android",             isBrand: true },
  androidstudio:  { component: SiAndroidstudio,    color: "#3DDC84", label: "Android Studio",      isBrand: true },
  git:            { component: SiGit,              color: "#F05032", label: "Git",                 isBrand: true },
  github:         { component: SiGithub,           color: "#181717", label: "GitHub",              isBrand: true },
  figma:          { component: SiFigma,            color: "#F24E1E", label: "Figma",               isBrand: true },
  vscode:         { component: Code2,              color: "#007ACC", label: "VS Code",             isBrand: false },
  nodejs:         { component: SiNodedotjs,        color: "#5FA04E", label: "Node.js",             isBrand: true },
  chrome:         { component: SiGooglechrome,     color: "#4285F4", label: "Chrome DevTools",     isBrand: true },

  // ── DATABASE ──
  mysql:          { component: SiMysql,            color: "#4479A1", label: "MySQL",               isBrand: true },
  sqlite:         { component: SiSqlite,           color: "#003B57", label: "SQLite",              isBrand: true },
  firebase:       { component: SiFirebase,         color: "#FFCA28", label: "Firebase",            isBrand: true },
  postgresql:     { component: SiPostgresql,       color: "#4169E1", label: "PostgreSQL",          isBrand: true },
  supabase:       { component: SiSupabase,         color: "#3FCF8E", label: "Supabase",            isBrand: true },
  mongodb:        { component: SiMongodb,          color: "#47A248", label: "MongoDB",             isBrand: true },

  // ── CLOUD & DEVOPS ──
  vercel:         { component: SiVercel,           color: "#000000", label: "Vercel",              isBrand: true },
  docker:         { component: SiDocker,           color: "#2496ED", label: "Docker",              isBrand: true },
  linux:          { component: SiLinux,            color: "#FCC624", label: "Linux",               isBrand: true },

  // ── IT & AUDIT ──
  shieldcheck:    { component: ShieldCheck,        color: "#06B6D4", label: "IT Audit / Controls", isBrand: false },
  search:         { component: Search,             color: "#06B6D4", label: "Analysis / Research", isBrand: false },
  openai:         { component: Bot,                color: "#412991", label: "AI / OpenAI",         isBrand: false },
  excel:          { component: FileSpreadsheet,    color: "#217346", label: "Excel / Spreadsheet", isBrand: false },
  cpu:            { component: Cpu,                color: "#06B6D4", label: "Hardware / Systems",  isBrand: false },

  // ── GENERIC FALLBACK ──
  code:           { component: Code2,              color: "#06B6D4", label: "Generic Code",        isBrand: false },
  award:          { component: Award,              color: "#06B6D4", label: "Award",               isBrand: false },
  badge:          { component: BadgeCheck,         color: "#06B6D4", label: "Badge",               isBrand: false },
  book:           { component: BookOpen,           color: "#06B6D4", label: "Learning",            isBrand: false },

    // ── PYTHON ECOSYSTEM ──
  streamlit:      { component: SiStreamlit,      color: "#FF4B4B", label: "Streamlit",          isBrand: true },
  "streamlit cloud": { component: SiStreamlit,   color: "#FF4B4B", label: "Streamlit Cloud",    isBrand: true },
  pikepdf:        { component: FileText,         color: "#3776AB", label: "pikepdf",            isBrand: false },
  pillow:         { component: ImageIcon,        color: "#3776AB", label: "Pillow (PIL)",       isBrand: false },
  "python-docx":  { component: FileText,         color: "#2B579A", label: "python-docx",        isBrand: false },
  openpyxl:       { component: FileSpreadsheet,  color: "#217346", label: "openpyxl",           isBrand: false },
  "python-pptx":  { component: Presentation,     color: "#B7472A", label: "python-pptx",        isBrand: false },
  mutagen:        { component: Music,            color: "#7F52FF", label: "mutagen",            isBrand: false },

  // ── JAVASCRIPT ECOSYSTEM ──
  sortablejs:     { component: Shuffle,          color: "#00A2E8", label: "SortableJS",         isBrand: false },

  // ── DEVOPS ──
  "github actions": { component: SiGithubactions, color: "#2088FF", label: "GitHub Actions",    isBrand: true },
};

export function TechIcon({
  name,
  size = 16,
  className,
  color,
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
  color?: string;
}) {
  if (!name) {
    return <Code2 size={size} className={className} color="#06B6D4" />;
  }

  const key = name.toLowerCase().trim();
  const entry = TECH_ICONS[key];

  if (!entry) {
    return <Code2 size={size} className={className} color="#06B6D4" />;
  }

  const Icon = entry.component;
  return (
    <Icon
      size={size}
      color={color ?? entry.color}
      className={className}
      aria-label={entry.label}
    />
  );
}

export const AVAILABLE_ICONS = Object.entries(TECH_ICONS)
  .map(([key, value]) => ({ key, ...value }))
  .sort((a, b) => a.label.localeCompare(b.label));