import { useState } from "react";
import { PRIORITY_COLOR, TAG_COLOR, Task } from "../workspace/theme";
import {
  COLOR_PRESETS,
  Project,
  ProjectStage,
  STAGE_META,
  STAGES,
} from "./theme";
import { toInput, ColorPicker } from "./utility";

// ── Project form modal ────────────────────────────────
export function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project?: Project | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const isEdit = !!project;
  const [form, setForm] = useState({
    name: project?.name ?? "",
    description: project?.description ?? "",
    category: project?.category ?? "General",
    stage: (project?.stage ?? "planning") as ProjectStage,
    color: project?.color ?? COLOR_PRESETS[0],
    startDate: toInput(project?.startDate),
    endDate: toInput(project?.endDate),
  });
  const [saving, setSaving] = useState(false);

  const inp =
    "w-full bg-[#1a1d24] border border-[#2a2d35] rounded-lg px-3 py-2 text-[#e8e3d5] font-mono text-xs outline-none focus:border-[#60a5fa] transition-colors placeholder:text-[#374151]";

  async function submit() {
    if (!form.name) return;
    setSaving(true);
    await onSave({ ...form });
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#16181d] rounded-2xl w-full max-w-lg my-auto border border-[#2a2d35] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1" style={{ background: form.color }} />
        <div className="p-6 sm:p-7">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-mono text-[11px] tracking-widest text-[#60a5fa]">
              {isEdit ? "EDIT PROJECT" : "NEW PROJECT"}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-[#4b5563] cursor-pointer text-xl hover:text-[#9ca3af]"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
            {/* Name */}
            <div>
              <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
                PROJECT NAME *
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="My project…"
                className={inp}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
                CATEGORY
              </label>
              <input
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="e.g. Product, Marketing, Engineering…"
                className={inp}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
                DESCRIPTION
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="What is this project about?"
                rows={3}
                className={inp + " resize-none leading-relaxed"}
              />
            </div>

            {/* Stage */}
            <div>
              <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
                STAGE
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {STAGES.map((s) => {
                  const m = STAGE_META[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setForm((p) => ({ ...p, stage: s }))}
                      className="py-2 rounded-lg border-none cursor-pointer font-mono text-[9px] tracking-widest transition-all"
                      style={{
                        background:
                          form.stage === s ? m.color + "33" : "#1a1d24",
                        color: form.stage === s ? m.color : "#4b5563",
                        outline:
                          form.stage === s
                            ? `1.5px solid ${m.color}88`
                            : "1px solid #2a2d35",
                      }}
                    >
                      {m.icon} {m.label.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
                  START DATE
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                  className={inp}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
                  END DATE
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                  className={inp}
                />
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-1.5">
                COLOR
              </label>
              <ColorPicker
                value={form.color}
                onChange={(c) => setForm((p) => ({ ...p, color: c }))}
              />
            </div>

            {/* Existing tasks summary (read-only in modal) */}
            {project && project.tasks.length > 0 && (
              <div>
                <label className="block font-mono text-[10px] text-[#4b5563] tracking-widest mb-2">
                  TASKS{" "}
                  <span className="text-[#374151]">
                    ({project.tasks.length})
                  </span>
                </label>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {project.tasks.map((t) => {
                    const tag = TAG_COLOR[t.tag] ?? {
                      bg: "#ffffff10",
                      text: "#9ca3af",
                    };
                    return (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111214] border border-[#1e2128]"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            background: t.done
                              ? "#2a2d35"
                              : PRIORITY_COLOR[t.priority],
                          }}
                        />
                        <span
                          className="flex-1 font-mono text-[11px] truncate"
                          style={{
                            color: t.done ? "#374151" : "#9ca3af",
                            textDecoration: t.done ? "line-through" : "none",
                          }}
                        >
                          {t.title}
                        </span>
                        <span
                          className="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{ background: tag.bg, color: tag.text }}
                        >
                          {t.tag}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <button
              onClick={onClose}
              className="py-2.5 rounded-xl border border-[#2a2d35] bg-transparent text-[#6b7280] cursor-pointer font-mono text-[10px] tracking-widest hover:border-[#374151] transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="py-2.5 rounded-xl border-none cursor-pointer font-mono text-[10px] tracking-widest font-semibold text-[#111] hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: form.color }}
            >
              {saving ? "SAVING…" : isEdit ? "SAVE CHANGES" : "CREATE PROJECT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ── Confirm delete ────────────────────────────────────
export function ConfirmDelete({
  name,
  color,
  onConfirm,
  onCancel,
}: {
  name: string;
  color: string;
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
        <div className="h-1 rounded-sm mb-5" style={{ background: color }} />
        <p className="font-mono text-[11px] text-[#f87171] tracking-widest mb-2">
          DELETE PROJECT
        </p>
        <p className="text-[#e8e3d5] text-sm font-semibold mb-1">{name}</p>
        <p className="font-mono text-[10px] text-[#4b5563] mb-5 leading-relaxed">
          Tasks will be detached but not deleted. This cannot be undone.
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
