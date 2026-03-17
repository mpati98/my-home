"use client";

import { useState } from "react";
import {
  Card,
  CardCategory,
  CardFormData,
  CAT_ICON,
  CREAM,
  INK,
  INP,
  INP_MONO,
  RED,
  SEPIA,
  SPINE_PRESETS,
} from "./theme";
import { Label, toInputDate } from "./utility";

// ── DeleteModal ───────────────────────────────────────
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
      className="fixed inset-0 bg-[#1a1612]/60 z-60 flex items-center justify-center p-5"
      onClick={onCancel}
    >
      <div
        className="bg-[#16181d] rounded-sm p-7 w-full max-w-sm border border-[#1e2128] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 rounded-sm mb-6"
          style={{ background: card.spineColor }}
        />
        <h3 className="font-[Cormorant_Garant,serif] text-[22px] font-bold text-[#e8e3d5] mb-2">
          Remove this card?
        </h3>
        <p className="font-[Cormorant_Garant,serif] text-[15px] font-semibold text-[#e8e3d5] mb-1">
          {card.title}
        </p>
        <p className="font-[Courier_Prime,monospace] text-[11px] text-[#4b5563] mb-6 leading-relaxed">
          This will permanently delete the card and all its notes. This cannot
          be undone.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onCancel}
            className="py-2.5 rounded-sm border border-[#1e2128] bg-transparent text-[#4b5563] cursor-pointer font-[Courier_Prime,monospace] text-xs hover:bg-[#1e2128] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 rounded-sm border-none cursor-pointer font-[Cormorant_Garant,serif] text-[15px] font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: RED }}
          >
            Delete card
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Category & Color pickers ──────────────────────────
export function CategoryPicker({
  value,
  onChange,
}: {
  value: CardCategory;
  onChange: (c: CardCategory) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(["Book", "Experience", "Collection"] as CardCategory[]).map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className="py-2 px-1 rounded-sm cursor-pointer font-[Courier_Prime,monospace] text-[11px] transition-all"
          style={{
            border: value === cat ? "1.5px solid " + INK : "1px solid #1e2128",
            background: value === cat ? INK : "transparent",
            color: value === cat ? CREAM : "#4b5563",
          }}
        >
          {CAT_ICON[cat]} {cat}
        </button>
      ))}
    </div>
  );
}
export function SpineColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {SPINE_PRESETS.map((color) => (
        <div
          key={color}
          onClick={() => onChange(color)}
          className="w-6 h-6 rounded-sm cursor-pointer transition-all"
          style={{
            background: color,
            outline:
              value === color ? "2.5px solid #e8e3d5" : "2px solid transparent",
            outlineOffset: 2,
          }}
        />
      ))}
    </div>
  );
}

export function CardFormFields({
  form,
  setForm,
}: {
  form: CardFormData;
  setForm: (fn: (p: CardFormData) => CardFormData) => void;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <Label>TITLE *</Label>
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Title"
          className={INP}
        />
      </div>
      <div>
        <Label>SUBTITLE / AUTHOR</Label>
        <input
          value={form.subtitle}
          onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
          placeholder="Optional"
          className={INP}
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
          className={INP_MONO}
        />
      </div>
      <div>
        <Label>NOTES *</Label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="Your notes, quotes, observations..."
          rows={5}
          className={INP + " resize-y leading-relaxed"}
        />
      </div>
      <div>
        <Label>TAGS (comma separated)</Label>
        <input
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
          placeholder="travel, 2024, fiction"
          className={INP}
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

// ── Modal Shell ───────────────────────────────────────
export function CardModal({
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
      className="fixed inset-0 bg-[#1a1612]/55 z-50 flex items-center justify-center p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#16181d] rounded-sm w-full max-w-md my-auto border border-[#1e2128] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {accentColor && (
          <div
            className="h-1 rounded-t-sm"
            style={{ background: accentColor }}
          />
        )}
        <div className="p-7 sm:p-8">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="font-[Cormorant_Garant,serif] text-2xl font-bold text-[#e8e3d5]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none cursor-pointer font-[Courier_Prime,monospace] text-lg text-[#4b5563] hover:text-[#e8e3d5] transition-colors"
            >
              ×
            </button>
          </div>
          {children}
          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <button
              onClick={onClose}
              className="py-2.5 rounded-sm border border-[#1e2128] bg-transparent text-[#4b5563] cursor-pointer font-[Courier_Prime,monospace] text-xs hover:bg-[#1e2128] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="py-2.5 rounded-sm border-none bg-[#a3c47a] text-[#111] cursor-pointer font-[Cormorant_Garant,serif] text-[15px] font-semibold hover:opacity-85 transition-opacity disabled:opacity-60"
            >
              {loading ? "Saving…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
