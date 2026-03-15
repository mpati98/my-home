export type Reference = { type: string; title: string; author: string; note?: string; url?: string };
export type LearnWord = {
  id: string; word: string; type: string; phonetic: string | null;
  partOfSpeech: string | null; meaning: string; description: string;
  examples: string[]; etymology: string | null; references: Reference[];
  tags: string[]; isSaved: boolean; dailyDate: string | null; createdAt: string;subCardId: string;topicId: string;
};

export const ACCENT = "#f472b6";
export const ACCENT2 = "#fb7185";

export const REF_ICON: Record<string, string> = {
  book: "📚", newsletter: "📰", article: "✍", podcast: "🎙", other: "🔗",
};
export const TYPE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  word:       { bg: "#f472b618", color: "#f472b6", border: "#f472b644" },
  phrase:     { bg: "#7dd3fc18", color: "#7dd3fc", border: "#7dd3fc44" },
  idiom:      { bg: "#fbbf2418", color: "#fbbf24", border: "#fbbf2444" },
  expression: { bg: "#a78bfa18", color: "#a78bfa", border: "#a78bfa44" },
};