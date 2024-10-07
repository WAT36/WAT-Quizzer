-- CreateTable
CREATE TABLE "quiz_dummy_choice" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "dummy_choice_sentense" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_dummy_choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quiz_dummy_choice" ADD CONSTRAINT "quiz_dummy_choice_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
