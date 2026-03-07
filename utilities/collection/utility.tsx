import { INK, SEPIA } from "./theme";
import type { CardCategory } from "./theme";

// ── Utility ─────────────────────────────────────────
export function serif(
  size: number,
  color = INK,
  weight = 400,
  extra: React.CSSProperties = {},
): React.CSSProperties {
  return {
    fontSize: size,
    color,
    fontFamily: "'Cormorant Garant', serif",
    fontWeight: weight,
    ...extra,
  };
}
export function mono(
  size: number,
  color = SEPIA,
  extra: React.CSSProperties = {},
): React.CSSProperties {
  return {
    fontSize: size,
    color,
    fontFamily: "'Courier Prime', monospace",
    ...extra,
  };
}

export const inp = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  width: "100%",
  background: "#fdf8f0",
  border: "1px solid #ddd4c4",
  borderRadius: 3,
  padding: "9px 12px",
  color: INK,
  fontFamily: "'Cormorant Garant', serif",
  fontSize: 15,
  outline: "none",
  ...extra,
});
export const inpMono = (
  extra: React.CSSProperties = {},
): React.CSSProperties => ({
  ...inp(),
  fontFamily: "'Courier Prime', monospace",
  fontSize: 12,
  ...extra,
});

// Format date as "Mar 2024" or "Mar 15, 2024"
export function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
export function fmtFull(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
// "2024-03" key for grouping
export function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
export function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
// ISO date string to YYYY-MM-DD for <input type="date">
export function toInputDate(iso: string) {
  return iso.slice(0, 10);
}

// ── Label ────────────────────────────────────────────
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={mono(10, SEPIA, {
        display: "block",
        marginBottom: 5,
        letterSpacing: 1,
      })}
    >
      {children}
    </label>
  );
}
