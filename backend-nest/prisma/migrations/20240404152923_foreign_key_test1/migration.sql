-- AddForeignKey
ALTER TABLE "advanced_quiz" ADD CONSTRAINT "advanced_quiz_advanced_quiz_type_id_fkey" FOREIGN KEY ("advanced_quiz_type_id") REFERENCES "advanced_quiz_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advanced_quiz_explanation" ADD CONSTRAINT "advanced_quiz_explanation_advanced_quiz_id_fkey" FOREIGN KEY ("advanced_quiz_id") REFERENCES "advanced_quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_subsource" ADD CONSTRAINT "word_subsource_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
