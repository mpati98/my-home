import { useState, useRef, useEffect } from "react";
import { toInputDate } from "@/utilities/library/utility";

import { fmtFull } from "@/utilities/library/utility";
// ── DateEditor ────────────────────────────────────────
export function DateEditor({
  iso,
  cardId,
  onUpdate,
}: {
  iso: string;
  cardId: string;
  onUpdate: (id: string, newIso: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(toInputDate(iso));
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = async () => {
    setEditing(false);
    if (!value) return;
    const newIso = new Date(value + "T12:00:00").toISOString();
    onUpdate(cardId, newIso);
    await fetch("/api/cards/" + cardId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ createdAt: newIso }),
    });
  };

  if (editing)
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="bg-[#1e2128] border border-[#a3c47a] rounded px-1.5 py-0.5 text-[10px] text-[#e8e3d5] font-[Courier_Prime,monospace] outline-none"
        />
      </div>
    );

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      className="flex items-center gap-1 bg-transparent border-none cursor-text font-[Courier_Prime,monospace] text-[10px] text-[#4b5563] hover:text-[#e8e3d5] transition-colors p-0"
    >
      <span className="text-[9px] opacity-60">✎</span>
      {fmtFull(iso)}
    </button>
  );
}
