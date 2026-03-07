"use client";
import { useState } from "react";
import type { Card } from "@/utilities/collection/theme";
import {
  CREAM,
  CAT_ICON,
  CAT_LABEL,
  GOLD,
  INK,
  SEPIA,
  RED,
} from "@/utilities/collection/theme";
import { serif, mono, fmtMonth } from "@/utilities/collection/utility";
import DateEditor from "./DateEditor";
// ── Flip Card ────────────────────────────────────────
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
      style={{
        perspective: 1200,
        cursor: "pointer",
        height: 300,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(.23,1,.32,1)",
        }}
      >
        {/* ── FRONT ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: hovered
              ? "4px 6px 24px rgba(26,22,18,0.22), 0 0 0 1px rgba(26,22,18,0.08)"
              : "2px 4px 12px rgba(26,22,18,0.12), 0 0 0 1px rgba(26,22,18,0.06)",
            transform: hovered ? "translateY(-3px)" : "translateY(0)",
            transition: "box-shadow 0.25s ease, transform 0.25s ease",
          }}
        >
          {/* Spine */}
          <div
            style={{
              width: 14,
              flexShrink: 0,
              background: card.spineColor,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: 8,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Courier Prime', monospace",
                letterSpacing: 2,
              }}
            >
              {card.category.toUpperCase()}
            </span>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              background: CREAM,
              padding: "18px 18px 14px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: card.spineColor,
                  fontFamily: "'Courier Prime', monospace",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {CAT_ICON[card.category]} {CAT_LABEL[card.category]}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFav(card.id, !card.isFavorite);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  color: card.isFavorite ? GOLD : "#ccc2b4",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {card.isFavorite ? "★" : "☆"}
              </button>
            </div>

            {/* Title + subtitle */}
            <div style={{ flex: 1 }}>
              <h3
                style={serif(19, INK, 700, {
                  lineHeight: 1.2,
                  marginBottom: 5,
                })}
              >
                {card.title}
              </h3>
              {card.subtitle && (
                <p
                  style={mono(12, SEPIA, {
                    marginBottom: 10,
                    fontStyle: "italic",
                  })}
                >
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* Date stamp */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "#c9bfb0",
                  flexShrink: 0,
                }}
              />
              <span style={mono(10, "#b0a090")}>
                {fmtMonth(card.createdAt)}
              </span>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {card.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 2,
                    border: "1px solid #ddd4c4",
                    color: SEPIA,
                    fontFamily: "'Courier Prime', monospace",
                    background: "transparent",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 8,
                right: 12,
                ...mono(9, "#ccc2b4"),
              }}
            >
              tap to read →
            </div>

            {/* Ruled lines */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 14,
                right: 0,
                height: 30,
                pointerEvents: "none",
              }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{ height: 1, background: "#e8dfd3", marginBottom: 14 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: CREAM,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow:
              "2px 4px 12px rgba(26,22,18,0.12), 0 0 0 1px rgba(26,22,18,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{ height: 5, background: card.spineColor, flexShrink: 0 }}
          />

          {/* Notes body */}
          <div style={{ flex: 1, padding: "14px 16px", overflowY: "auto" }}>
            <div
              style={mono(10, card.spineColor, {
                letterSpacing: 2,
                marginBottom: 12,
              })}
            >
              {CAT_ICON[card.category]} NOTES
            </div>
            {lines.map((line, i) => (
              <p
                key={i}
                style={serif(13.5, line.startsWith("'") ? SEPIA : INK, 400, {
                  lineHeight: 1.65,
                  marginBottom: 8,
                  fontStyle: line.startsWith("'") ? "italic" : "normal",
                })}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Back footer */}
          <div
            style={{
              padding: "10px 16px 14px",
              borderTop: "1px solid #e8dfd3",
              flexShrink: 0,
            }}
          >
            {/* Editable date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={mono(9, "#c9bfb0", { letterSpacing: 1 })}>
                RECORDED
              </span>
              <DateEditor
                iso={card.createdAt}
                cardId={card.id}
                onUpdate={onDateUpdate}
              />
            </div>

            {/* Tags row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginBottom: 12,
              }}
            >
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 9,
                    padding: "1px 7px",
                    border: "1px solid #ddd4c4",
                    color: SEPIA,
                    fontFamily: "'Courier Prime', monospace",
                    borderRadius: 2,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Edit + Delete action row */}
            <div
              style={{ display: "flex", gap: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(card)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "7px 0",
                  borderRadius: 3,
                  border: "1px solid #ddd4c4",
                  background: "transparent",
                  color: SEPIA,
                  cursor: "pointer",
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: 11,
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0ebe0";
                  e.currentTarget.style.borderColor = "#c9bfb0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#ddd4c4";
                }}
              >
                <span style={{ fontSize: 12 }}>✏︎</span> Edit
              </button>
              <button
                onClick={() => onDelete(card)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "7px 0",
                  borderRadius: 3,
                  border: "1px solid #f5c6c0",
                  background: "transparent",
                  color: RED,
                  cursor: "pointer",
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: 11,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fdf0ee";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 12 }}>✕</span> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
