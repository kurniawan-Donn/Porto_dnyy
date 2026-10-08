"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import { useSound } from "./SoundProvider";
import { useActiveSection } from "../hooks/useActiveSection";

const NAV_LINKS = [
  { name: "Tentang", href: "#tentang", id: "tentang" },
  { name: "Keahlian", href: "#keahlian", id: "keahlian" },
  { name: "Pengalaman", href: "#pengalaman", id: "pengalaman" },
  { name: "Proyek", href: "#proyek", id: "proyek" },
  { name: "Sertifikasi", href: "#sertifikasi", id: "sertifikasi" },
  { name: "Kontak", href: "#kontak", id: "kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS.map((l) => l.id));
  const { play } = useSound();

  // ============================================
  // Programmatic scroll — lebih reliable di mobile
  // ============================================
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    play("click");

    // Tutup menu dulu
    setIsOpen(false);

    // Delay sedikit agar animasi menu close tidak bentrok dengan scroll
    setTimeout(() => {
      const id = href.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const navHeight = 80; // offset untuk navbar fixed
        const elementTop =
          element.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: elementTop,
          behavior: "smooth",
        });
      }
    }, 150);
  };

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#"
          aria-label="Beranda - Dony Kurniawan"
          onMouseEnter={() => play("hover")}
          onClick={(e) => {
            e.preventDefault();
            play("click");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xl font-bold tracking-widest text-cyan-600 dark:text-cyan-400"
        >
          DONY.
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-3">
          <ul className="flex items-center space-x-1 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.name} className="relative">
                  <a
                    href={link.href}
                    onMouseEnter={() => play("hover")}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative block px-3 py-2 transition-colors duration-300 ${
                      isActive
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                    }`}
                  >
                    {link.name}

                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-2 right-2 -bottom-0.5 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: Toggle + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <SoundToggle />
          <ThemeToggle />
          <button
            className="text-slate-600 dark:text-slate-300 w-9 h-9 flex items-center justify-center"
            onClick={() => {
              setIsOpen(!isOpen);
              play("toggle");
            }}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.name} className="relative">
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`relative block px-4 py-3 rounded-md transition-colors duration-300 ${
                        isActive
                          ? "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-400/10"
                          : "text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      {link.name}

                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicatorMobile"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 dark:bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}