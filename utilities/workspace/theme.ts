export type Task = {
  id: string;
  title: string;
  tag: "Design" | "Dev" | "Docs" | "Content" | "Management";
  priority: "High" | "Medium" | "Low";
  done: boolean;
  dueDate: string;
  doneAt?: string | null;
};

export const PRIORITY_COLOR: Record<string, string> = {
  High: "#f87171",
  Medium: "#fbbf24",
  Low: "#6ee7b7",
};

export const TAG_COLOR: Record<string, { bg: string; text: string }> = {
  Design:     { bg: "#c084fc18", text: "#c084fc" },
  Dev:        { bg: "#38bdf818", text: "#38bdf8" },
  Docs:       { bg: "#fb923c18", text: "#fb923c" },
  Content:    { bg: "#4ade8018", text: "#4ade80" },
  Management: { bg: "#f472b618", text: "#f472b6" },
};
export const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
export const TAG_LIST      = ["Design", "Dev", "Docs", "Content", "Management"] as const;
export const PRIORITY_LIST = ["High", "Medium", "Low"] as const;