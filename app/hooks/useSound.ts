"use client";

type SoundType = "hover" | "click" | "open" | "success" | "error" | "toggle";

let audioContext: AudioContext | null = null;
let ambientNodes: {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  masterGain: GainNode;
} | null = null;

// ============================================
// Audio Context Init
// ============================================
const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  return audioContext;
};

// ============================================
// Tone Generator (SFX)
// ============================================
const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.15,
  startTime: number = 0,
  frequencyEnd?: number
) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
  if (frequencyEnd) {
    osc.frequency.exponentialRampToValueAtTime(
      frequencyEnd,
      ctx.currentTime + startTime + duration
    );
  }

  gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + startTime + duration
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

// ============================================
// SFX Player — VOLUME DITINGKATKAN 2×
// ============================================
export const playSound = (type: SoundType) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  switch (type) {
    case "hover":
      // Tick lebih jelas
      playTone(900, 0.04, "sine", 0.08);
      break;

    case "click":
      // Blip dual-tone lebih tegas
      playTone(450, 0.07, "sine", 0.15);
      playTone(700, 0.07, "sine", 0.12, 0.04);
      break;

    case "open":
      // Whoosh naik lebih dramatis
      playTone(220, 0.18, "sine", 0.15, 0, 900);
      playTone(440, 0.12, "triangle", 0.08, 0.08);
      break;

    case "success":
      // Chime chord lebih meriah
      playTone(523, 0.3, "sine", 0.12);      // C5
      playTone(659, 0.3, "sine", 0.1, 0.08); // E5
      playTone(784, 0.4, "sine", 0.12, 0.16); // G5
      playTone(1046, 0.5, "sine", 0.08, 0.24); // C6
      break;

    case "error":
      // Buzz lebih tegas
      playTone(180, 0.22, "square", 0.12);
      playTone(140, 0.25, "square", 0.1, 0.1);
      break;

    case "toggle":
      // Switch lebih punchy
      playTone(650, 0.05, "triangle", 0.12);
      playTone(900, 0.06, "triangle", 0.09, 0.04);
      break;
  }
};

// ============================================
// AMBIENT BACKGROUND SOUND
// Drone sci-fi halus dengan 2 layer + LFO
// ============================================
export const startAmbient = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ambientNodes) return; // Sudah jalan

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  // Master gain untuk ambient
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  // Fade in halus selama 3 detik
  masterGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3);
  masterGain.connect(ctx.destination);

  // Filter lowpass untuk kesan "jauh" dan lembut
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  filter.Q.value = 0.7;
  filter.connect(masterGain);

  // Osc 1: Low drone A1 (55 Hz)
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = 55;
  const gain1 = ctx.createGain();
  gain1.gain.value = 0.6;
  osc1.connect(gain1);
  gain1.connect(filter);

  // Osc 2: Perfect fifth E2 (82.5 Hz) — detune sedikit untuk tekstur
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 82.5;
  osc2.detune.value = -8; // detune -8 cents untuk "beating"
  const gain2 = ctx.createGain();
  gain2.gain.value = 0.4;
  osc2.connect(gain2);
  gain2.connect(filter);

  // Osc 3: High shimmer C6 (1046 Hz) — sangat lembut
  const osc3 = ctx.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = 1046;
  const gain3 = ctx.createGain();
  gain3.gain.value = 0.03; // sangat pelan, cuma "bumbu"
  osc3.connect(gain3);
  gain3.connect(filter);

  // LFO untuk modulasi volume ambient (efek "bernafas")
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15; // 0.15 Hz = siklus ~6.6 detik
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.015; // modulasi amplitudo 0.015
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);

  // Start semua
  osc1.start();
  osc2.start();
  osc3.start();
  lfo.start();

  ambientNodes = { osc1, osc2, lfo, lfoGain, masterGain };

  // Simpan osc3 di masterGain untuk cleanup nanti
  (ambientNodes as any).osc3 = osc3;
  (ambientNodes as any).gain1 = gain1;
  (ambientNodes as any).gain2 = gain2;
  (ambientNodes as any).gain3 = gain3;
  (ambientNodes as any).filter = filter;
};

export const stopAmbient = () => {
  const ctx = getAudioContext();
  if (!ctx || !ambientNodes) return;

  // Fade out halus selama 1 detik
  const { masterGain } = ambientNodes;
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

  const nodes = ambientNodes;
  ambientNodes = null;

  // Stop setelah fade out selesai
  setTimeout(() => {
    try {
      nodes.osc1.stop();
      nodes.osc2.stop();
      nodes.lfo.stop();
      const osc3 = (nodes as any).osc3;
      if (osc3) osc3.stop();
    } catch {
      // ignore if already stopped
    }
  }, 1100);
};

export const isAmbientPlaying = () => ambientNodes !== null;