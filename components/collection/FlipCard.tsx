"use client";

import { CAT_ICON, GOLD, SEPIA, INK, RED } from "@/utilities/collection/theme";
import { fmtMonth } from "@/utilities/collection/utility";
import { Card } from "@/utilities/collection/theme";
import { useState } from "react";
import { DateEditor } from "./DateEditor";

// ── Flip Card ─────────────────────────────────────────
export default function FlipCard({
  card,
  onFav,
  onEdit,
  onDelete,
  onDateUpdate,
}: {
  card: Card;
  onFav: (id: string, val: boolean) => void;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  onDateUpdate: (id: string, newIso: string) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lines = card.content.split("\n").filter(Boolean);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFlipped((f) => !f)}
      className="perspective-1200 cursor-pointer h-75 relative"
    >
      <div
        className="relative w-full h-full preserve-3d transition-transform duration-500"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transitionTimingFunction: "cubic-bezier(.23,1,.32,1)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 backface-hidden flex rounded-sm overflow-hidden transition-all duration-300"
          style={{
            boxShadow: hovered
              ? "4px 6px 24px rgba(26,22,18,0.22), 0 0 0 1px rgba(26,22,18,0.08)"
              : "2px 4px 12px rgba(26,22,18,0.12), 0 0 0 1px rgba(26,22,18,0.06)",
            transform: hovered ? "translateY(-3px)" : "translateY(0)",
          }}
        >
          {/* Spine */}
          <div
            className="w-3.5 shrink-0 flex items-end justify-center pb-2.5"
            style={{ background: card.spineColor }}
          >
            <span className="writing-vertical text-[8px] text-white/50 font-[Courier_Prime,monospace] tracking-widest">
              {card.category.toUpperCase()}
            </span>
          </div>
          {/* Body */}
          <div className="flex-1 bg-[#16181d] px-4 pt-4 pb-3 flex flex-col relative">
            <div className="flex justify-between items-start mb-3">
              <span
                className="font-[Courier_Prime,monospace] text-[11px] tracking-widest uppercase"
                style={{ color: card.spineColor }}
              >
                {CAT_ICON[card.category]} {card.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFav(card.id, !card.isFavorite);
                }}
                className="bg-transparent border-none cursor-pointer text-base p-0 leading-none"
                style={{ color: card.isFavorite ? GOLD : "#4b5563" }}
              >
                {card.isFavorite ? "★" : "☆"}
              </button>
            </div>
            <div className="flex-1">
              <h3 className="font-[Cormorant_Garant,serif] text-[19px] font-bold text-[#e8e3d5] leading-tight mb-1">
                {card.title}
              </h3>
              {card.subtitle && (
                <p className="font-[Courier_Prime,monospace] text-xs text-[#4b5563] italic mb-2">
                  {card.subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1 h-1 rounded-full bg-[#4b5563]" />
              <span className="font-[Courier_Prime,monospace] text-[10px] text-[#4b5563]">
                {fmtMonth(card.createdAt)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {card.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-[Courier_Prime,monospace] text-[10px] px-1.5 py-0.5 border border-[#1e2128] text-[#4b5563] rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="absolute bottom-2 right-3 font-[Courier_Prime,monospace] text-[9px] text-[#4b5563]">
              tap to read →
            </div>
            <div className="absolute bottom-0 left-3.5 right-0 h-7 pointer-events-none">
              <div className="h-px bg-[#1e2128] mb-3.5" />
              <div className="h-px bg-[#1e2128]" />
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 backface-hidden bg-[#16181d] rounded-sm overflow-hidden flex flex-col"
          style={{
            transform: "rotateY(180deg)",
            boxShadow:
              "2px 4px 12px rgba(26,22,18,0.12), 0 0 0 1px rgba(26,22,18,0.06)",
          }}
        >
          <div
            className="h-1.5 shrink-0"
            style={{ background: card.spineColor }}
          />
          <div className="flex-1 px-4 py-3.5 overflow-y-auto">
            <div
              className="font-[Courier_Prime,monospace] text-[10px] tracking-widest mb-3"
              style={{ color: card.spineColor }}
            >
              {CAT_ICON[card.category]} NOTES
            </div>
            {lines.map((line, i) => (
              <p
                key={i}
                className="font-[Cormorant_Garant,serif] text-sm leading-relaxed mb-2"
                style={{
                  color: line.startsWith("'") ? SEPIA : INK,
                  fontStyle: line.startsWith("'") ? "italic" : "normal",
                }}
              >
                {line}
              </p>
            ))}
          </div>
          <div className="px-4 pb-3.5 border-t border-[#1e2128] shrink-0">
            <div className="flex justify-between items-center mb-2.5 pt-2">
              <span className="font-[Courier_Prime,monospace] text-[9px] text-[#4b5563] tracking-widest">
                RECORDED
              </span>
              <DateEditor
                iso={card.createdAt}
                cardId={card.id}
                onUpdate={onDateUpdate}
              />
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-[Courier_Prime,monospace] text-[9px] px-1.5 py-0.5 border border-[#1e2128] text-[#4b5563] rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div
              className="grid grid-cols-2 gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(card)}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-sm border border-[#1e2128] bg-transparent text-[#4b5563] cursor-pointer font-[Courier_Prime,monospace] text-[11px] hover:bg-[#1e2128] hover:border-[#4b5563] transition-all"
              >
                <span>✏︎</span> Edit
              </button>
              <button
                onClick={() => onDelete(card)}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-sm border border-[#f5c6c0] bg-transparent cursor-pointer font-[Courier_Prime,monospace] text-[11px] hover:bg-[#1e2128] transition-all"
                style={{ color: RED }}
              >
                <span>✕</span> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
