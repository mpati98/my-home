import { COVER_PRESETS } from "./theme";

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Color Picker ──────────────────────────────────────
export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {COVER_PRESETS.map((c) => (
        <div
          key={c}
          onClick={() => onChange(c)}
          className="w-6 h-6 rounded-md cursor-pointer transition-all"
          style={{
            background: c,
            outline:
              value === c ? "2.5px solid #e8e3d5" : "2px solid transparent",
            outlineOffset: 2,
          }}
        />
      ))}
    </div>
  );
}

// ── Modal Shell ───────────────────────────────────────
export function Modal({
  title,
  onClose,
  onSubmit,
  loading,
  submitLabel,
  accentColor,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  submitLabel: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#16181d] rounded-2xl w-full max-w-md my-auto border border-[#2a2d35] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {accentColor && (
          <div className="h-1" style={{ background: accentColor }} />
        )}
        <div className="p-6 sm:p-7">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-mono text-[11px] tracking-widest text-[#a78bfa]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-[#4b5563] cursor-pointer text-xl hover:text-[#9ca3af] transition-colors"
            >
              ×
            </button>
          </div>
          {children}
          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <button
              onClick={onClose}
              className="py-2.5 rounded-xl border border-[#2a2d35] bg-transparent text-[#6b7280] cursor-pointer font-mono text-[10px] tracking-widest hover:border-[#374151] transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="py-2.5 rounded-xl border-none text-[#111] cursor-pointer font-mono text-[10px] tracking-widest font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: "#a78bfa" }}
            >
              {loading ? "SAVING…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Delete Modal ──────────────────────────────
export function ConfirmDelete({
  label,
  onConfirm,
  onCancel,
}: {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#16181d] rounded-2xl w-full max-w-sm border border-[#2a2d35] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 rounded-t-sm bg-[#f87171] -mx-6 -mt-6 mb-5" />
        <p className="font-mono text-[11px] text-[#a78bfa] tracking-widest mb-2">
          CONFIRM DELETE
        </p>
        <p className="text-[#e8e3d5] text-sm mb-1 font-medium">{label}</p>
        <p className="font-mono text-[10px] text-[#4b5563] mb-5">
          This cannot be undone.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onCancel}
            className="py-2.5 rounded-xl border border-[#2a2d35] bg-transparent text-[#6b7280] cursor-pointer font-mono text-[10px] tracking-widest"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 rounded-xl border-none bg-[#f87171] text-white cursor-pointer font-mono text-[10px] tracking-widest font-semibold"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}
