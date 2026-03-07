"use client";
import { useState, useRef, useEffect } from "react";
import FlipCard from "@/components/collection/FlipCard";
import type { Card, CardCategory } from "@/utilities/collection/theme";
import {
  monthKey,
  monthLabel,
  mono,
  serif,
} from "@/utilities/collection/utility";
import { SEPIA, INK, CREAM, CAT_ICON } from "@/utilities/collection/theme";
import {
  EditCardModal,
  DeleteModal,
  AddCardModal,
} from "@/utilities/collection/modal";

// ── Main Library Page ─────────────────────────────────
export default function CollectionPage({
  initialCards,
}: {
  initialCards: Card[];
}) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [catFilter, setCatFilter] = useState<
    CardCategory | "All" | "Favorites"
  >("All");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editCard, setEditCard] = useState<Card | null>(null);
  const [deleteCard, setDeleteCard] = useState<Card | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!dateOpen) return;
    const h = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node))
        setDateOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [dateOpen]);

  const monthOptions = Array.from(
    new Set(cards.map((c) => monthKey(c.createdAt))),
  ).sort((a, b) => b.localeCompare(a));

  const q = search.toLowerCase();
  const visible = cards.filter((c) => {
    if (catFilter === "Favorites" && !c.isFavorite) return false;
    if (
      catFilter !== "All" &&
      catFilter !== "Favorites" &&
      c.category !== catFilter
    )
      return false;
    if (dateFilter && monthKey(c.createdAt) !== dateFilter) return false;
    if (
      q &&
      !c.title.toLowerCase().includes(q) &&
      !c.content.toLowerCase().includes(q) &&
      !(c.subtitle ?? "").toLowerCase().includes(q) &&
      !c.tags.some((t) => t.includes(q))
    )
      return false;
    return true;
  });

  const counts = {
    All: cards.length,
    Book: cards.filter((c) => c.category === "Book").length,
    Experience: cards.filter((c) => c.category === "Experience").length,
    Collection: cards.filter((c) => c.category === "Collection").length,
    Favorites: cards.filter((c) => c.isFavorite).length,
  };

  // ── Handlers ─────────────────────────────────────
  const handleFav = async (id: string, val: boolean) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: val } : c)),
    );
    await fetch("/api/cards/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: val }),
    });
  };

  const handleDateUpdate = (id: string, newIso: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, createdAt: newIso } : c)),
    );
  };

  const handleAdd = async (data: Partial<Card> & { createdAt?: string }) => {
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const raw = await res.json();
      let newCard: Card = raw;
      if (data.createdAt && data.createdAt !== raw.createdAt) {
        const patch = await fetch("/api/cards/" + raw.id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ createdAt: data.createdAt }),
        });
        if (patch.ok) newCard = await patch.json();
      }
      setCards((prev) => [newCard, ...prev]);
    }
  };

  const handleSave = async (id: string, data: Partial<Card>) => {
    const res = await fetch("/api/cards/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated: Card = await res.json();
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCard) return;
    const id = deleteCard.id;
    setDeleteCard(null);
    setCards((prev) => prev.filter((c) => c.id !== id));
    await fetch("/api/cards/" + id, { method: "DELETE" });
  };

  const CAT_FILTERS: Array<CardCategory | "All" | "Favorites"> = [
    "All",
    "Book",
    "Experience",
    "Collection",
    "Favorites",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        body { background: #ede8df; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #ede8df; }
        ::-webkit-scrollbar-thumb { background: #c9bfb0; border-radius: 10px; }
        ::placeholder { color: #c9bfb0; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .card-item { animation: fadeUp 0.4s ease both; }
        @keyframes dropIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .date-dropdown { animation: dropIn 0.18s ease; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#ede8df",
          padding: "40px 32px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div>
            <p style={mono(11, SEPIA, { letterSpacing: 3, marginBottom: 8 })}>
              PERSONAL LIBRARY
            </p>
            <h1 style={serif(44, INK, 700, { lineHeight: 1 })}>My Archive</h1>
            <p
              style={serif(17, SEPIA, 400, {
                marginTop: 6,
                fontStyle: "italic",
              })}
            >
              {counts.All} {counts.All === 1 ? "entry" : "entries"} across
              books, experiences & collections
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: INK,
              color: CREAM,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Cormorant Garant', serif",
              fontSize: 16,
              fontWeight: 600,
              padding: "11px 24px",
              borderRadius: 3,
              letterSpacing: 0.5,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            + New Card
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 32,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Category pills */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "#e0d9cf",
              borderRadius: 4,
              padding: 3,
            }}
          >
            {CAT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setCatFilter(f)}
                style={{
                  fontSize: 11,
                  padding: "6px 13px",
                  borderRadius: 3,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Courier Prime', monospace",
                  letterSpacing: 0.5,
                  background: catFilter === f ? CREAM : "transparent",
                  color: catFilter === f ? INK : SEPIA,
                  boxShadow:
                    catFilter === f ? "0 1px 4px rgba(26,22,18,0.1)" : "none",
                  transition: "all .15s",
                }}
              >
                {f === "All"
                  ? "All"
                  : f === "Favorites"
                    ? "★ Fav"
                    : CAT_ICON[f as CardCategory] + " " + f}
                <span style={{ marginLeft: 5, opacity: 0.5 }}>
                  {counts[f as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>

          {/* Date dropdown */}
          <div ref={dateRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDateOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: dateFilter ? INK : CREAM,
                color: dateFilter ? CREAM : SEPIA,
                border: "1px solid " + (dateFilter ? INK : "#ddd4c4"),
                borderRadius: 3,
                padding: "7px 14px",
                cursor: "pointer",
                fontFamily: "'Courier Prime', monospace",
                fontSize: 11,
                letterSpacing: 0.5,
                transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 12 }}>⊞</span>
              {dateFilter ? monthLabel(dateFilter) : "Filter by month"}
              {dateFilter && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateFilter("");
                  }}
                  style={{
                    marginLeft: 2,
                    opacity: 0.7,
                    fontSize: 14,
                    lineHeight: 1,
                    cursor: "pointer",
                  }}
                >
                  ×
                </span>
              )}
            </button>
            {dateOpen && (
              <div
                className="date-dropdown"
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  zIndex: 20,
                  background: CREAM,
                  border: "1px solid #ddd4c4",
                  borderRadius: 4,
                  boxShadow: "0 8px 28px rgba(26,22,18,0.15)",
                  minWidth: 200,
                  maxHeight: 280,
                  overflowY: "auto",
                  padding: "6px 0",
                }}
              >
                <button
                  onClick={() => {
                    setDateFilter("");
                    setDateOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 16px",
                    background: !dateFilter ? "#f0ebe0" : "none",
                    border: "none",
                    cursor: "pointer",
                    color: INK,
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: 11,
                  }}
                >
                  All dates
                </button>
                <div
                  style={{ height: 1, background: "#e8dfd3", margin: "4px 0" }}
                />
                {monthOptions.map((mk) => {
                  const ct = cards.filter(
                    (c) => monthKey(c.createdAt) === mk,
                  ).length;
                  return (
                    <button
                      key={mk}
                      onClick={() => {
                        setDateFilter(mk);
                        setDateOpen(false);
                      }}
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 16px",
                        background: dateFilter === mk ? "#f0ebe0" : "none",
                        border: "none",
                        cursor: "pointer",
                        color: INK,
                        fontFamily: "'Courier Prime', monospace",
                        fontSize: 11,
                      }}
                    >
                      <span>{monthLabel(mk)}</span>
                      <span
                        style={{ fontSize: 10, color: SEPIA, marginLeft: 12 }}
                      >
                        {ct}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search… (⌘K)"
              style={{
                width: "100%",
                background: CREAM,
                border: "1px solid #ddd4c4",
                borderRadius: 3,
                padding: "8px 14px 8px 34px",
                color: INK,
                fontFamily: "'Courier Prime', monospace",
                fontSize: 12,
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                ...mono(13, "#ccc2b4"),
              }}
            >
              ⌕
            </span>
          </div>

          {(dateFilter || search) && (
            <div style={{ ...mono(10, SEPIA), opacity: 0.8 }}>
              {visible.length} result{visible.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {visible.map((card, i) => (
              <div
                key={card.id}
                className="card-item"
                style={{ animationDelay: Math.min(i * 0.05, 0.4) + "s" }}
              >
                <FlipCard
                  card={card}
                  onFav={handleFav}
                  onEdit={setEditCard}
                  onDelete={setDeleteCard}
                  onDateUpdate={handleDateUpdate}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={serif(48, "#ddd4c4", 400)}>∅</div>
            <p
              style={serif(18, SEPIA, 400, {
                marginTop: 12,
                fontStyle: "italic",
              })}
            >
              {search || dateFilter
                ? "No cards match your filters."
                : "Your library is empty. Add your first card."}
            </p>
            {(search || dateFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setDateFilter("");
                }}
                style={{
                  marginTop: 16,
                  background: "none",
                  border: "1px solid #ddd4c4",
                  borderRadius: 3,
                  padding: "8px 18px",
                  cursor: "pointer",
                  ...mono(11, SEPIA),
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 60,
            paddingTop: 24,
            borderTop: "1px solid #ddd4c4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={mono(10, "#ccc2b4", { letterSpacing: 1 })}>
            {counts.Book} BOOKS · {counts.Experience} EXPERIENCES ·{" "}
            {counts.Collection} COLLECTIONS
          </p>
          <p style={mono(10, "#ccc2b4")}>Flip a card to edit or delete</p>
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <AddCardModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
      {editCard && (
        <EditCardModal
          card={editCard}
          onClose={() => setEditCard(null)}
          onSave={handleSave}
        />
      )}
      {deleteCard && (
        <DeleteModal
          card={deleteCard}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteCard(null)}
        />
      )}
    </>
  );
}
