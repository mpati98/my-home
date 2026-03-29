-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('planning', 'doing', 'running', 'completed');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "projectId" TEXT;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "stage" "ProjectStage" NOT NULL DEFAULT 'planning',
    "color" TEXT NOT NULL DEFAULT '#a3c47a',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
