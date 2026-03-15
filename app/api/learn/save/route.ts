import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { id, isSaved } = await req.json();
  const word = await (prisma as any).learnWord.update({
    where: { id },
    data:  { isSaved },
  });
  return NextResponse.json({ ...word, createdAt: word.createdAt.toISOString() });
}
