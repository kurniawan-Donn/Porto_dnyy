"use client";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";

export default function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const trailsRef = useRef<{ x: number; y: number }[]>([]);
  const [trails, setTrails] = useState<{ x: number; y: number }[]>([]);

  // Motion values untuk posisi
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring untuk ring (chase effect)
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 20, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 20, mass: 0.5 });

  // Detect device (only enable on desktop with pointer)
  useEffect(() => {
    const checkDevice = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setIsEnabled(!isTouch && !prefersReduced);
    };
    checkDevice();

    const mediaQuery = window.matchMedia("(pointer: coarse)");
    mediaQuery.addEventListener("change", checkDevice);
    return () => mediaQuery.removeEventListener("change", checkDevice);
  }, []);

  // Mouse tracking
  useEffect(() => {
    if (!isEnabled) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const leave = () => setIsVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [isEnabled, mouseX, mouseY]);

  // Detect hover state on interactive elements
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest(
        "a, button, input, textarea, select, [role='button'], [data-cursor]"
      ) as HTMLElement | null;

      if (interactive) {
        const customText = interactive.getAttribute("data-cursor");
        if (customText) {
          setCursorText(customText);
          setIsPointer(true);
          setIsHovering(false);
        } else {
          setCursorText("");
          setIsHovering(true);
          setIsPointer(false);
        }
      } else {
        setCursorText("");
        setIsHovering(false);
        setIsPointer(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => document.removeEventListener("mouseover", handleMouseOver);
  }, [isEnabled]);

  // Trailing particles
  useEffect(() => {
    if (!isEnabled) return;

    let animationFrame: number;
    let lastUpdate = 0;

    const update = (timestamp: number) => {
      if (timestamp - lastUpdate > 50) {
        lastUpdate = timestamp;
        const newPoint = { x: mouseX.get(), y: mouseY.get() };
        trailsRef.current = [newPoint, ...trailsRef.current].slice(0, 5);
        setTrails([...trailsRef.current]);
      }
      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [isEnabled, mouseX, mouseY]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Sembunyikan cursor default di seluruh halaman */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Trailing particles */}
      <AnimatePresence>
        {isVisible &&
          trails.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.6 - i * 0.12,
                scale: 1 - i * 0.15,
              }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 pointer-events-none z-[9998] w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{
                x: t.x - 3,
                y: t.y - 3,
                boxShadow: "0 0 8px rgba(6,182,212,0.8)",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Outer ring (chase effect) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 60 : isHovering ? 72 : 36,
            height: isPointer ? 60 : isHovering ? 72 : 36,
            opacity: isVisible ? 1 : 0,
            borderWidth: isHovering || isPointer ? 2 : 1.5,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-full border-cyan-500 dark:border-cyan-400 flex items-center justify-center backdrop-blur-[2px]"
          style={{
            boxShadow:
              "0 0 20px rgba(6,182,212,0.4), inset 0 0 12px rgba(6,182,212,0.2)",
          }}
        >
          {/* Crosshair markers (4 sisi) */}
          <motion.div
            animate={{ opacity: isHovering ? 1 : 0.4 }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-500 dark:bg-cyan-400"
          />
          <motion.div
            animate={{ opacity: isHovering ? 1 : 0.4 }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-500 dark:bg-cyan-400"
          />
          <motion.div
            animate={{ opacity: isHovering ? 1 : 0.4 }}
            className="absolute -left-1 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-cyan-500 dark:bg-cyan-400"
          />
          <motion.div
            animate={{ opacity: isHovering ? 1 : 0.4 }}
            className="absolute -right-1 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-cyan-500 dark:bg-cyan-400"
          />

          {/* Text label (kalau ada data-cursor) */}
          <AnimatePresence>
            {cursorText && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-[10px] font-mono font-bold tracking-wider text-cyan-600 dark:text-cyan-400 whitespace-nowrap px-2"
              >
                {cursorText}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Inner dot (instant follow) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
          boxShadow: "0 0 12px rgba(6,182,212,1)",
        }}
      />
    </>
  );
}