"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";
import { Eyebrow, PrimaryButton } from "@/components/Primitives";
import {
  getFilmPresetId,
  getGuestId,
  getGuestName,
  setGuestName as saveGuestName,
} from "@/lib/localStore";

const EVENT_NAME = "Dhani & Firda";
const EVENT_DATE = "12 Oktober 2026 — Malang";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getGuestId(); // ensures a guest id exists
    const existingName = getGuestName();
    if (existingName) {
      const hasPreset = getFilmPresetId();
      router.replace(hasPreset ? "/camera" : "/preset");
      return;
    }
    setChecked(true);
  }, [router]);

  function handleSubmit() {
    if (name.trim().length === 0) return;
    saveGuestName(name.trim());
    router.push("/preset");
  }

  if (!checked) return null;

  return (
    <PhoneShell>
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <Eyebrow>Pernikahan</Eyebrow>
          <h1 className="text-4xl font-serif mb-1 text-filmPaper">
            {EVENT_NAME}
          </h1>
          <p className="text-sm mb-8 text-filmPaperDim">{EVENT_DATE}</p>
          <p className="text-[15px] leading-relaxed text-filmPaper">
            Kamu jadi fotografer hari ini. Masukkan nama, pilih rol film, lalu
            mulai memotret. Semua foto tersembunyi sampai pesta usai — lalu
            terungkap sekaligus.
          </p>
        </div>
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
            className="w-full px-4 py-3 rounded-sm text-[15px] bg-filmPaper text-filmInk shadow-[0_0_0_1px_#B7AE9A] focus:outline-none"
          />
          <PrimaryButton
            disabled={name.trim().length === 0}
            onClick={handleSubmit}
          >
            Ambil kamera →
          </PrimaryButton>
        </div>
      </div>
    </PhoneShell>
  );
}
