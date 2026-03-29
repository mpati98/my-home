import { Task } from "../workspace/theme";

export type ProjectStage = "planning" | "doing" | "running" | "completed";
export type TaskStatus   = "waiting" | "processing" | "on_time" | "over_due";

export type Project = {
  id: string; name: string; description: string; category: string;
  stage: ProjectStage; color: string;
  startDate?: string | null; endDate?: string | null;
  createdAt: string; updatedAt: string;
  tasks: Task[];
};
export const STAGE_META: Record<ProjectStage, { label: string; color: string; bg: string; icon: string }> = {
  planning:  { label: "Planning",  color: "#7dd3fc", bg: "#7dd3fc18", icon: "◌" },
  doing:     { label: "Doing",     color: "#fbbf24", bg: "#fbbf2418", icon: "◉" },
  running:   { label: "Running",   color: "#a3c47a", bg: "#a3c47a18", icon: "▶" },
  completed: { label: "Completed", color: "#6ee7b7", bg: "#6ee7b718", icon: "✓" },
};
export const COLOR_PRESETS = [
  "#60a5fa","#a3c47a","#f472b6","#fbbf24","#a78bfa",
  "#34d399","#f87171","#c084fc","#7dd3fc","#fb923c",
  "#e879f9","#4ade80",
];
export const STAGES: ProjectStage[] = ["planning","doing","running","completed"];

// ── Progress calculation ──────────────────────────────
export function calcProgress(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
}