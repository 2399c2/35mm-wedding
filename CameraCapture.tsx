"use client";

import { useEffect, useRef, useState } from "react";
import { FacingMode, FilmPreset } from "@/lib/types";

function FlipIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function ShutterIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#14110E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

export default function CameraCapture({
  preset,
  disabled,
  onCapture,
}: {
  preset: FilmPreset;
  disabled: boolean;
  onCapture: (dataUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<FacingMode>("environment");
  const [started, setStarted] = useState(false);
  const [cameraLive, setCameraLive] = useState(false);
  const [flash, setFlash] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCamera(nextFacing: FacingMode) {
    setError(null);
    // stop any existing stream before requesting a new one (important for the flip)
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraLive(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: nextFacing } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraLive(true);
    } catch (e) {
      setCameraLive(false);
      setError(
        "Tidak bisa mengakses kamera. Pastikan izin kamera diaktifkan di pengaturan browser."
      );
    }
  }

  // Camera only starts after an explicit tap — this is the reliable pattern
  // on iOS Safari, which can silently block getUserMedia calls that aren't
  // tied to a user gesture.
  function handleStart() {
    setStarted(true);
    startCamera(facing);
  }

  function handleFlip() {
    const next: FacingMode = facing === "environment" ? "user" : "environment";
    setFacing(next);
    if (started) startCamera(next);
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function handleShutter() {
    if (disabled || capturing || !cameraLive || !videoRef.current) return;
    setCapturing(true);
    setFlash(true);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (facing === "user") {
        // mirror the capture to match what the guest saw in the selfie preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Deliberately NOT applying the film filter here — the original frame
      // is preserved. The filter is only ever applied at render time.
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setTimeout(() => {
        onCapture(dataUrl);
        setFlash(false);
        setCapturing(false);
      }, 150);
    } else {
      setFlash(false);
      setCapturing(false);
    }
  }

  return (
    <div className="relative flex-1 rounded-sm overflow-hidden bg-black min-h-[280px]">
      <video
        ref={videoRef}
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          filter: preset.filter,
          transform: facing === "user" ? "scaleX(-1)" : "none",
          display: cameraLive ? "block" : "none",
        }}
      />

      {!cameraLive && (
        <div
          className="w-full h-full flex items-center justify-center text-center px-6"
          style={{
            background:
              "linear-gradient(200deg,#3a3428 0%,#8c6423 40%,#1C1815 100%)",
          }}
        >
          {!started ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 rounded-sm bg-filmPaper text-filmInk text-sm font-semibold"
            >
              Nyalakan kamera
            </button>
          ) : (
            <p className="text-xs text-filmPaperDim">
              {error || "Menyambungkan kamera…"}
            </p>
          )}
        </div>
      )}

      {/* viewfinder reticle */}
      <div className="absolute inset-3 pointer-events-none">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-filmPaper/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-filmPaper/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-filmPaper/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-filmPaper/60" />
      </div>

      {/* flip button */}
      {started && (
        <button
          onClick={handleFlip}
          aria-label="Ganti kamera"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-filmDarkEdge/80 border border-filmAmberDim flex items-center justify-center text-filmAmber"
        >
          <FlipIcon />
        </button>
      )}

      {flash && <div className="absolute inset-0 bg-white" />}

      {/* shutter */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button
          onClick={handleShutter}
          disabled={disabled || !cameraLive || capturing}
          className="w-16 h-16 rounded-full bg-filmPaper border-4 flex items-center justify-center disabled:opacity-50"
          style={{
            borderColor: disabled ? "#B7AE9A" : "#E8A33D",
          }}
        >
          <ShutterIcon />
        </button>
      </div>
    </div>
  );
}
