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
