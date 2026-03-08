import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Priority, TaskTag } from "@prisma/client";

// GET /api/tasks?filter=All|Pending|Done
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    const tasks = await prisma.task.findMany({
      where:
        filter === "Done"
          ? { done: true }
          : filter === "Pending"
          ? { done: false }
          : undefined,
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, tag, priority, dueDate } = body;
    if (!title || !tag || !priority || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const task = await prisma.task.create({
      data: {
        title,
        tag: tag as TaskTag,
        priority: priority as Priority,
        dueDate: new Date(dueDate),
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// PATCH — toggle done OR full update
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Full update payload
    const data: Record<string, unknown> = {};
    if (body.title     !== undefined) data.title    = body.title;
    if (body.tag       !== undefined) data.tag       = body.tag as TaskTag;
    if (body.priority  !== undefined) data.priority  = body.priority as Priority;
    if (body.dueDate   !== undefined) data.dueDate   = new Date(body.dueDate);

    // Toggle done — set/clear doneAt (date only, midnight UTC)
    if (body.done !== undefined) {
      data.done   = body.done;
      data.doneAt = body.done
        ? (body.doneAt ? new Date(body.doneAt + "T00:00:00Z") : new Date(new Date().toISOString().slice(0,10) + "T00:00:00Z"))
        : null;
    } else if (Object.keys(body).length === 0) {
      // No body = simple toggle
      const nowDone = !task.done;
      data.done   = nowDone;
      data.doneAt = nowDone ? new Date(new Date().toISOString().slice(0,10) + "T00:00:00Z") : null;
    }

    const updated = await prisma.task.update({ where: { id }, data });
    return NextResponse.json({
      ...updated,
      dueDate:   updated.dueDate.toISOString(),
      doneAt:    updated.doneAt?.toISOString() ?? null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
