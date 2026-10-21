"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { playSound, startAmbient, stopAmbient } from "../hooks/useSound";
import { useIsClient } from "../hooks/useIsClient";

type SoundContextType = {
  isEnabled: boolean;
  toggle: () => void;
  play: (type: "hover" | "click" | "open" | "success" | "error" | "toggle") => void;
};

const SoundContext = createContext<SoundContextType>({
  isEnabled: false,
  toggle: () => {},
  play: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const isMounted = useIsClient();

  // Baca preferensi dari localStorage setelah hydration (server tidak punya
  // akses localStorage, jadi nilai awal harus false agar HTML-nya cocok)
  useEffect(() => {
    const saved = localStorage.getItem("sound-preference");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkron sekali dari localStorage
    if (saved === "on") setIsEnabled(true);
  }, []);

  // Kontrol ambient based on isEnabled
  useEffect(() => {
    if (!isMounted) return;

    if (isEnabled) {
      // Tunggu interaksi user dulu (autoplay policy)
      // Karena toggle diklik, ini aman
      startAmbient();
    } else {
      stopAmbient();
    }

    return () => {
      stopAmbient();
    };
  }, [isEnabled, isMounted]);

  // Simpan preferensi
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("sound-preference", isEnabled ? "on" : "off");
  }, [isEnabled, isMounted]);

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    // Play feedback saat baru dinyalakan
    if (newValue) {
      // Play setelah sedikit delay agar tidak overlap dengan ambient fade-in
      setTimeout(() => playSound("toggle"), 100);
    }
  };

  const play = (type: "hover" | "click" | "open" | "success" | "error" | "toggle") => {
    if (!isEnabled) return;
    playSound(type);
  };

  return (
    <SoundContext.Provider value={{ isEnabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);