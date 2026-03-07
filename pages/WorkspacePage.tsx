"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import StatCard from "../components/workspace/StatCard";
import AnimatedBar from "../components/workspace/AnimatedBar";
import MiniCalendar from "../components/workspace/MiniCalendar";
import TaskRow from "../components/workspace/TaskRow";
import AddTaskModal from "../components/workspace/AddTaskModal";
import type { Task } from "@/utilities/workspace/theme";
import { isoToKey, Dot, mono } from "@/utilities/workspace/utility";
import { PRIORITY_COLOR } from "@/utilities/workspace/theme";
const TODAY = new Date();

export default function WorkspacePage({
  initialTasks,
}: {
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Done">(
    "All",
  );
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>("");
  const [showAdd, setShowAdd] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const pendingCount = total - doneCount;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // Combined filter: status tab + calendar date
  const visible = tasks.filter((t) => {
    if (statusFilter === "Done" && !t.done) return false;
    if (statusFilter === "Pending" && t.done) return false;
    if (selectedDateKey && isoToKey(t.dueDate) !== selectedDateKey)
      return false;
    return true;
  });

  const handleToggle = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
    try {
      const res = await fetch("/api/tasks/" + id, { method: "PATCH" });
      if (!res.ok)
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        );
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch("/api/tasks/" + id, { method: "DELETE" });
    } catch {
      startTransition(() => router.refresh());
    }
  };

  const handleAdd = async (data: Omit<Task, "id" | "done">) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newTask: Task = await res.json();
      setTasks((prev) =>
        [...prev, newTask].sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
      );
    }
  };

  const handleSelectDate = (key: string | null, label: string) => {
    setSelectedDateKey(key);
    setSelectedDateLabel(label);
  };

  const clearDateFilter = () => {
    setSelectedDateKey(null);
    setSelectedDateLabel("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        body { background: #111214; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 10px; }
        select option { background: #1a1d24; color: #e8e3d5; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4); }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .date-badge { animation: slideDown 0.2s ease; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#111214",
          fontFamily: "'IBM Plex Sans',sans-serif",
          padding: "32px 28px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <div style={mono(11, "#4b5563", 2, { marginBottom: 6 })}>
              WORKSPACE
            </div>
            <h1
              style={{
                fontSize: 30,
                fontFamily: "'Playfair Display',serif",
                color: "#e8e3d5",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              Task Manager
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={mono(11, "#374151")}>
              {TODAY.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() => setShowAdd(true)}
              style={{
                background: "#a3c47a",
                color: "#111",
                border: "none",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 11,
                fontWeight: 600,
                padding: "9px 18px",
                borderRadius: 100,
                letterSpacing: 1,
              }}
            >
              + NEW TASK
            </button>
          </div>
        </div>

        {/* § 01 OVERVIEW */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <span style={mono(10, "#a3c47a", 2)}>§ 01</span>
            <span style={mono(11, "#374151", 1)}>OVERVIEW</span>
            <div style={{ flex: 1, height: 1, background: "#1e2128" }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              alignItems: "start",
            }}
          >
            {/* Left: stats + progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <StatCard
                  label="TOTAL"
                  value={total}
                  color="#e8e3d5"
                  sub="tasks this sprint"
                />
                <StatCard
                  label="PENDING"
                  value={pendingCount}
                  color="#fbbf24"
                  sub={
                    total > 0
                      ? Math.round((pendingCount / total) * 100) + "% remaining"
                      : "—"
                  }
                />
                <StatCard
                  label="DONE"
                  value={doneCount}
                  color="#a3c47a"
                  sub={pct + "% complete"}
                />
              </div>
              <div
                style={{
                  background: "#16181d",
                  borderRadius: 16,
                  padding: "20px 22px",
                }}
              >
                <AnimatedBar pct={pct} />
                <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
                  {(["High", "Medium", "Low"] as const).map((p) => {
                    const c = tasks.filter(
                      (t) => t.priority === p && !t.done,
                    ).length;
                    return (
                      <div
                        key={p}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <Dot color={PRIORITY_COLOR[p]} size={8} />
                        <span style={mono(11, "#4b5563")}>
                          {c} {p.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Calendar — clicking a day filters the list */}
            <MiniCalendar
              tasks={tasks}
              selectedKey={selectedDateKey}
              onSelectDate={handleSelectDate}
            />
          </div>
        </div>

        {/* § 02 TASK LIST */}
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <span style={mono(10, "#a3c47a", 2)}>§ 02</span>
            <span style={mono(11, "#374151", 1)}>TASK LIST</span>
            <div style={{ flex: 1, height: 1, background: "#1e2128" }} />

            {/* Active date filter badge */}
            {selectedDateKey && (
              <div
                className="date-badge"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#a3c47a18",
                  border: "1px solid #a3c47a44",
                  borderRadius: 100,
                  padding: "4px 12px",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#a3c47a",
                  }}
                />
                <span style={mono(10, "#a3c47a")}>
                  DUE {selectedDateLabel.toUpperCase()}
                </span>
                <button
                  onClick={clearDateFilter}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#a3c47a",
                    cursor: "pointer",
                    fontSize: 12,
                    padding: "0 0 0 2px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Status filter tabs */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["All", "Pending", "Done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  style={{
                    fontSize: 10,
                    padding: "5px 12px",
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'IBM Plex Mono',monospace",
                    letterSpacing: 0.5,
                    background: statusFilter === f ? "#a3c47a" : "#1a1d24",
                    color: statusFilter === f ? "#111" : "#4b5563",
                    transition: "all .2s",
                  }}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Task count context */}
          {selectedDateKey && (
            <div style={mono(11, "#4b5563", 0, { marginBottom: 12 })}>
              Showing {visible.length} task{visible.length !== 1 ? "s" : ""} due
              on {selectedDateLabel}
              {statusFilter !== "All"
                ? ` · ${statusFilter.toLowerCase()} only`
                : ""}
            </div>
          )}

          <div
            style={{
              background: "#16181d",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                padding: "10px 16px",
                borderBottom: "1px solid #1e2128",
              }}
            >
              <div style={{ width: 18 }} />
              <span style={mono(10, "#374151", 1, { flex: 1 })}>TASK</span>
              <span style={mono(10, "#374151", 1, { width: 90 })}>TAG</span>
              <span style={{ width: 7 }} />
              <span style={mono(10, "#374151", 1, { width: 54 })}>DUE</span>
              <span style={{ width: 22 }} />
            </div>
            {visible.length > 0 ? (
              visible.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  ...mono(12, "#374151"),
                }}
              >
                {selectedDateKey
                  ? "No tasks due on " + selectedDateLabel + "."
                  : "No tasks here."}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <AddTaskModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
    </>
  );
}

export async function getServerSideProps() {
  const { prisma } = await import("@/lib/prisma");
  const tasks = await prisma.task.findMany({
    orderBy: { dueDate: "asc" },
  });

  const serialized = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return {
    props: {
      initialTasks: serialized,
    },
  };
}
