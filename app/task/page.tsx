import { prisma } from "@/lib/prisma";
import TaskDashboard from "@/pages/TaskDashboard";

export const dynamic = "force-dynamic";

export default async function Task() {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { dueDate: "asc" } });
    const projects = await prisma.project.findMany();
    const serialized = (tasks || []).map((t: any) => ({
      ...t,
      dueDate: t.dueDate.toISOString(),
      doneAt:
        (t as { doneAt?: Date | null }).doneAt?.toISOString().slice(0, 10) ??
        null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));
    const serializedProjects = (projects || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      color: p.color,
    }));
    return (
      <TaskDashboard
        initialTasks={serialized}
        initialProjects={serializedProjects}
      />
    );
  } catch (error) {
    console.error("[Task Page] Error loading data:", error);
    throw error;
  }
}
