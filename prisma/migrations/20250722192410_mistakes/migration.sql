-- CreateTable
CREATE TABLE "Mistakes" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mistakes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mistakes" ADD CONSTRAINT "Mistakes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
