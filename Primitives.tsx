export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-filmAmber mb-2">
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 rounded-sm font-semibold text-[15px] text-filmInk transition-opacity ${
        disabled ? "bg-filmPaperDim opacity-50" : "bg-filmAmber"
      }`}
    >
      {children}
    </button>
  );
}

export function FrameCounter({
  remaining,
  total,
}: {
  remaining: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-sm bg-filmDarkEdge border border-filmAmberDim">
      <div className="w-1.5 h-1.5 rounded-full bg-filmSafety shadow-[0_0_6px_#C4432E]" />
      <span className="font-mono text-sm tracking-widest text-filmAmber [text-shadow:0_0_8px_#8C6423]">
        {String(Math.max(remaining, 0)).padStart(2, "0")}/{total}
      </span>
    </div>
  );
}
