-- CreateTable
CREATE TABLE "Collaborations" (
    "id" TEXT NOT NULL,
    "note_id" VARCHAR(100) NOT NULL,
    "user_id" VARCHAR(100) NOT NULL,

    CONSTRAINT "Collaborations_pkey" PRIMARY KEY ("id")
);
