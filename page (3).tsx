"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";
import BottomNav from "@/components/BottomNav";
import { Eyebrow, FrameCounter } from "@/components/Primitives";
import PhotoGrid from "@/components/PhotoGrid";
import FullscreenViewer from "@/components/FullscreenViewer";
import {
  getActivePhotosForGuest,
  getGuestId,
  getGuestName,
  getSettings,
  softDeletePhoto,
} from "@/lib/localStore";
import { Photo } from "@/lib/types";

export default function RollPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [frameLimit, setFrameLimit] = useState(15);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const guestId = getGuestId();
  const guestName = getGuestName();

  useEffect(() => {
    if (!guestName) {
      router.replace("/");
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refresh() {
    setFrameLimit(getSettings().frameLimit);
    setPhotos(getActivePhotosForGuest(guestId));
  }

  function handleDelete(photo: Photo) {
    softDeletePhoto(photo.id);
    refresh();
  }

  const remaining = frameLimit - photos.length;

  return (
    <PhoneShell>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center justify-between pb-3">
          <Eyebrow>Rol kamu</Eyebrow>
          <FrameCounter remaining={remaining} total={frameLimit} />
        </div>
        <PhotoGrid
          photos={photos}
          onOpen={(p) => setViewerIndex(photos.findIndex((x) => x.id === p.id))}
          onDelete={handleDelete}
        />
      </div>
      <BottomNav />

      {viewerIndex !== null && (
        <FullscreenViewer
          photos={photos}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
          onDelete={handleDelete}
        />
      )}
    </PhoneShell>
  );
}
