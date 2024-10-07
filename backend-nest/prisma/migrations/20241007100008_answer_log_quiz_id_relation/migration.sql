-- AlterTable
ALTER TABLE "answer_log" ADD COLUMN     "quiz_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "answer_log" ADD CONSTRAINT "answer_log_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
