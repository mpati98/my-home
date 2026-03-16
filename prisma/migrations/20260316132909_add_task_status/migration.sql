-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('waiting', 'processing', 'on_time', 'over_due');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'waiting';
