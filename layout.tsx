import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kamera Foto Tamu — Dhani & Firda",
  description: "Kamera film digital untuk tamu pernikahan Dhani & Firda",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-filmDarkEdge flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
