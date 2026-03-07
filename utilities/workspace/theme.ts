export type Task = {
  id: string;
  title: string;
  tag: "Design" | "Dev" | "Docs" | "Content" | "Management";
  priority: "High" | "Medium" | "Low";
  done: boolean;
  dueDate: string;
};

export const PRIORITY_COLOR: Record<string, string> = {
  High: "#f87171",
  Medium: "#fbbf24",
  Low: "#6ee7b7",
};

export const TAG_COLORS: Record<string, string> = {
  Design: "#c084fc",
  Dev: "#38bdf8",
  Docs: "#fb923c",
  Content: "#4ade80",
  Management: "#f472b6",
};