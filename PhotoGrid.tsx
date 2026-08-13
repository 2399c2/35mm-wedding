import { Photo } from "@/lib/types";
import { getPreset } from "@/lib/presets";

export default function PhotoGrid({
  photos,
  onOpen,
  onDelete,
}: {
  photos: Photo[];
  onOpen: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
}) {
  if (photos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-6">
        <p className="text-sm text-filmPaperDim">Belum ada foto di sini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1">
      {photos.map((photo) => (
        <div key={photo.id} className="relative rounded-sm overflow-hidden">
          <button
            onClick={() => onOpen(photo)}
            className="block w-full aspect-[3/4]"
          >
            <img
              src={photo.dataUrl}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: getPreset(photo.filmId).filter }}
            />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(photo)}
              aria-label="Hapus foto"
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-filmDarkEdge/80 text-filmPaper text-xs flex items-center justify-center"
            >
              ✕
            </button>
          )}
          <div className="text-[10px] mt-1 text-filmPaperDim truncate">
            {photo.guestName}
          </div>
        </div>
      ))}
    </div>
  );
}
