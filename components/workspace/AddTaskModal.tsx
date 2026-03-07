import { useState } from "react";
import type { Task } from "@/utilities/workspace/theme";
import { mono } from "@/utilities/workspace/utility";

const AddTaskModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (t: Omit<Task, "id" | "done">) => Promise<void>;
}) => {
  const [form, setForm] = useState({
    title: "",
    tag: "Dev",
    priority: "Medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const inp: React.CSSProperties = {
    width: "100%",
    background: "#1a1d24",
    border: "1px solid #2a2d35",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#e8e3d5",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: 12,
    outline: "none",
  };
  const submit = async () => {
    if (!form.title || !form.dueDate) return;
    setLoading(true);
    await onAdd(form as Omit<Task, "id" | "done">);
    setLoading(false);
    onClose();
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000aa",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#16181d",
          borderRadius: 20,
          padding: 28,
          width: 380,
          border: "1px solid #2a2d35",
          boxShadow: "0 24px 60px #000000cc",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={mono(11, "#a3c47a", 2, { marginBottom: 18 })}>NEW TASK</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Task title..."
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            style={inp}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={form.tag}
              onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
              style={{ ...inp, flex: 1 }}
            >
              {["Design", "Dev", "Docs", "Content", "Management"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              value={form.priority}
              onChange={(e) =>
                setForm((p) => ({ ...p, priority: e.target.value }))
              }
              style={{ ...inp, flex: 1 }}
            >
              {["High", "Medium", "Low"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, dueDate: e.target.value }))
            }
            style={inp}
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "1px solid #2a2d35",
              background: "transparent",
              color: "#6b7280",
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 12,
            }}
          >
            CANCEL
          </button>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              flex: 2,
              padding: 10,
              borderRadius: 10,
              border: "none",
              background: "#a3c47a",
              color: "#111",
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {loading ? "SAVING..." : "ADD TASK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
