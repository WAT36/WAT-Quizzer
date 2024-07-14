-- AddForeignKey
ALTER TABLE "synonym" ADD CONSTRAINT "synonym_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "synonym" ADD CONSTRAINT "synonym_synonym_group_id_fkey" FOREIGN KEY ("synonym_group_id") REFERENCES "synonym_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
