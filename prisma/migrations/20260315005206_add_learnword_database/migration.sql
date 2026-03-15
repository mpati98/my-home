-- CreateTable
CREATE TABLE "LearnWord" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'word',
    "phonetic" TEXT,
    "partOfSpeech" TEXT,
    "meaning" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" TEXT[],
    "etymology" TEXT,
    "references" JSONB NOT NULL DEFAULT '[]',
    "tags" TEXT[],
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "dailyDate" TEXT,
    "subCardId" TEXT,
    "topicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearnWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearnWord_subCardId_key" ON "LearnWord"("subCardId");
