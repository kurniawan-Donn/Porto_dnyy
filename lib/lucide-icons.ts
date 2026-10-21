import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Calendar,
  Code2,
  Cpu,
  FolderGit2,
  Layers,
  Medal,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

// ============================================
// Ikon Lucide yang bisa dipilih dari admin (disimpan sebagai nama string).
// Import eksplisit — jangan `import * as Icons`, itu menarik seluruh
// library lucide ke bundle client.
// ============================================

export type IconOption = { name: string; icon: LucideIcon };

export const CERT_ICON_OPTIONS: IconOption[] = [
  { name: "Award", icon: Award },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Code2", icon: Code2 },
  { name: "BadgeCheck", icon: BadgeCheck },
  { name: "Trophy", icon: Trophy },
  { name: "Medal", icon: Medal },
  { name: "Star", icon: Star },
  { name: "BookOpen", icon: BookOpen },
];

export const STAT_ICON_OPTIONS: IconOption[] = [
  { name: "FolderGit2", icon: FolderGit2 },
  { name: "Award", icon: Award },
  { name: "Calendar", icon: Calendar },
  { name: "Cpu", icon: Cpu },
  { name: "Briefcase", icon: Briefcase },
  { name: "Users", icon: Users },
  { name: "Star", icon: Star },
  { name: "Trophy", icon: Trophy },
  { name: "Code2", icon: Code2 },
  { name: "Zap", icon: Zap },
  { name: "Target", icon: Target },
  { name: "Rocket", icon: Rocket },
  { name: "Layers", icon: Layers },
  { name: "TrendingUp", icon: TrendingUp },
];

function toMap(options: IconOption[]): Record<string, LucideIcon> {
  return Object.fromEntries(options.map((o) => [o.name, o.icon]));
}

const CERT_ICONS = toMap(CERT_ICON_OPTIONS);
const STAT_ICONS = toMap(STAT_ICON_OPTIONS);

export function getCertIcon(name: string | null | undefined): LucideIcon {
  return (name && CERT_ICONS[name]) || Award;
}

export function getStatIcon(name: string | null | undefined): LucideIcon {
  return (name && STAT_ICONS[name]) || FolderGit2;
}
