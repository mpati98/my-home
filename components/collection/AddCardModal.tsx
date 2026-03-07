"use client";
import { useState } from "react";
import type { Card } from "@/utilities/collection/theme";
import {
  CardCategory,
  SPINE_PRESETS,
  INK,
  CREAM,
  SEPIA,
  CAT_ICON,
} from "@/utilities/collection/theme";
import { mono, serif, toInputDate } from "@/utilities/collection/utility";

// ── Add Card Modal ────────────────────────────────────
export default function AddCardModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (
    data: Omit<Card, "id" | "isFavorite" | "createdAt"> & {
      createdAt?: string;
    },
  ) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    category: "Book" as CardCategory,
    content: "",
    tags: "",
    spineColor: SPINE_PRESETS[0],
    createdAt: toInputDate(new Date().toISOString()),
  });
  const [loading, setLoading] = useState(false);

  const inp: React.CSSProperties = {
    width: "100%",
    background: "#fdf8f0",
    border: "1px solid #ddd4c4",
    borderRadius: 3,
    padding: "9px 12px",
    color: INK,
    fontFamily: "'Cormorant Garant', serif",
    fontSize: 15,
    outline: "none",
  };
  const inpMono: React.CSSProperties = {
    ...inp,
    fontFamily: "'Courier Prime', monospace",
    fontSize: 12,
  };

  const submit = async () => {
    if (!form.title || !form.content) return;
    setLoading(true);
    await onAdd({
      title: form.title,
      category: form.category,
      content: form.content,
      subtitle: form.subtitle || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      spineColor: form.spineColor,
      createdAt: new Date(form.createdAt + "T12:00:00").toISOString(),
    });
    setLoading(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,22,18,0.55)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: CREAM,
          borderRadius: 4,
          padding: 32,
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(26,22,18,0.35)",
          border: "1px solid #ddd4c4",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <h2 style={serif(24, INK, 700)}>New Card</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              ...mono(18, SEPIA),
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label
              style={mono(10, SEPIA, {
                display: "block",
                marginBottom: 5,
                letterSpacing: 1,
              })}
            >
              TITLE *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Title"
              style={inp}
            />
          </div>
          <div>
            <label
              style={mono(10, SEPIA, {
                display: "block",
                marginBottom: 5,
                letterSpacing: 1,
              })}
            >
              SUBTITLE / AUTHOR / DATE
            </label>
            <input
              value={form.subtitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, subtitle: e.target.value }))
              }
              placeholder="Optional"
              style={inp}
            />
          </div>
          <div>
            <label
              style={mono(10, SEPIA, {
                display: "block",
                marginBottom: 5,
                letterSpacing: 1,
              })}
            >
              CATEGORY
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["Book", "Experience", "Collection"] as CardCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      borderRadius: 3,
                      cursor: "pointer",
                      border:
                        form.category === cat
                          ? "1.5px solid " + INK
                          : "1px solid #ddd4c4",
                      background: form.category === cat ? INK : "transparent",
                      color: form.category === cat ? CREAM : SEPIA,
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: 11,
                    }}
                  >
                    {CAT_ICON[cat]} {cat}
                  </button>
                ),
              )}
            </div>
          </div>
          <div>
            <label
              style={mono(10, SEPIA, {
                display: "block",
                marginBottom: 5,
                letterSpacing: 1,
              })}
            >
              DATE RECORDED
            </label>
            <input
              type="date"
              value={form.createdAt}
              onChange={(e) =>
                setForm((p) => ({ ...p, createdAt: e.target.value }))
              }
              style={inpMono}
            />
          </div>
          <div>
            <label
              style={mono(10, SEPIA, {
                display: "block",
                marginBottom: 5,
                letterSpacing: 1,
              })}
            >
              NOTES *
            </label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              placeholder="Your notes, quotes, observations..."
              rows={5}
              style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
            />
          </div>
          <div>
            <label
              style={mono(10, SEPIA, {
                display: "block",
                marginBottom: 5,
                letterSpacing: 1,
              })}
            >
              TAGS (comma separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="travel, 2024, fiction"
              style={inp}
            />
          </div>
          <div>
            <label
              style={mono(10, SEPIA, {
                display: "block",
                marginBottom: 8,
                letterSpacing: 1,
              })}
            >
              SPINE COLOR
            </label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SPINE_PRESETS.map((color) => (
                <div
                  key={color}
                  onClick={() => setForm((p) => ({ ...p, spineColor: color }))}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 3,
                    background: color,
                    cursor: "pointer",
                    outline:
                      form.spineColor === color
                        ? "2.5px solid " + INK
                        : "2px solid transparent",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 3,
              border: "1px solid #ddd4c4",
              background: "transparent",
              color: SEPIA,
              cursor: "pointer",
              fontFamily: "'Courier Prime', monospace",
              fontSize: 12,
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: 3,
              border: "none",
              background: INK,
              color: CREAM,
              cursor: "pointer",
              fontFamily: "'Cormorant Garant', serif",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {loading ? "Saving..." : "Add to Library"}
          </button>
        </div>
      </div>
    </div>
  );
}
