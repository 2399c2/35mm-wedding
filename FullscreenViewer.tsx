"use client";

import { Photo } from "@/lib/types";
import { getPreset } from "@/lib/presets";

export default function FullscreenViewer({
  photos,
  index,
  onClose,
  onNavigate,
  onDelete,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
  onDelete?: (photo: Photo) => void;
}) {
  const photo = photos[index];
  if (!photo) return null;

  function download() {
    const a = document.createElement("a");
    a.href = photo.dataUrl;
    a.download = `dhani-firda-${photo.guestName || "tamu"}-${photo.frameNumber}.jpg`;
    a.click();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <button onClick={onClose} className="text-filmPaper text-sm">
          ✕ Tutup
        </button>
        <span className="text-filmPaperDim text-xs">
          {photo.guestName} · #{photo.frameNumber}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-2">
        {index > 0 && (
          <button
            onClick={() => onNavigate(index - 1)}
            className="text-filmPaper text-2xl px-2"
            aria-label="Sebelumnya"
          >
            ‹
          </button>
        )}
        <img
          src={photo.dataUrl}
          alt=""
          className="max-h-[70vh] max-w-full object-contain rounded-sm"
          style={{ filter: getPreset(photo.filmId).filter }}
        />
        {index < photos.length - 1 && (
          <button
            onClick={() => onNavigate(index + 1)}
            className="text-filmPaper text-2xl px-2"
            aria-label="Berikutnya"
          >
            ›
          </button>
        )}
      </div>

      <div className="p-4 flex gap-2">
        <button
          onClick={download}
          className="flex-1 py-3 rounded-sm bg-filmAmber text-filmInk text-sm font-semibold"
        >
          Unduh
        </button>
        {onDelete && (
          <button
            onClick={() => {
              onDelete(photo);
              onClose();
            }}
            className="flex-1 py-3 rounded-sm border border-filmSafety text-filmSafety text-sm font-semibold"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}
