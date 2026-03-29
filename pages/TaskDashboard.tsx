"use client";

import { PRIORITY_COLOR, type Task } from "@/utilities/workspace/theme";
import { dateKey, isoToKey, StatusStrip } from "@/utilities/workspace/utility";
import {
  AnimatedBar,
  MiniCalendar,
  StatCard,
  TaskRow,
} from "@/components/workspace/Elements";
import { AddTaskModal, StatusModal } from "@/utilities/workspace/modal";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ── Main Dashboard ────────────────────────────────────
export default function TaskDashboard({
  initialTasks = [],
  initialProjects = [],
}: {
  initialTasks?: Task[];
  initialProjects?: { id: string; name: string; color: string }[];
}) {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Done">(
    "All",
  );
  const [, startTransition] = useTransition();
  const router = useRouter();

  // Create projectsMap from initialProjects
  const projectsMap: Record<
    string,
    { id: string; name: string; color: string }
  > = {};
  initialProjects.forEach((p) => {
    projectsMap[p.id] = p;
  });

  const initDateKey = (() => {
    const d = searchParams?.get("date");
    if (!d) return null;
    const p = new Date(d + "T12:00:00");
    return isNaN(p.getTime()) ? null : dateKey(p);
  })();
  const initDateLabel = (() => {
    const d = searchParams?.get("date");
    if (!d) return "";
    const p = new Date(d + "T12:00:00");
    return isNaN(p.getTime())
      ? ""
      : p.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  })();

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    initDateKey,
  );
  const [selectedDateLabel, setSelectedDateLabel] =
    useState<string>(initDateLabel);
  const [showAdd, setShowAdd] = useState(false);
  const [statusTask, setStatusTask] = useState<Task | null>(null);

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const pendingCount = total - doneCount;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const visible = tasks.filter((t) => {
    if (statusFilter === "Done" && !t.done) return false;
    if (statusFilter === "Pending" && t.done) return false;
    if (selectedDateKey && isoToKey(t.dueDate) !== selectedDateKey)
      return false;
    return true;
  });

  function handleStatusUpdate(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch("/api/tasks/" + id, { method: "DELETE" });
    } catch {
      startTransition(() => router.refresh());
    }
  };

  const handleAdd = async (data: {
    title: string;
    tag: string;
    priority: string;
    dueDate: string;
    notes: string;
    projectId?: string | null;
  }) => {
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

  return (
    <div className="min-h-screen bg-[#111214] px-4 py-6 sm:px-7 sm:py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <div className="font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
            WORKSPACE
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#e8e3d5]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Task Manager
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="font-mono text-[11px] text-[#374151] hidden sm:block"
            suppressHydrationWarning
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[#a3c47a] text-[#111] border-none cursor-pointer font-mono text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest hover:opacity-90 transition-opacity"
          >
            + NEW TASK
          </button>
        </div>
      </div>

      {/* § 01 OVERVIEW */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#a3c47a] tracking-widest">
            § 01
          </span>
          <span className="font-mono text-[11px] text-[#374151] tracking-widest">
            OVERVIEW
          </span>
          <div className="flex-1 h-px bg-[#1e2128]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
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
            <div className="bg-[#16181d] rounded-2xl p-4 sm:p-5">
              <AnimatedBar pct={pct} />
              {/* Status strip */}
              <div className="mt-4">
                <StatusStrip tasks={tasks} />
              </div>
            </div>
          </div>
          <MiniCalendar
            tasks={tasks}
            selectedKey={selectedDateKey}
            onSelectDate={(k, l) => {
              setSelectedDateKey(k);
              setSelectedDateLabel(l);
            }}
          />
        </div>
      </div>

      {/* § 02 TASK LIST */}
      <div className="mt-7">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="font-mono text-[10px] text-[#a3c47a] tracking-widest">
            § 02
          </span>
          <span className="font-mono text-[11px] text-[#374151] tracking-widest">
            TASK LIST
          </span>
          <div className="flex-1 h-px bg-[#1e2128]" />
          {selectedDateKey && (
            <div className="flex items-center gap-1.5 bg-[#a3c47a18] border border-[#a3c47a44] rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a3c47a]" />
              <span className="font-mono text-[10px] text-[#a3c47a] tracking-wide">
                DUE {selectedDateLabel.toUpperCase()}
              </span>
              <button
                onClick={() => {
                  setSelectedDateKey(null);
                  setSelectedDateLabel("");
                }}
                className="bg-transparent border-none text-[#a3c47a] cursor-pointer text-sm leading-none pl-0.5 hover:opacity-70"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex gap-1">
            {(["All", "Pending", "Done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className="font-mono text-[10px] px-3 py-1.5 rounded-full border-none cursor-pointer tracking-wide transition-all duration-200"
                style={{
                  background: statusFilter === f ? "#a3c47a" : "#1a1d24",
                  color: statusFilter === f ? "#111" : "#4b5563",
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#16181d] rounded-2xl overflow-hidden">
          <div className="hidden sm:flex gap-2.5 px-4 py-2.5 border-b border-[#1e2128]">
            <span className="font-mono text-[10px] text-[#374151] tracking-widest w-20.5">
              STATUS
            </span>
            <span className="font-mono text-[10px] text-[#374151] tracking-widest flex-1">
              TASK
            </span>
            <span className="font-mono text-[10px] text-[#374151] tracking-widest w-32 hidden sm:block">
              DATE
            </span>
            <span className="font-mono text-[10px] text-[#374151] tracking-widest w-20">
              TAG
            </span>
            <span className="w-2" />
          </div>
          {visible.length > 0 ? (
            visible.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onOpenStatus={(t) => setStatusTask(t)}
                onDelete={handleDelete}
                projectsMap={projectsMap}
              />
            ))
          ) : (
            <div className="py-12 text-center font-mono text-xs text-[#374151]">
              {selectedDateKey
                ? "No tasks due on " + selectedDateLabel + "."
                : "No tasks here."}
            </div>
          )}
        </div>

        {/* Priority escalation legend */}
        <div className="mt-3 flex items-center gap-4 flex-wrap px-1">
          <span className="font-mono text-[9px] text-[#2a2d35] tracking-widest">
            AUTO-PRIORITY:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-[#fbbf24] bg-[#fbbf2418] border border-[#fbbf2433] px-1.5 py-0.5 rounded-full">
              ↑ BUMPED
            </span>
            <span className="font-mono text-[9px] text-[#374151]">
              due tomorrow → +1 level
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-[#f87171] bg-[#f8717118] border border-[#f8717133] px-1.5 py-0.5 rounded-full">
              ↑ HIGH
            </span>
            <span className="font-mono text-[9px] text-[#374151]">
              due today or past → High
            </span>
          </div>
        </div>
      </div>

      {showAdd && (
        <AddTaskModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
      {statusTask && (
        <StatusModal
          task={statusTask}
          onClose={() => setStatusTask(null)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
