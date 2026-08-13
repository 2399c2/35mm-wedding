"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";
import { Eyebrow, PrimaryButton } from "@/components/Primitives";
import { PRESETS } from "@/lib/presets";
import { getGuestName, setFilmPresetId } from "@/lib/localStore";
import { FilmPreset } from "@/lib/types";

export default function PresetPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<FilmPreset | null>(null);

  useEffect(() => {
    if (!getGuestName()) router.replace("/");
  }, [router]);

  function handleContinue() {
    if (!selected) return;
    setFilmPresetId(selected.id);
    router.push("/camera");
  }

  return (
    <PhoneShell>
      <div className="flex-1 flex flex-col p-6">
        <Eyebrow>Pilih rol film</Eyebrow>
        <p className="text-sm mb-5 text-filmPaperDim">
          Satu rol untuk seluruh album, biar semua foto senada.
        </p>
        <div className="space-y-3 flex-1">
          {PRESETS.map((p) => {
            const active = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full flex items-center gap-3 p-3 rounded-sm text-left border ${
                  active
                    ? "border-filmAmber bg-[#2a2520]"
                    : "border-[#332e28]"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-sm flex-shrink-0"
                  style={{ background: p.swatch, filter: p.filter }}
                />
                <div>
                  <div className="font-semibold text-[15px] text-filmPaper">
                    {p.name}
                  </div>
                  <div className="text-xs text-filmPaperDim">{p.mood}</div>
                </div>
                {active && (
                  <span className="ml-auto text-filmAmber">✓</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-5">
          <PrimaryButton disabled={!selected} onClick={handleContinue}>
            Pasang rol ini →
          </PrimaryButton>
        </div>
      </div>
    </PhoneShell>
  );
}
