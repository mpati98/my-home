"use client";
import { useState } from "react";
import type { Task } from "@/utilities/workspace/theme";
import { mono } from "@/utilities/workspace/theme";
import { isoToKey, dateKey, Dot, NavBtn } from "@/utilities/workspace/utility";

const TODAY = new Date(2026, 2, 3); // March 3, 2026

export default function MiniCalendar({
  tasks,
  selectedKey,
  onSelectDate,
}: {
  tasks: Task[];
  selectedKey: string | null;
  onSelectDate: (key: string | null, label: string) => void;
}) {
  const [view, setView] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  );
  const yr = view.getFullYear();
  const mo = view.getMonth();

  const firstDay = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo + 1, 0).getDate();

  // Build per-day task maps for the current view month
  const pendingByDay = new Map<string, number>();
  const doneByDay = new Map<string, number>();
  tasks.forEach((t) => {
    const k = isoToKey(t.dueDate);
    const d = new Date(t.dueDate);
    if (d.getFullYear() !== yr || d.getMonth() !== mo) return;
    if (t.done) doneByDay.set(k, (doneByDay.get(k) ?? 0) + 1);
    else pendingByDay.set(k, (pendingByDay.get(k) ?? 0) + 1);
  });

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
  ];

  const handleDayClick = (d: number) => {
    const clickedDate = new Date(yr, mo, d);
    const k = dateKey(clickedDate);
    const hasAny = pendingByDay.has(k) || doneByDay.has(k);
    if (!hasAny) return; // no tasks on this day — do nothing
    if (selectedKey === k) {
      onSelectDate(null, "");
    } else {
      const label = clickedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      onSelectDate(k, label);
    }
  };
  return (
    <div
      style={{
        background: "#16181d",
        borderRadius: 16,
        padding: "20px 22px",
        height: "100%",
      }}
    >
      {/* Month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <NavBtn onClick={() => setView(new Date(yr, mo - 1, 1))}>‹</NavBtn>
        <span style={mono(13, "#e8e3d5", 1)}>
          {view.toLocaleString("default", { month: "long" }).toUpperCase()} {yr}
        </span>
        <NavBtn onClick={() => setView(new Date(yr, mo + 1, 1))}>›</NavBtn>
      </div>

      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
          marginBottom: 4,
        }}
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            style={mono(10, "#4b5563", 0, {
              textAlign: "center",
              paddingBottom: 4,
            })}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
        }}
      >
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;

          const k = `${yr}-${mo}-${d}`;
          const hasPending = pendingByDay.has(k);
          const hasDone = doneByDay.has(k);
          const hasAny = hasPending || hasDone;
          const isToday =
            d === TODAY.getDate() &&
            mo === TODAY.getMonth() &&
            yr === TODAY.getFullYear();
          const isSelected = selectedKey === k;
          const pendingCt = pendingByDay.get(k) ?? 0;
          const doneCt = doneByDay.get(k) ?? 0;

          return (
            <div
              key={i}
              onClick={() => handleDayClick(d)}
              title={
                hasAny ? `${pendingCt} pending · ${doneCt} done` : undefined
              }
              style={{
                textAlign: "center",
                padding: "5px 2px 6px",
                borderRadius: 8,
                cursor: hasAny ? "pointer" : "default",
                position: "relative",
                // Selected: bright fill
                background: isSelected
                  ? "#a3c47a"
                  : isToday
                    ? "#a3c47a1a"
                    : hasAny
                      ? "#ffffff08"
                      : "transparent",
                // Ring on hover (handled via inline transition)
                outline: isSelected ? "none" : "none",
                transition: "background 0.15s",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono',monospace",
                  color: isSelected
                    ? "#111"
                    : isToday
                      ? "#a3c47a"
                      : hasAny
                        ? "#e8e3d5"
                        : "#4b5563",
                  fontWeight: isSelected || isToday ? 600 : 400,
                  lineHeight: 1,
                }}
              >
                {d}
              </span>

              {/* Task count pills */}
              {hasAny && !isSelected && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    marginTop: 3,
                  }}
                >
                  {hasPending && (
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#fbbf24",
                      }}
                    />
                  )}
                  {hasDone && (
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#6ee7b7",
                      }}
                    />
                  )}
                </div>
              )}
              {isSelected && (
                <div
                  style={{
                    fontSize: 8,
                    color: "#1a2a12",
                    fontFamily: "'IBM Plex Mono',monospace",
                    marginTop: 2,
                    lineHeight: 1,
                  }}
                >
                  {pendingCt + doneCt}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 14,
          justifyContent: "flex-end",
        }}
      >
        {[
          ["#fbbf24", "Pending"],
          ["#6ee7b7", "Done"],
        ].map(([c, l]) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              ...mono(10, "#6b7280"),
            }}
          >
            <Dot color={c} size={5} /> {l}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            ...mono(10, "#6b7280"),
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "#a3c47a",
              flexShrink: 0,
            }}
          />{" "}
          Selected
        </div>
      </div>
    </div>
  );
}
