import { useEffect, useState } from "react";
import { ACCENT } from "./theme";

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Voice / TTS ───────────────────────────────────────
export function useVoice(text: string) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  function speak() {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.85;
    utt.pitch = 1;
    utt.volume = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }
  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  return { speak, stop, speaking, supported };
}

// ── Topic input ───────────────────────────────────────
export function TopicInput({
  onGenerate,
}: {
  onGenerate: (topic: string) => void;
}) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (onGenerate(val), setVal(""))}
        placeholder="Optional topic (e.g. Japanese, business, philosophy…)"
        className="flex-1 bg-[#1a1d24] border border-[#2a2d35] rounded-xl px-4 py-2.5 text-[#e8e3d5] font-mono text-xs outline-none focus:border-[#f472b6] transition-colors placeholder:text-[#374151]"
      />
      <button
        onClick={() => {
          onGenerate(val);
          setVal("");
        }}
        className="px-4 py-2.5 rounded-xl font-mono text-[11px] font-semibold border-none cursor-pointer hover:opacity-85 transition-opacity text-[#111]"
        style={{ background: ACCENT }}
      >
        GENERATE
      </button>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────
export function LoadingSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#2a2d35] bg-[#16181d] p-8 animate-pulse">
      <div className="h-1 bg-[#2a2d35] rounded mb-8" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 bg-[#1a1d24] rounded-full" />
        <div className="h-6 w-16 bg-[#1a1d24] rounded-full" />
      </div>
      <div className="h-12 w-2/3 bg-[#1a1d24] rounded-xl mb-4" />
      <div className="h-4 w-1/4 bg-[#1a1d24] rounded mb-6" />
      <div className="h-14 bg-[#111214] rounded-xl mb-6" />
      <div className="flex gap-1 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-24 bg-[#1a1d24] rounded-lg" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-[#1a1d24] rounded w-full" />
        <div className="h-4 bg-[#1a1d24] rounded w-5/6" />
        <div className="h-4 bg-[#1a1d24] rounded w-4/6" />
      </div>
    </div>
  );
}
