import { prisma } from "@/lib/prisma";
import CalendarView from "@/components/workspace/CalendarView";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks = await prisma.task.findMany({ orderBy: { dueDate: "asc" } });
  const serialized = tasks.map((t: any) => ({
    ...t,
    dueDate: t.dueDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    doneAt: t.doneAt?.toISOString() ?? null,
  }));
  return (
    <>
      <CalendarView initialTasks={serialized} />;
    </>
  );
}
