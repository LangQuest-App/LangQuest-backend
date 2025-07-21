/*
  Warnings:

  - Added the required column `language` to the `Scene` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Tutorial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scene" ADD COLUMN     "language" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tutorial" ADD COLUMN     "language" TEXT NOT NULL;
