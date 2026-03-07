export function mono(
  size: number,
  color: string,
  tracking?: number,
  extra?: React.CSSProperties,
): React.CSSProperties {
  return {
    fontSize: size,
    color,
    fontFamily: "'IBM Plex Mono',monospace",
    letterSpacing: tracking ?? 0,
    ...extra,
  };
}

export function NavBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: "#6b7280",
        cursor: "pointer",
        fontSize: 18,
        padding: "2px 8px",
        borderRadius: 6,
      }}
    >
      {children}
    </button>
  );
}

export function Dot({ color, size }: { color: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ── dateKey: canonical "YYYY-M-D" for comparison ──────
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
export function isoToKey(iso: string): string {
  return dateKey(new Date(iso));
}
