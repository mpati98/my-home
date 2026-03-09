export function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
export function fmtFull(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
export function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
export function toInputDate(iso: string) {
  return iso.slice(0, 10);
}
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-[Courier_Prime,monospace] text-[10px] text-[#4b5563] tracking-widest mb-1.5">
      {children}
    </label>
  );
}
