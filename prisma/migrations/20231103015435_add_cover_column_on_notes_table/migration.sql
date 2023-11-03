/*
  Warnings:

  - Added the required column `cover` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "cover" TEXT NOT NULL;
