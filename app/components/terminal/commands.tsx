import type { ReactNode } from "react";

// ============================================
// Data & mesin perintah terminal (tanpa state UI).
// ============================================

export type TerminalProject = {
  slug: string;
  title: string;
  tech: string[];
};

export type TerminalData = {
  name: string;
  role: string;
  location: string;
  email: string | null;
  cvUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  projects: TerminalProject[];
};

/** Aksi yang dijalankan komponen Terminal setelah perintah selesai */
export type TerminalEffect =
  | { type: "clear" }
  | { type: "close" }
  | { type: "open-url"; url: string }
  | { type: "navigate"; href: string };

export type CommandResult = {
  output?: ReactNode;
  effect?: TerminalEffect;
};

export type CommandContext = {
  data: TerminalData;
  history: string[];
  /** Tutup terminal lalu pindah halaman (untuk link di dalam output) */
  go: (href: string) => void;
};

type Command = {
  name: string;
  usage: string;
  description: string;
  run: (args: string[], ctx: CommandContext) => CommandResult;
};

const accent = "text-cyan-600 dark:text-cyan-400";
const muted = "text-slate-500 dark:text-slate-400";
const ok = "text-emerald-600 dark:text-emerald-400";
const warn = "text-amber-600 dark:text-amber-400";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className={`w-24 shrink-0 ${muted}`}>{label}</span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

function LinkButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${accent} underline decoration-dotted underline-offset-4 hover:decoration-solid`}
    >
      {children}
    </button>
  );
}

function findProject(data: TerminalData, raw: string | undefined) {
  if (!raw) return undefined;
  const slug = raw.replace(/^projects\//, "").replace(/\/$/, "").toLowerCase();
  return data.projects.find((p) => p.slug === slug);
}

const COMMANDS: Command[] = [
  {
    name: "help",
    usage: "help",
    description: "Daftar perintah",
    run: () => ({
      output: (
        <div className="space-y-1">
          <p className={muted}>Perintah yang tersedia:</p>
          {COMMANDS.filter((c) => c.name !== "sudo").map((c) => (
            <Row key={c.name} label={c.usage}>
              {c.description}
            </Row>
          ))}
          <Row label="sudo hire-me">Rahasia. Coba saja.</Row>
          <p className={`pt-1 ${muted}`}>
            Tips: <span className={accent}>Tab</span> untuk melengkapi,{" "}
            <span className={accent}>↑/↓</span> untuk riwayat, <span className={accent}>Esc</span> untuk
            menutup.
          </p>
        </div>
      ),
    }),
  },
  {
    name: "whoami",
    usage: "whoami",
    description: "Siapa saya",
    run: (_args, { data }) => ({
      output: (
        <div className="space-y-1">
          <p className="font-bold">{data.name}</p>
          <Row label="role">{data.role}</Row>
          <Row label="focus">IT Audit · Cybersecurity · Web Development</Row>
          <Row label="location">{data.location}</Row>
          <Row label="status">
            <span className={ok}>● open to work</span> — magang & kolaborasi
          </Row>
        </div>
      ),
    }),
  },
  {
    name: "ls",
    usage: "ls projects",
    description: "Daftar case study",
    run: (args, { data, go }) => {
      const target = (args[0] ?? "").replace(/\/$/, "");
      if (target && target !== "projects") {
        return { output: <p className={warn}>ls: {args[0]}: No such file or directory</p> };
      }
      if (!target) {
        return {
          output: (
            <p>
              <span className={accent}>projects/</span>
              {"  "}
              cv.pdf{"  "}
              <span className={muted}>hire-me.sh</span>
            </p>
          ),
        };
      }
      if (data.projects.length === 0) return { output: <p className={muted}>(kosong)</p> };
      return {
        output: (
          <div className="space-y-0.5">
            <p className={muted}>total {data.projects.length}</p>
            {data.projects.map((p) => (
              <div key={p.slug} className="flex flex-wrap gap-x-3">
                <span className={muted}>drwxr-xr-x</span>
                <LinkButton onClick={() => go(`/projects/${p.slug}`)}>{p.slug}/</LinkButton>
                <span className="text-slate-600 dark:text-slate-300">{p.title}</span>
              </div>
            ))}
            <p className={`pt-1 ${muted}`}>
              Klik nama folder atau ketik <span className={accent}>open &lt;slug&gt;</span>.
            </p>
          </div>
        ),
      };
    },
  },
  {
    name: "open",
    usage: "open <slug>",
    description: "Buka halaman case study",
    run: (args, { data }) => {
      const project = findProject(data, args[0]);
      if (!project) {
        return {
          output: (
            <p className={warn}>
              open: {args[0] ?? "(kosong)"}: project tidak ditemukan — lihat <span className={accent}>ls projects</span>
            </p>
          ),
        };
      }
      return {
        output: <p className={muted}>Membuka {project.title}…</p>,
        effect: { type: "navigate", href: `/projects/${project.slug}` },
      };
    },
  },
  {
    name: "cat",
    usage: "cat cv.pdf",
    description: "Buka CV (tab baru)",
    run: (args, { data }) => {
      const file = args[0];
      if (file !== "cv.pdf") {
        return { output: <p className={warn}>cat: {file ?? "(kosong)"}: No such file or directory</p> };
      }
      if (!data.cvUrl) {
        return { output: <p className={warn}>cat: cv.pdf: belum diunggah</p> };
      }
      return {
        output: <p className={muted}>%PDF-1.7 … binary file — membuka cv.pdf di tab baru</p>,
        effect: { type: "open-url", url: data.cvUrl },
      };
    },
  },
  {
    name: "audit",
    usage: "audit",
    description: "Laporan keamanan situs ini",
    run: () => ({
      output: <p className={muted}>Menjalankan self-audit… membuka laporan.</p>,
      effect: { type: "navigate", href: "/#audit" },
    }),
  },
  {
    name: "history",
    usage: "history",
    description: "Riwayat perintah",
    run: (_args, { history }) => ({
      output: (
        <div>
          {history.map((h, i) => (
            <p key={i}>
              <span className={muted}>{String(i + 1).padStart(4, " ")}</span> {h}
            </p>
          ))}
        </div>
      ),
    }),
  },
  {
    name: "clear",
    usage: "clear",
    description: "Bersihkan layar",
    run: () => ({ effect: { type: "clear" } }),
  },
  {
    name: "exit",
    usage: "exit",
    description: "Tutup terminal",
    run: () => ({ effect: { type: "close" } }),
  },
  {
    name: "sudo",
    usage: "sudo",
    description: "",
    run: (args, { data, go }) => {
      if (args.join(" ") !== "hire-me") {
        return {
          output: (
            <p className={warn}>
              recruiter is not in the sudoers file. This incident will be reported. 👀
            </p>
          ),
        };
      }
      return {
        output: (
          <div className="space-y-1">
            <p className={muted}>[sudo] password for recruiter: ********</p>
            <p className={ok}>✔ Access granted. Menjalankan hire-me.sh…</p>
            <p className={muted}>[1/3] verifikasi kandidat ........ OK</p>
            <p className={muted}>[2/3] memuat kontak .............. OK</p>
            <p className={muted}>[3/3] membuka jalur komunikasi .... OK</p>
            <div className="pt-2">
              {data.email && (
                <Row label="email">
                  <a className={`${accent} underline underline-offset-4`} href={`mailto:${data.email}`}>
                    {data.email}
                  </a>
                </Row>
              )}
              {data.linkedinUrl && (
                <Row label="linkedin">
                  <a
                    className={`${accent} underline underline-offset-4`}
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </Row>
              )}
              {data.githubUrl && (
                <Row label="github">
                  <a
                    className={`${accent} underline underline-offset-4`}
                    href={data.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </Row>
              )}
            </div>
            <p className="pt-1">
              <LinkButton onClick={() => go("/#kontak")}>→ Kirim pesan lewat form kontak</LinkButton>
            </p>
          </div>
        ),
      };
    },
  },
  {
    name: "rm",
    usage: "rm",
    description: "",
    run: (args) => ({
      output: args.includes("-rf") ? (
        <p className={warn}>Nice try. 🛡️ Permission denied — sistem ini diaudit.</p>
      ) : (
        <p className={warn}>rm: operasi tidak diizinkan (read-only filesystem)</p>
      ),
    }),
  },
];

/** Perintah yang ditampilkan ke pengguna (untuk autocomplete) */
const COMPLETIONS = ["help", "whoami", "ls projects", "open ", "cat cv.pdf", "audit", "history", "clear", "exit", "sudo hire-me"];

export function complete(input: string, data: TerminalData): string {
  const value = input.trimStart();
  if (value.startsWith("open ")) {
    const partial = value.slice(5).toLowerCase();
    const match = data.projects.find((p) => p.slug.startsWith(partial));
    return match ? `open ${match.slug}` : input;
  }
  const match = COMPLETIONS.find((c) => c.startsWith(value) && c !== value);
  return match ?? input;
}

export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return {};
  const command = COMMANDS.find((c) => c.name === name.toLowerCase());
  if (!command) {
    return {
      output: (
        <p className={warn}>
          command not found: {name}. Ketik <span className={accent}>help</span>.
        </p>
      ),
    };
  }
  return command.run(args, ctx);
}
