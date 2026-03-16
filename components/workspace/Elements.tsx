"use client";
import { useState, useEffect } from "react";
import type { Task, TaskStatus } from "@/utilities/workspace/theme";
import {
  dueDateDiff,
  EscalationBadge,
  isoToKey,
} from "@/utilities/workspace/utility";
import {
  TAG_COLOR,
  PRIORITY_COLOR,
  STATUS_META,
} from "@/utilities/workspace/theme";
import { fmtDate } from "@/utilities/workspace/utility";

const TODAY = new Date(2026, 2, 3); // March 3, 2026

// ── MiniCalendar ──────────────────────────────────────
export function MiniCalendar({
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
    const k = `${yr}-${mo}-${d}`;
    if (!pendingByDay.has(k) && !doneByDay.has(k)) return;
    if (selectedKey === k) {
      onSelectDate(null, "");
      return;
    }
    const label = new Date(yr, mo, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    onSelectDate(k, label);
  };

  return (
    <div className="bg-[#16181d] rounded-2xl p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setView(new Date(yr, mo - 1, 1))}
          className="bg-transparent border-none text-[#6b7280] cursor-pointer text-lg px-2 py-0.5 rounded-md hover:text-[#9ca3af] transition-colors"
        >
          ‹
        </button>
        <span className="font-mono text-[13px] text-[#e8e3d5] tracking-widest">
          {view.toLocaleString("default", { month: "long" }).toUpperCase()} {yr}
        </span>
        <button
          onClick={() => setView(new Date(yr, mo + 1, 1))}
          className="bg-transparent border-none text-[#6b7280] cursor-pointer text-lg px-2 py-0.5 rounded-md hover:text-[#9ca3af] transition-colors"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center font-mono text-[10px] text-[#4b5563] pb-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
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
          return (
            <div
              key={i}
              onClick={() => handleDayClick(d)}
              title={
                hasAny
                  ? `${pendingByDay.get(k) ?? 0} pending · ${doneByDay.get(k) ?? 0} done`
                  : undefined
              }
              className="text-center py-1.5 px-0.5 rounded-lg transition-colors duration-150"
              style={{
                cursor: hasAny ? "pointer" : "default",
                background: isSelected
                  ? "#a3c47a"
                  : isToday
                    ? "#a3c47a1a"
                    : hasAny
                      ? "#ffffff08"
                      : "transparent",
              }}
            >
              <span
                className="block font-mono text-xs leading-none"
                style={{
                  color: isSelected
                    ? "#111"
                    : isToday
                      ? "#a3c47a"
                      : hasAny
                        ? "#e8e3d5"
                        : "#4b5563",
                  fontWeight: isSelected || isToday ? 600 : 400,
                }}
              >
                {d}
              </span>
              {hasAny && !isSelected && (
                <div className="flex justify-center gap-0.5 mt-0.5">
                  {hasPending && (
                    <div className="w-1 h-1 rounded-full bg-[#fbbf24]" />
                  )}
                  {hasDone && (
                    <div className="w-1 h-1 rounded-full bg-[#6ee7b7]" />
                  )}
                </div>
              )}
              {isSelected && (
                <div className="font-mono text-[8px] text-[#1a2a12] mt-0.5 leading-none">
                  {(pendingByDay.get(k) ?? 0) + (doneByDay.get(k) ?? 0)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 justify-end flex-wrap">
        {[
          ["#fbbf24", "Pending"],
          ["#6ee7b7", "Done"],
        ].map(([c, l]) => (
          <div
            key={l}
            className="flex items-center gap-1 font-mono text-[10px] text-[#6b7280]"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: c }}
            />{" "}
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AnimatedBar ───────────────────────────────────────
export function AnimatedBar({ pct }: { pct: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-mono text-[11px] text-[#6b7280] tracking-widest">
          COMPLETION
        </span>
        <span className="font-mono text-[13px] text-[#a3c47a] font-semibold">
          {pct}%
        </span>
      </div>
      <div className="bg-[#1e2128] rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1200 ease-out"
          style={{
            width: width + "%",
            background: "linear-gradient(90deg,#a3c47a,#6ee7b7)",
            boxShadow: "0 0 12px #a3c47a66",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="font-mono text-[10px] text-[#374151]">0</span>
        <span className="font-mono text-[10px] text-[#374151]">100</span>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: number;
  color: string;
  sub: string;
}) {
  return (
    <div
      className="relative bg-[#16181d] rounded-2xl p-4 sm:p-5 flex-1 overflow-hidden"
      style={{ border: `1px solid ${color}18` }}
    >
      <div
        className="absolute -top-5 -right-5 w-20 h-20 rounded-full"
        style={{ background: color + "12" }}
      />
      <div className="font-mono text-[10px] text-[#4b5563] tracking-widest mb-2.5">
        {label}
      </div>
      <div
        className="font-mono text-3xl sm:text-4xl font-bold leading-none"
        style={{ color }}
      >
        {value}
      </div>
      <div className="font-mono text-[11px] text-[#4b5563] mt-2">{sub}</div>
    </div>
  );
}

// ── TaskRow ───────────────────────────────────────────
export function TaskRow({
  task,
  onOpenStatus,
  onDelete,
}: {
  task: Task;
  onOpenStatus: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  const [hov, setHov] = useState(false);
  const tag = TAG_COLOR[task.tag];
  const sm = STATUS_META[task.status];
  const diff = dueDateDiff(task.dueDate);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors duration-150 border-b border-[#1a1d2480] last:border-0"
      style={{ background: hov ? "#1a1d24" : "transparent" }}
    >
      {/* Status pill button */}
      <button
        onClick={() => onOpenStatus(task)}
        title="Click to update status"
        className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full border cursor-pointer transition-all duration-200 font-mono text-[9px] tracking-wide min-w-18 justify-center"
        style={{ background: sm.bg, borderColor: sm.border, color: sm.color }}
      >
        <span>{sm.icon}</span>
        {sm.label.toUpperCase()}
      </button>

      {/* Title */}
      <span
        className="flex-1 text-sm min-w-0 truncate"
        style={{
          color: task.done ? "#4b5563" : "#c9c4b8",
          textDecoration: task.done ? "line-through" : "none",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {task.title}
      </span>

      {/* Escalation badge */}
      {!task.done && (
        <EscalationBadge dueDate={task.dueDate} done={task.done} />
      )}

      {/* Date info */}
      {task.done && task.doneAt ? (
        <span className="font-mono text-[10px] text-[#a3c47a] shrink-0 hidden sm:block">
          ✓ {fmtDate(task.doneAt)}
        </span>
      ) : (
        <span
          className="font-mono text-[10px] shrink-0 hidden sm:block"
          style={{
            color: diff <= 0 ? "#f87171" : diff === 1 ? "#fbbf24" : "#374151",
          }}
        >
          {diff < 0
            ? `${Math.abs(diff)}d overdue`
            : diff === 0
              ? "Due today"
              : diff === 1
                ? "Due tomorrow"
                : `Due ${fmtDate(task.dueDate)}`}
        </span>
      )}

      {/* Tag */}
      <span
        className="hidden sm:inline font-mono text-[10px] px-2.5 py-0.5 rounded-full shrink-0 tracking-wide"
        style={{ background: tag.bg, color: tag.text }}
      >
        {task.tag}
      </span>

      {/* Notes indicator */}
      {task.notes && (
        <span
          title={task.notes}
          className="font-mono text-[9px] text-[#4b5563] bg-[#1a1d24] border border-[#2a2d35] px-1.5 py-0.5 rounded-full shrink-0 hidden sm:block cursor-default"
        >
          ✎
        </span>
      )}
      {/* Priority dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: PRIORITY_COLOR[task.priority] }}
      />

      {/* Delete on hover */}
      {hov && (
        <button
          onClick={() => onDelete(task.id)}
          className="bg-transparent border-none text-[#f87171] cursor-pointer text-sm px-0.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ── Status summary strip ──────────────────────────────
export function StatusStrip({ tasks }: { tasks: Task[] }) {
  const counts: Record<TaskStatus, number> = {
    waiting: 0,
    processing: 0,
    on_time: 0,
    over_due: 0,
  };
  tasks.forEach((t) => {
    counts[t.status] = (counts[t.status] ?? 0) + 1;
  });
  const entries = [
    "over_due",
    "processing",
    "waiting",
    "on_time",
  ] as TaskStatus[];
  return (
    <div className="flex gap-2 flex-wrap">
      {entries.map((s) => {
        const m = STATUS_META[s];
        return (
          <div
            key={s}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: m.bg, borderColor: m.border }}
          >
            <span className="font-mono text-[10px]" style={{ color: m.color }}>
              {m.icon}
            </span>
            <span
              className="font-mono text-[10px] font-semibold"
              style={{ color: m.color }}
            >
              {counts[s]}
            </span>
            <span className="font-mono text-[9px] text-[#4b5563]">
              {m.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
