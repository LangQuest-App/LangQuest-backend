/*
  Warnings:

  - You are about to drop the column `userId` on the `UserResponse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserResponse" DROP CONSTRAINT "UserResponse_userId_fkey";

-- AlterTable
ALTER TABLE "UserResponse" DROP COLUMN "userId";
