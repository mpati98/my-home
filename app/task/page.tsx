import { prisma } from "@/lib/prisma";
import TaskDashboard from "@/pages/TaskDashboard";

export const dynamic = "force-dynamic";

export default async function Task() {
  const tasks = await prisma.task.findMany({ orderBy: { dueDate: "asc" } });
  const serialized = (tasks || []).map((t) => ({
    ...t,
    dueDate: t.dueDate.toISOString(),
    doneAt:
      (t as { doneAt?: Date | null }).doneAt?.toISOString().slice(0, 10) ??
      null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));
  return <TaskDashboard initialTasks={serialized} />;
}
