/*
  Warnings:

  - Added the required column `preferences` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferences" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
