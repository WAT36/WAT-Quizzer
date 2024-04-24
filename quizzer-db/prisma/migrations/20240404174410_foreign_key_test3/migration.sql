-- AddForeignKey
ALTER TABLE "englishbot_answer_log" ADD CONSTRAINT "englishbot_answer_log_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
