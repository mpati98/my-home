import { useState, useRef, useEffect } from "react";
import { toInputDate } from "@/utilities/collection/utility";
import { INK } from "@/utilities/collection/theme";
import { mono, fmtFull } from "@/utilities/collection/utility";
// ── Inline DateEditor (back of card) ────────────────
export default function DateEditor({
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

  if (editing) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: 5 }}
        onClick={(e) => e.stopPropagation()}
      >
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
          style={{
            background: "#fdf8f0",
            border: "1px solid #c9a96e",
            borderRadius: 3,
            padding: "2px 6px",
            fontSize: 10,
            color: INK,
            fontFamily: "'Courier Prime', monospace",
            outline: "none",
          }}
        />
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title="Click to edit date"
      style={{
        background: "none",
        border: "none",
        cursor: "text",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 4,
        ...mono(10, "#b0a090"),
      }}
    >
      <span style={{ fontSize: 9, opacity: 0.6 }}>✎</span>
      {fmtFull(iso)}
    </button>
  );
}
