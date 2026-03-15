import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const words = await (prisma as any).learnWord.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(words.map((w: any) => ({ ...w, createdAt: w.createdAt.toISOString() })));
}
