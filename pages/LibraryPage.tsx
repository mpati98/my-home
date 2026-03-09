"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardCategory, CAT_ICON } from "@/utilities/library/theme";
import {
  AddCardModal,
  EditCardModal,
  DeleteModal,
} from "@/utilities/library/modal";
import { monthKey, monthLabel } from "@/utilities/library/utility";
import FlipCard from "@/components/library/FlipCard";
export default function LibraryPage({
  initialCards,
}: {
  initialCards: Card[];
}) {
  const [cards, setCards] = useState<Card[]>(initialCards || []);
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
  const handleDateUpdate = (id: string, newIso: string) =>
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, createdAt: newIso } : c)),
    );
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .card-item { animation: fadeUp 0.4s ease both; }
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .date-dropdown { animation: dropIn 0.18s ease; }
      `}</style>

      <div className="min-h-screen w-full bg-[#111214] px-4 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="font-[Courier_Prime,monospace] text-[11px] text-[#a3c47a] tracking-[3px] mb-2">
              PERSONAL LIBRARY
            </p>
            <h1 className="font-[Cormorant_Garant,serif] text-4xl sm:text-5xl font-bold text-[#e8e3d5] leading-none">
              My Archive
            </h1>
            <p className="font-[Cormorant_Garant,serif] text-[17px] text-[#4b5563] italic mt-1.5">
              {counts.All} {counts.All === 1 ? "entry" : "entries"} across
              books, experiences & collections
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="self-start sm:self-auto bg-[#a3c47a] text-[#111] border-none cursor-pointer font-[Cormorant_Garant,serif] text-base font-semibold px-5 py-2.5 rounded-sm tracking-wide hover:opacity-85 transition-opacity"
          >
            + New Card
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7 sm:mb-8 items-start sm:items-center flex-wrap">
          {/* Category pills */}
          <div className="flex gap-1 bg-[#1e2128] rounded p-0.5 overflow-x-auto shrink-0">
            {CAT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setCatFilter(f)}
                className="font-[Courier_Prime,monospace] text-[11px] px-2.5 sm:px-3 py-1.5 rounded-sm border-none cursor-pointer tracking-wide whitespace-nowrap transition-all duration-150"
                style={{
                  background: catFilter === f ? "#a3c47a" : "transparent",
                  color: catFilter === f ? "#111" : "#4b5563",
                  boxShadow:
                    catFilter === f ? "0 1px 4px rgba(26,22,18,0.1)" : "none",
                }}
              >
                {f === "All"
                  ? "All"
                  : f === "Favorites"
                    ? "★ Fav"
                    : CAT_ICON[f as CardCategory] + " " + f}
                <span className="ml-1 opacity-50">
                  {counts[f as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>

          {/* Date dropdown */}
          <div ref={dateRef} className="relative shrink-0">
            <button
              onClick={() => setDateOpen((o) => !o)}
              className="flex items-center gap-2 border rounded-sm px-3 py-1.5 cursor-pointer font-[Courier_Prime,monospace] text-[11px] tracking-wide transition-all duration-150"
              style={{
                background: dateFilter ? "#a3c47a" : "#16181d",
                color: dateFilter ? "#111" : "#4b5563",
                borderColor: "#1e2128",
              }}
            >
              <span>⊞</span>
              {dateFilter ? monthLabel(dateFilter) : "Filter by month"}
              {dateFilter && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateFilter("");
                  }}
                  className="ml-0.5 opacity-70 text-sm leading-none cursor-pointer"
                >
                  ×
                </span>
              )}
            </button>
            {dateOpen && (
              <div className="date-dropdown absolute top-[calc(100%+6px)] left-0 z-20 bg-[#16181d] border border-[#1e2128] rounded shadow-lg min-w-50 max-h-64 overflow-y-auto py-1.5">
                <button
                  onClick={() => {
                    setDateFilter("");
                    setDateOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 border-none cursor-pointer font-[Courier_Prime,monospace] text-[11px] text-[#e8e3d5] hover:bg-[#1e2128] transition-colors"
                  style={{
                    background: !dateFilter ? "#1e2128" : "transparent",
                  }}
                >
                  All dates
                </button>
                <div className="h-px bg-[#1e2128] my-1" />
                {monthOptions.map((mk) => (
                  <button
                    key={mk}
                    onClick={() => {
                      setDateFilter(mk);
                      setDateOpen(false);
                    }}
                    className="flex w-full justify-between items-center px-4 py-2 border-none cursor-pointer font-[Courier_Prime,monospace] text-[11px] text-[#e8e3d5] hover:bg-[#1e2128] transition-colors"
                    style={{
                      background: dateFilter === mk ? "#1e2128" : "transparent",
                    }}
                  >
                    <span>{monthLabel(mk)}</span>
                    <span className="text-[10px] text-[#4b5563] ml-3">
                      {cards.filter((c) => monthKey(c.createdAt) === mk).length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-50 max-w-xs">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search… (⌘K)"
              className="w-full bg-[#16181d] border border-[#1e2128] rounded-sm pl-8 pr-3 py-1.5 text-[#e8e3d5] font-[Courier_Prime,monospace] text-xs outline-none focus:border-[#a3c47a] transition-colors"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-[Courier_Prime,monospace] text-sm text-[#4b5563]">
              ⌕
            </span>
          </div>

          {(dateFilter || search) && (
            <span className="font-[Courier_Prime,monospace] text-[10px] text-[#4b5563]">
              {visible.length} result{visible.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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
          <div className="text-center py-20">
            <div className="font-[Cormorant_Garant,serif] text-6xl text-[#4b5563]">
              ∅
            </div>
            <p className="font-[Cormorant_Garant,serif] text-lg text-[#4b5563] italic mt-3">
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
                className="mt-4 bg-transparent border border-[#1e2128] rounded-sm px-5 py-2 cursor-pointer font-[Courier_Prime,monospace] text-[11px] text-[#4b5563] hover:bg-[#1e2128] transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-[#1e2128] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-[Courier_Prime,monospace] text-[10px] text-[#4b5563] tracking-widest">
            {counts.Book} BOOKS · {counts.Experience} EXPERIENCES ·{" "}
            {counts.Collection} COLLECTIONS
          </p>
          <p className="font-[Courier_Prime,monospace] text-[10px] text-[#4b5563]">
            Flip a card to edit or delete
          </p>
        </div>
      </div>

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
