"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";
import BottomNav from "@/components/BottomNav";
import { Eyebrow } from "@/components/Primitives";
import PhotoGrid from "@/components/PhotoGrid";
import FullscreenViewer from "@/components/FullscreenViewer";
import {
  getActivePhotosForGuest,
  getAllPhotos,
  getGuestId,
  getGuestName,
  resolveScheduledReveal,
} from "@/lib/localStore";
import { Photo, WeddingSettings } from "@/lib/types";

type Tab = "mine" | "all";

export default function GalleryPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("mine");
  const [settings, setSettings] = useState<WeddingSettings | null>(null);
  const [myPhotos, setMyPhotos] = useState<Photo[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const guestId = getGuestId();
  const guestName = getGuestName();

  useEffect(() => {
    if (!guestName) {
      router.replace("/");
      return;
    }
    refresh();
    const interval = setInterval(refresh, 5000); // pick up scheduled reveal
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refresh() {
    const s = resolveScheduledReveal();
    setSettings(s);
    setMyPhotos(getActivePhotosForGuest(guestId));
    if (s.albumState === "revealed") {
      setAllPhotos(
        getAllPhotos()
          .filter((p) => p.isActive)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
      );
    }
  }

  if (!settings) return null;

  const revealed = settings.albumState === "revealed";
  const activeList = tab === "mine" ? myPhotos : allPhotos;

  return (
    <PhoneShell>
      <div className="flex-1 flex flex-col p-4">
        <Eyebrow>Galeri</Eyebrow>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("mine")}
            className={`flex-1 py-2 rounded-sm text-xs font-semibold ${
              tab === "mine"
                ? "bg-filmAmber text-filmInk"
                : "border border-[#332e28] text-filmPaperDim"
            }`}
          >
            Foto Kamu
          </button>
          <button
            onClick={() => setTab("all")}
            className={`flex-1 py-2 rounded-sm text-xs font-semibold ${
              tab === "all"
                ? "bg-filmAmber text-filmInk"
                : "border border-[#332e28] text-filmPaperDim"
            }`}
          >
            Semua Foto
          </button>
        </div>

        {tab === "all" && !revealed ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="text-filmAmber text-2xl mb-3">✦</div>
            <p className="text-sm text-filmPaper font-serif text-lg mb-2">
              Sedang dicuci…
            </p>
            <p className="text-xs text-filmPaperDim leading-relaxed">
              Album akan terbuka untuk semua tamu setelah pesta usai. Kamu
              tetap bisa lihat foto kamu sendiri di tab &quot;Foto Kamu&quot;.
            </p>
          </div>
        ) : (
          <PhotoGrid
            photos={activeList}
            onOpen={(p) =>
              setViewerIndex(activeList.findIndex((x) => x.id === p.id))
            }
          />
        )}
      </div>
      <BottomNav />

      {viewerIndex !== null && (
        <FullscreenViewer
          photos={activeList}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
        />
      )}
    </PhoneShell>
  );
}
