-- AddForeignKey
ALTER TABLE "dummy_choice" ADD CONSTRAINT "dummy_choice_advanced_quiz_id_fkey" FOREIGN KEY ("advanced_quiz_id") REFERENCES "advanced_quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
