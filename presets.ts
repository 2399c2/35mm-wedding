import { FilmPreset } from "./types";

export const PRESETS: FilmPreset[] = [
  {
    id: "kodak",
    name: "Kodak Gold 200",
    mood: "Hangat, sedikit nostalgia",
    filter: "sepia(0.22) saturate(1.45) contrast(1.08) brightness(1.05)",
    swatch: "linear-gradient(135deg,#e8a33d 0%,#c4432e 45%,#4a3728 100%)",
  },
  {
    id: "fuji",
    name: "Fujicolor 400",
    mood: "Sejuk, hijau natural",
    filter: "saturate(1.2) contrast(0.95) hue-rotate(-10deg) brightness(1.02)",
    swatch: "linear-gradient(135deg,#4a6b5a 0%,#8fae6b 45%,#1C1815 100%)",
  },
  {
    id: "cinestill",
    name: "CineStill 800T",
    mood: "Malam, sinematik, sedikit halo merah",
    filter: "contrast(1.18) saturate(1.35) hue-rotate(6deg) brightness(0.94)",
    swatch: "linear-gradient(135deg,#2b2540 0%,#c4432e 55%,#12100D 100%)",
  },
];

export function getPreset(id: string): FilmPreset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}
