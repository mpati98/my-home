import {
  LearnWord,
  TYPE_STYLE,
  ACCENT,
  REF_ICON,
} from "@/utilities/learn/theme";
import { useVoice } from "@/utilities/learn/utility";
import { fmtDate } from "@/utilities/workspace/utility";
import { useState } from "react";

// ── History card ──────────────────────────────────────
export default function HistoryCard({
  word,
  onSave,
}: {
  word: LearnWord;
  onSave: (id: string, val: boolean) => void;
}) {
  const [exp, setExp] = useState(false);
  const { speak, speaking } = useVoice(word.word);
  const ts = TYPE_STYLE[word.type] ?? TYPE_STYLE.word;

  return (
    <div className="bg-[#16181d] rounded-xl border border-[#2a2d35] overflow-hidden hover:border-[#374151] transition-all duration-200">
      <div className="h-0.5" style={{ background: ts.color + "99" }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span
                className="font-mono text-[9px] px-2 py-0.5 rounded-full border"
                style={{
                  color: ts.color,
                  background: ts.bg,
                  borderColor: ts.border,
                }}
              >
                {word.type.toUpperCase()}
              </span>
              {word.partOfSpeech && (
                <span className="font-mono text-[9px] text-[#374151]">
                  {word.partOfSpeech}
                </span>
              )}
            </div>
            <h3
              className="font-bold text-[#e8e3d5] text-base leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {word.word}
            </h3>
            {word.phonetic && (
              <p className="font-mono text-[10px] text-[#4b5563] mt-0.5">
                {word.phonetic}
              </p>
            )}
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => speak()}
              title="Listen"
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border border-[#2a2d35] cursor-pointer text-xs transition-colors"
              style={{
                color: speaking ? ACCENT : "#4b5563",
                borderColor: speaking ? ACCENT + "44" : "#2a2d35",
              }}
            >
              ▶
            </button>
            <button
              onClick={() => onSave(word.id, !word.isSaved)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border border-[#2a2d35] cursor-pointer text-xs transition-colors"
              style={{
                color: word.isSaved ? ACCENT : "#4b5563",
                borderColor: word.isSaved ? ACCENT + "44" : "#2a2d35",
              }}
            >
              {word.isSaved ? "★" : "☆"}
            </button>
          </div>
        </div>

        <p className="font-mono text-[11px] text-[#6b7280] leading-relaxed mb-2 line-clamp-2">
          {word.meaning}
        </p>

        <button
          onClick={() => setExp((e) => !e)}
          className="font-mono text-[9px] text-[#374151] bg-transparent border-none cursor-pointer hover:text-[#6b7280] transition-colors p-0 tracking-widest"
        >
          {exp ? "SHOW LESS ↑" : "READ MORE ↓"}
        </button>

        {exp && (
          <div className="mt-3 pt-3 border-t border-[#1e2128]">
            <p className="font-mono text-[11px] text-[#6b7280] leading-relaxed mb-3">
              {word.description}
            </p>
            {word.examples[0] && (
              <div
                className="bg-[#111214] rounded-lg px-3 py-2 border-l-2 mb-2"
                style={{ borderColor: ts.color + "66" }}
              >
                <p className="font-mono text-[11px] text-[#4b5563] italic leading-relaxed">
                  {word.examples[0]}
                </p>
              </div>
            )}
            {word.references.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <span className="font-mono text-[9px] text-[#374151]">
                  See in:
                </span>
                {word.references.map((r, i) => (
                  <span
                    key={i}
                    className="font-mono text-[9px] text-[#4b5563] bg-[#1a1d24] px-1.5 py-0.5 rounded"
                  >
                    {REF_ICON[r.type]} {r.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between flex-wrap gap-1">
          <span className="font-mono text-[9px] text-[#2a2d35]">
            {fmtDate(word.createdAt)}
          </span>
          <div className="flex items-center gap-1.5">
            {word.dailyDate && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[#f472b618] text-[#f472b6]">
                daily
              </span>
            )}
            {word.subCardId && (
              <a
                href="/collection"
                className="font-mono text-[9px] px-1.5 py-0.5 rounded-full no-underline"
                style={{ background: "#a78bfa18", color: "#a78bfa" }}
              >
                ◈ saved
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
