"use client";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";

export default function ProfilePhoto({ photoUrl }: { photoUrl?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values untuk tilt 3D
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // ============================================
  // Realtime Clock (WIB) + Tanggal + Hari + Status
  // ============================================
  const [currentTime, setCurrentTime] = useState<string>("--:--:--");
  const [currentDate, setCurrentDate] = useState<string>("--/--/----");
  const [currentDay, setCurrentDay] = useState<string>("---");
  const [status, setStatus] = useState({
    label: "OFFLINE",
    color: "bg-red-500",
    glow: "rgba(239,68,68,0.8)",
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      const hours = wibTime.getUTCHours().toString().padStart(2, "0");
      const minutes = wibTime.getUTCMinutes().toString().padStart(2, "0");
      const seconds = wibTime.getUTCSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      const day = wibTime.getUTCDate().toString().padStart(2, "0");
      const month = (wibTime.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = wibTime.getUTCFullYear();
      setCurrentDate(`${day}/${month}/${year}`);

      const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      setCurrentDay(dayNames[wibTime.getUTCDay()]);

      const h = wibTime.getUTCHours();
      if (h >= 7 && h < 22) {
        setStatus({ label: "ONLINE", color: "bg-green-500", glow: "rgba(34,197,94,0.8)" });
      } else {
        setStatus({ label: "OFFLINE", color: "bg-red-500", glow: "rgba(239,68,68,0.8)" });
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] aspect-[5/8] mx-auto"
      style={{ perspective: 1200 }}
    >
      {/* ============================================
          LAYER 1: GRID PATTERN
      ============================================ */}
      <div
        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.6) 1px, transparent 1px)",
          backgroundSize: "8% 5%",
          maskImage: "radial-gradient(ellipse at center 40%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center 40%, #000 30%, transparent 75%)",
        }}
      />

      {/* ============================================
          LAYER 2: NEON BLOBS
      ============================================ */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[70%] aspect-square rounded-full bg-cyan-500 blur-[60px] md:blur-[80px]"
      />
      <motion.div
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[55%] -translate-x-1/2 w-[60%] aspect-square rounded-full bg-blue-500 blur-[60px] md:blur-[80px]"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[65%] h-[28%] rounded-full bg-cyan-400 blur-[50px] md:blur-[70px]"
      />

      {/* ============================================
          LAYER 3: ROTATING RINGS
      ============================================ */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[9%] left-1/2 -translate-x-1/2 w-[82%] aspect-square rounded-full border border-dashed border-cyan-500/30 dark:border-cyan-400/30 pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-[13%] left-1/2 -translate-x-1/2 w-[66%] aspect-square rounded-full border border-cyan-500/20 dark:border-cyan-400/20 pointer-events-none"
      >
        <div className="absolute top-1/2 -right-[3px] w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
      </motion.div>

      {/* ============================================
          LAYER 4: CORNER BRACKETS (Viewfinder)
      ============================================ */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute top-[2%] left-[2%] w-[10%] aspect-square z-30 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </motion.div>

      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute top-[2%] right-[2%] w-[10%] aspect-square z-30 pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-full h-[2px] bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-[18%] left-[2%] w-[10%] aspect-square z-30 pointer-events-none"
      >
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </motion.div>

      <motion.div
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-[18%] right-[2%] w-[10%] aspect-square z-30 pointer-events-none"
      >
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </motion.div>

      {/* ============================================
          LAYER 5: FOTO CUTOUT
      ============================================ */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute bottom-[20%] left-[10%] right-[10%] h-[70%] z-20"
      >
        <Image
          src={photoUrl || "/profile.png"}
          alt="Dony Kurniawan"
          fill
          priority
          unoptimized
          sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
          className="object-contain object-bottom drop-shadow-[0_0_40px_rgba(6,182,212,0.5)]"
        />
      </motion.div>

      {/* ============================================
          LAYER 6: HOLOGRAM PLATFORM
      ============================================ */}
      <div className="absolute bottom-[19%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 w-[70%]">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6], scaleX: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-[3px] rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)]"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="w-[65%] h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        />
      </div>

      {/* ============================================
          LAYER 7: HUD METADATA
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-[1%] left-0 right-0 z-30 flex flex-col items-center gap-1 px-2"
      >
        {/* Baris 1: Hari + Tanggal */}
        <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-widest">
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
            {currentDay}
          </span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-500 dark:text-slate-400 tabular-nums">
            {currentDate}
          </span>
        </div>

        {/* Baris 2: Jam */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] tracking-widest">
          <span className="text-slate-400 dark:text-slate-600">[</span>
          <span className="text-cyan-600 dark:text-cyan-400 tabular-nums font-semibold">
            {currentTime}
          </span>
          <span className="text-slate-500 dark:text-slate-500">WIB</span>
          <span className="text-slate-400 dark:text-slate-600">]</span>
        </div>

        {/* Baris 3: ID + Status */}
        <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-600 dark:text-cyan-400">
          <span className="text-slate-500 dark:text-slate-500">ID:</span>
          <span>DNY-2025</span>
          <span className="text-slate-400 dark:text-slate-600">//</span>
          <span className="text-slate-500 dark:text-slate-500">STATUS:</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${status.color} animate-pulse`}
              style={{ boxShadow: `0 0 8px ${status.glow}` }}
            />
            {status.label}
          </span>
        </div>
      </motion.div>

      {/* ============================================
          LAYER 8: FLOATING PARTICLES
      ============================================ */}
      {[
        { top: "8%", left: "12%", delay: 0, duration: 4 },
        { top: "18%", right: "8%", delay: 1, duration: 5 },
        { top: "55%", left: "6%", delay: 0.5, duration: 3.5 },
        { top: "70%", right: "12%", delay: 1.5, duration: 4.5 },
        { top: "40%", right: "5%", delay: 2, duration: 4 },
      ].map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.9, 0.3] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]"
          style={{ top: p.top, left: p.left, right: p.right }}
        />
      ))}
    </div>
  );
}