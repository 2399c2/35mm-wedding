"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/camera", label: "Kamera" },
  { href: "/roll", label: "Rol Saya" },
  { href: "/gallery", label: "Galeri" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="flex border-t border-[#2a2520]">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 text-center py-3 text-xs font-mono uppercase tracking-wider ${
              active ? "text-filmAmber" : "text-filmPaperDim"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
