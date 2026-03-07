import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardCategory } from "@prisma/client";

// GET /api/cards?category=Book|Experience|Collection&fav=true&q=search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as CardCategory | null;
    const fav = searchParams.get("fav");
    const q = searchParams.get("q");

    const cards = await prisma.card.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(fav === "true" ? { isFavorite: true } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }, { subtitle: { contains: q, mode: "insensitive" } }] } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cards);
  } catch {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

// POST /api/cards
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, category, content, tags, spineColor } = body;
    if (!title || !category || !content)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const card = await prisma.card.create({
      data: {
        title, subtitle, content,
        category: category as CardCategory,
        tags: tags ?? [],
        spineColor: spineColor ?? "#c9a96e",
      },
    });
    return NextResponse.json(card, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
