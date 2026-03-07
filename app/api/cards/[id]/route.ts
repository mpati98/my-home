import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardCategory } from "@prisma/client";

// PATCH /api/cards/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const card = await prisma.card.update({
      where: { id: params.id },
      data: {
        ...(body.title      !== undefined ? { title: body.title }                       : {}),
        ...(body.subtitle   !== undefined ? { subtitle: body.subtitle }                 : {}),
        ...(body.content    !== undefined ? { content: body.content }                   : {}),
        ...(body.category   !== undefined ? { category: body.category as CardCategory } : {}),
        ...(body.tags       !== undefined ? { tags: body.tags }                         : {}),
        ...(body.spineColor !== undefined ? { spineColor: body.spineColor }             : {}),
        ...(body.isFavorite !== undefined ? { isFavorite: body.isFavorite }             : {}),
        ...(body.createdAt  !== undefined ? { createdAt: new Date(body.createdAt) }     : {}),
      },
    });
    return NextResponse.json({
      ...card,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}

// DELETE /api/cards/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.card.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
