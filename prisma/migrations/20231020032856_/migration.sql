/*
  Warnings:

  - You are about to alter the column `title` on the `Notes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `tags` on the `Notes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - A unique constraint covering the columns `[title]` on the table `Notes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notes" ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "tags" SET DATA TYPE VARCHAR(200);

-- CreateTable
CREATE TABLE "Authentications" (
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Authentications_token_key" ON "Authentications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Notes_title_key" ON "Notes"("title");
