export default function Sprocket({ flip }: { flip?: boolean }) {
  return (
    <div
      className={`flex justify-between px-3 bg-filmDarkEdge ${
        flip ? "scale-y-[-1]" : ""
      }`}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="w-2 h-2 my-1.5 rounded-[2px] bg-filmDark" />
      ))}
    </div>
  );
}
