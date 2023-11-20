/*
  Warnings:

  - The primary key for the `Activities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Comment_Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Note_Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Activities" DROP CONSTRAINT "Activities_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Activities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Comment_Likes" DROP CONSTRAINT "Comment_Likes_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Comment_Likes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Note_Likes" DROP CONSTRAINT "Note_Likes_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Note_Likes_pkey" PRIMARY KEY ("id");
