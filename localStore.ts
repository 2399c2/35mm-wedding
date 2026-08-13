"use client";

import { DEFAULT_SETTINGS, Photo, WeddingSettings } from "./types";

// ---------------------------------------------------------------------------
// PHASE 1 NOTE: everything here lives in this browser's localStorage only.
// It is NOT shared across guests or devices — that requires Supabase (phase 2).
// This file exists so the rest of the app can be written against a stable
// "data layer" shape that won't need to change when phase 2 lands.
// ---------------------------------------------------------------------------

const KEYS = {
  guestId: "wedding.guestId",
  guestName: "wedding.guestName",
  filmPresetId: "wedding.filmPresetId",
  photos: "wedding.photos",
  settings: "wedding.settings",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getGuestId(): string {
  if (!isBrowser()) return "";
  let id = localStorage.getItem(KEYS.guestId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEYS.guestId, id);
  }
  return id;
}

export function getGuestName(): string {
  if (!isBrowser()) return "";
  return localStorage.getItem(KEYS.guestName) || "";
}

export function setGuestName(name: string) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.guestName, name);
}

export function getFilmPresetId(): string {
  if (!isBrowser()) return "";
  return localStorage.getItem(KEYS.filmPresetId) || "";
}

export function setFilmPresetId(id: string) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.filmPresetId, id);
}

export function getAllPhotos(): Photo[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(KEYS.photos);
  return raw ? (JSON.parse(raw) as Photo[]) : [];
}

function saveAllPhotos(photos: Photo[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.photos, JSON.stringify(photos));
}

export function getActivePhotosForGuest(guestId: string): Photo[] {
  return getAllPhotos()
    .filter((p) => p.guestId === guestId && p.isActive)
    .sort((a, b) => a.frameNumber - b.frameNumber);
}

export function addPhoto(input: {
  guestId: string;
  guestName: string;
  dataUrl: string;
  filmId: string;
}): Photo | null {
  const settings = getSettings();
  const photos = getAllPhotos();
  const activeCount = photos.filter(
    (p) => p.guestId === input.guestId && p.isActive
  ).length;
  if (activeCount >= settings.frameLimit) return null; // roll full

  const photo: Photo = {
    id: crypto.randomUUID(),
    guestId: input.guestId,
    guestName: input.guestName,
    dataUrl: input.dataUrl,
    filmId: input.filmId,
    caption: "",
    frameNumber: activeCount + 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  photos.push(photo);
  saveAllPhotos(photos);
  return photo;
}

export function softDeletePhoto(photoId: string) {
  const photos = getAllPhotos();
  const next = photos.map((p) =>
    p.id === photoId ? { ...p, isActive: false } : p
  );
  saveAllPhotos(next);
}

export function restorePhoto(photoId: string) {
  const photos = getAllPhotos();
  const next = photos.map((p) =>
    p.id === photoId ? { ...p, isActive: true } : p
  );
  saveAllPhotos(next);
}

export function getSettings(): WeddingSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(KEYS.settings);
  return raw
    ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as WeddingSettings) }
    : DEFAULT_SETTINGS;
}

export function saveSettings(settings: WeddingSettings) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

// If a scheduled reveal time has passed, flips the album to revealed.
// Phase 1: checked client-side. Phase 2: should also be enforced server-side.
export function resolveScheduledReveal(): WeddingSettings {
  const settings = getSettings();
  if (
    settings.albumState === "locked" &&
    settings.scheduledRevealAt &&
    new Date(settings.scheduledRevealAt).getTime() <= Date.now()
  ) {
    const next: WeddingSettings = { ...settings, albumState: "revealed" };
    saveSettings(next);
    return next;
  }
  return settings;
}
