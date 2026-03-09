

export type SubCard = {
  id: string; title: string; description: string;
  createdAt: string; updatedAt: string; topicId: string;
};
export type Topic = {
  id: string; title: string; category: string; description: string;
  coverColor: string; createdAt: string; updatedAt: string;
  subCards: SubCard[];
};

export const COVER_PRESETS = [
  "#4a6fa5","#2d6a4f","#6d3b8e","#b5451b",
  "#1a6b7c","#7a4f2d","#3d5a80","#5c4a72",
  "#2e6b4a","#8e3b5a","#4a5568","#6b5a2e",
];

export const CATEGORIES = ["Research","Design","Development","Strategy","Personal","Other"];

// ── Shared input style (dark workspace theme) ─────────
export const INP = `w-full bg-[#1a1d24] border border-[#2a2d35] rounded-lg px-3 py-2.5
  text-[#e8e3d5] font-mono text-xs outline-none focus:border-[#a78bfa] transition-colors
  placeholder:text-[#4b5563]`;
export const TEXTAREA = `w-full bg-[#1a1d24] border border-[#2a2d35] rounded-lg px-3 py-2.5
  text-[#e8e3d5] font-mono text-xs outline-none focus:border-[#a78bfa] transition-colors
  placeholder:text-[#4b5563] resize-y leading-relaxed`;
