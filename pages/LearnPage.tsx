"use client";

import DailyCard from "@/components/learn/DailyCard";
import HistoryCard from "@/components/learn/HistoryCard";
import { LearnWord, ACCENT } from "@/utilities/learn/theme";
import { TopicInput, LoadingSkeleton } from "@/utilities/learn/utility";
import { useState, useRef } from "react";

// ── Main Page ─────────────────────────────────────────
export default function LearnPage({
  initialDaily,
  initialHistory,
}: {
  initialDaily: LearnWord | null;
  initialHistory: LearnWord[];
}) {
  const [daily, setDaily] = useState<LearnWord | null>(initialDaily);
  const [history, setHistory] = useState<LearnWord[]>(initialHistory || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"daily" | "saved" | "history">("daily");
  const [showTopic, setShowTopic] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  async function generate(topic = "", force = false) {
    setLoading(true);
    setError(null);
    setTab("daily");
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const res = await fetch("/api/learn/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, force }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const word: LearnWord = await res.json();
      // merge _topicId into topicId if present
      if ((word as any)._topicId) word.topicId = (word as any)._topicId;
      setDaily(word);
      // Add to history if not already there
      setHistory((prev) => {
        if (prev.some((w) => w.id === word.id)) return prev;
        return [word, ...prev];
      });
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    }
    setLoading(false);
  }

  async function handleSave(id: string, val: boolean) {
    const res = await fetch("/api/learn/save", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isSaved: val }),
    });
    if (res.ok) {
      const updated: LearnWord = await res.json();
      setHistory((prev) => prev.map((w) => (w.id === id ? updated : w)));
      if (daily?.id === id) setDaily(updated);
    }
  }

  const saved = history.filter((w) => w.isSaved);
  const allHist = history.filter((w) => w.id !== daily?.id);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .streak-glow { box-shadow: 0 0 20px ${ACCENT}33, 0 0 40px ${ACCENT}18; }
      `}</style>

      <div
        ref={topRef}
        className="min-h-screen bg-[#111214] px-4 py-7 sm:px-8 sm:py-9 mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <div className="font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
              WORKSPACE
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#e8e3d5] leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Daily Learn
            </h1>
            <p className="font-mono text-[11px] text-[#4b5563] mt-1.5">
              {history.length} {history.length === 1 ? "word" : "words"} learned
              · {saved.length} saved
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowTopic((t) => !t)}
              className="font-mono text-[10px] px-3.5 py-2 rounded-xl border border-[#2a2d35] bg-[#16181d] text-[#6b7280] cursor-pointer hover:border-[#374151] hover:text-[#9ca3af] transition-all tracking-widest"
            >
              {showTopic ? "HIDE ↑" : "BY TOPIC ↓"}
            </button>
            <button
              onClick={() => generate("", true)}
              disabled={loading}
              className="font-mono text-[10px] px-4 py-2 rounded-xl border-none cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-50 text-[#111] font-semibold tracking-widest flex items-center gap-2"
              style={{ background: ACCENT }}
            >
              <span className={loading ? "inline-block animate-spin" : ""}>
                ⚄
              </span>
              {loading ? "LOADING…" : "RANDOM WORD"}
            </button>
          </div>
        </div>

        {/* Topic input */}
        {showTopic && (
          <div className="mb-5 fade-up">
            <TopicInput
              onGenerate={(topic) => {
                generate(topic, true);
                setShowTopic(false);
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 bg-[#f8717118] border border-[#f8717144] rounded-xl px-4 py-3 font-mono text-[11px] text-[#f87171]">
            {error} — check your API connection and try again.
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-[#16181d] rounded-xl p-1 w-fit border border-[#1e2128]">
          {(
            [
              { key: "daily", label: "TODAY", count: null },
              { key: "saved", label: "SAVED", count: saved.length },
              { key: "history", label: "HISTORY", count: allHist.length },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="font-mono text-[10px] px-4 py-2 rounded-lg border-none cursor-pointer tracking-widest transition-all duration-150 flex items-center gap-1.5"
              style={{
                background: tab === t.key ? ACCENT : "transparent",
                color: tab === t.key ? "#111" : "#4b5563",
                fontWeight: tab === t.key ? 700 : 400,
              }}
            >
              {t.label}
              {t.count !== null && (
                <span className="text-[9px] opacity-70">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TODAY tab ── */}
        {tab === "daily" && (
          <div className="fade-up">
            {loading ? (
              <LoadingSkeleton />
            ) : daily ? (
              <DailyCard
                word={daily}
                onSave={handleSave}
                onRegenerate={() => generate("", true)}
                loading={loading}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-[#2a2d35] bg-[#16181d] p-12 text-center">
                <div className="text-4xl mb-4" style={{ color: ACCENT + "66" }}>
                  ✦
                </div>
                <p className="font-mono text-[13px] text-[#374151] mb-5">
                  No word for today yet.
                </p>
                <button
                  onClick={() => generate()}
                  disabled={loading}
                  className="font-mono text-[11px] font-semibold px-6 py-3 rounded-xl border-none cursor-pointer hover:opacity-85 transition-opacity text-[#111]"
                  style={{ background: ACCENT }}
                >
                  {loading ? "LOADING…" : "PICK TODAY\'S WORD"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SAVED tab ── */}
        {tab === "saved" && (
          <div className="fade-up">
            {saved.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {saved.map((w, i) => (
                  <div
                    key={w.id}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    className="fade-up"
                  >
                    <HistoryCard word={w} onSave={handleSave} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-mono text-[13px] text-[#374151]">
                  No saved words yet.
                </p>
                <p className="font-mono text-[11px] text-[#2a2d35] mt-1">
                  Star a word to save it here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY tab ── */}
        {tab === "history" && (
          <div className="fade-up">
            {allHist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allHist.map((w, i) => (
                  <div
                    key={w.id}
                    style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
                    className="fade-up"
                  >
                    <HistoryCard word={w} onSave={handleSave} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-mono text-[13px] text-[#374151]">
                  No history yet.
                </p>
                <p className="font-mono text-[11px] text-[#2a2d35] mt-1">
                  Pick a random word to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
