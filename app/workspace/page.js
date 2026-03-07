import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import WorkspacePage from "@/pages/WorkspacePage";

export default async function page() {
  const tasks = await prisma.task.findMany({
    orderBy: { dueDate: "asc" },
  });

  const serialized = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return <WorkspacePage initialTasks={serialized} />;
}
