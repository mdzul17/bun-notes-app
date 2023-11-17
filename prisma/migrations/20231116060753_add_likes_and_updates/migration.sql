-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "is_edit" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "is_edit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "tags" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profile_pict" TEXT;

-- CreateTable
CREATE TABLE "Activities" (
    "user_id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "doing_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Note_Likes" (
    "user_id" TEXT NOT NULL,
    "notes_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_Likes_pkey" PRIMARY KEY ("user_id","notes_id")
);

-- CreateTable
CREATE TABLE "Comment_Likes" (
    "user_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_Likes_pkey" PRIMARY KEY ("user_id","comment_id")
);

-- AddForeignKey
ALTER TABLE "Collaborations" ADD CONSTRAINT "Collaborations_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborations" ADD CONSTRAINT "Collaborations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note_Likes" ADD CONSTRAINT "Note_Likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note_Likes" ADD CONSTRAINT "Note_Likes_notes_id_fkey" FOREIGN KEY ("notes_id") REFERENCES "Notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Likes" ADD CONSTRAINT "Comment_Likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Likes" ADD CONSTRAINT "Comment_Likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
