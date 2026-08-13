export type FacingMode = "environment" | "user";

export interface FilmPreset {
  id: string;
  name: string;
  mood: string;
  filter: string; // CSS filter string, applied at render time only — never baked into the stored image
  swatch: string; // CSS gradient for the picker card
}

export interface Photo {
  id: string; // photo ID
  guestId: string; // guest identifier (random UUID, no account)
  guestName: string;
  dataUrl: string; // phase 1: base64 image. phase 2: replaced by a storage path + signed URL.
  filmId: string; // film selection
  caption: string;
  frameNumber: number;
  isActive: boolean; // soft-deletion flag
  createdAt: string; // upload timestamp
}

export type AlbumState = "locked" | "revealed";

export interface WeddingSettings {
  frameLimit: number; // default 15
  albumState: AlbumState;
  scheduledRevealAt: string | null; // ISO datetime or null
}

export const DEFAULT_SETTINGS: WeddingSettings = {
  frameLimit: 15,
  albumState: "locked",
  scheduledRevealAt: null,
};
