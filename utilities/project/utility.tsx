import { useState, useEffect } from "react";
import { COLOR_PRESETS } from "./theme";

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
export function toInput(iso?: string | null) {
  return iso ? iso.slice(0, 10) : "";
}

// ── AnimatedBar ───────────────────────────────────────
export function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="bg-[#1e2128] rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: w + "%",
          background: color,
          boxShadow: `0 0 8px ${color}55`,
        }}
      />
    </div>
  );
}

// ── Color picker ──────────────────────────────────────
export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {COLOR_PRESETS.map((c) => (
        <div
          key={c}
          onClick={() => onChange(c)}
          className="w-6 h-6 rounded-md cursor-pointer transition-all"
          style={{
            background: c,
            outline:
              value === c ? "2.5px solid #e8e3d5" : "2px solid transparent",
            outlineOffset: 2,
          }}
        />
      ))}
    </div>
  );
}
