import LearnPage from "@/pages/LearnPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Learn() {
  const today = new Date().toISOString().slice(0, 10);
  const [daily, history] = await Promise.all([
    (prisma as any).learnWord.findFirst({
      where: { dailyDate: today },
      orderBy: { createdAt: "desc" },
    }),
    (prisma as any).learnWord.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const ser = (w: any) =>
    w
      ? {
          ...w,
          createdAt: w.createdAt.toISOString(),
          subCardId: w.subCardId ?? null,
          topicId: w.topicId ?? null,
        }
      : null;

  return (
    <LearnPage initialDaily={ser(daily)} initialHistory={history.map(ser)} />
  );
}
