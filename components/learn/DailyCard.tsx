import {
  LearnWord,
  TYPE_STYLE,
  ACCENT,
  ACCENT2,
  REF_ICON,
} from "@/utilities/learn/theme";
import { useVoice } from "@/utilities/learn/utility";
import { fmtDate } from "@/utilities/workspace/utility";
import { useState } from "react";

// ── Main word card ────────────────────────────────────
export default function DailyCard({
  word,
  onSave,
  onRegenerate,
  loading,
}: {
  word: LearnWord;
  onSave: (id: string, val: boolean) => void;
  onRegenerate: () => void;
  loading: boolean;
}) {
  const [tab, setTab] = useState<
    "meaning" | "examples" | "etymology" | "references"
  >("meaning");
  const { speak, stop, speaking, supported } = useVoice(word.word);
  const ts = TYPE_STYLE[word.type] ?? TYPE_STYLE.word;

  const TABS = [
    { key: "meaning", label: "Meaning" },
    { key: "examples", label: "Examples" },
    { key: "etymology", label: "Etymology" },
    { key: "references", label: "References" },
  ] as const;

  return (
    <div className="rounded-2xl overflow-hidden border border-[#2a2d35] bg-[#16181d] shadow-2xl">
      {/* Top bar */}
      <div
        className="h-1"
        style={{
          background: `linear-gradient(90deg,${ACCENT},${ACCENT2},#a78bfa)`,
        }}
      />

      <div className="p-6 sm:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            {/* Type + part of speech */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="font-mono text-[10px] px-2.5 py-1 rounded-full border tracking-widest"
                style={{
                  color: ts.color,
                  background: ts.bg,
                  borderColor: ts.border,
                }}
              >
                {word.type.toUpperCase()}
              </span>
              {word.partOfSpeech && (
                <span className="font-mono text-[10px] text-[#4b5563] border border-[#2a2d35] px-2.5 py-1 rounded-full">
                  {word.partOfSpeech}
                </span>
              )}
              {word.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] text-[#374151] bg-[#1a1d24] px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Word */}
            <h1
              className="text-3xl sm:text-5xl font-bold text-[#e8e3d5] leading-none mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "-0.02em",
              }}
            >
              {word.word}
            </h1>

            {/* Phonetic + voice */}
            <div className="flex items-center gap-3 mt-2">
              {word.phonetic && (
                <span className="font-mono text-[13px] text-[#6b7280]">
                  {word.phonetic}
                </span>
              )}
              {supported && (
                <button
                  onClick={speaking ? stop : speak}
                  title={speaking ? "Stop" : "Listen to pronunciation"}
                  className="flex items-center gap-1.5 font-mono text-[10px] px-3 py-1.5 rounded-full border cursor-pointer transition-all"
                  style={{
                    background: speaking ? ACCENT + "22" : "transparent",
                    borderColor: speaking ? ACCENT : "#2a2d35",
                    color: speaking ? ACCENT : "#4b5563",
                  }}
                >
                  <span className="text-sm">{speaking ? "■" : "▶"}</span>
                  {speaking ? "STOP" : "LISTEN"}
                </button>
              )}
            </div>
          </div>

          {/* Save + regen */}
          <div className="flex flex-col gap-2 shrink-0 items-end">
            <button
              onClick={() => onSave(word.id, !word.isSaved)}
              title={word.isSaved ? "Unsave" : "Save to collection"}
              className="w-9 h-9 rounded-xl border cursor-pointer flex items-center justify-center transition-all text-base"
              style={{
                background: word.isSaved ? ACCENT + "22" : "#1a1d24",
                borderColor: word.isSaved ? ACCENT + "66" : "#2a2d35",
                color: word.isSaved ? ACCENT : "#4b5563",
              }}
            >
              {word.isSaved ? "★" : "☆"}
            </button>
            <button
              onClick={onRegenerate}
              disabled={loading}
              title="Generate a new word"
              className="w-9 h-9 rounded-xl border border-[#2a2d35] bg-[#1a1d24] cursor-pointer flex items-center justify-center text-[#4b5563] hover:text-[#9ca3af] hover:border-[#374151] transition-all disabled:opacity-50 text-sm"
            >
              {loading ? "…" : "↻"}
            </button>
          </div>
        </div>

        {/* Quick meaning always visible */}
        <div
          className="bg-[#111214] rounded-xl px-4 py-3 mb-5 border-l-2"
          style={{ borderColor: ACCENT }}
        >
          <p className="font-mono text-[13px] text-[#c9c4b8] leading-relaxed italic">
            {word.meaning}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-[#111214] rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="font-mono text-[10px] px-3 py-1.5 rounded-lg border-none cursor-pointer tracking-widest transition-all duration-150"
              style={{
                background: tab === t.key ? ACCENT : "transparent",
                color: tab === t.key ? "#111" : "#4b5563",
                fontWeight: tab === t.key ? 700 : 400,
              }}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-30">
          {tab === "meaning" && (
            <p className="font-mono text-[13px] text-[#9ca3af] leading-relaxed">
              {word.description}
            </p>
          )}

          {tab === "examples" && (
            <div className="flex flex-col gap-3">
              {word.examples.map((ex, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="font-mono text-[10px] text-[#f472b655] mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="font-mono text-[13px] text-[#9ca3af] leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{
                      __html: ex.replace(
                        new RegExp(
                          word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                          "gi",
                        ),
                        (m) =>
                          `<span style="color:${ACCENT};font-style:italic">${m}</span>`,
                      ),
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "etymology" && (
            <div>
              {word.etymology ? (
                <p className="font-mono text-[13px] text-[#9ca3af] leading-relaxed">
                  {word.etymology}
                </p>
              ) : (
                <p className="font-mono text-[12px] text-[#374151]">
                  Etymology not available for this entry.
                </p>
              )}
            </div>
          )}

          {tab === "references" && (
            <div className="flex flex-col gap-3">
              {word.references.length > 0 ? (
                word.references.map((ref, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start p-3 rounded-xl bg-[#111214] border border-[#1e2128] hover:border-[#2a2d35] transition-colors"
                  >
                    <span className="text-lg shrink-0 mt-0.5">
                      {REF_ICON[ref.type] ?? REF_ICON.other}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1a1d24] text-[#4b5563] tracking-widest">
                          {ref.type.toUpperCase()}
                        </span>
                        <span className="font-mono text-[12px] text-[#e8e3d5] font-semibold">
                          {ref.title}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-[#6b7280] mb-1">
                        by {ref.author}
                      </p>
                      {ref.note && (
                        <p className="font-mono text-[11px] text-[#4b5563] leading-relaxed">
                          {ref.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-mono text-[12px] text-[#374151]">
                  No references for this entry.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#1e2128] flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] text-[#374151]">
              Daily word · {fmtDate(word.createdAt)}
            </span>
            {word.subCardId && (
              <a
                href="/collection"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full border transition-colors no-underline"
                style={{
                  color: "#a78bfa",
                  background: "#a78bfa18",
                  borderColor: "#a78bfa44",
                }}
              >
                <span>◈</span> In Collection
              </a>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {word.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] text-[#4b5563] bg-[#1a1d24] border border-[#2a2d35] px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
