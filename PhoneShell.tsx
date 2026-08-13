import Sprocket from "./Sprocket";

export default function PhoneShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-2xl bg-filmDark border border-[#2a2520]">
      <Sprocket />
      <div className="min-h-[560px] flex flex-col">{children}</div>
      <Sprocket flip />
    </div>
  );
}
