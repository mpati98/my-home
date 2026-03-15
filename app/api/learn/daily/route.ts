import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TODAY = () => new Date().toISOString().slice(0, 10);

const TYPE_COLOR: Record<string, string> = {
  word: "#f472b6", phrase: "#7dd3fc", idiom: "#fbbf24", expression: "#a78bfa",
};

async function getOrCreateTopic(type: string): Promise<string> {
  const title = `Learn — ${type.charAt(0).toUpperCase() + type.slice(1)}s`;
  const existing = await (prisma as any).topic.findFirst({ where: { title } });
  if (existing) return existing.id;
  const topic = await (prisma as any).topic.create({
    data: {
      title,
      category:    "Learn",
      description: `Words and ${type}s added from the Daily Learn engine.`,
      coverColor:  TYPE_COLOR[type] ?? "#f472b6",
    },
  });
  return topic.id;
}

function buildSubCardDescription(word: any): string {
  const refs = (word.references ?? []) as any[];
  const refStr = refs.length
    ? `\nReferences: ${refs.map((r: any) => `${r.title} by ${r.author}`).join(" · ")}`
    : "";
  const ex = (word.examples ?? []).slice(0, 2).join("\n");
  return [
    `[${word.partOfSpeech ?? word.type}] ${word.phonetic ?? ""}`,
    word.meaning,
    "",
    word.description,
    ex ? `\nExamples:\n${ex}` : "",
    word.etymology ? `\nEtymology: ${word.etymology}` : "",
    refStr,
  ].join("\n").trim();
}

function serialize(w: any) {
  return { ...w, createdAt: w.createdAt.toISOString() };
}

// GET — return today's word
export async function GET() {
  const today = TODAY();
  const word = await (prisma as any).learnWord.findFirst({
    where: { dailyDate: today },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(word ? serialize(word) : null);
}

// POST — pick a random unshown word from DB and mark as today's daily
export async function POST(req: Request) {
  const body  = await req.json().catch(() => ({}));
  const force = body.force ?? false;
  const topic = body.topic ?? "";
  const today = TODAY();

  // Return existing today's word unless forcing
  if (!force) {
    const existing = await (prisma as any).learnWord.findFirst({
      where: { dailyDate: today },
    });
    if (existing) return NextResponse.json(serialize(existing));
  }

  // Clear today's daily marker if force-regenerating
  if (force) {
    await (prisma as any).learnWord.updateMany({
      where: { dailyDate: today },
      data: { dailyDate: null },
    });
  }

  // Find words never shown as daily yet
  let candidates = await (prisma as any).learnWord.findMany({
    where: {
      dailyDate: null,
      ...(topic
        ? {
            OR: [
              { word:  { contains: topic, mode: "insensitive" } },
              { tags:  { hasSome: [topic.toLowerCase()] } },
              { type:  { equals: topic.toLowerCase() } },
              { meaning: { contains: topic, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });

  // If all shown or no match for topic, fall back to any word not shown today
  if (candidates.length === 0) {
    candidates = await (prisma as any).learnWord.findMany({
      where: { dailyDate: { not: today } },
      orderBy: { createdAt: "asc" },
    });
  }

  if (candidates.length === 0) {
    return NextResponse.json({ error: "No words available" }, { status: 404 });
  }

  // Pick a random candidate
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // Ensure it has a subCard in Collection
  let subCardId = chosen.subCardId;
  let topicId   = chosen.topicId;

  if (!subCardId) {
    topicId  = await getOrCreateTopic(chosen.type ?? "word");
    const sc = await (prisma as any).subCard.create({
      data: {
        title:       chosen.word,
        description: buildSubCardDescription(chosen),
        topicId,
      },
    });
    subCardId = sc.id;
  }

  // Mark as today's daily
  const updated = await (prisma as any).learnWord.update({
    where: { id: chosen.id },
    data:  { dailyDate: today, subCardId, topicId },
  });

  return NextResponse.json(serialize(updated));
}
