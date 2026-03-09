export type CardCategory = "Book" | "Experience" | "Collection";

export type Card = {
  id: string;
  title: string;
  subtitle: string | null;
  category: CardCategory;
  content: string;
  tags: string[];
  spineColor: string;
  isFavorite: boolean;
  createdAt: string;
};

// ── Card Form (shared by Add & Edit) ─────────────────
export type CardFormData = {
  title: string; subtitle: string; category: CardCategory;
  content: string; tags: string; spineColor: string; createdAt: string;
};

// ── Design tokens ───────────────────────────────────
export const CREAM = "#f5f0e8";
export const INK = "#1a1612";
export const SEPIA = "#7a6a56";
export const GOLD  = "#c9a96e";
export const RED = "#c0392b";

export const CAT_ICON: Record<CardCategory, string> = {
  Book: "◎",
  Experience: "◈",
  Collection: "◇",
};

export const CAT_LABEL: Record<CardCategory, string> = {
  Book: "Book",
  Experience: "Experience",
  Collection: "Collection",
};

export const SPINE_PRESETS = [
  "#8b4513",
  "#2d6a4f",
  "#4a4e69",
  "#c77dff",
  "#e07a5f",
  "#f4a261",
  "#264653",
  "#d4a373",
  "#c9a96e",
  "#b5838d",
  "#457b9d",
  "#6d6875",
];


// ── Shared input style ────────────────────────────────
export const INP = "w-full bg-[#1e2128] border border-[#1e2128] rounded-sm px-3 py-2.5 text-[#e8e3d5] outline-none font-[Cormorant_Garant,serif] text-[15px] focus:border-[#a3c47a] transition-colors";
export const INP_MONO = "w-full bg-[#1e2128] border border-[#1e2128] rounded-sm px-3 py-2.5 text-[#e8e3d5] outline-none font-[Courier_Prime,monospace] text-xs focus:border-[#a3c47a] transition-colors";
