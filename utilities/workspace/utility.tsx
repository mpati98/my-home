import { TaskStatus, STATUS_META, type Task } from "./theme";

// Get today's date at midnight - calculated dynamically to avoid hydration mismatches
function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// ── dateKey: canonical "YYYY-M-D" for comparison ──────
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
export function isoToKey(iso: string): string {
  return dateKey(new Date(iso));
}
export function toYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function isoToYMD(iso: string): string {
  return toYMD(new Date(iso));
}
export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function dueDateDiff(iso: string): number {
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - getTodayMidnight().getTime()) / 86400000);
}

export function toInputDate(iso: string) {
  return iso.slice(0, 10);
}

// ── Status Badge ──────────────────────────────────────
export function StatusBadge({ status }: { status: TaskStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-full border whitespace-nowrap"
      style={{ color: m.color, background: m.bg, borderColor: m.border }}
    >
      <span>{m.icon}</span>
      {m.label.toUpperCase()}
    </span>
  );
}

export // ── Priority escalation warning badge ────────────────
function EscalationBadge({
  dueDate,
  done,
}: {
  dueDate: string;
  done: boolean;
}) {
  if (done) return null;
  const diff = dueDateDiff(dueDate);
  if (diff > 1) return null;
  if (diff <= 0)
    return (
      <span className="font-mono text-[9px] text-[#f87171] bg-[#f8717118] border border-[#f8717133] px-1.5 py-0.5 rounded-full">
        ↑ HIGH
      </span>
    );
  return (
    <span className="font-mono text-[9px] text-[#fbbf24] bg-[#fbbf2418] border border-[#fbbf2433] px-1.5 py-0.5 rounded-full">
      ↑ BUMPED
    </span>
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
