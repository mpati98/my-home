export type Task = {
  id: string;
  projectId?: string | null;
  title: string;
  tag: "Adhoc" | "Event" | "Fair" | "External" | "Data" | "Learning";
  priority: "High" | "Medium" | "Low";
  status: TaskStatus;
  notes: string | null;
  done: boolean;
  dueDate: string;
  doneAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = "waiting" | "processing" | "on_time" | "over_due";

export type TaskForm = {
  title: string;
  tag: string;
  priority: string;
  dueDate: string;
  notes: string;
  projectId?: string | null;
};

export type Props = {
  onClose: () => void;
  onAdd: (t: TaskForm) => Promise<void>;
  /** Pre-bind a project — hides the projectId from the UI */
  projectId?: string;
  /** Accent color for the header label (defaults to sage green) */
  accentColor?: string;
  /** Optional label shown above the modal title */
  projectName?: string;
};

export const PRIORITY_COLOR: Record<string, string> = {
  High: "#f87171",
  Medium: "#fbbf24",
  Low: "#6ee7b7",
};

export const TAG_COLOR: Record<string, { bg: string; text: string }> = {
  Adhoc:     { bg: "#c084fc18", text: "#c084fc" },
  Event:        { bg: "#38bdf818", text: "#38bdf8" },
  Fair:       { bg: "#fb923c18", text: "#fb923c" },
  External:    { bg: "#4ade8018", text: "#4ade80" },
  Data: { bg: "#f472b618", text: "#f472b6" },
  Learning: { bg: "#f472b618", text: "#f472b6" },
};
export const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
export const TAG_LIST      = ["Adhoc", "Event", "Fair", "External", "Data", "Learning"] as const;
export const PRIORITY_LIST = ["High", "Medium", "Low"] as const;

export const STATUS_META: Record<TaskStatus, { label: string; color: string; bg: string; border: string; icon: string }> = {
  waiting:    { label: "Waiting",    color: "#6b7280", bg: "#6b728018", border: "#6b728044", icon: "◌" },
  processing: { label: "Processing", color: "#7dd3fc", bg: "#7dd3fc18", border: "#7dd3fc44", icon: "◉" },
  on_time:    { label: "On Time",    color: "#a3c47a", bg: "#a3c47a18", border: "#a3c47a44", icon: "✓" },
  over_due:   { label: "Overdue",    color: "#f87171", bg: "#f8717118", border: "#f8717144", icon: "⚠" },
};
