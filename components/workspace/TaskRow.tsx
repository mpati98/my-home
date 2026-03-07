"use client";
import { useState } from "react";
import type { Task } from "@/utilities/workspace/theme";
import { Dot, mono } from "@/utilities/workspace/utility";
import { TAG_COLORS, PRIORITY_COLOR } from "@/utilities/workspace/theme";

const TaskRow = ({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 16px",
        borderRadius: 12,
        background: hov ? "#1a1d24" : "transparent",
        transition: "background .15s",
        borderBottom: "1px solid #1a1d2480",
      }}
    >
      <div
        onClick={() => onToggle(task.id)}
        style={{
          width: 18,
          height: 18,
          borderRadius: 6,
          flexShrink: 0,
          cursor: "pointer",
          border: task.done ? "none" : "2px solid #374151",
          background: task.done ? "#a3c47a" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .2s",
        }}
      >
        {task.done && (
          <span style={{ fontSize: 11, color: "#111" }}>&#10003;</span>
        )}
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 13.5,
          color: task.done ? "#4b5563" : "#c9c4b8",
          textDecoration: task.done ? "line-through" : "none",
          fontFamily: "'IBM Plex Sans',sans-serif",
          transition: "color .2s",
        }}
      >
        {task.title}
      </span>
      <span
        style={{
          fontSize: 10,
          padding: "3px 9px",
          borderRadius: 100,
          background: TAG_COLORS[task.tag] + "18",
          color: TAG_COLORS[task.tag],
          fontFamily: "'IBM Plex Mono',monospace",
          letterSpacing: 0.5,
          flexShrink: 0,
        }}
      >
        {task.tag}
      </span>
      <Dot color={PRIORITY_COLOR[task.priority]} size={7} />
      <span style={mono(11, "#374151", 0, { flexShrink: 0 })}>
        {new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
      {hov && (
        <button
          onClick={() => onDelete(task.id)}
          style={{
            background: "none",
            border: "none",
            color: "#f87171",
            cursor: "pointer",
            fontSize: 14,
            padding: "0 2px",
            flexShrink: 0,
            opacity: 0.7,
          }}
        >
          &#10005;
        </button>
      )}
    </div>
  );
};

export default TaskRow;
