import { useState } from "react";
import type { Task } from "@/utilities/workspace/theme";
import {
  TAG_COLOR,
  PRIORITY_COLOR,
  PRIORITY_ORDER,
} from "@/utilities/workspace/theme";

// ── Task Card (calendar cell) ─────────────────────────
export function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const tag = TAG_COLOR[task.tag];
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`${task.title} · ${task.tag} · ${task.priority}\nClick to edit`}
      className="flex items-center gap-1 px-1.5 py-1 rounded-md cursor-pointer transition-all duration-150 mb-0.5 overflow-hidden"
      style={{
        background: hov ? "#1e2128" : "#16181d",
        border: `1px solid ${hov ? tag.text + "55" : "#1e2128"}`,
        transform: hov ? "translateX(2px)" : "none",
        boxShadow: hov ? `0 2px 10px ${tag.text}18` : "none",
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          background: task.done ? "#2a2d35" : PRIORITY_COLOR[task.priority],
          boxShadow:
            !task.done && task.priority === "High"
              ? `0 0 5px ${PRIORITY_COLOR.High}`
              : "none",
        }}
      />
      <span
        className="flex-1 font-sans text-[11px] truncate leading-snug min-w-0"
        style={{
          color: task.done ? "#2a2d35" : "#c9c4b8",
          textDecoration: task.done ? "line-through" : "none",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {task.title}
      </span>
      <span
        className="font-mono text-[9px] px-1 py-px rounded-full shrink-0 hidden sm:inline"
        style={{
          background: task.done ? "#1a1d24" : tag.bg,
          color: task.done ? "#2a2d35" : tag.text,
        }}
      >
        {task.tag}
      </span>
    </div>
  );
}

// ── Day Cell ──────────────────────────────────────────
export function DayCell({
  day,
  tasks,
  isToday,
  isCurrentMonth,
  onTaskClick,
}: {
  day: Date;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onTaskClick: (task: Task) => void;
}) {
  const sorted = [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
  const maxVisible = 2;
  const overflow = sorted.length - maxVisible;

  return (
    <div
      className="flex flex-col rounded-lg p-1.5 sm:p-2.5 min-h-20 sm:min-h-27.5 relative overflow-hidden transition-colors"
      style={{
        background: isToday ? "#15181f" : "#111214",
        border: isToday ? "1px solid #a3c47a44" : "1px solid #1a1d24",
        opacity: isCurrentMonth ? 1 : 0.3,
      }}
    >
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <div
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
          style={{ background: isToday ? "#a3c47a" : "transparent" }}
        >
          <span
            className="font-mono text-[10px] sm:text-[11px] leading-none"
            style={{
              color: isToday ? "#111" : isCurrentMonth ? "#9ca3af" : "#2a2d35",
              fontWeight: isToday ? 700 : 400,
            }}
          >
            {day.getDate()}
          </span>
        </div>
        {sorted.length > 0 && (
          <span className="font-mono text-[8px] text-[#2a2d35] bg-[#1a1d24] px-1 py-px rounded-full hidden sm:block">
            {sorted.length}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {sorted.slice(0, maxVisible).map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {overflow > 0 && (
          <div className="font-mono text-[9px] text-[#374151] pl-2 mt-0.5">
            +{overflow} more
          </div>
        )}
      </div>

      {isToday && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-t bg-[#a3c47a]"
          style={{ boxShadow: "0 0 8px #a3c47a99" }}
        />
      )}
    </div>
  );
}
