import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/projects/[id]/tasks — assign or unassign a task
export async function PATCH(req: NextRequest, context: any) {
  const params = await context.params;
  const { taskId, assign } = await req.json();
  const task = await prisma.task.update({
    where: { id: taskId },
    data:  { projectId: assign ? params.id : null },
  });
  return NextResponse.json({
    ...task,
    dueDate: task.dueDate.toISOString(),
    doneAt:  task.doneAt?.toISOString().slice(0, 10) ?? null,
  });
}
