"use client";

import { useEffect, useState } from "react";
import PhoneShell from "@/components/PhoneShell";
import { Eyebrow, PrimaryButton } from "@/components/Primitives";
import { getPreset } from "@/lib/presets";
import {
  getAllPhotos,
  getSettings,
  restorePhoto,
  saveSettings,
  softDeletePhoto,
} from "@/lib/localStore";
import { Photo, WeddingSettings } from "@/lib/types";

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState<WeddingSettings | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setPhotos(
      getAllPhotos().sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    setSettings(getSettings());
  }

  function updateSettings(patch: Partial<WeddingSettings>) {
    if (!settings) return;
    const next = { ...settings, ...patch };
    saveSettings(next);
    setSettings(next);
  }

  function toggleActive(photo: Photo) {
    if (photo.isActive) softDeletePhoto(photo.id);
    else restorePhoto(photo.id);
    refresh();
  }

  if (!settings) return null;

  const activeCount = photos.filter((p) => p.isActive).length;

  return (
    <PhoneShell>
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <Eyebrow>Admin</Eyebrow>
        <div className="text-[11px] text-filmSafety mb-4 leading-relaxed">
          Halaman ini belum diamankan dengan login — untuk pengujian lokal
          saja. Setelah Supabase tersambung, halaman ini akan memerlukan
          login admin.
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-sm bg-filmDarkEdge border border-[#2a2520]">
            <div className="text-[10px] text-filmPaperDim uppercase">
              Total unggahan
            </div>
            <div className="text-xl text-filmPaper font-mono">
              {photos.length}
            </div>
          </div>
          <div className="p-3 rounded-sm bg-filmDarkEdge border border-[#2a2520]">
            <div className="text-[10px] text-filmPaperDim uppercase">
              Aktif
            </div>
            <div className="text-xl text-filmPaper font-mono">
              {activeCount}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-filmPaperDim block mb-1">
            Batas frame per tamu
          </label>
          <input
            type="number"
            min={1}
            value={settings.frameLimit}
            onChange={(e) =>
              updateSettings({ frameLimit: Number(e.target.value) || 1 })
            }
            className="w-full px-3 py-2 rounded-sm bg-filmPaper text-filmInk text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-filmPaperDim block mb-2">
            Status album
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ albumState: "locked" })}
              className={`flex-1 py-2 rounded-sm text-xs font-semibold ${
                settings.albumState === "locked"
                  ? "bg-filmAmber text-filmInk"
                  : "border border-[#332e28] text-filmPaperDim"
              }`}
            >
              Terkunci
            </button>
            <button
              onClick={() => updateSettings({ albumState: "revealed" })}
              className={`flex-1 py-2 rounded-sm text-xs font-semibold ${
                settings.albumState === "revealed"
                  ? "bg-filmAmber text-filmInk"
                  : "border border-[#332e28] text-filmPaperDim"
              }`}
            >
              Terungkap
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-filmPaperDim block mb-1">
            Jadwalkan pengungkapan (opsional)
          </label>
          <input
            type="datetime-local"
            value={settings.scheduledRevealAt ?? ""}
            onChange={(e) =>
              updateSettings({
                scheduledRevealAt: e.target.value || null,
              })
            }
            className="w-full px-3 py-2 rounded-sm bg-filmPaper text-filmInk text-sm"
          />
        </div>

        <div className="mb-2">
          <Eyebrow>Semua foto</Eyebrow>
        </div>
        <div className="space-y-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex items-center gap-2 p-2 rounded-sm bg-filmDarkEdge border border-[#2a2520]"
            >
              <img
                src={photo.dataUrl}
                alt=""
                className="w-12 h-16 object-cover rounded-sm"
                style={{ filter: getPreset(photo.filmId).filter }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-filmPaper truncate">
                  {photo.guestName}
                </div>
                <div className="text-[10px] text-filmPaperDim">
                  #{photo.frameNumber} ·{" "}
                  {new Date(photo.createdAt).toLocaleString("id-ID")}
                </div>
                <div className="text-[10px]">
                  {photo.isActive ? (
                    <span className="text-filmTeal">Aktif</span>
                  ) : (
                    <span className="text-filmSafety">Dihapus</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <a
                  href={photo.dataUrl}
                  download={`${photo.guestName}-${photo.frameNumber}.jpg`}
                  className="text-[10px] text-filmAmber underline"
                >
                  Unduh
                </a>
                <button
                  onClick={() => toggleActive(photo)}
                  className="text-[10px] text-filmPaperDim underline"
                >
                  {photo.isActive ? "Hapus" : "Pulihkan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}
