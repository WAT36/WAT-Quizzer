-- AddForeignKey
ALTER TABLE "quiz_basis_advanced_linkage" ADD CONSTRAINT "quiz_basis_advanced_linkage_basis_quiz_id_fkey" FOREIGN KEY ("basis_quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_basis_advanced_linkage" ADD CONSTRAINT "quiz_basis_advanced_linkage_advanced_quiz_id_fkey" FOREIGN KEY ("advanced_quiz_id") REFERENCES "advanced_quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
