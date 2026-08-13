"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";
import BottomNav from "@/components/BottomNav";
import { FrameCounter } from "@/components/Primitives";
import CameraCapture from "@/components/CameraCapture";
import { getPreset } from "@/lib/presets";
import {
  addPhoto,
  getActivePhotosForGuest,
  getFilmPresetId,
  getGuestId,
  getGuestName,
  getSettings,
} from "@/lib/localStore";

export default function CameraPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [frameLimit, setFrameLimit] = useState(15);
  const [presetId, setPresetId] = useState("kodak");
  const [rollFullMessage, setRollFullMessage] = useState(false);

  const guestId = getGuestId();
  const guestName = getGuestName();

  useEffect(() => {
    if (!guestName) {
      router.replace("/");
      return;
    }
    const fp = getFilmPresetId();
    if (!fp) {
      router.replace("/preset");
      return;
    }
    setPresetId(fp);
    refreshCount();
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refreshCount() {
    const settings = getSettings();
    setFrameLimit(settings.frameLimit);
    const active = getActivePhotosForGuest(guestId);
    setRemaining(settings.frameLimit - active.length);
  }

  function handleCapture(dataUrl: string) {
    const photo = addPhoto({ guestId, guestName, dataUrl, filmId: presetId });
    if (!photo) {
      setRollFullMessage(true);
      setTimeout(() => setRollFullMessage(false), 2500);
    }
    refreshCount();
  }

  if (!ready) return null;

  return (
    <PhoneShell>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center justify-between pb-3">
          <span className="text-xs text-filmPaperDim">
            {guestName} · {getPreset(presetId).name}
          </span>
          <FrameCounter remaining={remaining} total={frameLimit} />
        </div>

        {rollFullMessage && (
          <div className="text-center text-xs text-filmSafety mb-2">
            Rol kamu penuh — hapus foto lama di &quot;Rol Saya&quot; untuk
            ambil foto baru.
          </div>
        )}

        <CameraCapture
          preset={getPreset(presetId)}
          disabled={remaining <= 0}
          onCapture={handleCapture}
        />
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
