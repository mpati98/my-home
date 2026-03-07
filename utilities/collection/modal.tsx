import { useState } from "react";

import { INK, SEPIA, CREAM, CAT_ICON, SPINE_PRESETS, RED } from "./theme";
import { mono, serif, Label, toInputDate, inp, inpMono } from "./utility";
import type { CardFormData, CardCategory, Card } from "./theme";

// ── CategoryPicker ───────────────────────────────────
function CategoryPicker({
  value,
  onChange,
}: {
  value: CardCategory;
  onChange: (c: CardCategory) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {(["Book", "Experience", "Collection"] as CardCategory[]).map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            flex: 1,
            padding: "8px 4px",
            borderRadius: 3,
            cursor: "pointer",
            border: value === cat ? "1.5px solid " + INK : "1px solid #ddd4c4",
            background: value === cat ? INK : "transparent",
            color: value === cat ? CREAM : SEPIA,
            fontFamily: "'Courier Prime', monospace",
            fontSize: 11,
          }}
        >
          {CAT_ICON[cat]} {cat}
        </button>
      ))}
    </div>
  );
}

// ── SpineColorPicker ─────────────────────────────────
function SpineColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {SPINE_PRESETS.map((color) => (
        <div
          key={color}
          onClick={() => onChange(color)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 3,
            background: color,
            cursor: "pointer",
            outline:
              value === color ? "2.5px solid " + INK : "2px solid transparent",
            outlineOffset: 2,
            transition: "outline 0.1s",
          }}
        />
      ))}
    </div>
  );
}

function CardFormFields({
  form,
  setForm,
}: {
  form: CardFormData;
  setForm: (fn: (p: CardFormData) => CardFormData) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <Label>TITLE *</Label>
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Title"
          style={inp()}
        />
      </div>
      <div>
        <Label>SUBTITLE / AUTHOR / DATE</Label>
        <input
          value={form.subtitle}
          onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
          placeholder="Optional"
          style={inp()}
        />
      </div>
      <div>
        <Label>CATEGORY</Label>
        <CategoryPicker
          value={form.category}
          onChange={(cat) => setForm((p) => ({ ...p, category: cat }))}
        />
      </div>
      <div>
        <Label>DATE RECORDED</Label>
        <input
          type="date"
          value={form.createdAt}
          onChange={(e) =>
            setForm((p) => ({ ...p, createdAt: e.target.value }))
          }
          style={inpMono()}
        />
      </div>
      <div>
        <Label>NOTES *</Label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="Your notes, quotes, observations..."
          rows={5}
          style={{ ...inp(), resize: "vertical", lineHeight: 1.6 }}
        />
      </div>
      <div>
        <Label>TAGS (comma separated)</Label>
        <input
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
          placeholder="travel, 2024, fiction"
          style={inp()}
        />
      </div>
      <div>
        <Label>SPINE COLOR</Label>
        <SpineColorPicker
          value={form.spineColor}
          onChange={(color) => setForm((p) => ({ ...p, spineColor: color }))}
        />
      </div>
    </div>
  );
}

// ── Shared Modal Shell ────────────────────────────────
function CardModal({
  title,
  onClose,
  onSubmit,
  loading,
  submitLabel,
  accentColor,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  submitLabel: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
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
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(26,22,18,0.35)",
          border: "1px solid #ddd4c4",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {accentColor && (
          <div
            style={{
              height: 4,
              background: accentColor,
              borderRadius: "4px 4px 0 0",
            }}
          />
        )}
        <div style={{ padding: "28px 32px 32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 24,
            }}
          >
            <h2 style={serif(24, INK, 700)}>{title}</h2>
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
          {children}
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
              onClick={onSubmit}
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
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Saving…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add Card Modal ────────────────────────────────────
export function AddCardModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: Partial<Card> & { createdAt?: string }) => Promise<void>;
}) {
  const [form, setForm] = useState<CardFormData>({
    title: "",
    subtitle: "",
    category: "Book",
    content: "",
    tags: "",
    spineColor: SPINE_PRESETS[0],
    createdAt: toInputDate(new Date().toISOString()),
  });
  const [loading, setLoading] = useState(false);

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
    <CardModal
      title="New Card"
      onClose={onClose}
      onSubmit={submit}
      loading={loading}
      submitLabel="Add to Library"
    >
      <CardFormFields form={form} setForm={setForm} />
    </CardModal>
  );
}

// ── Edit Card Modal ───────────────────────────────────
export function EditCardModal({
  card,
  onClose,
  onSave,
}: {
  card: Card;
  onClose: () => void;
  onSave: (id: string, data: Partial<Card>) => Promise<void>;
}) {
  const [form, setForm] = useState<CardFormData>({
    title: card.title,
    subtitle: card.subtitle ?? "",
    category: card.category,
    content: card.content,
    tags: card.tags.join(", "),
    spineColor: card.spineColor,
    createdAt: toInputDate(card.createdAt),
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.title || !form.content) return;
    setLoading(true);
    await onSave(card.id, {
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
    <CardModal
      title="Edit Card"
      onClose={onClose}
      onSubmit={submit}
      loading={loading}
      submitLabel="Save changes"
      accentColor={card.spineColor}
    >
      <CardFormFields form={form} setForm={setForm} />
    </CardModal>
  );
}

// ── Delete Confirm Modal ─────────────────────────────
export function DeleteModal({
  card,
  onConfirm,
  onCancel,
}: {
  card: Card;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,22,18,0.6)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: CREAM,
          borderRadius: 4,
          padding: "32px 32px 28px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 24px 60px rgba(26,22,18,0.35)",
          border: "1px solid #ddd4c4",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spine accent */}
        <div
          style={{
            height: 4,
            background: card.spineColor,
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        <h3 style={serif(22, INK, 700, { marginBottom: 8 })}>
          Remove this card?
        </h3>
        <p style={mono(12, SEPIA, { lineHeight: 1.6, marginBottom: 6 })}>
          <strong
            style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 15 }}
          >
            {card.title}
          </strong>
        </p>
        <p style={mono(11, "#b0a090", { marginBottom: 24 })}>
          This will permanently delete the card and all its notes. This action
          cannot be undone.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
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
            onClick={onConfirm}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: 3,
              border: "none",
              background: RED,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "'Cormorant Garant', serif",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Delete card
          </button>
        </div>
      </div>
    </div>
  );
}
